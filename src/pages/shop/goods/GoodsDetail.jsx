import React, { useEffect, useState } from 'react';
import "../css/goodsdetail.css";
import "bootstrap/dist/css/bootstrap.min.css";
import GoodsNav from "./GoodsNav";
import axios from 'axios';
import { useParams } from 'react-router-dom';

function GoodsDetail(){

    //goods 테이블에서 데이터 가져오기
    let [gdetail, setGDetail] = useState(null);
    const { goodsuuid } = useParams();
    useEffect(() => {
        const uuid = goodsuuid || sessionStorage.getItem('goodsuuid');

        axios.get(`http://localhost:8080/shop/goods/detail/${goodsuuid}`)
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
                                                <button className="welcome-add-cart" onClick="#">
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