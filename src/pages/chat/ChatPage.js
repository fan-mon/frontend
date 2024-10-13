import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import {useParams} from "react-router-dom";
import ChatRoom from "./ChatRoom";
import axios from "axios";
import {getMessageList, getChatInfo,blockuser} from "./chatAPI/chat";
import api from "../../apiClient";
import { useLocation } from "react-router-dom";
const ChatPage = () => {
    const [stompClient, setStompClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [artistuuid, setArtistuuid] = useState("");
    const [useruuid, setUseruuid] = useState("");
    const [destination, setDestination]=useState("");
    const [data, setData] = useState(null);
    const [status,setStatus] = useState("");
    const location = useLocation();

    // 파라미터 teamuuid 받아오기
    const {chatuuid} = useParams();
    
    // 유저 식별
    const role=localStorage.getItem("role");

    const fetchUserInfo = async () => {
        try {
            const response = await api.get('/users/myprofile');
            // setUseruuid(response.data.useruuid);
            console.log("유저정보 가져오기 완료!"+response.data.useruuid)
            return response.data;
        } catch (error) {
            console.error("사용자 정보 가져오기 오류:", error);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            if (role === 'USER') {
                const userData = location.state; // USER 데이터
                setData(userData);
                setArtistuuid(userData.chat.artist.artistuuid);
                setUseruuid(userData.user.useruuid);
            } else if (role === 'ARTIST') {
                const artistuuid = localStorage.getItem("uuid");
                setArtistuuid(artistuuid);
                try {
                    const chatInfo = await getChatInfo(chatuuid);
                    setData(chatInfo); // ARTIST 데이터 설정
                    setUseruuid(chatInfo.user.useruuid); // 유저 UUID 설정
                } catch (error) {
                    console.error("채팅 정보 가져오기 오류: ", error);
                }
            }
        };
        fetchData();
    }, [role, location.state, chatuuid]);
    const fetchMessages = async () => {
        if (!data) {
            console.warn("data 또는 user 정보가 없습니다.");
            return;
        }
        const messages = await getMessageList(chatuuid);
        if (messages) {
            setMessages(messages);
            console.log("메세지 로드 완료")
        }
    };
    // artistuuid가 변경될 때 destination을 설정해줌
    useEffect(() => {
        fetchMessages();
    }, [data, chatuuid, role]);

    useEffect(() => {
        if (artistuuid) {
            if (role === 'ARTIST') {
                setDestination(`/pub/${artistuuid}/toFans`);
                console.log("artist destination : " + destination)
            } else if (role === 'USER' && useruuid) {
                setDestination(`/pub/${artistuuid}/${useruuid}/toArtist`);
                console.log("user destination : " + destination)
            }
        }
        console.log(`useruuid : ${useruuid}`)
        console.log(`artistuuid : ${artistuuid}`)
        console.log(`role : ${role}`)
        console.log(`chatuuid : ${chatuuid}`)
    }, [artistuuid, useruuid, role, data]);

    useEffect(() => {

        const socket = new SockJS(`${process.env.REACT_APP_BACKEND_API_URL}/chat/ws`);
        const client = Stomp.over(()=>socket); // Stomp 클라이언트 생성
        client.connect({}, (frame) => {
            console.log('Connected: ' + frame);
            // 유저와 아티스트의 구독 처리
            // 팬의 메세지는 아티스트와 발행한 팬만 구독
            client.subscribe(`/sub/${artistuuid}/fromFans`, (message) => {
                console.log("receive message : "+message.body)
                const parsedMsg=JSON.parse(message.body);
                if (role==='ARTIST'||parsedMsg.user.useruuid===localStorage.getItem("uuid")){   //TODO 여기도 세션 수정 필요
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
    }, [artistuuid, useruuid, role]);

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
    const sendMessage = async (message) => {
        if (destination===''||!destination){
            console.log("전송에 실패했습니다.")
            return
        }
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
                        chatuuid: chatuuid,  // 채팅 UUID
                    },
                };
                stompClient.send(destination, {}, JSON.stringify(messageData));
                console.log(`destination : ${destination}`)
            }else {
                messageData = {
                    artistmessageuuid:null,
                    messagetext: message,
                    timestamp: null,
                    artist: {
                        artistuuid: artistuuid,  // 아티스트 UUID
                    },
                    chat: {
                        chatuuid: chatuuid,  // 채팅 UUID
                    },
                };
                console.log("messageData : "+JSON.stringify(messageData))
                stompClient.send(destination, {}, JSON.stringify(messageData));
            }
            const updatedMessages = await getMessageList(chatuuid);
            if (updatedMessages) {
                setMessages(updatedMessages);
            } else {
                console.warn("메시지 리스트를 가져오는 데 실패했습니다.");
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
                      chatuuid={chatuuid}
                      data={data}
            />
        </div>
    );
};

export default ChatPage;