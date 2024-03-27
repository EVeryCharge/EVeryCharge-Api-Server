import {
  AppBar,
  Button,
  Fade,
  Hidden,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { EvStation, Menu as MenuIcon } from "@material-ui/icons";
import { ElectricCar } from "@mui/icons-material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const { isLogin, setLogout, getUserName, getUserNickname } = useAuth();

  const handleLogout = () => {
    setLogout();
    //로그 아웃 후 로그인 페이지 or 홈으로 이동 ?
    navigate("/");
  };

  const goToHome = () => {
    navigate("/");
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      style={{
        background: "white",
        borderBottom: "1px solid grey",
        boxShadow: "none",
        display: "flex",
      }}
    >
      <Toolbar
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "24px",
          maxWidth: "1200px",
        }}
      >
        <div style={{ width: "55px" }} />
        <div onClick={goToHome} style={{ cursor: "pointer" }}>
          <Typography
            variant="h5"
            style={{
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              color: "#3F51B5",
              marginRight: "20px",
            }}
          >
            <ElectricCar
              style={{ marginRight: "3px", fontSize: "2rem", color: "#3F51B5" }}
            />
            EVeryCharge
          </Typography>
          <Typography
            variant="subtitle2"
            style={{
              fontWeight: "bold",
              display: "flex",
              justifyContent: "flex-end",
              color: "#3F51B5",
              marginRight: "20px",
            }}
          >
            전기차 충전 정보 제공 서비스
          </Typography>
        </div>

        <div>
          {/* for mobile */}
          <div>
            <Hidden mdUp>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                aria-controls="nav-menu"
                aria-haspopup="true"
                onClick={handleMenuClick}
                style={{ color: "black" }}
              >
                <MenuIcon style={{ fontSize: "2rem" }} />
              </IconButton>
              <Menu
                id="nav-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                TransitionComponent={Fade}
                PaperProps={{
                  style: {
                    boxShadow: "none",
                    marginTop: "84px",
                    marginLeft: "20px",
                    border: "1px solid lightgrey",
                  },
                }}
              >
                {[
                  <MenuItem
                    key="report"
                    onClick={handleMenuClose}
                    component={Link}
                    to="/report/list"
                  >
                    신고하기
                  </MenuItem>,
                  <MenuItem
                    key="map"
                    onClick={handleMenuClose}
                    component={Link}
                    to="/map"
                  >
                    충전소 지도
                  </MenuItem>,
                  <MenuItem
                    key="map"
                    onClick={handleMenuClose}
                    component={Link}
                    to="/fee"
                  >
                    요금 정보
                  </MenuItem>,
                  <MenuItem
                    key="inquiry"
                    onClick={handleMenuClose}
                    component={Link}
                    to="/inquiry"
                  >
                    1대1 문의
                  </MenuItem>,
                  isLogin() ? (
                    <>
                      <MenuItem
                        key="my"
                        onClick={[handleMenuClose]}
                        component={Link}
                        to="/my"
                      >
                        마이페이지
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleMenuClose();
                          handleLogout();
                        }}
                      >
                        로그아웃
                      </MenuItem>
                    </>
                  ) : (
                    <>
                      <MenuItem
                        key="signup"
                        onClick={handleMenuClose}
                        component={Link}
                        to="/signup"
                      >
                        회원가입
                      </MenuItem>
                      <MenuItem
                        key="login"
                        onClick={handleMenuClose}
                        component={Link}
                        to="/login"
                      >
                        로그인
                      </MenuItem>
                    </>
                  ),
                ]}
              </Menu>
            </Hidden>
          </div>

          {/* for web */}
          <Hidden mdDown>
            <Button
              color="inherit"
              component={Link}
              to="/report/list"
              style={{
                fontSize: "20px",
                color: "gray",
                fontWeight: "bold",
                marginLeft: "12px",
                marginRight: "12px",
              }}
            >
              신고하기
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/map"
              style={{
                fontSize: "20px",
                color: "gray",
                fontWeight: "bold",
                marginLeft: "12px",
                marginRight: "12px",
              }}
            >
              충전소 지도
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/fee"
              style={{
                fontSize: "20px",
                color: "gray",
                fontWeight: "bold",
                marginLeft: "12px",
                marginRight: "12px",
              }}
            >
              요금 정보
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/inquiry"
              style={{
                fontSize: "20px",
                color: "gray",
                fontWeight: "bold",
                marginLeft: "12px",
                marginRight: "12px",
              }}
            >
              1대1 문의
            </Button>
            {isLogin() ? (
              <>
                <Button
                  component={Link}
                  to="/my"
                  style={{
                    fontSize: "20px",
                    color: "gray",
                    fontWeight: "bold",
                    marginLeft: "12px",
                    marginRight: "12px",
                  }}
                >
                  마이페이지
                </Button>
                <Button
                  color="inherit"
                  onClick={handleLogout}
                  style={{
                    fontSize: "20px",
                    color: "gray",
                    fontWeight: "bold",
                    marginLeft: "12px",
                    marginRight: "12px",
                  }}
                >
                  로그아웃
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={Link}
                  to="/signup"
                  style={{
                    fontSize: "20px",
                    color: "gray",
                    fontWeight: "bold",
                    marginLeft: "12px",
                    marginRight: "12px",
                  }}
                >
                  회원가입
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/login"
                  style={{
                    fontSize: "20px",
                    color: "gray",
                    fontWeight: "bold",
                    marginLeft: "12px",
                  }}
                >
                  로그인
                </Button>
              </>
            )}
          </Hidden>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
