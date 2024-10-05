import React, {useState} from "react";
const ChatRoom = ({ role, messages, sendMessage }) => {
    const [inputMessage, setInputMessage] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isChatPlusOpen, setIsChatPlusOpen] = useState(false);

    const openChatRoom = () => setIsChatOpen(true);
    const closeChatRoom = () => setIsChatOpen(false);
    const toggleChatPlus = () => setIsChatPlusOpen(!isChatPlusOpen);
    const handleSend = () => {
        if (inputMessage.trim()) {
            sendMessage(inputMessage, role);
            setInputMessage('');
        }
    };

    return (
        <div>
            <h2>{role === 'USER' ? 'Fan Chat' : 'Artist Chat'}</h2>
            <div className={`col-4 chatroom-area ${isChatOpen ? 'open' : ''}`}>
                <div className="contents-box contents-scroll-box chatroom">
                    <div className="chat-top">
                        <div>아티스트 이름</div>
                    </div>
                    <div className="chat-contents">
                        <div className="date-wrap">2024년 09월 19일</div>
                        <div className="message-list">
                            {messages.map((msg, index) => (
                                <div key={index}>
                                    <div className="profile"></div>
                                    <div className="content-wrap">
                                        <div className="same-time">
                                            <div className="bubble-wrap">
                                                <p className="name">{msg.messageFrom}</p>
                                                <div className="bubble">
                                                    {msg.messagetext}
                                                </div>
                                            </div>
                                            <div className="bubble-time">
                                                {new Date(msg.timestamp).getHours().toString().padStart(2, '0')}:
                                                {new Date(msg.timestamp).getMinutes().toString().padStart(2, '0')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="chat-bottom">
                        <div className="input-area">
                            <button className="btn btn-ico btn-chat-plus" onClick={toggleChatPlus}>
                                <i className="bi bi-plus-circle-fill"></i>
                            </button>
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
                                    <button className="btn btn-chat-add">
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