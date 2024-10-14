import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../../apiClient';
import './managementmypage.css';
import { useNavigate } from 'react-router-dom';


const ManagementMyPage = () => {
  const [userName, setUserName] = useState('로그인 안됨'); 

  const fetchUserInfo = async () => {
    try {
      const response = await api.get('/management/myprofile');
      setUserName(response.data.name);
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error);
    }
  };

    const navigate = useNavigate();

    const handleBackButtonClick = () => {
        navigate('/management/dashboard');
    };
  
    const handleDetailButtonClick = () => {
      navigate('/management/managementmyprofile');
  };
  const handleUpdateButtonClick = () => {
    navigate('/management/updatemanagement');
};


  useEffect(() => {
    fetchUserInfo(); // 컴포넌트가 마운트될 때 사용자 정보 가져오기
  }, []);

  return (
    <div className="mypage-container">
        <h1 className="user-name">{userName} 님</h1> 
        <div className="menu-container">
            <div className="menu-item"  onClick={handleDetailButtonClick}>회원조회</div>
            <div className="menu-item"  onClick={handleUpdateButtonClick}>회원수정</div>
            {/* <div className="menu-item">test2</div>
            <div className="menu-item">test3</div>
            <div className="menu-item">test4</div> */}
            <div className="menu-item">회원탈퇴</div>

        </div>
        <div className="back-container">
            <button className="back-button" onClick={handleBackButtonClick}>뒤로가기</button>
        </div>
    </div>
);
};


export default ManagementMyPage;
