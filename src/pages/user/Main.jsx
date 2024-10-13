import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function UserMain() {
    const location = useLocation();

    const [teamList, setTeamList] = useState([]);
    const [loading, setLoading] = useState([]);
    const [error, setError] = useState(null);// 에러 상태
    const navigate = useNavigate();

    //Team List 가져오는 api 호출 함수
    const fetchTeam = async() =>{
        try{
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/management/team/list`);
            setTeamList(response.data);
            setLoading(false);
        }catch(error){
            setError(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        // URL에서 쿼리 파라미터를 추출
        const params = new URLSearchParams(location.search);
        const token = params.get('token'); // 소셜 로그인 시 URL에 포함된 토큰
        if (token) {
            // token이 존재하면 localStorage에 저장
            localStorage.setItem('accessToken', token);
            console.log('Access Token 저장 완료:', token);
        }
        
        fetchTeam();
    }, [location]);

    if (loading) {
        return <div>로딩 중...</div>
    }
    if (error) {
        return <div>에러 발생..!</div>
    }

    return (
        <div>
            <h1>유저 메인 페이지</h1>
            <p>Welcome to User Main Page!</p>
            <div>
                <h2>팀 리스트</h2>
                <div>
                    {teamList.map((team)=>(
                        <div key={team.teamuuid}>
                        <img src={`${process.env.REACT_APP_BACKEND_API_URL}/resources/teamimg/${team.fname}`} alt={team.name} className="team-image"></img>
                        <p>{team.name}</p>
                    </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default UserMain;
