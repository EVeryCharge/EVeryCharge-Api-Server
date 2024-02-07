import React from "react";
import {Button} from '@material-ui/core';
import kakaoLoginImage from '../../assets/kakao_login.png';

const KakaoLoginButton = () =>{
  const url = `${process.env.REACT_APP_BACKEND_URL}/socialLogin/kakao?redirectUrl=${process.env.REACT_APP_FRONTEND_URL}`;
  console.log(url);

  // 클릭 이벤트 핸들러
  // const handleClick = () => {
   
  //   window.location.href = `${process.env.REACT_APP_BACKEND_URL}/socialLogin/kakao?redirectUrl=${encodeURIComponent(process.env.REACT_APP_FRONTEND_URL)}`;
  // };
  return (
    <Button
      style={{ marginTop: '20px', backgroundColor: '#FFEB00', color: 'black', padding: 0, minWidth: 'auto' }} // 버튼 스타일 수정
      variant="contained"
      fullWidth
      href={url}
    >
      <img src={kakaoLoginImage} alt="카카오 로그인" style={{ width: '40%', height: 'auto' }} /> 
    </Button>
  );
}

export default KakaoLoginButton;
