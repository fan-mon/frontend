import React, { useEffect, useState } from 'react';
import "../css/goodslist.css";
import "bootstrap/dist/css/bootstrap.min.css";
import GoodsNav from "./GoodsNav";
import axios from 'axios';

function GoodsList(){

    //goodsview 테이블에서 데이터 가져오기
    let [glist, setGList] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:8080/shop/goods')
            .then(response => {
                console.log(response.data);
                setGList(response.data);
            })
            .catch(error => {
                console.error('Error fetching goods:', error);
            });
    }, []);

    return(
        <>
            <section className="goods-frame">
                <div className="goodslist-container">
                    <div className="goodslist-content">
                        <GoodsNav/>
                        
                            <div className="row">
                                {glist.map((gprod)=>(
                                    <div className="col-md-3 col-sm-4">
                                    
                                        <div className="single-goods">
                                            <div className="single-goods-bg">
                                                <img src={`${process.env.PUBLIC_URL}/shop/goods/${gprod.fname}`} alt="single-goods images"/>
                                                <div className="single-goods-bg-overlay"></div>
                                            </div>
                                            <h4>{gprod.name}</h4>
                                            <p className="goods-price">{gprod.price.toLocaleString()}원</p>
                                            <button className="add-to-cart" onClick="#">Add to Cart</button>
                                            <a href={`/shop/goods/detail/${gprod.goodsuuid}`}><button className="more-info">More Info</button></a>
                                        </div>
                                        
                                    </div>
                                ))}
                                
                            </div>
                       
                    </div>
                </div>
            </section>
        </>
    )
};

export default GoodsList;