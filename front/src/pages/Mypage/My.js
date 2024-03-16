import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Button,
} from "@material-ui/core";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useAuth } from "../../utils/AuthContext";
import {
    HttpGet,
} from "../../services/HttpService";
import SettingsIcon from '@mui/icons-material/Settings';
const bull = (
    <Box
        component="span"
        sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
        •
    </Box>
);





function CardComponent({ username, nickname, createDate, profileImgUrl }) {
    let formattedDate = new Date(createDate).toISOString().split('T')[0];
    return (
        <React.Fragment>
            <CardContent>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{
                            width: '70px',
                            height: '70px',
                            overflow: 'hidden',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: '30%', // 여기에 원하는 border-radius 값을 적용합니다.
                            marginLeft: '-30px',
                        }}>
                            <img src={profileImgUrl ? profileImgUrl : "https://via.placeholder.com/80"} alt="프로필 이미지" style={{
                                minWidth: '100%',
                                height: 'auto',
                            }} />
                        </div>
                    </Grid>
                    {/* 세로 Divider 추가 */}
                    <Grid item xs={6}>
                        <Typography variant="h5" component="div">
                            {username}
                        </Typography>
                        <Typography variant="body2" style={{ marginTop: '5px' }}>
                            {nickname}
                        </Typography>
                        <Typography variant="body2">
                            가입일 : {formattedDate}
                        </Typography>
                    </Grid>
                    <Grid item xs={1}>
                    </Grid>
                    <Grid item xs={2}>
                        <CardActions>
                            <Button size="small" color="primary" style={{ marginLeft: '15px' }} component={Link} to="/edit">
                                <SettingsIcon />
                            </Button>
                        </CardActions>
                    </Grid>
                </Grid>
            </CardContent>
        </React.Fragment>
    );
}

function CardComponent2({ carModel, carInfo }) {
    if (carModel === null) {
        return (
            <Typography component="div" style={{ textAlign: 'center', margin: '40px' }}>
                아직 등록된 차량이 없어요.
                <br />
                아래 버튼을 눌러 등록해 보세요.
                <br />
                <br />
                <Button variant="outlined" color="Primary" component={Link} style={{ textAlign: 'center', margin: '10px' }}
                    to="/carInit" >
                    등록하기
                </Button>
            </Typography>
        );
    }
    return (
        <React.Fragment>
            <CardContent>
                <Grid container direction="column" spacing={2} alignItems="flex-start">
                    <Grid container direction="row" justifyContent="space-between" alignItems="center">

                        {/* 차종 이름 - 왼쪽 정렬 */}
                        <Grid item style={{ marginTop: '15px', marginLeft: '20px' }}>
                            <Typography variant="h5" component="div" style={{ textAlign: 'left' }}>
                                {carModel}
                            </Typography>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                {carInfo.manufacturer}
                            </Typography>
                        </Grid>

                        {/* 수정 버튼 - 오른쪽 정렬 */}
                        <Grid item>
                            <CardActions>
                                <Button size="small" color="primary" component={Link} to="/carInit">
                                    <SettingsIcon />
                                </Button>
                            </CardActions>
                        </Grid>
                    </Grid>

                    {/* 이미지 */}
                    <Grid item style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <img src="https://via.placeholder.com/600x200" alt="설명" style={{ width: '600px', height: '200px' }} />
                    </Grid>

                    <Grid container item spacing={2} justifyContent="center">
                        {/* 배터리 정보 (전체 넓이의 1/3) */}
                        <Grid item xs={4} align="center">
                            <Typography variant="body2" >
                                완속 충전
                            </Typography>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                방식 : {carInfo.chargeWaySlow}
                                <br />
                                시간 : {carInfo.chargeTimeSlow}
                            </Typography>
                        </Grid>

                        {/* 충전 방식 (전체 넓이의 1/3) */}
                        <Grid item xs={4} align="center">
                            <Typography variant="body2" >
                                급속 충전
                            </Typography>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                방식 : {carInfo.chargeWayFast}
                                <br />
                                시간 : {carInfo.chargeTimeFast}
                            </Typography>
                        </Grid>

                        {/* 충전기 타입 (전체 넓이의 1/3) */}
                        <Grid item xs={4} align="center">
                            <Typography variant="body2" >
                                배터리
                            </Typography>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                용량 : {carInfo.battery}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </React.Fragment>
    );
}



const card3 = (
    <React.Fragment>
        <CardContent>
            <Grid container item spacing={2} justifyContent="center">
                {/* 배터리 정보 (전체 넓이의 1/3) */}
                <Grid item xs={4} align="center">
                    <Typography variant="body2" >
                        내찜목록
                    </Typography>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        100
                    </Typography>
                </Grid>

                {/* 충전 방식 (전체 넓이의 1/3) */}
                <Grid item xs={4} align="center">
                    <Typography variant="body2" >
                        최근 조회 충전소
                    </Typography>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        100
                    </Typography>
                </Grid>

                {/* 충전기 타입 (전체 넓이의 1/3) */}
                <Grid item xs={4} align="center">
                    <Typography variant="body2" >
                        내 리뷰 목록
                    </Typography>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        100
                    </Typography>
                </Grid>
            </Grid>

        </CardContent>
    </React.Fragment>
);

const My = () => {
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const { getUserName, getUserNickname } = useAuth();
    const navigate = useNavigate();
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const [user, setUser] = useState(null);

    const [car, setCar] = useState(null);
    const [createDate, setCreateDate] = useState(null);
    const [profileImgUrl, setProfileImgUrl] = useState(null);
    const [carInfo, setCarInfo] = useState({});

    useEffect(() => {
        const sessionUsername = sessionStorage.getItem("username");
        if (sessionUsername === null || sessionUsername === undefined || sessionUsername === "") {
            alert("로그인이 필요한 서비스입니다.");
            navigate("/login");
            return
        }

        HttpGet("/api/v1/members/me")
            .then((data) => {
                if (data) {
                    setUser(data);
                    setCar(data.data.item.carModel)
                    setCreateDate(data.data.item.createDate)
                    setProfileImgUrl(data.data.item.profileImgUrl)
                    console.log('car ' + data.data.item.car)
                    console.log('cd ' + createDate)
                    console.log('p ' + profileImgUrl)
                }
            });




        const fetchCarInfo = async () => {

        };
        fetchCarInfo();

        console.log('car2 ' + car)

    }, []);

    useEffect(() => {

        if (car) {
            HttpGet("/api/v1/car/carInfo", {
                carModel: car // 사용자 이름 설정
            }).then((data2) => {
                if (data2) {
                    setCarInfo(data2);
                    console.log("m " + data2.manufacturer)
                }
            })
        }

    }, [user]);




    return (
        <div className={classes.root}>
            <h3>마이페이지</h3>

            <Box sx={{ minWidth: 700 }}>
                <Card variant="outlined" sx={{ border: 1.5 }}>
                    <CardComponent username={getUserName()} nickname={getUserNickname()} createDate={createDate} profileImgUrl={profileImgUrl} />
                </Card>
            </Box>
            <br />
            <Box sx={{ minWidth: 700 }}>
                <Card variant="outlined" sx={{ border: 1.5 }}>
                    <CardComponent2 carModel={car} carInfo={carInfo} />
                </Card>
            </Box>
            <br />
            <Box sx={{ minWidth: 700 }}>
                <Card variant="outlined" sx={{ border: 1.5 }}>{card3}</Card>
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
