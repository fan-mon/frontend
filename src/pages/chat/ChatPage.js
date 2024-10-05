import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import {useParams} from "react-router-dom";
import ChatRoom from "./ChatRoom";

const ChatPage = ({ userUuid, chatUuid }) => {
    const [stompClient, setStompClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [role, setRole] = useState('USER'); // 초기 역할
    const { artistUuid } = useParams();
    console.log(artistUuid);
    const toggleRole = () => {
        setRole(prevRole => (prevRole === 'USER' ? 'ARTIST' : 'USER'));
    };

    useEffect(() => {
        const socket = new SockJS(`http://localhost:8080/chat/ws`); // WebSocket 연결
        const client = Stomp.over(()=>socket); // Stomp 클라이언트 생성

        client.connect({}, (frame) => {
            console.log('Connected: ' + frame);

            // 유저와 아티스트의 구독 처리
            // 아티스트는 모든 팬 메시지를 구독
            client.subscribe(`/sub/${artistUuid}/fromFans`, (message) => {
                console.log("아티스트 구독 포인트"+message.body)
                setMessages(prevMessages => [...prevMessages, JSON.parse(message.body)]);
            });
            // 유저는 아티스트의 메시지만 구독
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
    }, [artistUuid, userUuid, role]); // 의존성 배열에 artistUuid와 userUuid 추가

    // 메세지 전송 함수
    const sendMessage = (message, sender) => {
        if (stompClient && stompClient.connected) {
            const messageData = {
                messagetext: message,
                timestamp: new Date().toISOString(),
                artist: {
                    artistuuid: artistUuid,  // 아티스트 UUID
                },
                user: {
                    useruuid: userUuid,  // 유저 UUID
                },
                messageFrom: sender,
                chat: {
                    chatuuid: chatUuid,  // 채팅 UUID
                },
            };

            console.log(`Sending message: `, messageData);
            // 팬이 메시지를 보낼 때는 아티스트에게 보내는 경로
            const destination = sender === 'USER' ? `/pub/${artistUuid}/${userUuid}/toArtist` : `/pub/${artistUuid}/toFans`;
            stompClient.send(destination, {}, JSON.stringify(messageData));
        } else {
            console.error("STOMP client is not connected");
        }
    };
    return (
        <div>
            <h1>Chat Page</h1>
            <button onClick={toggleRole}>Toggle Role</button>
            <ChatRoom role={role}
                      messages={messages}
                      sendMessage={sendMessage}
                      style={{ marginLeft: '100px' }}
            />
        </div>
    );

};

export default ChatPage;