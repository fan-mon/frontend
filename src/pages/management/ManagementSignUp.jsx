import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./managementsignup.css";

const ManagementSignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [businessno, setBusinessno] = useState('');
  const [address, setAddress] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const navigate = useNavigate();


  const handleSubmit =  async(e) => {
    e.preventDefault();
    if (!emailVerified) {
      alert('이메일 인증을 완료해주세요.');
      return;
    };

  try {
    const response = await axios.post('http://localhost:8080/management/signup', {
      email,
      password,
      name,
      businessno,
      address
    });

    alert('회원가입이 완료되었습니다!');
    navigate('/user/login'); 
    console.log(response.data);
  } catch (error) {
    if (error.response) {
      alert(`회원가입 실패: ${error.response.data.message}`);
    } else {
      alert('회원가입 중 오류가 발생했습니다.');
    }
  }
};



  const handleEmailVerification = () => {
    // 여기에 이메일 인증 로직 추가 (API 호출 등)
    alert("이메일 인증 요청이 완료되었습니다.");
    setEmailVerified(true); // 이메일 인증 완료로 설정
  };

  return (
    <div className="container">
      <h1 className="title">기업회원가입</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="email-container">
          <input
            className="input email-input"
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button 
            type="button" 
            className="verify-button" 
            onClick={handleEmailVerification}>
            인증 요청
          </button>
        </div>
        <input
          className="input"
          type="password"
          placeholder="비밀번호 (8-16자의 영문, 숫자, 특수문자)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          className="input"
          type="text"
          placeholder="회사명"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="input"
          type="tel"
          placeholder="사업자 번호 ('-'빼고 숫자만 입력)"
          value={businessno}
          onChange={(e) => setBusinessno(e.target.value)}
          required
        />
        <input
          className="input"
          type="text"
          placeholder="주소"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <button className="button" type="submit">
          회원 가입완료
        </button>
      </form>
    </div>
  );
};

export default ManagementSignUp;
