import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const navigate = useNavigate();

  const handleCheckid = async () => {
    try {
      const response = await axios.get(`/api/v1/members/checkid/${username}`);
      if (response.data) {
        alert('사용 가능한 ID 입니다');
      } else {
        alert('이미 사용중인 ID 입니다');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignup = async () => {
    try {
      const response = await axios.post(
        '/api/v1/members/signup',
        {
          username: username,
          password1: password,
          password2: password2
        }
      );

      // 회원가입 성공시 처리
      console.log('Signup successful:' , response);
      alert("회원 가입 성공!");
      navigate('/');
    } catch (error) {
      // 회원가입 실패 시 처리
      console.error('Signup failed:', error.response.data);
    }
  };

  return (
    <div>
      <h2>회원가입</h2>
      <form>
        <label>
          Username : 
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <button type= "button" onClick={handleCheckid}>
          중복 확인        
        </button>
        <br />
        <label>
          Password : 
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <label>
          Password Confirm : 
          <input type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} />
        </label>
        <br />
        <button type="button" onClick={handleSignup}>
          회원가입
        </button>
      </form>
    </div>
  );
};

export default Signup;