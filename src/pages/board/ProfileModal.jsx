import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { findAllChat } from "../chat/chatAPI/chat";

const ProfileModal = ({ isOpen, onClose, data }) => {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [chatuuid, setChatuuid] = useState(null);
    const [chatInfo, setChatInfo] = useState(null);
    const useruuid = localStorage.getItem("uuid");
    const goodsuuid = '66f9c803-b769-4b95-9247-a0ec9869e90c';
    const [list, setList] = useState([]);
    const [isChat, setIsChat] = useState(false);

    const getGoods = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/shop/goods/detail/${goodsuuid}`);
            return res.data;
        } catch (e) {
            console.error("굿즈 데이터 불러오기 실패!", e);
        }
    };

    const getList = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/chat/subscription/${useruuid}`);
            if (response.data === 204) {
                console.log("구독중인 아티스트 없음");
            } else if (Array.isArray(response.data)) {
                setList(response.data);
                const subscribedArtists = response.data.filter(item => item.chat && item.chat.artist.artistuuid === data.artist.artistuuid);
                if (subscribedArtists.length > 0) {
                    setChatuuid(subscribedArtists[0].chat);
                    setIsSubscribed(true);
                    setChatInfo(subscribedArtists[0]);
                }
            } else {
                console.error("응답 데이터가 배열이 아닙니다:", response.data);
            }
        } catch (e) {
            console.error("API 호출 중 오류 발생:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchChats = async () => {
            const chatList = await findAllChat();
            if (Array.isArray(chatList)) {
                const chatExists = chatList.some(item => item.artist.artistuuid === data.artist.artistuuid);
                setIsChat(chatExists);
            } else {
                console.error("list가 배열이 아닙니다:", chatList);
            }
        };

        getList();
        fetchChats();
    }, [data, useruuid]);

    const navigate = useNavigate();
    const goChat = (chatInfo) => {
        navigate(`/chat/ws/${chatInfo.chat.chatuuid}`, { state: chatInfo });
    };

    const goSubscribe = async () => {
        try {
            const goodsData = await getGoods();
            if (goodsData) {
                const orders = {
                    ordersuuid: null,
                    address: null,
                    createdat: null,
                    status: 'BEFORE',
                    totalcost: goodsData.price,
                    useruuid: useruuid,
                    qty: 1,
                    postcode: null,
                };

                const ordersDetailList = {
                    ordersdetailuuid: null,
                    goodsuuid: goodsuuid,
                    name: "채팅",
                    qty: 1,
                    totalcost: goodsData.price,
                    ordersuuid: null,
                    useruuid: useruuid,
                };

                sessionStorage.setItem('DetailData', JSON.stringify(ordersDetailList));
                sessionStorage.setItem('ordersData', JSON.stringify(orders));
                await subscribe();
                setTimeout(() => {
                    navigate(`/shop/buy/buying`);
                }, 100);
            }
        } catch (e) {
            console.error("goodsData 함수 실행에 실패했습니다.", e);
        }
    };

    const unsubscribe = async () => {
        if (chatInfo) {
            try {
                await axios.get(`http://localhost:8080/chat/subscription/unsubscribe/${chatInfo.subscribeuuid}`);
                setIsSubscribed(false);
                setChatuuid(null);
                setChatInfo(null);
            } catch (e) {
                console.error("구독 취소 중 오류 발생:", e);
            }
        }
    };

    const subscribe = async () => {
        const subscribeData = {
            subscribeuuid: null,
            chat: { chatuuid: data.chatuuid },
            user: { useruuid: useruuid },
            subscriptionStatus: 'SUBSCRIBED',
        };
        try {
            await axios.post(`http://localhost:8080/chat/subscription/newsubscription`, subscribeData);
            setIsSubscribed(true);
        } catch (e) {
            console.error("구독 중 오류 발생:", e);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="profile-modal-wrap" onClick={(e) => e.stopPropagation()}>
                <div className="info-top">
                    <div className="member-info">
                        <div className="member-photo">
                            member photo
                        </div>
                        <div className="member-name">
                            {data.artist.name}
                        </div>
                    </div>
                    {loading ? (
                        <div>로딩 중...</div>
                    ) : (
                        isSubscribed ? (
                            <div>
                                <button className="gochat" onClick={() => goChat(chatInfo)}>
                                    채팅하러 가기
                                </button>
                                <button className="unsubscribe" onClick={unsubscribe}>
                                    구독 취소
                                </button>
                            </div>
                        ) : isChat ? (
                            <button className="gosubscribe" onClick={goSubscribe}>
                                채팅 구독하기
                            </button>
                        ) : (
                            <div className="nochat">채팅 준비중이예요!</div>
                        )
                    )}
                </div>
                <button className="close-button" onClick={onClose}>닫기</button>
            </div>
        </div>
    );
};

export default ProfileModal;
