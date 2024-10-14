import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./signup.css";

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [emailChecked, setEmailChecked] = useState(false);
  const [postcode, setPostcode] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailChecked) {
      alert('이메일 중복 확인을 완료해주세요');
      return;
    }


  try {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_API_URL}/users/signup`, {
      email,
      password,
      name,
      birth: birthdate,
      phone,
      postcode,
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



const handleEmailCheck = async () => {
  try {
    const response =  await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/users/check-email`, {
      params: {email}  
    });
    if (response.status === 200) {
      alert("사용 가능한 이메일입니다.");
      setEmailChecked(true);
    }
  } catch (error) {
    if (error.response && error.response.status === 409) {
      alert("이미 사용 중인 이메일입니다.");
      setEmailChecked(false);
    } else {
      alert('이메일 중복 확인 중 오류가 발생했습니다.');
    }
  }
};

  return (
    <div className="container">
      <h1 className="title">개인회원가입</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="email-container">
          <input
            className="input email-input"
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailChecked(false); // 이메일이 변경되면 중복 확인 다시 필요
            }}
            required
          />
          <button 
            type="button" 
            className="verify-button" 
            onClick={handleEmailCheck}>
            중복 확인
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
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="input"
          type="text"
          placeholder="생년월일 (YYYY-MM-DD)"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          required
        />
        <input
          className="input"
          type="tel"
          placeholder="휴대폰 (010-1234-1234)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
          <input
          className="input"
          type="text"
          placeholder="우편번호 (5자리 숫자)"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
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


export default SignUp;
