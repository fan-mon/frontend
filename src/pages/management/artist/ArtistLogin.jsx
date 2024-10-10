import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./css/artistlogin.css";

const ArtistLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const requestData = {
      email,
      password,
    };

    try {
      const apiEndpoint = 'http://localhost:8080/management/artist/login';
      const response = await axios.post(apiEndpoint, requestData);

      localStorage.setItem('accessToken', response.data.accessToken);
      navigate('/user/main'); // 로그인 후 메인 페이지로 이동
    } catch (error) {
      console.error("로그인 오류:", error);
      alert("로그인에 실패했습니다. 이메일이나 비밀번호를 확인하세요.");
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">아티스트 로그인</h1>
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
    </div>
  );
};

export default ArtistLogin;
