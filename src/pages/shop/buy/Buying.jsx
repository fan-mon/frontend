import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function Buying() {

    // URL 경로에 포함된 useruuid 불러오기 : 로그인 기능 구현 후 수정 필요!
    const { useruuid } = useParams();

    // CartList.jsx에서 세션에 저장한 데이터를 한 번만!! 불러오기
    let [ordersData, setOrdersData] = useState(null);
    let [detailData, setDetailData] = useState(null);

    useEffect(()=>{
        console.log('세션 받아올게요');

        // ordersData 불러오기
        const storedOrdersData = sessionStorage.getItem('ordersData');
        if (storedOrdersData) setOrdersData(JSON.parse(storedOrdersData));

        // detailData 불러오기
        const storedDetailData = sessionStorage.getItem('DetailData');
        if (storedDetailData) setDetailData(JSON.parse(storedDetailData));

        console.log('세션을 다 받아왔어요');
    }, []);


    //DB에서 데이터를 가져오기 위한 변수
    let [userData, setUserData] = useState(null);
    let [cardInfo, setCardInfo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`http://localhost:8080/shop/buy/buying`);
            setUserData(response.data.user);
            setCardInfo(response.data.cardInfo);
            console.log('userData'+userData);
            console.log('cardInfo'+cardInfo);
          } catch (err) {
            setError(err.message);
          }
        };
        fetchData();
    }, []);


    // 결제 준비 useEffect가 한 번만 실행되도록 플래그 생성
    const hasExecuted = useRef(false);

    // 결제 준비
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    useEffect(() => {
        if(ordersData && detailData && !hasExecuted.current) {
            // iamport.js 스크립트 로드
            const script = document.createElement('script');
            script.src = 'https://cdn.iamport.kr/v1/iamport.js';
            script.async = true;
            script.onload = () => {
                console.log('iamport.js 스크립트가 성공적으로 로드되었습니다.');
                handlePayment();
            };
            script.onerror = () => {
                console.error('iamport.js 스크립트 로드에 실패했습니다.');
            };
            document.body.appendChild(script);

            // useEffect가 재실행되지 않도록 플래그 설정
            hasExecuted.current = true;

            // 컴포넌트 언마운트 시 이벤트 리스너 제거
            return () => {
                document.body.removeChild(script);
            };
        }
    }, [ordersData, detailData]);

    const handlePayment = () => {
        if (window.IMP) {
            console.log('IMP 객체가 정상적으로 로드되었습니다.');
            
            // 세션에서 데이터 가져오기
            const totalQuantity = ordersData.qty;
            const name = null;
            if(totalQuantity > 1){
                name = detailData.name[0] + ' 외 ' + (totalQuantity-1) + '개';
            }else{
                name = detailData.name[0];
            }

            //DB에서 데이터 가져오기
            

            const amount = ordersData.totalcost;

            // 결제 요청 실행
            window.IMP.init('imp10888263');
            window.IMP.request_pay(
                {
                    // pg: cardinfo.provider,
                    pg: 'kcp', // PG사 구분 코드
                    pay_method: 'card', // 결제 방법
                    merchant_uid: `payment-${crypto.randomUUID()}`, // 고객사 주문번호
                    name: name, //상품명
                    amount: amount, //결제 예정 금액
                    buyer_email: '이메일', //이메일
                    buyer_name: '구매자이름', //구매자 이름
                    buyer_tel: '구매자연락처', //구매자 연락처
                    buyer_addr: '구매자주소', //구매자 주소
                    // buyer_postcode: '구매자우편번호' //구매자 우편번호
                },
                async (response) => {

                    // 결제 실패 처리
                    if (response.error_code != null) {
                        console.log('결제 실패:', response);
                        alert(`결제에 실패했습니다. 사유: ${response.error_msg}`);

                        // 장바구니 페이지로 네비게이트
                        navigate('/shop/cart/list/0cf55a0d-a2a5-443b-af46-835d70874c40');
                        return;
                    }
                    
                    // 결제 성공 처리
                    try{
                        const notified = await fetch (``, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            // imp_uid와 merchant_uid, 주문 정보를 서버에 전달합니다
                            body: JSON.stringify({
                                imp_uid: response.imp_uid,
                                merchant_uid: response.merchant_uid,
                                // 주문 정보...
                            }),
                        });

                        // orders, ordersdetail, cardinfo 테이블에 데이터 삽입
    
                        //세션 삭제
                        sessionStorage.removeItem('ordersData');
                        sessionStorage.removeItem('userData');
                        sessionStorage.removeItem('DetailData');
                        
                        console.log('결제 성공:', response);
                        alert('결제가 성공적으로 완료되었습니다.');
    
                        // 구매 완료 페이지로 네비게이트 
                        navigate('/shop/buy/bought');
                    } catch (error){
                        console.error('서버 통신 중 오류 발생:', error);
                        alert('결제 정보를 처리하는 중 오류가 발생했습니다.');
                    }
                }
            );
        } else {
            console.error('IMP 객체가 로드되지 않았습니다.');
        }
    };

    if (error) {
        return <div>Error: {error.message}</div>; // 에러 발생 시 표시
    }

    return (
        <div>
            결제 페이지
        </div>
    );
}


export default Buying;