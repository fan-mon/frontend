import axios from "axios";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import '../common/css/header.css'

const ChatList=({chatList=[]})=>{

    const navigate = useNavigate();
    const [data, setData] = useState([]);

    const handleChatClick = (data) => {
        navigate(`/chat/ws/${data.chatuuid}`, { state: data }); // URL로 이동
    };
    useEffect(() => {
        const role=localStorage.getItem("role");
        if (role==='USER'){
            const userChatList = chatList.map(item => item.chat);
            setData(userChatList)
        }else if (role === 'ARTIST') {
            setData([chatList]);    // 아티스트는 배열로 변경해서 넣어주기
        }
    }, [chatList]);

    return (
        <>
            {data.length > 0 ?
                (data.map(data => (
                        <div key={data.chatuuid} // 유일한 key 추가
                            onClick={() => handleChatClick(data)}
                            className="chat-room-list">
                            {data.artist && data.artist.fname ? (
                                <img className="profile-photo" src={`${process.env.REACT_APP_BACKEND_API_URL}/resources/artistimg/${data.artist.fname}`} alt={data.artist.name} />
                            ) : (
                                <img className="profile-photo" src="/default-profile.png" alt="기본 프로필" /> // 기본 이미지 사용
                            )}
                            < div className="artist-name">
                                {data.artist ? data.artist.name : "이름 없음"}
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