import React, { useEffect, useState } from 'react';
import "../css/goodsmain.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';

function GoodsMain(){

        //goods 테이블에서 데이터 가져오기
        let [gmain, setGMain] = useState([]);
        useEffect(() => {
            axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/shop/goods/main`)
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
                <div id="goodsmain-container">
                    <div id="goodsmain-content">
                        <h2 id="goodsmain-title">아티스트 목록</h2>
                        <div className="row">
                            {gmain.map((glist)=>(
                                <div className="col-md-3 col-sm-4">
                                    <a id="single-glist" href={`/shop/goods/list/${glist.teamuuid}/all`}>
                                        <h4>{glist.name}</h4>
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