import axios from "axios";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import '../common/css/header.css'

const ChatList=({chatList=[]})=>{

    const navigate = useNavigate();
    const [data, setData] = useState([]);

    const handleChatClick = (index) => {
        // user는 subscribe 데이터 사용
        // artist는 chat data 사용
        const stataData = Array.isArray(chatList) && chatList.length > 0 ?
            chatList[index]
            : chatList;
        const navigatePath = Array.isArray(chatList) && chatList.length > 0 ?
            chatList[index].chat.chatuuid
            : chatList.chatuuid;
        navigate(`/chat/ws/${navigatePath}`, { state: stataData }); // URL로 이동
    };
    useEffect(() => {
        console.log(`artist chatlist : ${JSON.stringify(chatList)}`)
        const role=localStorage.getItem("role");
        if (role==='USER'&&chatList.length>0){
            const userChatList = chatList.map(item => item.chat);
            setData(userChatList)
        }else if (role === 'ARTIST' && chatList) {
            setData([chatList]);    // 아티스트는 배열로 변경해서 넣어주기
        }
    }, [chatList]);

    return (
        <>
            {data.length > 0 ?
                (data.map((data,index) => (
                        <div key={index} // 유일한 key 추가
                            onClick={() => handleChatClick(index)}
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