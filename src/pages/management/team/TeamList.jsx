import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/teamlist.css";

const TeamList = () => {
    const managementuuid = '32eb55e2-022c-4741-8a41-d32916480b4e'; //hard coding(세션유지)
    // const { managementuuid: urlmanagementuuid} = useParams(); //url에서 managementuuid 가져오기
    // const managementuuid = urlmanagementuuid || sessionStorage.getItem('managementuuid'); //세션 저장소에서 가져오기

    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);// 로딩 상태
    const [error, setError] = useState(null);// 에러 상태

    //Team api 호출 함수
    const fetchTeam = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/management/team/${managementuuid}`);
            setTeam(response.data); //팀 정보를 상태에 저장
            setLoading(false); //로딩 종료
            console.log(team);
        } catch (err) {
            setError(err.message);
        }
    };
    const navigate = useNavigate();

    // 팀을 누르면 각 팀의 detail 페이지로 이동
    const handleTeamClick = (teamuuid) => {
        navigate(`/management/teamDetail/${teamuuid}`);
    };

    //컴포넌트가 마운트되면 fetchTeam 실행
    useEffect(() => {
        fetchTeam();
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
                <h2>{team[0].management.name}의 아티스트(팀) 목록</h2>
                <div className="team-form">
                    <button className="team-form-btn" onClick={() => { navigate(`/management/teamForm/${managementuuid}`) }}>팀 등록</button>
                </div>
                <div className="team-list">
                    {team.map((team) => (
                        <div className="team-item" key={team.teamuuid} onClick={() => handleTeamClick(team.teamuuid)}>
                            <img src='http://localhost:8080/resources/goodsimg/day6.jpg' alt={team.name} className="team-image"></img>
                            <p>{team.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default TeamList;