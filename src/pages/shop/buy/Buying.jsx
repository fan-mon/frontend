import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../../../apiClient';

function Buying() {
    
    // user 데이터 불러오기
    let [useruuid, setUseruuid] = useState(null);
    let [userData, setUserData] = useState(null);
    let [UpdateUserData, setUpdateUserData] = useState(null);

    useEffect(() => {
        console.log('Buying.jsx 시작!!')
        const fetchUserInfo = async () => {
            try {
                const response = await api.get('/users/myprofile');
                setUseruuid(response.data.useruuid);
                setUserData(response.data);
                setUpdateUserData({
                    useruuid : response.data.useruuid,
                    status : response.data.status,
                    role: response.data.role,
                    email: response.data.email,
                    name: response.data.name,
                    birth: response.data.birth.toString(), // birth를 문자열로 변환
                    phone: response.data.phone,
                    address: response.data.address,
                    postcode: response.data.postcode
                });
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };
        fetchUserInfo();
    }, []);

    console.log("Fetched useruuid: " + useruuid);
    console.log("Fetched userData: "+ userData);
    console.log("Fetched updateUserData:"+UpdateUserData);

    // CartList.jsx에서 세션에 저장한 데이터를 한 번만!! 불러오기
    let [ordersData, setOrdersData] = useState(null);
    let [detailData, setDetailData] = useState(null);

    useEffect(()=>{
        console.log('세션 받아올게요');

        // ordersData 불러오기
        const storedOrdersData = sessionStorage.getItem('ordersData');
        if (storedOrdersData) {
            const parsedOrdersData = JSON.parse(storedOrdersData);
            setOrdersData(parsedOrdersData);
            console.log('ordersData'+parsedOrdersData);
        }
    

        // detailData 불러오기
        const storedDetailData = sessionStorage.getItem('DetailData');
        if (storedDetailData) {
            const parsedDetailData = JSON.parse(storedDetailData);
            setDetailData(parsedDetailData);
            console.log('detail data:'+parsedDetailData); // 여기에서 바로 로그를 출력
        }

        console.log('세션을 다 받아왔어요');
    }, []);


    // 결제 준비 useEffect가 한 번만 실행되도록 플래그 생성
    const hasExecuted = useRef(false);

    // 결제 준비
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    useEffect(() => {
        if(UpdateUserData && ordersData && detailData && !hasExecuted.current) {
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
    }, [useruuid, UpdateUserData]);

    async function handlePayment() {
        if (window.IMP) {
            console.log('IMP 객체가 정상적으로 로드되었습니다.');
    
            const totalQuantity = ordersData ? ordersData.qty : 0; // 주문 수량
            let name = detailData && detailData.length > 0 
                ? detailData.length > 1 
                    ? detailData[0].name + ' 외 ' + (detailData.length - 1) + '개' 
                    : detailData[0].name 
                : "상품명 없음";
    
            const amount = ordersData.totalcost; // 총 결제 금액
    
            window.IMP.init('imp10888263');
            window.IMP.request_pay(
                {
                    pg: 'kcp',
                    pay_method: 'card',
                    merchant_uid: `payment-${crypto.randomUUID()}`,
                    name: name,
                    amount: amount,
                    buyer_email: UpdateUserData.email,
                    buyer_name: UpdateUserData.name,
                    buyer_tel: UpdateUserData.phone,
                    buyer_addr: UpdateUserData.address,
                    buyer_postcode: UpdateUserData.postcode
                },
                async (response) => {
                    if (response.success) {
                        try {
                            // **Orders 데이터 저장 요청**
                            const notifiedO = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/shop/buy/bought/sendO/${useruuid}`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    imp_uid: response.imp_uid,
                                    apply_num: response.apply_num,
                                    merchant_uid: response.merchant_uid,
                                    user_data: UpdateUserData,
                                    buyer_addr: response.buyer_addr,
                                    paid_amount: response.paid_amount,
                                    paid_at: response.paid_at,
                                    paid_qty: totalQuantity
                                })
                            });
    
                            if (!notifiedO.ok) {
                                const errorResponse = await notifiedO.json();
                                console.error("Orders 저장 실패:", errorResponse.message);
                                alert(`Orders 저장 실패: ${errorResponse.message}`);
                                return;
                            }
    
                            const ordersResponse = await notifiedO.json();
                            console.log("Orders 저장 성공:", ordersResponse);

                            // ordersuuid를 응답에서 추출
                            console.log("저장된 Orders UUID:", ordersResponse.ordersuuid);
    
                            // 세션에 저장
                            sessionStorage.setItem("ordersData", JSON.stringify(ordersResponse));
                            setOrdersData(ordersResponse);
    
                            // **OrdersDetail 데이터 저장 요청**
                            const notifiedD = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/shop/buy/bought/sendD/${useruuid}`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    user_data: UpdateUserData, // 사용자 정보
                                    orders_data: ordersResponse.ordersuuid, // Orders 데이터
                                    goods_data: detailData.goodsuuid,// 굿즈 데이터
                                    detail_amount: detailData.amount,// 동일 상품 총액
                                    detail_qty: detailData.qty,// 동일 상품 총수량
                                })
                            });
    
                            if (!notifiedD.ok) {
                                const errorDetailResponse = await notifiedD.json();
                                console.error("OrdersDetail 저장 실패:", errorDetailResponse.message);
                                alert(`OrdersDetail 저장 실패: ${errorDetailResponse.message}`);
                                return;
                            }
    
                            const detailResponse = await notifiedD.json();
                            console.log("OrdersDetail 저장 성공:", detailResponse);
    
                            // 세션 데이터 삭제
                            sessionStorage.removeItem("ordersData");
                            sessionStorage.removeItem("DetailData");
    
                            // **장바구니 데이터 비우기**
                            const deleteCartResponse = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/shop/buy/deleteAll/${useruuid}`, {
                                method: "GET"
                            });
    
                            if (!deleteCartResponse.ok) {
                                console.error("Cart 데이터 삭제 실패");
                                alert("장바구니 비우기에 실패했습니다. 관리자에게 문의하세요.");
                            }
    
                            // 성공 메시지 및 페이지 이동
                            alert("결제가 성공적으로 완료되었습니다.");
                            navigate('/shop/buy/bought');
                        } catch (error) {
                            console.error("결제 처리 중 오류 발생:", error);
                            alert("결제 처리 중 오류가 발생했습니다. 관리자에게 문의하세요.");
                        }
                    } else {
                        console.error("결제 실패:", response.error_msg);
                        alert(`결제 실패: ${response.error_msg}`);
                        navigate('/shop/cart/list');
                    }
                }
            );
        } else {
            console.error('IMP 객체가 로드되지 않았습니다.');
        }
    }
    

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