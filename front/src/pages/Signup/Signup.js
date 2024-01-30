import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const navigate = useNavigate();

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
      

      // TODO: 성공 시 리다이렉트 또는 다른 작업 수행
      navigate('/');
    } catch (error) {
      
      // 회원가입 실패 시 처리
      console.error('Signup failed:', error.response.data);

      // TODO: 실패 시 에러 메시지 출력 또는 다른 작업 수행
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