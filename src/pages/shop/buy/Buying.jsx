import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../../../apiClient';

function Buying() {
    
    
    // user 데이터 불러오기
    let [useruuid, setUseruuid] = useState(null);
    let [userData, setUserData] = useState(null);
    

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await api.get('/users/myprofile');
                setUseruuid(response.data.useruuid);
                setUserData(response.data);
    
                console.log("Fetched useruuid: " + response.data.useruuid);
                console.log("Fetched userData: ", response.data);
    
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };
        fetchUserInfo();
    }, []);
    

    // CartList.jsx에서 세션에 저장한 데이터를 한 번만!! 불러오기
    let [ordersData, setOrdersData] = useState(null);
    let [detailData, setDetailData] = useState(null);

    useEffect(()=>{
        console.log('세션 받아올게요');

        // ordersData 불러오기
        const storedOrdersData = sessionStorage.getItem('ordersData');
        if (storedOrdersData) setOrdersData(JSON.parse(storedOrdersData));
        console.log(ordersData);

        // detailData 불러오기
        const storedDetailData = sessionStorage.getItem('DetailData');
        if (storedDetailData) setDetailData(JSON.parse(storedDetailData));
        console.log(detailData);

        console.log('세션을 다 받아왔어요');
    }, []);


    // 결제 준비 useEffect가 한 번만 실행되도록 플래그 생성
    const hasExecuted = useRef(false);

    // 결제 준비
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    useEffect(() => {
        if(userData && ordersData && detailData && !hasExecuted.current) {
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
    }, [useruuid, userData]);

    const handlePayment = () => {
        if (window.IMP) {
            console.log('IMP 객체가 정상적으로 로드되었습니다.');
            
            // 세션에서 데이터 가져오기
            const totalQuantity = ordersData ? ordersData.qty : 0; // ordersData가 null일 경우를 대비

            // detailData가 유효한지 확인
            let name = null;
            if (detailData && detailData.length > 0) { // detailData가 배열이고 길이가 0보다 큰 경우
                name = detailData.length > 1 
                    ? detailData[0].name + ' 외 ' + (detailData.length - 1) + '개' 
                    : detailData[0].name;
            }

            //총액 계산
            const amount = ordersData.totalcost;

            // 결제 요청 실행
            window.IMP.init('imp10888263');
            window.IMP.request_pay(
                {
                    pg: 'kcp', // PG사 구분 코드
                    pay_method: 'card', // 결제 방법
                    merchant_uid: `payment-${crypto.randomUUID()}`, // 승인번호
                    name: name, //상품명
                    amount: amount, //결제 예정 금액
                    buyer_email: userData.email, //이메일
                    buyer_name: userData.name, //구매자 이름
                    buyer_tel: userData.phone, //구매자 연락처
                    buyer_addr: userData.address, //구매자 주소
                    buyer_postcode: userData.postcode //구매자 우편번호
                },
                async (response) => {

                    // 결제 실패 처리
                    if (response.error_code != null) {
                        console.log('결제 실패:', response);
                        alert(`결제에 실패했습니다. 사유: ${response.error_msg}`);

                        // 장바구니 페이지로 네비게이트
                        navigate(`/shop/cart/list`);
                        return;
                    }
                    
                    // 결제 성공 처리
                    try{
                        //Orders 테이블에 데이터 저장
                        const notifiedO = await fetch (`http://localhost:8080/shop/buy/bought/sendO/${useruuid}`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                imp_uid: response.imp_uid,  // 포트원 결제ID
                                apply_num: response.apply_num,  //신용카드 승인 번호
                                merchant_uid: response.merchant_uid,    //주문번호
                                user_data: userData,// 유저 데이터
                                buyer_addr: response.buyer_addr,    // 주문자 주소
                                paid_amount: response.paid_amount,  // 결제 금액
                                paid_at: response.paid_at,  // 결제 승인 시각
                                paid_qty: totalQuantity// 물품 수량
                            }),
                        });

                        // 테이블에 저장된 ordres 데이터를 기존 세션/변수에 덮어쓰기
                        sessionStorage.setItem("ordersData", JSON.stringify(notifiedO.body));
                        setOrdersData(notifiedO.body);

                        //OrdersDetail 테이블에 데이터 저장
                        const notifiedD = await fetch (`http://localhost:8080/shop/buy/bought/sendD/${useruuid}`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                user_data: userData,// 유저 데이터
                                orders_data: ordersData,// Orders 데이터
                                goods_data: detailData.goodsuuid,// 굿즈 데이터
                                detail_amount: detailData.amount,// 동일 상품 총액
                                detail_qty: detailData.qty// 동일 상품 총수량
                            }),
                        });
    
                        //세션 삭제
                        sessionStorage.removeItem('ordersData');
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