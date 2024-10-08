import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/artistlist.css";
const ArtistList = () => {
    const managementuuid = '32eb55e2-022c-4741-8a41-d32916480b4e'; //hard coding(세션유지)
    // const { managementuuid: urlmanagementuuid} = useParams(); //url에서 managementuuid 가져오기
    // const managementuuid = urlmanagementuuid || localStorage.getItem('managementuuid'); //세션 저장소에서 가져오기

    const [artist, setArtist] = useState([]);
    const [loading, setLoading] = useState(true);// 로딩 상태
    const [error, setError] = useState(null);// 에러 상태
    const navigate = useNavigate();

    //Team api 호출 함수
    const fetchArtist = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/management/artist/list/${managementuuid}`);
            setArtist(response.data); 
            setLoading(false); //로딩 종료

        } catch (err) {
            setError(err.message);
        }
    };

    const handleArtistClick = (artistuuid) => {
        navigate(`/management/artistDetail/${artistuuid}`);
    };

    //컴포넌트가 마운트되면 fetchTeam 실행
    useEffect(() => {
        fetchArtist();
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
                <h2>{artist[0].management.name}의 아티스트 목록</h2>
                <div className="artist-form">
                    <button className="artist-form-btn" onClick={() => { navigate(`/management/artistForm/${managementuuid}`) }}>아티스트 등록</button>
                </div>
                <div className="artist-list">
                    {artist.map((artist) => (
                        <div className="artist-item" key={artist.artistuuid} onClick={()=>handleArtistClick(artist.artistuuid)}>
                            <img src={`http://localhost:8080/resources/artistimg/${artist.fname}`} alt={artist.name} className="artist-image"></img>
                            <p>{artist.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default ArtistList;