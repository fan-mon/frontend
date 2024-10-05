import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import {useParams} from "react-router-dom";
import ChatRoom from "./ChatRoom";

const ChatPage = ({ chatUuid }) => {
    const [stompClient, setStompClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const role=localStorage.getItem("user");
    const useruuid=localStorage.getItem("uuid");
    const { artistUuid } = useParams();

    useEffect(() => {
        const socket = new SockJS(`http://localhost:8080/chat/ws`); // WebSocket 연결
        const client = Stomp.over(()=>socket); // Stomp 클라이언트 생성

        client.connect({}, (frame) => {
            console.log('Connected: ' + frame);

            // 유저와 아티스트의 구독 처리
            // 팬의 메세지는 아티스트와 발행한 팬만 구독
            client.subscribe(`/sub/${artistUuid}/fromFans`, (message) => {
                const parsedMsg=JSON.parse(message.body);
                if (role==='ARTIST'||parsedMsg.user.useruuid===localStorage.getItem("uuid")){
                    setMessages(prevMessages => [...prevMessages, JSON.parse(message.body)]);
                }
            });
            // 아티스트가 보낸 메세지는 아티스트와 유저 둘 다 구독
            client.subscribe(`/sub/${artistUuid}/toFans`, (message) => {
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

    // 메세지 전송 함수
    const sendMessage = (message) => {
        if (stompClient && stompClient.connected) {
            const messageData = {
                messagetext: message,
                timestamp: new Date().toISOString(),
                artist: {
                    artistuuid: artistUuid,  // 아티스트 UUID
                },
                user: {
                    useruuid: useruuid,  // 유저 UUID
                },
                messageFrom: role,
                chat: {
                    chatuuid: chatUuid,  // 채팅 UUID
                },
            };
            const destination = role === 'USER' ? `/pub/${artistUuid}/${useruuid}/toArtist` : `/pub/${artistUuid}/toFans`;
            stompClient.send(destination, {}, JSON.stringify(messageData));
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
            />
        </div>
    );

};

export default ChatPage;