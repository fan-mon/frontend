import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import {useParams} from "react-router-dom";
import ChatRoom from "./ChatRoom";
import axios from "axios";

const ChatPage = ({ chatUuid }) => {
    const [stompClient, setStompClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const { artistUuid } = useParams();

    // TODO : chatuuid는 artistuuid를 사용해서 가져오는 작업 필요!
    
    // 유저 식별
    const role=localStorage.getItem("user");
    let useruuid = "";
    let destination="";
    let status = "";
    if (role==='ARTIST'){
        useruuid=null;
        destination=`/pub/${artistUuid}/toFans`
    }else if(role==='USER'){
        status = localStorage.getItem("stat");
        useruuid=localStorage.getItem("uuid");
        destination=`/pub/${artistUuid}/${useruuid}/toArtist`
    }

    useEffect(() => {
        // 처음 로딩시 과거 메세지들을 가져온다
        const fetchMessages = async ()=>{
            try{
                const response = await axios.get(`http://localhost:8080/chat/messages/${chatUuid}`);
                setMessages(response.data)
            }catch (e){
                console.log(e)
            }
        }
        fetchMessages();
        const socket = new SockJS(`http://localhost:8080/chat/ws`); // WebSocket 연결
        const client = Stomp.over(()=>socket); // Stomp 클라이언트 생성

        client.connect({}, (frame) => {
            console.log('Connected: ' + frame);
            // 유저와 아티스트의 구독 처리
            // 팬의 메세지는 아티스트와 발행한 팬만 구독
            client.subscribe(`/sub/${artistUuid}/fromFans`, (message) => {
                console.log("receive message : "+message.body)
                const parsedMsg=JSON.parse(message.body);
                if (role==='ARTIST'||parsedMsg.user.useruuid===localStorage.getItem("uuid")){
                    setMessages(prevMessages => [...prevMessages, JSON.parse(message.body)]);
                }
            });
            // 아티스트가 보낸 메세지는 아티스트와 유저 둘 다 구독
            client.subscribe(`/sub/${artistUuid}/toFans`, (message) => {
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
    }, [artistUuid, useruuid, role]); // 의존성 배열에 artistUuid와 useruuid 추가

    // 이미지 전송 함수
    const sendImage = (image) => {
        const formData = new FormData();
        formData.append("image", image);

        axios.post('http://localhost:8080/chat/sendImage', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // 멀티파트 폼 데이터로 전송
            },
        })
            .then(response => {
                console.log('Image sent successfully:', response.data);
            })
            .catch(error => {
                console.error('Error sending image:', error);
            });
    };

    // 유저 밴 함수
    const blockuser= async (useruuid)=>{
        try {
            const response=await axios.post(`http://localhost:8080/chat/block`, null, {
                params: {uuid: useruuid},
            });
            const banneduuid=response.data;
            if (banneduuid===useruuid){
                alert("해당 유저를 차단했습니다.")
            }
        }catch (e){
            console.log(e)
        }
    }

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
                        artistuuid: artistUuid,  // 아티스트 UUID
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
                        artistuuid: artistUuid,  // 아티스트 UUID
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