import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Buying() {
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        // 데이터 요청
        fetch('http://localhost:8080/shop/buy/buying')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(responseData => {
                setOrderData(responseData); // 주문 정보 저장
                setLoading(false); // 로딩 완료
            })
            .catch(error => {
                console.error('Error:', error);
                setError(error); // 에러 상태 업데이트
                setLoading(false); // 로딩 완료
            });

        // 데이터 수신
        const handleMessage = (event) => {
            // 보안 체크: event.origin이 현재 origin과 동일한지 확인
            if (event.origin !== window.location.origin) return;

            // 받은 데이터 처리
            const receivedData = event.data;
            console.log('Received Data:', receivedData);

            // 필요한 추가 로직 처리
        };

        // 메시지 이벤트 리스너 등록
        window.addEventListener('message', handleMessage);

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

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    const handlePayment = () => {
        if (window.IMP) {
            console.log('IMP 객체가 정상적으로 로드되었습니다.');

            if (!orderData) {
                console.error('주문 데이터가 없습니다.');
                return;
            }

            // 수신한 정보
            const { orders, ordersDetailList } = orderData; 
            const { useruuid, totalcost: totalOrderCost, qty: totalOrderQty } = orders;
            const { qty: detailQty, totalcost: detailTotalCost, goodsuuid: detailGoodsUUID, useruuid: detailUserUUID} = ordersDetailList;

            const { IMP } = window;
            IMP.init('imp10888263');

            // 결제 요청 실행
            IMP.request_pay(
                {
                    pg: 'kcp',
                    pay_method: 'card',
                    merchant_uid: `payment-${crypto.randomUUID()}`, // 이거 uuid로 수정하고 싶어요....흑흑흑
                    name: '상품명', //상품명
                    amount: {totalOrderCost}, //결제 예정 금액
                    buyer_email: '이메일', //이메일
                    buyer_name: '구매자이름', //구매자 이름
                    buyer_tel: '구매자연락처', //구매자 연락처
                    buyer_addr: '구매자주소', //구매자 주소
                    // buyer_postcode: '구매자우편번호'
                },
                function (response) {
                    if (response.success) {
                        console.log('결제 성공:', response);
                        alert('결제가 성공적으로 완료되었습니다.');
                        navigate('/shop/buy/bought');
                    } else {
                        console.log('결제 실패:', response);
                        alert(`결제에 실패했습니다. 사유: ${response.error_msg}`);
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
