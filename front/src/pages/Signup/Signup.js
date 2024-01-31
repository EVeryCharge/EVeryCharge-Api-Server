import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [checkId, setCheckId] = useState(null);
  const navigate = useNavigate();

  const handleCheckid = async () => {
    try {
      const response = await axios.get(`/api/v1/members/checkid/${username}`);
      if (response.data) {
        alert('사용 가능한 ID 입니다');
        setCheckId(true);
      } else {
        alert('이미 사용중인 ID 입니다');
        setCheckId(false);
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
      navigate('/login');
    } catch (error) {
      // 회원가입 실패 시 처리
      if(username === ''){
        alert("Username은 필수 입력 항목입니다.")
      }else if(password ===  ''){
        alert("Password은 필수 입력 항목입니다.")
      }else if(password2 === ''){
        alert("Passsword Confirm은 필수 입력 항목입니다.")
      }

      if(error.response.data.resultCode === '400-1'){
        alert("두개의 비밀번호가 일치하지 않습니다.");
      }
      else if(error.response.data.resultCode === '400-2'){
        alert("이미 존재하는 회원입니다.");
      }

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
        {checkId === true  && <span style={{ color: 'green' }}>✔️</span>}
        {checkId === false && <span style={{ color: 'red' }}>❌</span>}
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