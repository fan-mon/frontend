import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import ArtistChat from "./ArtistChat";
import UserChat from "./UserChat";

const ChatPage = ({ artistUuid, userUuid, chatUuid }) => {
    const [stompClient, setStompClient] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const socket = new SockJS(`http://localhost:8080/chat/ws`); // WebSocket 연결
        const client = Stomp.over(()=>socket); // Stomp 클라이언트 생성
        client.reconnect_delay = 5000;  // 재연결 시도 간격

        client.connect({}, (frame) => {
            console.log('Connected: ' + frame);

            // 아티스트 메시지 구독
            client.subscribe(`/sub/${artistUuid}`, (message) => {
                console.log(`Received message from artist: ${message.body}`);
                setMessages(prevMessages => [...prevMessages, JSON.parse(message.body)]);
            });

            setStompClient(client);
            // 팬 메시지 구독 (아티스트용)
            client.subscribe(`/sub/${artistUuid}/${userUuid}`, (message) => {
                console.log(`Received message from fan: ${message.body}`);
                setMessages(prevMessages => [...prevMessages, JSON.parse(message.body)]);
            });

        }, (error) => {
            console.error('STOMP error: ' + error);
        });

        // STOMP 에러 처리
        client.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        };


        return () => {
            if (client) {
                client.disconnect();
            }
        };
    }, [artistUuid, userUuid]); // 의존성 배열에 artistUuid와 userUuid 추가

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
            const destination = sender === 'Artist' ? `/pub/${artistUuid}` : `/pub/${artistUuid}/${userUuid}`;
            stompClient.send(destination, {}, JSON.stringify(messageData));
        } else {
            console.error("STOMP client is not connected");
        }
    };

    return (
        <div style={styles.page}>
            <h1>Chat Page</h1>
            <div style={styles.leftColumn}>
                <ArtistChat messages={messages} sendMessage={sendMessage} />
            </div>
            <div style={styles.rightColumn}>
                <UserChat messages={messages} sendMessage={sendMessage}/>
            </div>
        </div>
    );

};
const styles = {
    page: {
        display: 'flex',
        height: '100vh',
        padding: '20px',
        gap: '30px'
    },
    leftColumn: {
        flex: 1, // Takes up one part of the available space (left side)
        marginRight: '20px',
        padding: '20px',
        backgroundColor: 'rgba(150, 161, 190, 0.1)',
        borderRadius: '10px',
        border: '1px solid rgba(150, 161, 190, 0.3)',
        boxSizing: 'border-box',
        overflowY: 'scroll',
    },
    rightColumn: {
        flex: 1, // Takes up one part of the available space (right side)
        marginRight: '20px',
        padding: '20px',
        backgroundColor: 'rgba(150, 161, 190, 0.1)',
        borderRadius: '10px',
        border: '1px solid rgba(150, 161, 190, 0.3)',
        boxSizing: 'border-box',
        overflowY: 'scroll',
        // display: 'flex',
        // flexDirection: 'column',
        // justifyContent: 'space-between',
    },};

export default ChatPage;