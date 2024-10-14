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
                    buyer_email: UpdateUserData.email, //이메일
                    buyer_name: UpdateUserData.name, //구매자 이름
                    buyer_tel: UpdateUserData.phone, //구매자 연락처
                    buyer_addr: UpdateUserData.address, //구매자 주소
                    buyer_postcode: UpdateUserData.postcode //구매자 우편번호
                },
                async (response) => {
                    
                    // 결제 성공 처리
                    try{

                        //Orders 테이블에 데이터 저장
                        const notifiedO = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/shop/buy/bought/sendO/${useruuid}`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                imp_uid: response.imp_uid,  // 포트원 결제ID
                                apply_num: response.apply_num,  // 신용카드 승인 번호
                                merchant_uid: response.merchant_uid,    // 주문번호
                                user_data: UpdateUserData, // 유저 데이터
                                buyer_addr: response.buyer_addr,    // 주문자 주소
                                paid_amount: response.paid_amount,  // 결제 금액
                                paid_at: response.paid_at,  // 결제 승인 시각
                                paid_qty: totalQuantity // 물품 수량
                            }), 
                        });
                        const res = await notifiedO.json();
                        console.log("보내는 데이터:", JSON.stringify(res, null, 2));
                        console.log('포트원 결제 id'+res.imp_uid);
                        console.log('신용카드 승인번호'+res.apply_num);
                        console.log('주문번호'+res.merchant_uid);
                        console.log('유저데이터'+res.UpdateUserData);
                        console.log('주문자주소'+res.buyer_addr);
                        console.log('결제액'+res.paid_amount);
                        console.log('결제승인시각'+res.paid_at);
                        console.log('물품 수량'+res.paid_qty);

                        console.log("보내는 데이터2:", JSON.stringify({
                            imp_uid: response.imp_uid,
                            apply_num: response.apply_num,
                            merchant_uid: response.merchant_uid,
                            user_data: UpdateUserData,
                            buyer_addr: response.buyer_addr,
                            paid_amount: response.paid_amount,
                            paid_at: response.paid_at,
                            paid_qty: totalQuantity
                        }, null, 2));

                        if (!notifiedO.ok) {
                            console.error('응답 오류:', notifiedO.statusText);
                            const errorText = await notifiedO.text(); // 오류 메시지 출력
                            console.error('서버 응답 본문:', errorText);
                            return;
                            // console.log("notifiedO 에러 응답:", JSON.stringify(await notifiedO.json(), null, 2));
                            // throw new Error(`Orders 데이터 저장 실패: ${notifiedO.status}`);
                        }

                        // 성공적인 응답 출력
                        const responseData = await notifiedO.json();
                        console.log("notifiedO 응답 데이터:", JSON.stringify(responseData, null, 2));



                        // 테이블에 저장된 ordres 데이터를 기존 세션/변수에 덮어쓰기
                        sessionStorage.setItem("ordersData", JSON.stringify(notifiedO.body));
                        setOrdersData(notifiedO.body);

                        //OrdersDetail 테이블에 데이터 저장
                        const notifiedD = await fetch (`${process.env.REACT_APP_BACKEND_API_URL}/shop/buy/bought/sendD/${useruuid}`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                user_data: UpdateUserData,// 유저 데이터
                                orders_data: ordersData,// Orders 데이터
                                goods_data: detailData.goodsuuid,// 굿즈 데이터
                                detail_amount: detailData.amount,// 동일 상품 총액
                                detail_qty: detailData.qty// 동일 상품 총수량
                            }),
                        });
                        if (!notifiedD.ok) {
                            throw new Error(`OrdersDetail 데이터 저장 실패: ${notifiedD.status}`);
                        }
                        console.log("notifiedD"+ await notifiedD.json());
    
                        // 세션 삭제
                        sessionStorage.removeItem('ordersData');
                        sessionStorage.removeItem('DetailData');

                        // Cart 테이블 비우기
                        const deleteCartResponse = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/shop/buy/deleteAll/${useruuid}`, {
                            method: "GET",
                        });
                        
                        console.log('결제 성공:', response);
                        alert('결제가 성공적으로 완료되었습니다.');
    
                        // 구매 완료 페이지로 네비게이트 
                        console.log('navigate : /shop/buy/bought');
                        navigate('/shop/buy/bought');
                    } catch (error){
                        //일단 Orders 테이블에 들어갈게 다 나오는지 보자
                        console.log('유저데이터 생일 나오나'+UpdateUserData.birth);
                        console.log('유저데이터 생일 타입은?'+typeof UpdateUserData.birth);

                        // 결제 실패 처리
                        console.error('서버 통신 중 오류 발생:', error);
                        

                        alert('결제 정보를 처리하는 중 오류가 발생했습니다.');
                        navigate(`/shop/cart/list`);
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