import React, { useState, useEffect  } from 'react';
import "../css/cartlist.css";
import "bootstrap/dist/css/bootstrap.min.css";
import * as Icon from 'react-bootstrap-icons';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function CartList(){

    const { useruuid } = useParams();
    const navigate = useNavigate();
    const [clist, setCList] = useState([]);


    // 데이터 패칭을 useEffect로 처리
    useEffect(() => {
        console.log(clist);

        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/shop/cart/list/${useruuid}`);
                setCList(response.data);
            } catch (error) {
                console.error('Error fetching goods:', error);
            }
        };

        fetchData();
        console.log('Current cart list:', clist);
    }, []); // 빈 배열을 넣어 컴포넌트가 처음 렌더링될 때만 실행

    // 총 수량과 총 가격 계산
    const totalQuantity = clist.reduce((total, crecord) => total + parseInt(crecord.qty), 0);
    const totalPrice = clist.reduce((total, crecord) => total + (crecord.goods.price * crecord.qty), 0);
    const deliveryFee = 2500;
    const finalAmount = totalPrice+deliveryFee;

    const handleQuantityChange = async (id, newQty) => {
        // newQty가 유효한지 확인 (1에서 10 사이의 값)
        if (newQty < 1 || newQty > 10 || isNaN(newQty)) {
            console.error('Invalid quantity:', newQty);
            return; // 유효하지 않은 경우 함수 종료
        }
        
        // 상태에서 수량 변경
        const updatedCList = clist.map(crecord => 
            crecord.cartsequence === id ? { ...crecord, qty: newQty } : crecord
        );
    
        // 변경된 레코드 찾기
        const updatedRecord = updatedCList.find(crecord => crecord.cartsequence === id);
        
        // goodsuuid가 없으면 로그 출력 후 종료
        if (!updatedRecord || !updatedRecord.goods.goodsuuid) {
            console.error('Goods UUID not found');
            console.log('goodsuuid', updatedRecord ? updatedRecord.goods.goodsuuid : '레코드 없음'); 
            return;
        }
    
        try {
            // 서버에 수량 업데이트 요청
            await axios.post(`http://localhost:8080/shop/cart/update/${useruuid}/${updatedRecord.goods.goodsuuid}/${newQty}`);
            console.log(newQty);
            // 요청 성공 후 상태 업데이트
            setCList(updatedCList);
        } catch (error) {
            console.error('Error updating quantity:', error);
            // 수량 변경이 실패하면 원래 상태로 되돌리기
            setCList(clist);
        }
    };
    
    // 장바구니에 담긴 상품 삭제
    // 마찬가지로 CORS에서 delete가 허용되면 바꾸겠습니다
    const deleteCartItem = async (useruuid, cartsequence) => {
        try {
            await axios.get(`http://localhost:8080/shop/cart/delete/${useruuid}/${cartsequence}`);
            // 삭제 후 UI 업데이트
            setCList(prevItems => prevItems.filter(item => item.cartsequence !== cartsequence));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    //결제버튼클릭 > 새 창 열 때 데이터 전송
    const handlePaymentClick = () => {
        const paymentData = {
            orders: {
                useruuid: useruuid,  // 로그인된 사용자의 UUID
                totalcost: finalAmount,  // 결제 예정 금액 (배송비가 포함된 총액)
                qty: totalQuantity  // 장바구니에 담긴 총 상품 수량
            },

            ordersDetailList: clist.map(crecord => ({
                qty: crecord.qty,  // 각 상품의 수량
                totalcost: crecord.goods.price * crecord.qty,  // 각 상품의 총 금액
                goodsuuid: crecord.goods.goodsuuid,  // 각 상품의 UUID
                useruuid: useruuid  // 로그인된 사용자의 UUID (FK 용도)
            }))
        };

        fetch('http://localhost:8080/shop/buy/buying', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData),
        })
        .then(response => {
            if (!response.ok) {
                console.error('Response not OK:', response);
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('성공:', data);
            navigate('/shop/buy/buying/0cf55a0d-a2a5-443b-af46-835d70874c40');
        })
        .catch(error => {
            console.log('전송할 데이터:', paymentData);
            console.error('오류 발생:', error);
        });
    
    
};


    return(
        <>
            <div className=" cart-content">
                <div className="row">
                    <h2>장바구니</h2>
                    <table className="cart-content-list">
                        {clist.map((crecord, index) => (
                            <tr key={crecord.cartsequence}>
                                <td className="cart-list-no cart-list-center">{index + 1}</td>
                                <td className="cart-list-file cart-list-center"><a href={`/shop/goods/detail/${crecord.goods.goodsuuid}`}><img src={`${process.env.PUBLIC_URL}/shop/common/${crecord.goods.fname}`} alt={`${crecord.goods.fname}`}/></a></td>
                                <td className="cart-list-name"><a href={`/shop/goods/detail/${crecord.goods.goodsuuid}`}>{crecord.goods.name}</a></td>
                                <td className="cart-list-qty cart-list-center">
                                    <input 
                                        type="number" 
                                        name={`goods-qty-${crecord.cartsequence}`} 
                                        min="1" 
                                        max="10"
                                        defaultValue={crecord.qty}
                                        onChange={(e) => handleQuantityChange(crecord.cartsequence, parseInt(e.target.value), crecord.goodsuuid)}
                                    />
                                </td>
                                <td className="cart-list-price">{(crecord.goods.price * crecord.qty).toLocaleString()}원</td>
                                <td className="cart-list-delete cart-list-center" onClick={() => deleteCartItem(useruuid, crecord.cartsequence)}><Icon.XLg className="delete-icon" /></td>
                            </tr>
                        ))}
                        <tr>
                            <td className="cart-list-center">총</td>
                            <td></td>
                            <td></td>
                            <td className="cart-list-center">{totalQuantity}</td>
                            <td>{totalPrice}원</td>
                            <td></td>
                        </tr>
                    </table>
                    <div className="total-result">
                        <div>
                            <span>배송비&nbsp;&nbsp;&nbsp;{deliveryFee.toLocaleString()}원</span>
                        </div>
                        <div>
                            <span>결제예정금액&nbsp;&nbsp;&nbsp;{finalAmount.toLocaleString()}원</span>
                        </div>
                    </div>
                    <button className="buying-button" onClick={handlePaymentClick}>
                        Buying
                    </button>
                </div>
            </div>
        </>
    )
}

export default CartList;