import React from "react";

const KakaoLoginButton = () =>{
  
  const redirectUrl = "http://localhost:3000";

  // 클릭 이벤트 핸들러
  const handleClick = () => {
    window.location.href = `http://localhost:8090/socialLogin/kakao?redirectUrl=${encodeURIComponent(redirectUrl)}`;
  };

  return (
    <div>
      <button onClick={handleClick}>카카오 로그인</button>
    </div>
  );
}

export default KakaoLoginButton;
