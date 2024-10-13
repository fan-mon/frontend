import { useEffect, useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const ProfileModal = ({ isOpen, onClose, data }) => {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [chatuuid, setChatuuid] = useState(null);
    const useruuid = localStorage.getItem("uuid"); // 여기서 바로 가져옵니다.

    // 컴포넌트가 마운트될 때 데이터 가져오기
    useEffect(() => {
        if (!data || !useruuid) {
            setLoading(false);
            return; // 데이터가 없으면 바로 종료
        }
        const getList = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/chat/chatlist/${useruuid}`);
                if (response.data === 204) {
                    console.log("구독중인 아티스트 없음");
                } else {
                    console.log(response.data)
                    const subscribedArtists = response.data.map(item => {
                        // 구독 중인 아티스트의 chat 정보를 포함
                        const artistUUID = item.chat.artist.artistuuid;
                        const chatuuid = item.chat.chatuuid; // chatuuid 저장
                        // 만약 현재 아티스트가 구독 중이라면 chatuuid를 저장
                        if (artistUUID === data.artistuuid) {
                            setChatuuid(chatuuid);
                            setIsSubscribed(true);
                        }
                        return artistUUID;
                    });
                    setIsSubscribed(subscribedArtists.includes(data.artistuuid));
                }
            } catch (e) {
                console.error("Error fetching subscription list:", e);
            } finally {
                setLoading(false);
            }
        };

        getList(); // 데이터 가져오기 호출
    }, [data, useruuid]);



    const navigate = useNavigate();
    const handleChatClick = () => {
        if (chatuuid) {
            navigate(`/chat/ws/${chatuuid}`); // URL로 이동
        }
    };

    if (!isOpen) return null; // 모달이 열려있지 않으면 랜더링 X



    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="profile-modal-wrap" onClick={(e) => e.stopPropagation()}>
                <div className="info-top">
                <div className="member-info">
                    <div className="member-photo">
                        member photo
                    </div>
                    <div className="member-name">
                        {data.name}
                    </div>
                </div>
                {loading ? (
                    <div>로딩 중...</div>
                ) : (
                    isSubscribed ? (
                        <button onClick={() => {handleChatClick()}}>
                            채팅하러 가기
                        </button>
                    ) : (
                        <button onClick={() => {/* 채팅 구독하기 로직 */}}>
                            채팅 구독하기
                        </button>
                    )
                )}
                </div>
                <button onClick={onClose}>닫기</button>
            </div>
        </div>
    );
};

export default ProfileModal;
