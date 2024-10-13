import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import {useParams} from "react-router-dom";
import ChatRoom from "./ChatRoom";
import axios from "axios";
import {getMessageList, getChatInfo,blockuser} from "./chatApi/chat";
import api from "../../apiClient";

const ChatPage = ({ chatUuid }) => {
    const [stompClient, setStompClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const { chatuuid } = useParams();
    const [artistuuid, setArtistuuid] = useState("");


    // 유저 식별
    const role=localStorage.getItem("role");
    let useruuid = "";
    let destination="";
    let status = "";
    if (role==='ARTIST'){
        useruuid=null;
        destination=`/pub/${artistuuid}/toFans`
    }else if(role==='USER'){
        status = localStorage.getItem("stat");
        useruuid=localStorage.getItem("uuid");
        destination=`/pub/${artistuuid}/${useruuid}/toArtist`
    }

    useEffect(() => {

        // 처음 로딩시 과거 메세지들을 가져온다
        getMessageList(chatuuid).then((messages) => {
            if (messages) {
                setMessages(messages);
            } else {
                // 메시지가 없거나 오류가 발생했을 때 처리
                console.warn("메시지가 없습니다.");
            }
        });   //체크 필요
        getChatInfo(chatuuid).then((chatInfo)=>{
            if (chatInfo) {
                // chatInfo 처리
            } else {
                // 채팅 정보가 없거나 오류가 발생했을 때 처리
                console.warn("채팅 정보가 없습니다.");
            }
        })

        const socket = new SockJS(`${process.env.REACT_APP_BACKEND_API_URL}/chat/ws`);
        const client = Stomp.over(()=>socket); // Stomp 클라이언트 생성

        client.connect({}, (frame) => {
            console.log('Connected: ' + frame);
            // 유저와 아티스트의 구독 처리
            // 팬의 메세지는 아티스트와 발행한 팬만 구독
            client.subscribe(`/sub/${artistuuid}/fromFans`, (message) => {
                console.log("receive message : "+message.body)
                const parsedMsg=JSON.parse(message.body);
                if (role==='ARTIST'||parsedMsg.user.useruuid===localStorage.getItem("uuid")){
                    setMessages(prevMessages => [...prevMessages, JSON.parse(message.body)]);
                }
            });
            // 아티스트가 보낸 메세지는 아티스트와 유저 둘 다 구독
            client.subscribe(`/sub/${artistuuid}/toFans`, (message) => {
                console.log("receive message : "+message.body)
                setMessages(prevMessages => [...prevMessages, JSON.parse(message.body)]);
            });
            setStompClient(client);
        }, (error) => {
            console.error('STOMP error: ' + error);
        });

        // STOMP 에러 처리
        client.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        };
        client.activate();
        return () => {
            if (client) {
                client.disconnect();
            }
        };
    }, [artistuuid, useruuid, role]); // 의존성 배열에 artistUuid와 useruuid 추가

    // 이미지 전송 함수
    const sendImage = (image) => {
        const formData = new FormData();
        formData.append("image", image);

        axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/chat/sendImage`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // 멀티파트 폼 데이터로 전송
            },
        })
            .then(response => {
                const imageUrl = response.data; // 서버에서 받은 이미지 URL
                sendMessage(imageUrl); // 이미지 URL로 채팅 메시지 전송
            })
            .catch(error => {
                console.error('Error sending image:', error);
            });
    };

    // 메세지 전송 함수
    const sendMessage = (message) => {
        if (stompClient && stompClient.connected) {
            if (status==='BANNED'){
                alert("차단 당한 유저입니다.")
                return;
            }
            let messageData;
            if (role==='USER'){
                messageData = {
                    usermessageuuid:null,
                    messagetext: message,
                    timestamp: null,
                    artist: {
                        artistuuid: artistuuid,  // 아티스트 UUID
                    },
                    user: {
                        useruuid: useruuid,  // 유저 UUID
                    },
                    chat: {
                        chatuuid: chatUuid,  // 채팅 UUID
                    },
                };
                console.log("messageData : "+JSON.stringify(messageData))
                stompClient.send(destination, {}, JSON.stringify(messageData));
            }else {
                messageData = {
                    artistmessageuuid:null,
                    messagetext: message,
                    timestamp: null,
                    artist: {
                        artistuuid: artistuuid,  // 아티스트 UUID
                    },
                    chat: {
                        chatuuid: chatUuid,  // 채팅 UUID
                    },
                };
                console.log("messageData : "+JSON.stringify(messageData))
                stompClient.send(destination, {}, JSON.stringify(messageData));
            }
        } else {
            console.error("STOMP client is not connected");
        }
    };
    return (
        <div>
            <h1>{role} Chat Page</h1>
            <ChatRoom role={role}
                      messages={messages}
                      sendMessage={sendMessage}
                      sendImage={sendImage}
                      blockuser={blockuser}
            />
        </div>
    );
};

export default ChatPage;