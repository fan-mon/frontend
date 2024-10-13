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

    // // orders 테이블에 들어갈 데이터 준비
    // let [orders, setOrders] = useState([]);
    // useEffect(()=>{
    //     orders = {
    //         ordersuuid: null, //UUID
    //         address: null, //주소
    //         createdat: null, //구매일자
    //         status: 'BEFORE',   // 결제 상태 : 기본은 enums에 없는 값인 'BEFORE'으로 갈게요
    //         totalcost: finalAmount,  // 결제 예정 금액 (배송비가 포함된 총액)
    //         useruuid: useruuid,  // 로그인된 사용자의 UUID
    //         qty: totalQuantity  // 장바구니에 담긴 총 상품 수량
    //         // ,postcode: null //우편번호입니다. 테이블 구조 고쳐지면 추가할게요
    //     };
    //     sessionStorage.setItem('ordersData', JSON.stringify(orders));
    //     console.log("orders",orders);
    //
    // }, [clist, useruuid]) // clist 또는 useruuid가 변경될 때 실행

    // // ordersDetail 테이블에 들어갈 데이터 준비
    // let [ordersDetailList, setOrdersDetailList] = useState([]);
    // useEffect(() => {
    //     // clist가 null이 아니고, 배열이 존재할 때만 ordersDetailList 초기화
    //     if (clist && clist.length > 0) {
    //
    //         ordersDetailList = clist.map((crecord) => ({
    //             ordersdetailuuid: crecord.goods.goodsuuid, // UUID
    //             name : crecord.goods.name,
    //             qty: crecord.qty,  // 각 상품의 수량
    //             totalcost: crecord.goods.price * crecord.qty,  // 각 상품의 총 금액
    //             goodsuuid: crecord.goods.goodsuuid,  // 각 상품의 UUID
    //             ordersuuid: null,  // ordersuuid가 아직 존재하지 않음
    //             useruuid: useruuid
    //         }));
    //
    //         // ordersDetailList 업데이트
    //         setOrdersDetailList(ordersDetailList);
    //         // sessionStorage에 저장
    //         sessionStorage.setItem('DetailData', JSON.stringify(ordersDetailList));
    //         console.log("ordersDetailList",ordersDetailList);
    //     }
    // }, [clist, useruuid]);

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
