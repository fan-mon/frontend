import React, { useEffect, useState } from 'react';
import "../css/goodsdetail.css";
import "bootstrap/dist/css/bootstrap.min.css";
import GoodsNav from "./GoodsNav";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import api from '../../../apiClient';

function GoodsDetail(){

    // user 데이터 불러오기
    let [useruuid, setUseruuid] = useState(null);
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await api.get('/users/myprofile');
                setUseruuid(response.data.useruuid);
                console.log("Fetched useruuid: " + response.data.useruuid);
    
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };
        fetchUserInfo();
    }, []);

    //goods 테이블에서 데이터 가져오기
    let [gdetail, setGDetail] = useState(null);
    const { goodsuuid } = useParams();

    useEffect(() => {
        const uuid = goodsuuid || sessionStorage.getItem('goodsuuid');

        axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/shop/goods/detail/${goodsuuid}`)
            .then(response => {
                console.log(response.data);
                setGDetail(response.data);
                sessionStorage.setItem('goodsuuid', uuid);
            })
            .catch(error => {
                console.error('Error fetching goods:', error);
            });
    }, [goodsuuid]);

    //수량, 가격 변경
    const [quantity, setQuantity] = useState(1);
    const pricePerItem = gdetail ? gdetail.price : 0;
    const handleChange = (event) => {
        setQuantity(Number(event.target.value));
    };
    const totalPrice = (pricePerItem * quantity).toLocaleString();


    //장바구니 담기
    const handleAddToCart = async (goodsuuid) => {
        try {
        console.log(`User UUID: ${useruuid}, Goods UUID: ${goodsuuid}`);
        await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/shop/cart/add/${useruuid}/${goodsuuid}/${quantity}`);
        alert('상품이 장바구니에 추가되었습니다.');

        } catch (error) {
        console.error('장바구니 처리 중 오류 발생:', error);
        alert('장바구니에 상품을 추가할 수 없습니다.');
        
        }
    };

    return (
        <>
            <div className="goodsdetail-container detail-content">
            <GoodsNav/>
            <div className="row">

                    <div className="col-sm-6">
                        <div className="single-detail">
                            <div className="welcome-detail-txt">
                                {gdetail ? (
                                            <div>
                                                <h2>{gdetail.name}</h2>
                                                <p>{gdetail.description}</p>
                                                <div className="detail-item">
                                                    <span>
                                                        {totalPrice}원
                                                    </span>
                                                    <span>
                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                        <input type="number" name="goods-qty" min="1" max="10" value={quantity} onChange={handleChange} />
                                                        개
                                                    </span>
                                                </div>
                                                <button className="welcome-add-cart" onClick={() => handleAddToCart(goodsuuid)}>
                                                    Add to Cart
                                                </button>
                                            </div>
                                        ) : (
                                            <p>찾으시는 상품이 없습니다.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 gdetail-img">
                        <div className="single-welcome-hero">
                            {gdetail && gdetail.fname ? (
                                <img className="welcome-hero-img" src={`${process.env.PUBLIC_URL}/shop/goods/${gdetail.fname}`} alt="slider image" />
                            ) : (
                                <div></div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default GoodsDetail;