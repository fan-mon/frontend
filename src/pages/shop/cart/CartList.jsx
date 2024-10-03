import React, { useState } from 'react';
import "../css/cartlist.css";
import "bootstrap/dist/css/bootstrap.min.css";
import * as Icon from 'react-bootstrap-icons';


function CartList(){

    const initialCartitem = [
        { id: 1, name: "귀여운 요술봉", price: 59000, quantity: 1 },
        { id: 2, name: "안귀여운 요술봉", price: 39000, quantity: 2 } 
    ];

    const [cartitem, setCartitem] = useState(initialCartitem);

    // 총 수량과 총 가격 계산
    const totalQuantity = cartitem.reduce((total, product) => total + parseInt(product.quantity), 0);
    const totalPrice = cartitem.reduce((total, product) => total + (product.price * product.quantity), 0).toLocaleString();

    // 수량 변경 핸들러 함수
    const handleQuantityChange = (id, newQuantity) => {
        setCartitem(cartitem.map(product => 
            product.id === id ? { ...product, quantity: newQuantity } : product
        ));
    };

    return(
        <>
            <div className="container cart-content">
                <div className="row">
                    <h2>장바구니</h2>
                    <table className="cart-content-list">
                        {cartitem.map((product, index) => (
                            <tr key={product.id}>
                                <td className="cart-list-no cart-list-center">{index + 1}</td>
                                <td className="cart-list-file cart-list-center"><a href="/shop/goods/detail"><img src={`${process.env.PUBLIC_URL}/shop/common/monster1.png`} alt="cart list image"/></a></td>
                                <td className="cart-list-name"><a href="/shop/goods/detail">{product.name}</a></td>
                                <td className="cart-list-qty cart-list-center">
                                    <input 
                                        type="number" 
                                        name={`goods-qty-${product.id}`} 
                                        min="1" 
                                        max="10"
                                        value={product.quantity} 
                                        onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                                    />
                                </td>
                                <td className="cart-list-price">{(product.price * product.quantity).toLocaleString()}원</td>
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
                            <span>배송비&nbsp;&nbsp;&nbsp;2,500원</span>
                        </div>
                        <div>
                            <span>결제예정금액&nbsp;&nbsp;&nbsp;{totalPrice}원</span>
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