import React, { useEffect, useState } from 'react';
import "./css/managegoodsdetail.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from 'bootstrap';

function ManageGoodsDetail(){

    //goods 테이블에서 데이터 가져오기
    let [gdetail, setGDetail] = useState(null);
    const { goodsuuid } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const uuid = goodsuuid || sessionStorage.getItem('goodsuuid');

        axios.get(`http://localhost:8080/management/goods/${goodsuuid}`)
            .then(response => {
                console.log(response.data);
                setGDetail(response.data);
                sessionStorage.setItem('goodsuuid', uuid);
            })
            .catch(error => {
                console.error('Error fetching goods:', error);
            });
    }, [goodsuuid]);
    const handleUpdateClick = (goodsuuid) => {
        navigate(`/management/goodsUpdate/${goodsuuid}`);
      };
    
    const handleDeleteClick = (goodsuuid) => {
        axios.delete(`http://localhost:8080/management/goods/${goodsuuid}`)
            .then(response => {
                alert('상품이 성공적으로 삭제되었습니다.');
                navigate(`/management/manageGoodsList/${gdetail.team.teamuuid}`);
            })
            .catch(error=>{
                console.error('Error deleting goods:', error);
                alert('상품 삭제에 실패했습니다.');
            })
    }

    return (
        <>
            <div className="goodsdetail-container detail-content">
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
                                                        가격 : {gdetail.price}원
                                                    </span><br/>
                                                    <span>
                                                        수량 : {gdetail.qty}개
                                                    </span><br/>
                                                </div>
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
                                <img className="welcome-hero-img" src={`http://localhost:8080/resources/goodsimg/${gdetail.fname}`} alt="slider image" />
                            ) : (
                                <div></div>
                            )}
                        </div>
                    </div>
                    <div className='update-goods'>
                        <button className='update-goods-btn' onClick={()=>{handleUpdateClick(goodsuuid)}}>수정하기</button>
                    </div>
                    <div className='delete-goods'>
                        <button className='update-goods-btn' onClick={()=>{handleDeleteClick(goodsuuid)}}>삭제하기</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ManageGoodsDetail;