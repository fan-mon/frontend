import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CartBuying() {
    const navigate = useNavigate();

    useEffect(() => {
      // 1. iamport.js 스크립트 동적으로 로드
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
    }, []);
  
    const handlePayment = () => {
      if (window.IMP) {
        console.log('IMP 객체가 정상적으로 로드되었습니다.');
        const { IMP } = window;
        IMP.init('imp10888263');
  
        // 결제 요청 실행
        IMP.request_pay(
          {
            pg: 'kcp',
            pay_method: 'card',
            merchant_uid: `payment-${crypto.randomUUID()}`, // 주문 고유 번호를 랜덤 생성
            name: '나이키 축구공',
            amount: 300,
            buyer_email: 'gildong@gmail.com',
            buyer_name: '홍길동',
            buyer_tel: '010-4242-4242',
            buyer_addr: '서울특별시 강남구 신사동',
            buyer_postcode: '01181',
          },
          function (response) {
            if (response.success) {
              console.log('결제 성공:', response);
              alert('결제가 성공적으로 완료되었습니다.');
              navigate('/shop/cart/bought');
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

    return(
        <>
            <div>
                결제 페이지
            </div>
        </>
    )
}

export default CartBuying;