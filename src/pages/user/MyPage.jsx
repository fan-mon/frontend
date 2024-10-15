import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../../apiClient';
import './mypage.css';
import { useNavigate } from 'react-router-dom';


const MyPage = () => {
  const [userName, setUserName] = useState('로그인 안됨'); 

  const fetchUserInfo = async () => {
    try {
      const response = await api.get('/users/myprofile');
      setUserName(response.data.name);
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error);
    }
  };

    const navigate = useNavigate();

    const handleBackButtonClick = () => {
        navigate('/user/main');
    };
    const handleProfileClick = () => {
      navigate('/user/myprofile');
    };
    const handleUpdateClick = () => {
      navigate('/user/updateprofile');
    };


  useEffect(() => {
    fetchUserInfo(); 
  }, []);

  return (
    <div className="mypage-container">
        <h1 className="user-name">{userName} 님</h1> 
        <div className="menu-container">
            <div className="menu-item" onClick={handleProfileClick}>회원조회</div>
            <div className="menu-item" onClick={handleUpdateClick}>회원수정</div>
            <div className="menu-item">좋아하는 Artist</div>
            <div className="menu-item">내 게시물 조회</div>
            <div className="menu-item">결제내역</div>
            <div className="menu-item">회원탈퇴</div>

        </div>
        <div className="back-container">
            <button className="back-button" onClick={handleBackButtonClick}>뒤로가기</button>
        </div>
    </div>
);
};


export default MyPage;
