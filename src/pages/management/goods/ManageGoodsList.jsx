import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import "./css/managegoodslist.css";

const ManageGoodsList = () => {
    const { teamuuid } = useParams(); //URL파라미터에서 teamuuid 가져오기
    const [mgName, setMgName] = useState('로그인 안됨');
    const [managementuuid, setManagementuuid] = useState('');

    const [goods, setGoods] = useState([]);
    const [teamInfo, setTeamInfo] = useState([]);

    const [loading, setLoading] = useState(true);// 로딩 상태
    const [error, setError] = useState(null);// 에러 상태
    const navigate = useNavigate();

    //Goods api 호출 함수
    const fetchGoods = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/management/goods/team/${teamuuid}`); //api호출
            setGoods(response.data); //상품리스트를 상태에 저장
            setLoading(false); //로딩 종료
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };
    
    //team 정보 가져오기
    const fetchTeamInfo = async () => {
        try{
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/management/team/${teamuuid}`);
            setTeamInfo(response.data);
            console.log(response.data.name);
        }catch(err){
            setError(err.message);
            console.error("error fetching team info",err);
        }
    }

    // 굿즈를 클릭하면 해당 굿즈의 detail 페이지로 이동
    const handleGoodsClick = (goodsuuid) => {
        navigate(`/management/manageGoodsDetail/${goodsuuid}`);
    };

    //컴포넌트가 마운트되면 fetchGoods 실행
    useEffect(() => {
        const fetchData = async () => {
            await fetchGoods(); // fetchGoods 완료 후
            fetchTeamInfo(); // team 정보를 가져옴
        };

        fetchData();
    }, [teamuuid]); // teamuuid가 변경될 때마다 호출

    if (loading) {
        return <div>로딩 중...</div>
    }
    if (error) {
        return <div>에러 발생..!</div>
    }

    return (
        <div className="goods-list-container">
            <h1>{teamInfo.name}의 굿즈 목록</h1>
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
                                <img src={`${process.env.REACT_APP_BACKEND_API_URL}/resources/goodsimg/${item.fname}`} alt={item.name} className="goods-image" />
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