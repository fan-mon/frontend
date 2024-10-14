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

        axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/management/goods/${goodsuuid}`)
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
    
    const handleDeleteClick = async() => {
        const confirmed = window.confirm('정말로 삭제하시겠습니까?');

        if (confirmed) {
            try {
                await axios.delete(`${process.env.REACT_APP_BACKEND_API_URL}/management/goods/${goodsuuid}`);
                alert('상품이 성공적으로 삭제되었습니다.');
                navigate(`/management/manageGoodsList/${gdetail.team.teamuuid}`);
            } catch (error) {
                console.error('삭제 중 오류 발생:', error);
                alert('삭제에 실패하였습니다. 다시 시도해 주세요.');
            }
        }

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
                                <img className="welcome-hero-img" src={`${process.env.REACT_APP_BACKEND_API_URL}/resources/goodsimg/${gdetail.fname}`} alt="slider image" />
                            ) : (
                                <div></div>
                            )}
                        </div>
                    </div>
                    <div className='update-goods'>
                        <button className='update-goods-btn' onClick={()=>{handleUpdateClick(goodsuuid)}}>수정하기</button>
                    </div>
                    <div className='delete-goods'>
                        <button className='delete-goods-btn' onClick={()=>{handleDeleteClick(goodsuuid)}}>삭제하기</button>
                    </div>
                    <div className='list-goods'>
                        <button className='list-goods-btn' onClick={()=>{navigate(`/management/manageGoodsList/${gdetail.team.teamuuid}`)}}>목록으로</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ManageGoodsDetail;