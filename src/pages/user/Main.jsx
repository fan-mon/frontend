import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "./main.css";

function UserMain() {
    const location = useLocation();

    const [teamList, setTeamList] = useState([]);
    const [loading, setLoading] = useState([]);
    const [error, setError] = useState(null);// 에러 상태
    const navigate = useNavigate();

    //Team List 가져오는 api 호출 함수
    const fetchTeam = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/management/team/list`);
            setTeamList(response.data);
            setLoading(false);
        } catch (error) {
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

    // 슬라이더 설정
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <body className='usermain'>
            <div className='main-container'>
                <h1>!!Welcome to FANMON!!</h1>
                <div className='slide-container'>
                    <Slider {...settings}>
                        <div className='slide-card'>
                            <div className="ps-3 pe-3">
                                <div className="row">
                                    <div className="col-8 card-text-area">
                                        <div class="card-text">
                                            <h1>Taylor Swift</h1>
                                            <p>Taylor Swift 영통 팬싸인회</p>
                                            <a href="#">바로가기</a>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div class="card-image">
                                            <img src={`${process.env.PUBLIC_URL}/main/taylor.jpg`} alt="Taylor Swift" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3>2</h3>
                        </div>
                        <div>
                            <h3>3</h3>
                        </div>
                        <div>
                            <h3>4</h3>
                        </div>
                        <div>
                            <h3>5</h3>
                        </div>
                        <div>
                            <h3>6</h3>
                        </div>
                    </Slider>
                </div>
            </div>
            <div className='team-list-container'>
                <h2>새로운 아티스트의 <strong>팬몬</strong>이 되어보세요!</h2>
                <div className='team-list'>
                    {teamList.map((team) => (
                        <div key={team.teamuuid}>
                            <img src={`${process.env.REACT_APP_BACKEND_API_URL}/resources/teamimg/${team.fname}`} alt={team.name} className="team-image"></img>
                            <p>{team.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </body>
    );
}

export default UserMain;
