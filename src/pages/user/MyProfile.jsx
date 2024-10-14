import React, { useEffect, useState } from 'react';
import api from '../../apiClient';
import { useNavigate } from 'react-router-dom';
import './myprofile.css';

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchUserInfo = async () => {
    try {
      const response = await api.get('/users/myprofile');
      setUser(response.data); 
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error);
      alert('사용자 정보를 가져오는 데 오류가 발생했습니다.');
    }
  };

  // 뒤로가기 버튼 클릭 시 동작
  const handleBackButtonClick = () => {
    navigate('/user/main');
  };

  // 정보 수정 버튼 클릭 시 동작
  const handleEdit = () => {
    navigate('/user/edit');
  };

  // 컴포넌트가 마운트될 때 사용자 정보 가져오기
  useEffect(() => {
    fetchUserInfo(); 
  }, []);

  if (!user) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div className="container">
      <h1 className="title">회원 정보</h1>
      <div className="profile-info">
        <div className="info-row">
          <span className="label">이메일:</span>
          <span className="value">{user.email}</span>
        </div>
        <div className="info-row">
          <span className="label">이름:</span>
          <span className="value">{user.name}</span>
        </div>
        <div className="info-row">
          <span className="label">생년월일:</span>
          <span className="value">{user.birth}</span>
        </div>
        <div className="info-row">
          <span className="label">휴대폰:</span>
          <span className="value">{user.phone}</span>
        </div>
        <div className="info-row">
          <span className="label">주소:</span>
          <span className="value">{user.address}</span>
        </div>
      </div>
      {/* 버튼을 감싸는 컨테이너 추가 */}
      <div className="button-container">
        <button className="button" onClick={handleEdit}>
          정보 수정
        </button>
        <button className="button back-button" onClick={handleBackButtonClick}>
          뒤로가기
        </button>
      </div>
    </div>
  );
};

export default MyProfile;
