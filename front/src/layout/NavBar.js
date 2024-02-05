import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";


const Navbar = () => {
  const navigate = useNavigate();

  const { isLogin, setLogout, getUserName } = useAuth();
  console.log(isLogin);
  console.log(getUserName);

  const handleLogout = () => {
    setLogout();
    //로그 아웃 후 로그인 페이지 or 홈으로 이동 ?
    navigate("/");
  };

  const goToHome = () => {
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <div onClick={goToHome} style={{ flexGrow: 1, cursor: "pointer" }}>
          <Typography variant="h6">전기차 충전 서비스</Typography>
        </div>
        <Button color="inherit" component={Link} to="/report/list">
          신고내역 확인
        </Button>
        <Button color="inherit" component={Link} to="/chargingServiceInfo">
          서비스 안내
        </Button>
        <Button color="inherit" component={Link} to="/station">
          충전소 검색
        </Button>
        <Button color="inherit" component={Link} to="/map">
          충전소 지도
        </Button>
        {isLogin() ? ( // 로그인된 상태일 때
          <>
            <Typography variant="body1" style={{ marginRight: "1rem" }}>
              {getUserName()}님 환영합니다.{" "}
              {/* 로그인된 사용자의 이름을 보여줌 */}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              로그아웃
            </Button>
          </>
        ) : ( //로그인 되지 않은 상태일 때
        <>
          <Button color="inherit" component={Link} to="/signup">
            회원가입
          </Button>
          <Button color="inherit" component={Link} to="/login">
            로그인
          </Button>
          </>      
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
