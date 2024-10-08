import React, {useState,useRef} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../meetingroom/fonts/bootstrap-icons.min.css'
import './css/ChatRoom.css'
import axios from "axios";
const ChatRoom = ({ role, messages, sendMessage, sendImage  }) => {
    const [inputMessage, setInputMessage] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isChatPlusOpen, setIsChatPlusOpen] = useState(false);
    const fileInputRef = useRef(null);

    const openChatRoom = () => setIsChatOpen(true);
    const closeChatRoom = () => setIsChatOpen(false);
    const toggleChatPlus = () => setIsChatPlusOpen(!isChatPlusOpen);
    const handleSend = () => {
        if (inputMessage.trim()) {
            sendMessage(inputMessage);
            setInputMessage('');
        }
    };
    const handleImageSend = () => {
        // 예시: Base64 인코딩된 이미지 데이터 생성 (여기서는 임의의 데이터 사용)
        const imageData = "data:image/png;base64,..."; // 실제 Base64 이미지 데이터로 변경 필요
        sendImage(imageData);
    };

    const handleImageSelect = (event) => {
        const file = event.target.files[0]; // 선택한 파일 가져오기
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                console.log(reader.result)
                sendImage(reader.result, file.name); // Base64 데이터로 변환하여 sendImage 호출
            };
            reader.readAsDataURL(file); // 파일을 읽어 Base64로 변환
        }
    };

    const blockuser= async ({msg})=>{
        try {
            await axios.post('http://localhost:8080/chat/block',msg)
            alert('해당 메세지를 보낸 유저가 차단되었습니다.');
        }catch (e){
            console.log(e)
        }
    }
    const handleMessage=(msg)=> {
        console.log("block user 실행 : " + JSON.stringify(msg))
        const usermessageuuid=msg.usermessageuuid;
        blockuser(usermessageuuid);
    }

    return (
        <div className="artist-chat">
            <h2>{role === 'USER' ? 'Fan Chat' : 'Artist Chat'}</h2>
            <div className={`col-4 chatroom-area`}>
                <div className="contents-box contents-scroll-box chatroom">
                    <div className="chat-top">
                        <div>아티스트 이름</div>
                    </div>
                    <div className="chat-contents">
                        <div className="date-wrap">2024년 09월 19일</div>
                        {messages.map((msg, index) => (
                            <div key={index} className="chat-wrap">
                                <div className={msg.type === role ? "mine" : "yours"}>
                                    <div className="profile"></div>
                                    <div className="content-wrap">
                                        <p className="name">{msg.type}</p>
                                        <div className="same-time">
                                            <div className="bubble-wrap">
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
                            </div>
                        ))}
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