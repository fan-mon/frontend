import React, { useEffect, useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import axios from "axios";
import "./css/goodsmanage.css";

const GoodsManage = () => {
  const managementuuid = '32eb55e2-022c-4741-8a41-d32916480b4e'; //hard coding
  const [goods, setGoods] = useState([]); //상품 리스트를 저장할 상태값
  const [team, setTeam] = useState([]); //팀 리스트
  const [loading, setLoading] = useState(true);// 로딩 상태
  const [error, setError] = useState(null);// 에러 상태

  //Goods api 호출 함수
  const fetchGoods = async () => {
    try {
      const response = await axios.get("http://localhost:8080/management/goods"); //api호출
      setGoods(response.data); //상품리스트를 상태에 저장
      setLoading(false); //로딩 종료
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  
  //Team api 호출 함수
  const fetchTeam = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/management/team/${managementuuid}`);
      setTeam(response.data); //팀 정보를 상태에 저장
      console.log(team);
    } catch (err) {
      setError(err.message);
    }
  };
  const navigate = useNavigate();

  // 아티스트 팀을 클릭하면 해당 아티스트 팀의 ID에 따라 굿즈 등록 페이지로 이동
  const handleTeamClick = (teamuuid) => {
    navigate(`/management/goodsform/${teamuuid}`);
  };

  //컴포넌트가 마운트되면 fetchGoods 실행
  useEffect(() => {
    fetchGoods();
    fetchTeam();
  }, []);

  if (loading) {
    return <div>로딩 중...</div>
  }
  if (error) {
    return <div>에러 발생..!</div>
  }



  return (
    <div className="goods-management-container">
      <h1>굿즈 관리 페이지</h1>

      {/* 아티스트 목록 */}
      <div className="team-section">
        <h2>상품 등록</h2>
        <div className="team-list">
          {team.slice(0,6).map((team) => (
            <div className="team-item" key={team.teamuuid} onClick={() => handleTeamClick(team.teamuuid)}>
              <img src={team.fname} alt={team.name} className="team-image"></img>
              <p>{team.name}</p>
            </div>
          ))}
        </div>

        <div className="view-more">
          <Link to="/management/teamList">더보기</Link>
        </div>
      </div>

      {/* 등록한 상품 목록 */}
      <div className="registered-goods-section">
        <h2>등록한 상품</h2>
        <div className="goods-list">
          {/* goods배열을 map으로 돌려서 상품을 표시 */}
          {goods.slice(0, 6).map(
            (item) => (
              <div className="goods-item" key={item.goodsuuid}>
                <img src='http://localhost:8080/resources/goodsimg/day6_goods.jpg' alt={item.name} className="goods-image"/>
                <p>{item.name}</p>
              </div>
            )
          )}
        </div>

        <div className="view-more">
          <Link to="/management/goodsList">더보기</Link>
        </div>
      </div>
    </div>
  );

};

export default GoodsManage;