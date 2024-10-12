import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../../apiClient';
import axios from "axios";
import "./css/artistlist.css";

const ArtistList = () => {

    // const managementuuid = '5ee0cb40-3f82-4a40-aefb-540c1126e6a0'; //hard coding(세션유지)
    const [mgName, setMgName] = useState('로그인 안됨');
    const [managementuuid, setManagementuuid] = useState('');

    const [artist, setArtist] = useState([]);
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
          await fetchArtist(response.data.managementuuid);

        } catch (error) {
          console.error("사용자 정보 가져오기 오류:", error);
        }
    };

    // Artist API 호출 함수
    const fetchArtist = async (uuid) => {
        if (!uuid) {
            console.error("managementuuid가 없습니다.");
            return;
        }
        try {
            console.log(uuid); // uuid 확인
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/management/artist/list/${uuid}`);
            setArtist(response.data);
            console.log(response.data);
            setLoading(false); // 로딩 종료
        } catch (err) {
            setError(err.message);
            setLoading(false); // 로딩 종료
        }
    };

    const handleArtistClick = (artistuuid) => {
        navigate(`/management/artistDetail/${artistuuid}`);
    };

    //컴포넌트가 마운트되면 fetchData 실행
    useEffect(() => {
        fetchManagementInfo();
    }, []);


    if (loading) {
        return <div>로딩 중...</div>
    }
    if (error) {
        return <div>에러 발생..!</div>
    }

    return (
        <div className="artist-list-container">
            {/* 아티스트 목록 */}
            <div className="artist-section">
                <h2>{mgName}의 아티스트 목록</h2>
                <div className="artist-form">
                    <button className="artist-form-btn" onClick={() => { navigate(`/management/artistForm/${managementuuid}`) }}>아티스트 등록</button>
                </div>
                <div className="artist-list">
                    {artist.map((artist) => (
                        <div className="artist-item" key={artist.artistuuid} onClick={()=>handleArtistClick(artist.artistuuid)}>
                            <img src={`${process.env.REACT_APP_BACKEND_API_URL}/resources/artistimg/${artist.fname}`} alt={artist.name} className="artist-image"></img>
                            <p>{artist.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default ArtistList;