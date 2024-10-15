import React, {useState,useRef,useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../meetingroom/fonts/bootstrap-icons.min.css'

import axios from "axios";
import {getArtistData} from "./chatAPI/subscription";
const ChatRoom = ({ chatuuid, role, messages, sendMessage, sendImage, blockuser, data}) => {
    const [inputMessage, setInputMessage] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isChatPlusOpen, setIsChatPlusOpen] = useState(false);
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);
    const [chatInfo, setChatInfo] = useState([]);
    const scrollToBottom = () => {
        // console.log("스크롤 작동!!")
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };  //TODO 스크롤 작동 안됌..

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    // 스크롤 맨 아래로

    useEffect(() => {
        getArtistData(chatuuid, setChatInfo)
        // console.log(chatInfo)
    }, [messages],[chatuuid]);

    const openChatRoom = () => setIsChatOpen(true);
    const closeChatRoom = () => setIsChatOpen(false);
    const toggleChatPlus = () => setIsChatPlusOpen(!isChatPlusOpen);
    const handleSend = () => {
        if (inputMessage.trim()) {
            sendMessage(inputMessage);
            setInputMessage('');
        }
    };
    const handleImageSelect = (event) => {
        const file = event.target.files[0]; // 선택한 파일 가져오기
        if (file) {
            sendImage(file); // 파일을 전송하는 함수 호출
        }
    };
    const handleMessage=(msg)=> {
        let uuid=msg.user.useruuid;
        console.log("block user 실행 : " + uuid)
        blockuser(uuid.toString());
    }

    return (
        <div className="artist-chat">
            <div className={`chatroom-area`}>
                <div className="contents-box contents-scroll-box chatroom opacity-100">
                    <div className="chat-top">
                        <div>{role === 'USER' && data ? (
                            data.chat.artist.name // USER일 때
                        ) : role === 'ARTIST' && data ? (
                            data.artist.name // ARTIST일 때
                        ) : (
                            <div>No artist information available.</div> // 데이터가 없을 때 표시할 메시지
                        )}</div>
                    </div>
                    <div className="chat-contents">
                        <div className="date-wrap">2024년 09월 19일</div>
                        {messages.map((msg, index) => (
                            <div key={index} className="chat-wrap">
                                <div className={msg.type === role ? "mine" : "yours"}
                                     onClick={role === 'ARTIST' && msg.type === 'USER' ? () => handleMessage(msg) : null}>
                                    {msg.type === 'USER' ?
                                        (<img className="profile"
                                              src={`${process.env.PUBLIC_URL}/common/logo_black.png`}
                                              alt=""/>)
                                        :
                                        (<img className="profile"
                                              src={msg.artist.fname}
                                              alt=""/>)
                                    }
                                    <div className="content-wrap">
                                        <p className="name">{msg.type}</p>
                                        <div className="same-time">
                                            <div className="bubble-wrap">
                                                <div className="bubble">
                                                    {msg.messagetext.startsWith('http') ? (
                                                        <img src={msg.messagetext} alt="Sent image"
                                                             style={{maxWidth: '100%', maxHeight: '200px'}}/>
                                                    ) : (
                                                        msg.messagetext
                                                    )}
                                                </div>
                                            </div>
                                            <div className="bubble-time">
                                                {new Date(msg.timestamp).getHours().toString().padStart(2, '0')}:
                                                {new Date(msg.timestamp).getMinutes().toString().padStart(2, '0')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="chat-bottom">
                        <div className="input-area">
                            {role === 'USER' ?
                                null :
                                (<button className="btn btn-ico btn-chat-plus" onClick={toggleChatPlus}>
                                    <i className="bi bi-plus-circle-fill"></i>
                                </button>)}
                            <div className="form-group in-chat-wrap">
                                <input className="form-control in-chat"
                                       type="text"
                                       value={inputMessage}
                                       onChange={(e) => setInputMessage(e.target.value)}
                                       placeholder="Enter message"/>
                                <button className="btn btn-ico btn-chat-submit" onClick={handleSend}></button>
                            </div>
                        </div>
                    </div>
                    <div className={`chat-etc-add ${isChatPlusOpen ? 'open' : ''}`}>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col">
                                    <button className="btn btn-chat-add">
                                <span className="ico-circle-wrap">
                                    <i className="bi bi-camera-fill"></i>
                                </span>
                                        <span className="label">카메라</span>
                                    </button>
                                </div>
                                <div className="col">
                                    <button className="btn btn-chat-add">
                                <span className="ico-circle-wrap">
                                    <i className="bi bi-file-earmark-fill"></i>
                                </span>
                                        <span className="label">파일</span>
                                    </button>
                                </div>
                                <div className="col">
                                    <button className="btn btn-chat-add" onClick={() => fileInputRef.current.click()}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            style={{display: 'none'}} // input 요소 숨기기
                                            ref={fileInputRef}
                                            onChange={handleImageSelect} // 파일 선택 시 처리
                                        />
                                        <span className="ico-circle-wrap">
                                            <i className="bi bi-image-fill"></i>
                                        </span>
                                        <span className="label">사진</span>
                                    </button>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <button className="btn btn-chat-add">
                                <span className="ico-circle-wrap">
                                    <i className="bi bi-voicemail"></i>
                                </span>
                                        <span className="label">음성메세지</span>
                                    </button>
                                </div>
                                <div className="col"></div>
                                <div className="col"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default ChatRoom;