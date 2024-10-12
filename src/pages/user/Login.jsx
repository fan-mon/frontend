import React, { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css'; 

const Login = () => {
  const [isPersonal, setIsPersonal] = useState(true);
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const navigate = useNavigate();

  const handlePersonalClick = () => {
    setIsPersonal(true);
  };

  const handleCompanyClick = () => {
    setIsPersonal(false);
  };

  const handleLogin = async () => {
    const requestData = {
      email,
      password,
    };
  
  try {
    // 개인회원 또는 기업회원에 따라 API 경로 결정
    const apiEndpoint = isPersonal ? 'http://localhost:8080/users/login' : 'http://localhost:8080/management/login';

    // 로그인 API 호출
    const response = await axios.post(apiEndpoint, requestData);

    // 로그인 성공 시 토큰 저장
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('role', response.data.role); // 역할 저장 추가

    // 개인회원 또는 기업회원에 따라 리디렉션
    if (isPersonal) {
      navigate('/user/main'); // USER 홈으로 리디렉션
    } else {
      navigate('/management/dashboard'); // MANAGEMENT 홈으로 리디렉션
    }
  }   catch (error) {
    console.error("로그인 오류:", error);
    alert("로그인에 실패했습니다. 이메일이나 비밀번호를 확인하세요."); // 에러 메시지
  }
};



  // const handleLogin = () => {
  //   if (isPersonal) {
  //     navigate('/user/login');
  //   } else {
  //     navigate('/management/login');
  //   }
  // };

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




  const handleGoogleLogin = () => {
    try {
      window.location.href = "http://localhost:8080/oauth2/authorization/google";
    } catch (error) {
        console.error('구글 로그인 URL 가져오기 오류:', error);
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
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input
          type="password"
          placeholder="비밀번호를 입력하세요"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
            <button onClick={handleGoogleLogin}>
                <img src="/path-to-google-icon" alt="Google Login" className="social-icon" />
            </button>
        </div>
        </div>
      )}
    </div>
  );
};

export default Login;

