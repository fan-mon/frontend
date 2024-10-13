import { useEffect, useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const ProfileModal = ({isOpen, onClose, data}) => {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [chatuuid, setChatuuid] = useState(null);
    const [chatInfo, setChatInfo]=useState(null)
    const useruuid = localStorage.getItem("uuid"); // 여기서 바로 가져옵니다.
    const goodsuuid='66f9c803-b769-4b95-9247-a0ec9869e90c';
    const getGoods=async ()=>{
        try{
            const res=await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/shop/goods/detail/${goodsuuid}`)
            console.log(res.data);
            return res.data;
        }catch (e) {
            console.log("굿즈 데이터 불러오기 실패!")
        }

    }
    const getList = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/chat/chatlist/${useruuid}`);
            if (response.data === 204) {
                console.log("구독중인 아티스트 없음");
            }else {
                // response.data가 배열인지 확인
                if (Array.isArray(response.data)) {
                    const subscribedArtists = response.data.map(item => {
                        console.log("현재 item:", item); // 추가된 로그
                        // 구독 중인 아티스트의 chat 정보를 포함
                        const artistUUID = item.chat.artist.artistuuid;
                        const chatuuid = item.chat.chatuuid; // chatuuid 저장
                        // 만약 현재 아티스트가 구독 중이라면 chatuuid를 저장
                        if (artistUUID === data.artistuuid) {
                            setChatuuid(chatuuid);
                            setIsSubscribed(true);
                            setChatInfo(item);
                            return artistUUID;
                        }
                        return null; // 현재 아티스트가 아닐 경우 null 반환
                    }).filter(Boolean); //null값을 제거
                    setIsSubscribed(subscribedArtists.length > 0);
                }else{
                    console.error("응답 데이터가 배열이 아닙니다:", response.data);
                }
            }
        } catch (e) {
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        console.log("chatInfo가 업데이트되었습니다:", chatInfo);
    }, [chatInfo]);

    useEffect(() => {
        getList(); // 데이터 가져오기 호출
        console.log(chatInfo)
    }, [data, useruuid]);

    const navigate = useNavigate();
    const goChat = () => {
        if (chatuuid) {
            navigate(`/chat/ws/${chatuuid}`); // URL로 이동
        }
    };
    let [orders, setOrders] = useState();
    let [ordersDetailList, setOrdersDetailList] = useState();
    const goSubscribe = async () => {
        try{
            const goodsData= await getGoods();
            if (goodsData){
                orders = {
                    ordersuuid: null, //UUID
                    address: null, //주소
                    createdat: null, //구매일자
                    status: 'BEFORE',   // 결제 상태 : 기본은 enums에 없는 값인 'BEFORE'으로 갈게요
                    totalcost: goodsData.price ,  // 결제 예정 금액 (배송비가 포함된 총액)
                    useruuid: useruuid,  // 로그인된 사용자의 UUID
                    qty: 1,  // 장바구니에 담긴 총 상품 수량
                    postcode: null //우편번호입니다. 테이블 구조 고쳐지면 추가할게요
                };
                ordersDetailList= {
                    ordersdetailuuid: null, // UUID
                    goodsuuid: goodsuuid,  // 각 상품의 UUID
                    name: '채팅',
                    qty: 1,  // 각 상품의 수량
                    totalcost:goodsData.price,  // 각 상품의 총 금액
                    ordersuuid: null,  // ordersuuid가 아직 존재하지 않음
                    useruuid: useruuid
                };
                // ordersDetailList 업데이트
                setOrdersDetailList(ordersDetailList);
                // sessionStorage에 저장
                sessionStorage.setItem('DetailData', JSON.stringify(ordersDetailList));
                console.log("ordersDetailList", ordersDetailList);
                sessionStorage.setItem('ordersData', JSON.stringify(orders));
                console.log("orders", orders);
                setTimeout(() => {
                    navigate(`/shop/buy/buying`);
                }, 100);
            }
        }catch (e) {
            console.log("goodData 함수 실행에 실패했습니다.")
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
                            <button onClick={() => {
                                goChat()
                            }}>
                                채팅하러 가기
                            </button>
                        ) : (
                            <button onClick={() => {
                                goSubscribe()
                            }}>
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
