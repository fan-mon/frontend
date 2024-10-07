import React, { useEffect, useState } from 'react';
import "./css/artistdetail.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';

function ArtistDetail() {
    const managementuuid = '32eb55e2-022c-4741-8a41-d32916480b4e'; //hard coding
    const [adetail, setADetail] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [debut, setDebut] = useState('');
    const [email, setEmail] = useState('');
    const [birth, setBirth] = useState('');
    const [uploadfile, setUploadfile] = useState(null);
    const { artistuuid } = useParams();
    const [loading, setLoading] = useState(true);// 로딩 상태
    const [error, setError] = useState(null);// 에러 상태
    const navigate = useNavigate();

    //Artist detail api 호출
    const fetchArtistDetail = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/management/artist/${artistuuid}`);
            setADetail(response.data);
            setName(response.data.name);
            setDebut(response.data.debut);
            setEmail(response.data.email);
            setBirth(response.data.birth);
            setLoading(false); //로딩 종료

        } catch (err) {
            setError('Error fetching artist detail:', err.message);
        }
    };

    useEffect(() => {
        fetchArtistDetail();
    }, [artistuuid]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleUpdateClick = async() => {
        const updatedArtist = {
            name, debut, email, birth
        };
        try {
            await axios.put(`http://localhost:8080/management/artist/${artistuuid}`, updatedArtist);
            alert('아티스트 정보가 수정되었습니다.');
            setIsEditing(false); // 수정 모드 종료
            fetchArtistDetail(); // 최신 데이터 가져오기
        } catch (err) {
            console.error('Error updating artist:', err);
        }
    };

    const handleFileChange = (e) => {
        setUploadfile(e.target.files[0]);
    };

    return (
        <div className="artist-detail-container">
            {adetail ? (
                <div>
                    <h2>아티스트 상세 정보</h2>
                    <p>이름: {isEditing ? (
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    ) : (
                        adetail.name
                    )}</p>
                    <p>데뷔: {isEditing ? (
                        <input
                            type="text"
                            value={debut}
                            onChange={(e) => setDebut(e.target.value)}
                        />
                    ) : (
                        adetail.debut
                    )}</p>
                    <p>이메일: {isEditing ? (
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    ) : (
                        adetail.email
                    )}</p>
                    <p>생일: {isEditing ? (
                        <input
                            type="date"
                            value={birth}
                            onChange={(e) => setBirth(e.target.value)}
                        />
                    ) : (
                        adetail.birth
                    )}</p>
                    {isEditing && (
                        <div>
                            <label>이미지 파일:</label>
                            <input
                                type="file"
                                id="uploadfile"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                    )}

                    {isEditing ? (
                        <button className="update-form-btn" onClick={handleUpdateClick}>수정 완료</button>
                    ) : (
                        <button className="update-btn" onClick={handleEditClick}>수정하기</button>
                    )}
                </div>
            ) : (
                <p>아티스트 정보를 불러오는 중입니다...</p>
            )}
        </div>
    );
}

export default ArtistDetail;