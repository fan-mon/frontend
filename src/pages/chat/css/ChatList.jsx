import axios from "axios";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const ChatList=({chatList=[]})=>{

    const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수 얻기

    const handleChatClick = (chatuuid) => {
        navigate(`/chat/ws/${chatuuid}`); // URL로 이동
    };

    return (
        <>
            {chatList.length > 0 ?
                (chatList.map(data => (
                        <div key={data.chat.chatuuid} // 유일한 key 추가
                             onClick={() => handleChatClick(data.chat.chatuuid)}
                            className="chat-room-list">
                            <div className="profile-photo"></div>
                            < div className="artist-name">
                                {data.chat.artist.name}
                            </div>
                        </div>
                    )))
                :
                (<div  className="chat-room-list">새로운 채팅을 시작해보세요!</div>)
            }
        </>
    );
}

export default ChatList;