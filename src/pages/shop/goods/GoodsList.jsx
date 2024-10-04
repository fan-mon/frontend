import React, { useState } from 'react';
import "../css/goodslist.css";
import "bootstrap/dist/css/bootstrap.min.css";
import GoodsNav from "./GoodsNav";

function GoodsList(){

    const initialProducts = [
        { id: 1, name: "귀여운 요술봉", price: 59000},
        { id: 2, name: "안귀여운 요술봉", price: 39000} 
    ]

    const [products] = useState(initialProducts);

    return(
        <>
            <section className="goods-frame">
                <div className="goodslist-container">
                    <div className="goodslist-content">
                        <GoodsNav/>
                        
                            <div className="row">
                                {products.map((prod)=>(
                                    <div className="col-md-3 col-sm-4">
                                    
                                        <div className="single-goods">
                                            <div className="single-goods-bg">
                                                <img src={`${process.env.PUBLIC_URL}/shop/goods/logo_white.png`} alt="single-goods images"/>
                                                <div className="single-goods-bg-overlay"></div>
                                            </div>
                                            <h4>{prod.name}</h4>
                                            <p className="goods-price">{prod.price}원</p>
                                            <button className="add-to-cart" onClick="#">Add to Cart</button>
                                            <a href="/shop/goods/detail"><button className="more-info">More Info</button></a>
                                        </div>
                                        
                                    </div>
                                ))}
                                <div className="col-md-3 col-sm-4">
                                    
                                    <div className="single-goods">
                                        <div className="single-goods-bg">
                                            <img src={`${process.env.PUBLIC_URL}/shop/goods/logo_white.png`} alt="single-goods images"/>
                                            <div className="single-goods-bg-overlay"></div>
                                        </div>
                                        <h4>네임</h4>
                                        <p className="goods-price">00원</p>
                                        <button className="add-to-cart" onClick="#">Add to Cart</button>
                                        <a href="/shop/goods/detail"><button className="more-info">More Info</button></a>
                                    </div>
                                    
                                </div>
                                <div className="col-md-3 col-sm-4">
                                    
                                    <div className="single-goods">
                                        <div className="single-goods-bg">
                                            <img src={`${process.env.PUBLIC_URL}/shop/goods/logo_white.png`} alt="single-goods images"/>
                                            <div className="single-goods-bg-overlay"></div>
                                        </div>
                                        <h4>네임</h4>
                                        <p className="goods-price">00원</p>
                                        <button className="add-to-cart" onClick="#">Add to Cart</button>
                                        <a href="/shop/goods/detail"><button className="more-info">More Info</button></a>
                                    </div>
                                    
                                </div>
                                <div className="col-md-3 col-sm-4">
                                    
                                    <div className="single-goods">
                                        <div className="single-goods-bg">
                                            <img src={`${process.env.PUBLIC_URL}/shop/goods/logo_white.png`} alt="single-goods images"/>
                                            <div className="single-goods-bg-overlay"></div>
                                        </div>
                                        <h4>네임</h4>
                                        <p className="goods-price">00원</p>
                                        <button className="add-to-cart" onClick="#">Add to Cart</button>
                                        <a href="/shop/goods/detail"><button className="more-info">More Info</button></a>
                                    </div>
                                    
                                </div>
                                <div className="col-md-3 col-sm-4">
                                    
                                    <div className="single-goods">
                                        <div className="single-goods-bg">
                                            <img src={`${process.env.PUBLIC_URL}/shop/goods/logo_white.png`} alt="single-goods images"/>
                                            <div className="single-goods-bg-overlay"></div>
                                        </div>
                                        <h4>네임</h4>
                                        <p className="goods-price">00원</p>
                                        <button className="add-to-cart" onClick="#">Add to Cart</button>
                                        <a href="/shop/goods/detail"><button className="more-info">More Info</button></a>
                                    </div>
                                    
                                </div>
                            </div>
                       
                    </div>
                </div>
            </section>
        </>
    )
};

export default GoodsList;