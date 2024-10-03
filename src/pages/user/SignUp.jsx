import React, { useState } from 'react';
import "./signup.css";

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password, name, birthdate, phone, address });
  };

  return (
    <div className="container">
      <h1 className="title">개인회원가입</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input
          className="input"
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="input"
          type="password"
          placeholder="비밀번호 (8-16자)"
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
          type="date"
          placeholder="생년월일"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          required
        />
        <input
          className="input"
          type="tel"
          placeholder="휴대폰"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
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
