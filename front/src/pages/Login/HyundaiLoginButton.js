import React from "react";
import { Button } from '@material-ui/core';
import hyundaiLoginImage from '../../assets/image/hyundai_login.png';
import { useAuth } from "../../utils/AuthContext";

const HyundaiLoginButton = () => {
  const { getUserName } = useAuth();

  const responseType = 'code';
  const clientId = '4211f199-e798-459b-bc41-260cab36a1ed'; // 애플리케이션 등록 시 발급 받은 Client ID를 입력하세요.

  const redirectUri = encodeURIComponent(`${process.env.REACT_APP_BACKEND_URL}/hyundai`); // 애플리케이션 등록 시 설정한 Redirect URL을 입력하세요.

  const state = getUserName(); // 상태 토큰 값을 입력하세요. 실제 사용 시에는 매 요청마다 고유한 값을 생성해야 합니다.

  // OAuth 인증 페이지 URL 구성
  const authUrl = `https://prd.kr-ccapi.hyundai.com/api/v1/user/oauth2/authorize?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;




  return (
    <Button
      variant="outlined"
      color="primary"
      href={authUrl}
      style={{
        borderColor: '#1976d2',
        color: '#fff',
        padding: '8px 20px',
        textTransform: 'none',
        fontSize: '16px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        background: '#0D66AC',
      }}
    >
      현대 블루링크로 연동
    </Button>
  );
}

export default HyundaiLoginButton;
