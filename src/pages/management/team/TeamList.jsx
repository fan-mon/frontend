import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from '../../../apiClient';
import "./css/teamlist.css";

const TeamList = () => {
    const [mgName, setMgName] = useState('로그인 안됨');
    const [managementuuid, setManagementuuid] = useState('');

    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);// 로딩 상태
    const [error, setError] = useState(null);// 에러 상태
    const navigate = useNavigate();

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
    const fetchTeam = async (uuid) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/management/team/list/${uuid}`);
            setTeam(response.data); //팀 정보를 상태에 저장
            setLoading(false); //로딩 종료
            console.log(team);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    // 팀을 누르면 각 팀의 detail 페이지로 이동
    const handleTeamClick = (teamuuid) => {
        navigate(`/management/teamDetail/${teamuuid}`);
    };

    //컴포넌트가 마운트되면 fetchTeam 실행
    useEffect(() => {
        fetchManagementInfo();
    }, []);

    if (loading) {
        return <div>로딩 중...</div>
    }
    if (error) {
        return <div>에러 발생..!</div>
    }
    console.log(team);
    return (
        <div className="team-list-container">
            {/* 아티스트 목록 */}
            <div className="team-section">
                <h2 id="title">{mgName}의 그룹(팀) 목록</h2>
                <div className="team-form">
                    <button className="team-form-btn" onClick={() => { navigate(`/management/teamForm/${managementuuid}`) }}>팀 등록</button>
                </div>
                <div className="team-list">
                    {team.map((team) => (
                        <div className="team-item" key={team.teamuuid} onClick={() => handleTeamClick(team.teamuuid)}>
                            <img src={`${process.env.REACT_APP_BACKEND_API_URL}/resources/teamimg/${team.fname}`} alt={team.name} className="team-image"></img>
                            <p>{team.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default TeamList;