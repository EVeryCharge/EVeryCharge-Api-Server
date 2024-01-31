import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setLogined } = useAuth();
  const handleLogin = async () => {
    try {
      const response = await axios.post(
        '/api/v1/members/login',
        {
          username: username,
          password: password,
        }
      );

      // 로그인 성공 시 처리
      console.log('Login successful:', response);

      console.log('Login successful:', response.data.data.item);
      setLogined(response.data.data.item)
      console.log('username sessionStorage '+response.data.data.item.username);
      sessionStorage.setItem("username", response.data.data.item.username);
      // TODO: 성공 시 리다이렉트 또는 다른 작업 수행
      navigate('/');
    } catch (error) {
      // 로그인 실패 시 처리
      if(username === ''){
        alert("Username은 필수 입력 항목입니다.")
      }else if(password ===  ''){
        alert("Password은 필수 입력 항목입니다.")
      }

      if(error.response.data.resultCode === '400-1'){
        alert("해당 유저가 존재하지 않습니다.");
      }
      else if(error.response.data.resultCode === '400-2'){
        alert("비밀번호가 일치하지 않습니다.");
      }

      console.error('Login failed:', error.response.data);

      // TODO: 실패 시 에러 메시지 출력 또는 다른 작업 수행
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <br />
        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
