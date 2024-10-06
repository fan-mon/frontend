import React, { useState, useEffect  } from 'react';
import "../css/cartlist.css";
import "bootstrap/dist/css/bootstrap.min.css";
import * as Icon from 'react-bootstrap-icons';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function CartList(){

    const { useruuid } = useParams();

    const [clist, setCList] = useState([]);


    // 데이터 패칭을 useEffect로 처리
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
    }, []); // 빈 배열을 넣어 컴포넌트가 처음 렌더링될 때만 실행

    // 총 수량과 총 가격 계산
    const totalQuantity = clist.reduce((total, crecord) => total + parseInt(crecord.qty), 0);
    const totalPrice = clist.reduce((total, crecord) => total + (crecord.goods.price * crecord.qty), 0);
    const deliveryFee = 2500;
    const finalAmount = totalPrice+deliveryFee;

    // 수량 변경 핸들러 함수
    const handleQuantityChange = (id, newQuantity) => {
        setCList(clist.map(crecord => 
            crecord.cartsequence === id ? { ...crecord, qty: newQuantity } : crecord
        ));
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
                                <td className="cart-list-file cart-list-center"><a href={`/shop/goods/detail/${crecord.goodsuuid}`}><img src={`${process.env.PUBLIC_URL}/shop/common/${crecord.goods.fname}`} alt={`${crecord.goods.fname}`}/></a></td>
                                <td className="cart-list-name"><a href={`/shop/goods/detail/${crecord.goodsuuid}`}>{crecord.goods.name}</a></td>
                                <td className="cart-list-qty cart-list-center">
                                    <input 
                                        type="number" 
                                        name={`goods-qty-${crecord.cartsequence}`} 
                                        min="1" 
                                        max="10"
                                        defaultValue={crecord.qty}
                                        onChange={(e) => handleQuantityChange(crecord.cartsequence, parseInt(e.target.value))}
                                    />
                                </td>
                                <td className="cart-list-price">{(crecord.goods.price * crecord.qty).toLocaleString()}원</td>
                                <td className="cart-list-delete cart-list-center"><Icon.XLg className="delete-icon" onClick="#" /></td>
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
                    <a href="/shop/buy/buying">
                        <button className="buying-button">
                            Buying
                        </button>
                    </a>
                </div>
            </div>
        </>
    )
}

export default CartList;