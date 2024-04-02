import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@material-ui/core";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useAuth } from "../../utils/AuthContext";
import { HttpGet } from "../../services/HttpService";
import SettingsIcon from "@mui/icons-material/Settings";
const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

function CardComponent({ username, nickname, createDate, profileImgUrl }) {
  let formattedDate = new Date(createDate).toISOString().split("T")[0];
  return (
    <React.Fragment>
      <CardContent>
        <Grid container direction="column" alignItems="center" spacing={2}>
          {/* 프로필 이미지 */}
          <Grid item>
            <div
              style={{
                width: "100px",
                height: "100px",
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "30%",
              }}
            >
              <img
                src={
                  profileImgUrl
                    ? profileImgUrl
                    : "https://via.placeholder.com/80"
                }
                alt="프로필 이미지"
                style={{
                  minWidth: "100%",
                  height: "auto",
                }}
              />
            </div>
          </Grid>

          {/* 이미지 변경 버튼 */}
          <Grid item>
            <Button size="small" color="primary" component={Link} to="/edit">
              이미지 변경
            </Button>
          </Grid>
        </Grid>

        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid>
            <div style={{ width: "200px" }}>
              <br />

              <Typography variant="h5" component="div">
                ID :{username}
              </Typography>
              <Typography variant="body2" style={{ marginTop: "5px" }}>
                닉네임 : {nickname}
              </Typography>
              <br />
              <Typography variant="body2">새 비밀번호</Typography>
              <Typography variant="body2">비밀번호 확인</Typography>

              <Typography variant="body2">확인 버튼</Typography>

              <br />
              <Typography variant="body2">수정</Typography>
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </React.Fragment>
  );
}

const My = () => {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const { getUserName, getUserNickname } = useAuth();
  const navigate = useNavigate();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [user, setUser] = useState(null);

  const [createDate, setCreateDate] = useState(null);
  const [profileImgUrl, setProfileImgUrl] = useState(null);

  useEffect(() => {
    const sessionUsername = sessionStorage.getItem("username");
    if (
      sessionUsername === null ||
      sessionUsername === undefined ||
      sessionUsername === ""
    ) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return;
    }

    HttpGet("/api/v1/members/me").then((data) => {
      if (data) {
        setUser(data);
        setCreateDate(data.data.item.createDate);
        setProfileImgUrl(data.data.item.profileImgUrl);
        // console.log("r")
        // console.log('cd ' + createDate)
        // console.log('p ' + profileImgUrl)
      }
    });

    const fetchCarInfo = async () => {};
    fetchCarInfo();
  }, []);

  return (
    <div className={classes.root}>
      <h3>회원정보수정</h3>

      <Box sx={{ minWidth: 700 }}>
        <Card variant="outlined" sx={{ border: 1.5 }}>
          <CardComponent
            username={getUserName()}
            nickname={getUserNickname()}
            createDate={createDate}
            profileImgUrl={profileImgUrl}
          />
        </Card>
      </Box>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100vh",
  },
  callout: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "20px 0",
    padding: "10px",
    backgroundColor: "#f2f2f2",
    borderRadius: "5px",
  },
  disclaimer: {
    textAlign: "right",
    fontSize: "0.8rem",
    color: "#666",
    marginTop: "5px",
  },
  tabContainer: {
    marginTop: "20px",
    flexGrow: 1,
    width: "70%",
  },
}));

export default My;
