import React, { useEffect, useState } from 'react';
import "../css/goodslist.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';

function GoodsMain(){

        //goods 테이블에서 데이터 가져오기
        let [gmain, setGMain] = useState([]);
        useEffect(() => {
            axios.get('http://localhost:8080/shop/goods')
                .then(response => {
                    console.log(response.data);
                    setGMain(response.data);
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
                        <p className="goodslist-title">아티스트 목록</p>
                        <div className="row">
                            {gmain.map((gprod)=>(
                                <div className="col-md-3 col-sm-4">
                                    <a className="single-goods" href="/shop/goods/list">
                                        <h4>{gprod.name}</h4>
                                    </a>
                                    
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
};

export default GoodsMain;