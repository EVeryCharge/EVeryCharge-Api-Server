import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import { Link, useNavigate } from 'react-router-dom';


const Navbar = () => {
  const navigate = useNavigate();
  const goToHome = () => {
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
      <div onClick={goToHome} style={{ flexGrow: 1, cursor: 'pointer' }}>
          <Typography variant="h6">
            전기차 충전 서비스
          </Typography>
        </div>
        <Button color="inherit" component={Link} to="/chargingServiceInfo">서비스 안내</Button>
        <Button color="inherit" component={Link} to="/station">충전소 검색</Button>
        <Button color="inherit" component={Link} to="/map">충전소 지도</Button>
        <Button color="inherit" component={Link} to="/login">로그인</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
