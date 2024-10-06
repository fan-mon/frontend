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
        console.log('Current cart list:', clist);
    }, []); // 빈 배열을 넣어 컴포넌트가 처음 렌더링될 때만 실행

    // 총 수량과 총 가격 계산
    const totalQuantity = clist.reduce((total, crecord) => total + parseInt(crecord.qty), 0);
    const totalPrice = clist.reduce((total, crecord) => total + (crecord.goods.price * crecord.qty), 0);
    const deliveryFee = 2500;
    const finalAmount = totalPrice+deliveryFee;

    
    const handleQuantityChange = async (id, newQty) => {
        // 상태에서 수량 변경
        const updatedCList = clist.map(crecord => 
            crecord.cartsequence === id ? { ...crecord, qty: newQty } : crecord
        );
        setCList(updatedCList);
    
        // 변경된 수량의 goodsuuid를 찾기
        const updatedRecord = updatedCList.find(crecord => crecord.cartsequence === id);
        const cgoodsuuid = updatedRecord ? updatedRecord.goodsuuid : null;
    
        // if (!cgoodsuuid) {
        //     console.error('Goods UUID not found');
        //     return; // goodsuuid가 없으면 함수를 종료
        // }
    
        // try {
        //     // 서버에 수량 업데이트 요청
        //     await axios.post(`http://localhost:8080/shop/cart/update/${useruuid}/${cartsequence}/${newQty}`);
        // } catch (error) {
        //     console.error('Error updating quantity:', error);
        //     // 수량 변경이 실패하면 원래 상태로 되돌리기
        //     setCList(clist);
        // }



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