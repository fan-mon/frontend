import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./css/goodsmanage.css";

const GoodsManage = () => {
  const managementuuid = '32eb55e2-022c-4741-8a41-d32916480b4e'; //hard coding
  const [team, setTeam] = useState([]); //팀 리스트
  const [loading, setLoading] = useState(true);// 로딩 상태
  const [error, setError] = useState(null);// 에러 상태
  const [selectedTeamUuid, setSelectedTeamUuid] = useState(null); //선택된 팀의 uuid
  const [selectedTeamGoods, setSelectedTeamGoods] = useState([]); //선택된 팀의 굿즈
  const [message, setMessage] = useState('');

  //Team api 호출 함수
  const fetchTeam = useCallback(async () => { // useCallback으로 감싸기
    try {
      const response = await axios.get(`http://localhost:8080/management/team/${managementuuid}`);
      setTeam(response.data); //팀 정보를 상태에 저장
      setLoading(false); //로딩 종료
      console.log(response.data); // team을 console에 찍기
      setMessage('아티스트 팀을 선택해 주세요!');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [managementuuid]); // 의존성 배열에 managementuuid 추가

  //팀의 굿즈를 가져오는 함수
  const fetchTeamGoods = async (teamuuid) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/management/goods/team/${teamuuid}`);
      console.log("선택된 팀 : "+teamuuid);
      setSelectedTeamGoods(response.data);
      setLoading(false); //로딩 종료
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  const navigate = useNavigate();

  // 아티스트 팀을 클릭하면 해당 아티스트 팀의 굿즈가 출력
  const handleTeamClick = (teamuuid) => {
    setSelectedTeamUuid(teamuuid);
    fetchTeamGoods(teamuuid);
    setMessage('');
  };

  // 굿즈를 클릭하면 해당 굿즈의 detail 페이지로 이동
  const handleGoodsClick = (goodsuuid) => {
    navigate(`/management/manageGoodsDetail/${goodsuuid}`);
  };

  //컴포넌트가 마운트되면 fetchGoods 실행
  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]); 

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
        <h2>아티스트(팀)</h2>
        <div className="team-list">
          {team.map((team) => (
            <div className="team-item" key={team.teamuuid} onClick={() => handleTeamClick(team.teamuuid)}>
              <img src={`http://localhost:8080/resources/teamimg/${team.fname}`} alt={team.name} className="team-image"></img>
              <p>{team.name}</p>
            </div>
          ))}
        </div>

        {/* <div className="view-more">
          <Link to="/management/teamList">더보기</Link>
        </div> */}
      </div>

      {/* 등록한 상품 목록 */}
      <div className="registered-goods-section">
        <h2>등록한 상품</h2>
      
        {message && <p className="message">{message}</p>}

        <div className="goods-list">
          {/* goods배열을 map으로 돌려서 상품을 표시 */}
          {selectedTeamGoods.slice(0, 6).map(
            (item) => (
              <div className="goods-item" key={item.goodsuuid} onClick={()=>{handleGoodsClick(item.goodsuuid)}}>
                <img src={`http://localhost:8080/resources/goodsimg/${item.fname}`} alt={item.name} className="goods-image" />
                <p>{item.name}</p>
              </div>
            )
          )}
        </div>

        <div className="view-more">
          {selectedTeamUuid && (<Link to={`/management/manageGoodsList/${selectedTeamUuid}`}>더보기</Link>)}
        </div>
        <div className="goods-form">
          {selectedTeamUuid && (
            <button className="goods-form-btn" onClick={()=>{navigate(`/management/goodsform/${selectedTeamUuid}`)}}>굿즈 등록</button>
          )}
        </div>
      </div>
    </div>
  );

};

export default GoodsManage;