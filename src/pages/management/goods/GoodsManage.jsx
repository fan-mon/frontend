import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import api from '../../../apiClient';
import "./css/goodsmanage.css";

const GoodsManage = () => {
  // const managementuuid = '32eb55e2-022c-4741-8a41-d32916480b4e'; //hard coding
  const [mgName, setMgName] = useState('로그인 안됨');
  const [managementuuid, setManagementuuid] = useState('');

  const [team, setTeam] = useState([]); //팀 리스트
  const [selectedTeamUuid, setSelectedTeamUuid] = useState(null); //선택된 팀의 uuid
  const [selectedTeamName, setSelectedTeamName] = useState(''); //선택된 팀의 이름
  const [selectedTeamGoods, setSelectedTeamGoods] = useState([]); //선택된 팀의 굿즈
  const [displayCount, setDisplayCount] = useState(6); //보여줄 상품 개수

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);// 로딩 상태
  const [error, setError] = useState(null);// 에러 상태

  //로그인한 Management 정보 가져오기
  const fetchManagementInfo = async () => {
    try {
      const response = await api.get('/management/myprofile');
      console.log(response.headers); // 응답 헤더 출력
      console.log(response.data); // 사용자 정보 로그 출력
      setMgName(response.data.name);
      setManagementuuid(response.data.managementuuid);
      console.log(response.data.managementuuid);

      // managementuuid가 설정된 후 fetchArtist 호출
      await fetchTeam(response.data.managementuuid);

    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error);
    }
  };

  //Team api 호출 함수
  const fetchTeam = useCallback(async (uuid) => { // useCallback으로 감싸기
    if(!uuid){
      console.error("managementuuid가 없습니다.");
      return;
    }
    try {
      const response = await axios.get(`http://localhost:8080/management/team/list/${uuid}`);
      setTeam(response.data); //팀 정보를 상태에 저장
      setLoading(false); //로딩 종료
      console.log("team List from back : " + response.data); // team을 console에 찍기
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
      console.log("선택된 팀 : " + teamuuid);
      if (response.data && response.data.length > 0) { // 데이터가 있을 경우
        setSelectedTeamGoods(response.data);
      } else {
        setSelectedTeamGoods([]); // 데이터가 없으면 빈 배열로 초기화
      }
      setLoading(false); //로딩 종료
      setDisplayCount(6); //새 팀을 선택할 때마다 보여줄 상품 개수 초기화
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  const navigate = useNavigate();

  // 아티스트 팀을 클릭하면 해당 아티스트 팀의 굿즈가 출력
  const handleTeamClick = (team) => {
    setSelectedTeamUuid(team.teamuuid);
    setSelectedTeamName(team.name);
    fetchTeamGoods(team.teamuuid);
    setMessage('');
  };

  // 굿즈를 클릭하면 해당 굿즈의 detail 페이지로 이동
  const handleGoodsClick = (goodsuuid) => {
    navigate(`/management/manageGoodsDetail/${goodsuuid}`);
  };

  //더보기 클릭 핸들러
  const handleViewMore = () => {
    setDisplayCount(prevCount => prevCount + 6); //6개씩 증가
  }

  //컴포넌트가 마운트되면 fetchGoods 실행
  useEffect(() => {
    fetchManagementInfo();
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

      {/* 팀 목록 */}
      <div className="team-section">
        <h2>{mgName}의 그룹(팀) 목록</h2>
        <div className="team-list">
          {team.map((team) => (
            <div className="team-item" key={team.teamuuid} onClick={() => handleTeamClick(team)}>
              <img src={`http://localhost:8080/resources/teamimg/${team.fname}`} alt={team.name} className="team-image"></img>
              <p>{team.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 등록한 상품 목록 */}
      <div className="registered-goods-section">
        <h2>등록한 상품</h2>
        <div className="goods-form">
          {selectedTeamUuid && (
            <button className="goods-form-btn" onClick={() => { navigate(`/management/goodsform/${selectedTeamUuid}`) }}>{selectedTeamName}의 굿즈 등록</button>
          )}
        </div>

        {message && <p className="message">{message}</p>}

        <div className="goods-list">
          {/* 굿즈가 없을 때 메시지 표시 */}
          {selectedTeamGoods.length === 0 ? (
            <p>해당 팀의 등록된 굿즈가 없습니다.</p>
          ) : (
            selectedTeamGoods.slice(0, displayCount).map((item) => (
              <div className="goods-item" key={item.goodsuuid} onClick={() => { handleGoodsClick(item.goodsuuid) }}>
                <img src={`http://localhost:8080/resources/goodsimg/${item.fname}`} alt={item.name} className="goods-image" />
                <p>{item.name}</p>
              </div>
            ))
          )}
        </div>

        <div className="view-more">
          {selectedTeamGoods.length > displayCount && (
            <a onClick={handleViewMore}>더보기</a>
          )}
        </div>

      </div>
    </div>
  );

};

export default GoodsManage;