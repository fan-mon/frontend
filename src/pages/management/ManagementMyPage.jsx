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
      console.log("바보");
      console.log(response.headers); // 응답 헤더 출력
      console.log(response.data); // 사용자 정보 로그 출력
      setUserName(response.data.name); // 사용자 이름 상태 업데이트
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error);
    }
  };

    const navigate = useNavigate();

    const handleBackButtonClick = () => {
        navigate('/management/dashboard');
    };
  


  useEffect(() => {
    fetchUserInfo(); // 컴포넌트가 마운트될 때 사용자 정보 가져오기
  }, []);

  return (
    <div className="mypage-container">
        <h1 className="user-name">{userName} 님</h1> 
        <div className="menu-container">
            <div className="menu-item">회원조회/수정</div>
            <div className="menu-item">test1</div>
            <div className="menu-item">test2</div>
            <div className="menu-item">test3</div>
            <div className="menu-item">test4</div>
            <div className="menu-item">회원탈퇴</div>

        </div>
        <div className="back-container">
            <button className="back-button" onClick={handleBackButtonClick}>뒤로가기</button>
        </div>
    </div>
);
};


export default ManagementMyPage;
