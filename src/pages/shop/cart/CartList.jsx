import React, { useState, useEffect } from 'react';
import "../css/cartlist.css";
import "bootstrap/dist/css/bootstrap.min.css";
import * as Icon from 'react-bootstrap-icons';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';


function CartList(){

    // URL 경로에 포함된 useruuid 불러오기 : 로그인 기능 구현 후 수정 필요!
    const { useruuid } = useParams();

    // 장바구니 리스트 불러오기
    const [clist, setCList] = useState([]);
    useEffect(() => {
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
    },[useruuid]);

    // orders 테이블에 들어갈 데이터 준비
    useEffect(()=>{
        let orders = {
            ordersuuid: null, //UUID
            address: null, //주소
            createdat: null, //구매일자
            status: 'BEFORE',   // 결제 상태 : 기본은 enums에 없는 값인 'BEFORE'으로 갈게요
            totalcost: finalAmount,  // 결제 예정 금액 (배송비가 포함된 총액)
            useruuid: useruuid,  // 로그인된 사용자의 UUID
            qty: totalQuantity  // 장바구니에 담긴 총 상품 수량
            // ,postcode: null //우편번호입니다. 테이블 구조 고쳐지면 추가할게요
        };
        sessionStorage.setItem('ordersData', JSON.stringify(orders));
        console.log("orders",orders);

    }, [clist, useruuid]) // clist 또는 useruuid가 변경될 때 실행

    // ordersDetail 테이블에 들어갈 데이터 준비
    const [ordersDetailList, setOrdersDetailList] = useState([]);
    useEffect(() => {
        // clist가 null이 아니고, 배열이 존재할 때만 ordersDetailList 초기화
        if (clist && clist.length > 0) {
            
            let ordersDetailList = clist.map((crecord) => ({
                ordersdetailuuid: crecord.goods.goodsuuid, // UUID
                qty: crecord.qty,  // 각 상품의 수량
                totalcost: crecord.goods.price * crecord.qty,  // 각 상품의 총 금액
                goodsuuid: crecord.goods.goodsuuid,  // 각 상품의 UUID
                ordersuuid: null,  // ordersuuid가 아직 존재하지 않음
                useruuid: useruuid
            }));

            // ordersDetailList 업데이트
            setOrdersDetailList(ordersDetailList);
            // sessionStorage에 저장
            sessionStorage.setItem('DetailData', JSON.stringify(ordersDetailList));
            console.log("ordersDetailList",ordersDetailList);
        }
    }, [clist, useruuid]);

    // 장바구니에 담은 상품들의 총 수량과 총 가격 계산
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
    const navigate = useNavigate();
    const handlePaymentClick = () => {
        setTimeout(()=>{
            navigate('/shop/buy/buying/0cf55a0d-a2a5-443b-af46-835d70874c40');
        }, 100);
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
                                <td className="cart-list-file cart-list-center"><a href={`/shop/goods/detail/${crecord.goods.goodsuuid}/${useruuid}`}><img src={`${process.env.PUBLIC_URL}/shop/common/${crecord.goods.fname}`} alt={`${crecord.goods.fname}`}/></a></td>
                                <td className="cart-list-name"><a href={`/shop/goods/detail/${crecord.goods.goodsuuid}/${useruuid}`}>{crecord.goods.name}</a></td>
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