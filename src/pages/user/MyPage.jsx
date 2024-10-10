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
        navigate('/user/main');
    };
  


  useEffect(() => {
    fetchUserInfo(); // 컴포넌트가 마운트될 때 사용자 정보 가져오기
  }, []);

  return (
    <div className="mypage-container">
        <h1 className="user-name">{userName} 님</h1> 
        <div className="menu-container">
            <div className="menu-item">회원조회/수정</div>
            <div className="menu-item">결제내역</div>
            <div className="menu-item">좋아하는 Artist</div>
            <div className="menu-item">내 게시물 조회</div>
            <div className="menu-item">내 댓글 조회</div>
            <div className="menu-item">회원탈퇴</div>

        </div>
        <div className="back-container">
            <button className="back-button" onClick={handleBackButtonClick}>뒤로가기</button>
        </div>
    </div>
);
};


export default MyPage;
