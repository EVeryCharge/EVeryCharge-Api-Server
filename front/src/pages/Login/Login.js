import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        '/api/v1/members/logins',
        {
          username: username,
          password: password,
        }
      );

      // 로그인 성공 시 처리
      console.log('Login successful:', response.data);

      // TODO: 성공 시 리다이렉트 또는 다른 작업 수행
    } catch (error) {
      // 로그인 실패 시 처리
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
