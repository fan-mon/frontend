import React, { useEffect, useState } from 'react';
import "./css/artistdetail.css";
import api from '../../../apiClient';
// import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';

function ArtistDetail() {
    // const managementuuid = '32eb55e2-022c-4741-8a41-d32916480b4e'; //hard coding
    const [mgName, setMgName] = useState('로그인 안됨');
    const [managementuuid, setManagementuuid] = useState('');
    const { artistuuid } = useParams();

    const [adetail, setADetail] = useState(null);//디테일 정보 불러와서 담을 것
    const [name, setName] = useState('');
    const [debut, setDebut] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [birth, setBirth] = useState('');
    const [fname, setFname] = useState('');
    const [uploadfile, setUploadfile] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);// 로딩 상태
    const [error, setError] = useState(null);// 에러 상태
    const navigate = useNavigate();

    //로그인된 management 정보 가져오기
    const fetchManagementInfo = async () => {
        try {
          const response = await api.get('/management/myprofile');
          console.log(response.headers); // 응답 헤더 출력
          console.log(response.data); // 사용자 정보 로그 출력
          setMgName(response.data.name);
          setManagementuuid(response.data.managementuuid);
          console.log(response.data.managementuuid);

        } catch (error) {
          console.error("사용자 정보 가져오기 오류:", error);
        }
    };

    //Artist detail 정보 가져오기 api 호출
    const fetchArtistDetail = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/management/artist/${artistuuid}`);
            setADetail(response.data);
            setName(response.data.name);
            setDebut(response.data.debut);
            setEmail(response.data.email);
            setBirth(response.data.birth);
            setFname(response.data.fname);
            setLoading(false); //로딩 종료

        } catch (err) {
            setError('Error fetching artist detail:', err.message);
        }
    };

    useEffect(() => {
        fetchManagementInfo();
        fetchArtistDetail();
    }, [artistuuid]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleFileChange = (e) => {
        setUploadfile(e.target.files[0]);
    };
    //아티스트 삭제
    const handleDeleteClick = async () => {
        const confirmed = window.confirm('정말로 삭제하시겠습니까?');

        if (confirmed) {
            try {
                await axios.delete(`${process.env.REACT_APP_BACKEND_API_URL}/management/artist/${artistuuid}`);
                alert('아티스트가 삭제되었습니다.');
                navigate('/management/artistList'); // 아티스트 목록 페이지로 이동
            } catch (error) {
                console.error('삭제 중 오류 발생:', error);
                alert('삭제에 실패하였습니다. 다시 시도해 주세요.');
            }
        }
    };
    //아티스트 디테일 정보 수정하기
    const handleUpdateClick = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('managementuuid', managementuuid);
        formData.append('artistuuid', artistuuid);
        formData.append('name', name);
        formData.append('debut', debut);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('birth', birth);
        formData.append('fname',fname);
        if (uploadfile) {
            formData.append('uploadfile', uploadfile);
        }
        // FormData의 모든 필드를 확인하는 방법
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_API_URL}/management/artist/${artistuuid}`, formData);
            alert('아티스트 정보가 수정되었습니다.');
            setIsEditing(false); // 수정 모드 종료
            fetchArtistDetail(); // 최신 데이터 가져오기
        } catch (err) {
            console.error('Error updating artist:', err);
        }
    };



    return (
        <div className="artist-detail-container">
            {adetail ? (
                <div className='detail-is'>
                    <div className='detail-text'>
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
                    <p>데뷔일: {isEditing ? (
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
                    <p>비밀번호: {isEditing ? (
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    ) : null}</p>
                    <p>생일: {isEditing ? (
                        <input
                            type="date"
                            value={birth}
                            onChange={(e) => setBirth(e.target.value)}
                        />
                    ) : (
                        adetail.birth
                    )}</p>
                    </div>
                    
                    <div className='detail-img'>
                    {!isEditing && fname ? (
                        <img className='artist-img' src={`${process.env.REACT_APP_BACKEND_API_URL}/resources/artistimg/${fname}`} />
                    ) : (
                        <span>등록된 이미지가 없습니다.</span>
                    )}
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
                    </div>
                    {isEditing ? (
                        <button className="update-form-btn" onClick={handleUpdateClick}>수정 완료</button>
                    ) : (
                        <button className="update-btn" onClick={handleEditClick}>수정하기</button>
                    )}
                    <div className='btns'>
                        <button className='delete-btn' onClick={handleDeleteClick}>삭제하기</button>
                        <button className='list-btn' onClick={() => { navigate(`/management/artistList`) }}>목록으로</button>
                    </div>
                </div>
            ) : (
                <p>아티스트 정보를 불러오는 중입니다...</p>
            )}
        </div>
    );
}

export default ArtistDetail;