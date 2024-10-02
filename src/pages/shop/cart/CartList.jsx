import React, { useState } from 'react';
import "../css/cartlist.css";
import "bootstrap/dist/css/bootstrap.min.css";
import * as Icon from 'react-bootstrap-icons';


function CartList(){
    const products = [
        { id: 1, name: "귀여운 요술봉", price: 59000, quantity: 1 },
        { id: 2, name: "안귀여운 요술봉", price: 39000, quantity: 2 } // 하드코딩된 수량
    ];

    // 총 수량과 총 가격 계산
    const totalQuantity = products.reduce((total, product) => total + parseInt(product.quantity), 0);
    const totalPrice = products.reduce((total, product) => total + (product.price * product.quantity), 0).toLocaleString();

    return(
        <>
            <div class="container cart-content">
                <div class="row">
                    <h2>장바구니</h2>
                    <table class="cart-content-list">
                        {products.map((product, index) => (
                            <tr>
                                <td class="cart-list-no cart-list-center">1</td>
                                <td class="cart-list-file cart-list-center"><a href="/shop/goods/detail"><img src={`${process.env.PUBLIC_URL}/shop/common/monster1.png`} alt="cart list image"/></a></td>
                                <td class="cart-list-name"><a href="/shop/goods/detail">귀여운 요술봉</a></td>
                                <td class="cart-list-qty cart-list-center">
                                    <input type="number" name={`goods-qty-${product.id}`} min="1" max="10" value="1"/>
                                </td>
                                <td class="cart-list-price">{(product.price * product.quantity).toLocaleString()}원</td>
                                <td class="cart-list-delete cart-list-center"><Icon.XLg class="delete-icon" onClick="#" /></td>
                            </tr>
                        ))}
                        <tr>
                            <td class="cart-list-center">총</td>
                            <td></td>
                            <td></td>
                            <td class="cart-list-center">{totalQuantity}</td>
                            <td>{totalPrice}원</td>
                            <td></td>
                        </tr>
                    </table>
                    <div class="total-result">
                        <div>
                            <span>배송비&nbsp;&nbsp;&nbsp;2,500원</span>
                        </div>
                        <div>
                            <span>결제예정금액&nbsp;&nbsp;&nbsp;{totalPrice}원</span>
                        </div>
                    </div>
                    <a href="/shop/buy/buying">
                        <button class="buying-button">
                            Buying
                        </button>
                    </a>
                </div>
            </div>
        </>
    )
}

export default CartList;