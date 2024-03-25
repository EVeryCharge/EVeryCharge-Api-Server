import React from "react";
import { Button } from '@material-ui/core';
import hyundaiLoginImage from '../../assets/image/hyundai_login.png';
import { useAuth } from "../../utils/AuthContext";

const HyundaiLoginButton = () => {
  const { getUserName} = useAuth();

  const responseType = 'code';
  const clientId = '4211f199-e798-459b-bc41-260cab36a1ed'; // 애플리케이션 등록 시 발급 받은 Client ID를 입력하세요.
  const redirectUri = encodeURIComponent('http://api.eitcharge.site/hyundai'); // 애플리케이션 등록 시 설정한 Redirect URL을 입력하세요.
  const state = getUserName(); // 상태 토큰 값을 입력하세요. 실제 사용 시에는 매 요청마다 고유한 값을 생성해야 합니다.

  // OAuth 인증 페이지 URL 구성
  const authUrl = `https://prd.kr-ccapi.hyundai.com/api/v1/user/oauth2/authorize?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;




  return (
    <Button
      style={{ marginTop: '20px', backgroundColor: '#FFFFFF', color: 'black', padding: 0, minWidth: 'auto' }} // 버튼 스타일 수정
      variant="contained"

      href={authUrl}
    >
      <img src={hyundaiLoginImage} alt="현대" style={{ width: '100px', height: '40px' }} />
    </Button>
  );
}

export default HyundaiLoginButton;
