import React, { useEffect, useState } from 'react';
import api from '../../apiClient';
import { useNavigate } from 'react-router-dom';
import './updatemanagement.css';

const UpdateManagement = () => {
  const [user, setUser] = useState(null);
  const [editableUser, setEditableUser] = useState({
    phone: '',
    postcode: '',
    address: ''
  });
  const navigate = useNavigate();

  const fetchUserInfo = async () => {
    try {
      const response = await api.get('/management/myprofile');
      setUser(response.data);
      setEditableUser({
        name: response.data.name,
        address: response.data.address
      });
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error);
      alert('사용자 정보를 가져오는 데 오류가 발생했습니다.');
    }
  };

  const handleBackButtonClick = () => {
    navigate('/management/managementmypage');
  };

  const handleEdit = () => {
    api.put('/management/myprofile', editableUser)
      .then(() => {
        alert('정보가 수정되었습니다.');
      })
      .catch((error) => {
        console.error('정보 수정 오류:', error);
        alert('정보 수정 중 오류가 발생했습니다.');
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableUser({ ...editableUser, [name]: value });
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  if (!user) {
    return <div className="profile-loading">로딩 중...</div>;
  }

  return (
    <div className="profile-container">
      <h1 className="profile-title">회원 수정</h1>
      <div className="profile-info-container">
        <div className="profile-info-row">
          <span className="profile-label">이메일:</span>
          <span className="profile-value">{user.email}</span>
        </div>
        <div className="profile-info-row">
          <span className="profile-label">사업자번호:</span>
          <span className="profile-value">{user.businessno}</span>
        </div>
        <div className="profile-info-row">
          <span className="profile-label">회사명:</span>
          <input
            type="text"
            name="name"
            value={editableUser.name}
            onChange={handleInputChange}
            className="profile-input"
          />
        </div>
        <div className="profile-info-row">
          <span className="profile-label">주소:</span>
          <input
            type="text"
            name="address"
            value={editableUser.address}
            onChange={handleInputChange}
            className="profile-input"
          />
        </div>
      </div>
      <div className="profile-button-container">
        <button className="profile-button" onClick={handleEdit}>
          수정하기
        </button>
        <button className="profile-button profile-back-button" onClick={handleBackButtonClick}>
          뒤로가기
        </button>
      </div>
    </div>
  );
};

export default UpdateManagement;
