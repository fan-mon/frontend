import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css'; 

const Login = () => {
  const [isPersonal, setIsPersonal] = useState(true);
  const navigate = useNavigate();

  const handlePersonalClick = () => {
    setIsPersonal(true);
  };

  const handleCompanyClick = () => {
    setIsPersonal(false);
  };

  const handleLogin = () => {
    if (isPersonal) {
      navigate('/user/login');
    } else {
      navigate('/management/login');
    }
  };

  const handleSignup = () => {
    if (isPersonal) {
      navigate('/user/signup');
    } else {
      navigate('/management/managementsignup');
    }
  };

  const handleFindEmailPassword = () => {
    if (isPersonal) {
      navigate('/user/findEmailPassword');
    } else {
      navigate('/management/findEmailPassword');
    }
  };


  return (
    <div className="login-container">
      <h1 className="login-title">로그인</h1>
      <div className="tab-container">
        <div
          className={`tab ${isPersonal ? 'active' : ''}`}
          onClick={handlePersonalClick}
        >
          개인회원
        </div>
        <div
          className={`tab ${!isPersonal ? 'active' : ''}`}
          onClick={handleCompanyClick}
        >
          기업회원
        </div>
      </div>
      <div className="login-form">
        <input
          type="email"
          placeholder="이메일을 입력하세요"
          className="login-input"
        />
        <input
          type="password"
          placeholder="비밀번호를 입력하세요"
          className="login-input"
        />
        <button className="login-button" onClick={handleLogin}>
          로그인
        </button>
      </div>
      <div className="login-footer">
        <a onClick={handleSignup}>회원가입</a>
        <a onClick={handleFindEmailPassword}>이메일 · 비밀번호 찾기</a>
      </div>
      
      {/* 개인회원일 때만 소셜 로그인 버튼 표시 */}
      {isPersonal && (
        <div className="social-login">
          <div className="divider-container">
            <hr className="divider" />
            <span className="social-login-text">간편 로그인</span>
            <hr className="divider" />
          </div>
          <div className="social-icons">
            <img src="/path-to-naver-icon" alt="Naver Login" className="social-icon" />
            <img src="/path-to-kakao-icon" alt="Kakao Login" className="social-icon" />
            <img src="/path-to-google-icon" alt="Google Login" className="social-icon" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
