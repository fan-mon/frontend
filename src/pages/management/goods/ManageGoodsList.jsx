import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import "./css/managegoodslist.css";

const ManageGoodsList = () => {
    const { teamuuid } = useParams(); //URL파라미터에서 teamuuid 가져오기
    const managementuuid = '32eb55e2-022c-4741-8a41-d32916480b4e'; //hard coding
    // const { managementuuid: urlmanagementuuid} = useParams(); //url에서 managementuuid 가져오기
    // const managementuuid = urlmanagementuuid || localStorage.getItem('managementuuid'); //세션 저장소에서 가져오기

    const [goods, setGoods] = useState([]);

    const [loading, setLoading] = useState(true);// 로딩 상태
    const [error, setError] = useState(null);// 에러 상태

    //Goods api 호출 함수
    const fetchGoods = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/management/goods/team/${teamuuid}`); //api호출
            setGoods(response.data); //상품리스트를 상태에 저장
            setLoading(false); //로딩 종료
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const navigate = useNavigate();

    // 굿즈를 클릭하면 해당 굿즈의 detail 페이지로 이동
    const handleGoodsClick = (goodsuuid) => {
        navigate(`/management/manageGoodsDetail/${goodsuuid}`);
    };

    //컴포넌트가 마운트되면 fetchGoods 실행
    useEffect(() => {
        fetchGoods();
    }, []);

    if (loading) {
        return <div>로딩 중...</div>
    }
    if (error) {
        return <div>에러 발생..!</div>
    }

    return (
        <div className="goods-list-container">
            <h1>굿즈 목록</h1>
            <div className="links">
                <p className="goods-manage">
                    <button className="goods-manage-btn" onClick={() => { navigate(`/management/goodsManage`) }}>굿즈 관리 화면</button>
                </p>
                <p className="goods-form">
                    <button className="goods-form-btn" onClick={() => { navigate(`/management/goodsform/${teamuuid}`) }}>굿즈 등록</button>
                </p>
            </div>
            {/* 등록한 상품 목록 */}
            <div className="registered-goods-section">
                <h2>등록한 상품</h2>
                <div className="goods-list">
                    {/* goods배열을 map으로 돌려서 상품을 표시 */}
                    {goods.map(
                        (item) => (
                            <div className="goods-item" key={item.goodsuuid} onClick={() => handleGoodsClick(item.goodsuuid)}>
                                <img src={`http://localhost:8080/resources/goodsimg/${item.fname}`} alt={item.name} className="goods-image" />
                                <p>{item.name}</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}
export default ManageGoodsList;