import {useEffect, useState} from "react";
import {Stomp} from "@stomp/stompjs";
import SockJS from "sockjs-client";

const ChatPage = ({user}) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [client, setClient] = useState(null)

    // 컴포넌트가 마운트 될 때 websocket을 연결 설정
    useEffect(() => {
            const socket = new SockJS("http://localhost:8080/chat");
            const stompClient = Stomp.over(() => socket);
                // 서버에 연결
                stompClient.connect({}, (frame) => {
                    // 연결 성공 시 메세지 출력
                    console.log('front connected : ' + frame);
                    setClient(stompClient)
                    // 구독
                    stompClient.subscribe('/topic/messages', (message) => {
                        const receiveMessage = message.body;
                        console.log('Receive message : ' + receiveMessage);
                        setMessages((prevMessages) => [...prevMessages, receiveMessage])
                    })
                    stompClient.subscribe(`/topic/messages/${user}`, (message) => {
                        console.log('user subscribe 실행')    // 안됌 ㅡㅡ
                        const receiveMessage = message.body;
                        console.log('private message : ' + receiveMessage);
                        setMessages((prevMessages) => [...prevMessages, receiveMessage])
                    })
                    // 연결 확인 메세지 보내기!!!!
                    // stompClient.send("/app/sendMessage", {}, "hello from client!"
                }, (error) => {
                    console.log('Connection error : ' + error);
                })
                return () => {
                    if (stompClient) {
                        stompClient.disconnect();
                    }
                }
        },[user]);
    const sendMessage = () => {
        console.log("press sendMessage")
        if (inputMessage.trim() !== "" && client) {
            client.send("/app/sendMessage", {}, inputMessage);
            setInputMessage("");
        }
    }

    const sendUserMessage=(user)=>{
        if (inputMessage.trim()!==""&& client){
            client.send(`/app/sendMessage/${user}`,{},inputMessage);
            setInputMessage("");
        }
    }
    return (
        <div>
            <h1>Chat Application Test</h1>
            <div>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                />
                <button onClick={()=>sendMessage()}>Send</button>
                <button onClick={()=>sendUserMessage('summer')}>Send2</button>
            </div>
            <div>
                <h2>Messages</h2>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div> // 메시지 표시
                ))}
            </div>
        </div>
    );
}

export default ChatPage;