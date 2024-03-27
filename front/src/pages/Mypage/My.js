import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import CarInit from "./CarInit";
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
    HttpGet, HttpPut, HttpDelete
} from "../../services/HttpService";
import SettingsIcon from '@mui/icons-material/Settings';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import StarIcon from '@mui/icons-material/Star';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import ArticleIcon from '@mui/icons-material/Article';
import {
    Help,
} from "@material-ui/icons";
import {
    Tooltip,
} from "@material-ui/core";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { TextField } from '@material-ui/core';
import HyundaiLoginButton from "../Login/HyundaiLoginButton";

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Cookies from "js-cookie";


function CardComponent({ username, nickname, createDate, profileImgUrl }) {
    const [editing, setEditing] = useState(false);
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPassword2, setNewPassword2] = useState('');
    const [newNickname, setNewNickname] = useState('');
    const { setLogout } = useAuth();
    const navigate = useNavigate();
    let formattedDate = new Date(createDate).toISOString().split('T')[0];

    const handleEditClick = () => {
        setEditing(true);
    };
    const handleSaveClick = async () => {
        if (newPassword !== newPassword2) {
            alert('새 비밀번호가 일치하지 않습니다.');
            return;
        }
        try {
            const response = await HttpPut(`api/v1/members/edit`, {
                username: username,
                password: password,
                nickname: newNickname,
                newPassword: newPassword
            });
        } catch (error) {
            if (error.response.data.resultCode === "400-2") {
                alert("비밀번호가 일치하지 않습니다.");
            }
            console.error("Login failed:", error.response.data);
            console.error("후기를 수정하는 중 오류 발생:", error);
            return
        }
        setEditing(false);
        setLogout();
        navigate("/");
    };

    const handleNewPasswordChange = (event) => {
        setNewPassword(event.target.value);
    };

    const handleNewPassword2Change = (event) => {
        setNewPassword2(event.target.value);
    };

    return (
        <React.Fragment>
            <CardContent>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} sm={3} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>                        {/* 프로필 이미지 */}
                        <div style={{
                            width: '70px',
                            height: '70px',
                            overflow: 'hidden',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: '30%',
                            marginLeft: '-30px',
                        }}>
                            <img src={profileImgUrl ? profileImgUrl : "https://via.placeholder.com/80"} alt="프로필 이미지" style={{
                                minWidth: '100%',
                                height: 'auto',
                            }} />
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'center' }}>
                        <Grid container direction="column" spacing={2} alignItems="center">
                            {editing ? (
                                <React.Fragment>
                                    <Grid item>
                                        <TextField
                                            label="새로운 닉네임"
                                            value={newNickname}
                                            onChange={(event) => setNewNickname(event.target.value)}
                                            fullWidth
                                            margin="normal"
                                            variant="outlined"
                                            size="small"
                                            style={{ width: "100%" }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            label="기존 비밀번호"
                                            type="password"
                                            value={password}
                                            onChange={(event) => setPassword(event.target.value)}
                                            fullWidth
                                            margin="normal"
                                            variant="outlined"
                                            size="small"
                                            style={{ width: "100%" }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            label="새 비밀번호"
                                            type="password"
                                            value={newPassword}
                                            onChange={handleNewPasswordChange}
                                            fullWidth
                                            margin="normal"
                                            variant="outlined"
                                            size="small"
                                            style={{ width: "100%" }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            label="새 비밀번호 확인"
                                            type="password"
                                            value={newPassword2}
                                            onChange={handleNewPassword2Change}
                                            fullWidth
                                            margin="normal"
                                            variant="outlined"
                                            size="small"
                                            style={{ width: "100%" }}
                                        />
                                    </Grid>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <Typography variant="h5" component="div">
                                        {nickname}
                                    </Typography>
                                    <Typography variant="body2" style={{ marginTop: '5px' }}>
                                        {username}
                                    </Typography>
                                    <Typography variant="body2">
                                        가입일 : {formattedDate}
                                    </Typography>
                                </React.Fragment>
                            )}
                        </Grid>
                    </Grid>

                    <Grid item xs={12} sm={2} container justifyContent="center">
                        <CardActions>
                            {editing ? (
                                <Grid container direction="column" spacing={4}>
                                    <Grid item>
                                        <Button size="small" color="primary" onClick={handleSaveClick}>
                                            Save
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button size="small" color="default" onClick={() => setEditing(false)}>
                                            Cancel
                                        </Button>
                                    </Grid>
                                </Grid>
                            ) : (
                                <Button size="small" color="primary" onClick={handleEditClick}>
                                    <ModeEditIcon />
                                </Button>
                            )}
                        </CardActions>
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
                    <Typography variant="body2" style={{ fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <StarIcon />
                        즐겨찾기
                    </Typography>
                    <Tooltip
                        placement="right-start"
                        title="추후에 제공될 예정입니다."
                    >
                        <Help style={{ color: "grey", fontSize: "20" }} />
                    </Tooltip>
                </Grid>

                {/* 충전 방식 (전체 넓이의 1/3) */}
                <Grid item xs={4} align="center">
                    <Typography variant="body2" style={{ fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FindInPageIcon />
                        최근 조회 충전소
                    </Typography>
                    <Tooltip
                        placement="right-start"
                        title="추후에 제공될 예정입니다."
                    >
                        <Help style={{ color: "grey", fontSize: "20" }} />
                    </Tooltip>
                </Grid>

                {/* 충전기 타입 (전체 넓이의 1/3) */}
                <Grid item xs={4} align="center">
                    <Typography variant="body2" style={{ fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ArticleIcon />
                        내 리뷰 목록
                    </Typography>
                    <Tooltip
                        placement="right-start"
                        title="추후에 제공될 예정입니다."
                    >
                        <Help style={{ color: "grey", fontSize: "20" }} />
                    </Tooltip>
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

    const [isOpen, setIsOpen] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [batteryData, setBatteryData] = useState(null);

    const [showCard, setShowCard] = useState(false);

    const handleBatteryClick = () => {
        HttpGet("/api/v1/members/HDBattery").then((data) => {
            if (data) {
                console.log("bbb" + data);
                setBatteryData(data); // 받은 데이터를 상태에 저장
            }
        });
    };
    const handleModal = () => {
        // 모달을 닫고, 선택된 충전소 ID를 설정한 후 다시 모달을 열기
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setRefresh(!refresh)
    };

    const handleDeletelick = () => {
        HttpDelete("/api/v1/members/carDelete", {
            username: getUserName()
        }).then((response) => {
            window.location.reload();
        });

    };

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

        console.log('car2 ' + car)

        // 쿠키에서 HDAccess 및 HDCarId 값을 가져옴
        const hdAccess = Cookies.get("HDAccess");
        const hdCarId = Cookies.get("HDCarId");

        // HDAccess와 HDCarId가 모두 있는 경우에만 카드를 표시
        if (hdAccess && hdCarId) {
            setShowCard(true);
        } else {
            setShowCard(false);
        }

    }, []);

    useEffect(() => {
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
    }, [refresh]);

    useEffect(() => {

        if (car) {
            HttpGet("/api/v1/car/carInfo", {
                carModel: car // 사용자 이름 설정
            }).then((data2) => {
                if (data2) {
                    setCarInfo(data2);
                    console.log("m " + data2.imgUrl)
                }
            }).catch(error => {
                // 요청이 실패한 경우 여기에 도달합니다.
                HttpDelete("/api/v1/members/carDelete", {
                    username: getUserName()
                }).then((response) => {
                    window.location.reload();
                });
                console.error("Failed to fetch car info:", car);
                alert(car + " 정보를 가져오는 동안 오류가 발생했습니다. 다시 시도해주세요.");
                setCar(null)


            });
        }

    }, [user]);
    return (
        <div className={classes.root}>
            <h3>마이페이지</h3>

            <Grid container justifyContent="center">
                <Grid item xs={12} sm={10} md={8} lg={6} xl={4}>
                    <Box sx={{ minWidth: 400 }}>
                        <Card variant="outlined" sx={{ border: 1.5 }}>
                            <CardComponent username={getUserName()} nickname={getUserNickname()} createDate={createDate} profileImgUrl={profileImgUrl} />
                        </Card>
                    </Box>
                </Grid>
            </Grid>
            <br />
            <Grid container justifyContent="center">
                <Grid item xs={12} sm={10} md={8} lg={6} xl={4}>
                    <Box sx={{ minWidth: 400 }}>
                        <Card variant="outlined" sx={{ border: 1.5 }}>
                            {car === null ? (
                                <Typography component="div" style={{ textAlign: 'center', margin: '40px' }}>
                                    아직 등록된 차량이 없어요.
                                    <br />
                                    아래 버튼을 눌러 등록해 보세요.
                                    <br />
                                    <br />
                                    <Button variant="outlined" color="Primary" onClick={() => handleModal()} >
                                        등록하기
                                    </Button>
                                    <br />
                                    <HyundaiLoginButton />
                                    <CarInit
                                        isOpen={isOpen}
                                        onRequestClose={closeModal}
                                    />
                                </Typography>
                            ) :
                                (
                                    <React.Fragment>
                                        <CardContent>
                                            <Grid container direction="column" spacing={2} alignItems="flex-start">
                                                <Grid container direction="row" justifyContent="space-between" alignItems="center">

                                                    {/* 차종 이름 - 왼쪽 정렬 */}
                                                    <Grid item style={{ marginTop: '15px', marginLeft: '20px' }}>
                                                        <Typography variant="h5" component="div" style={{ textAlign: 'left' }}>
                                                            {car}
                                                        </Typography>
                                                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                            {carInfo.manufacturer}
                                                        </Typography>
                                                    </Grid>

                                                    {/* 수정 버튼 - 오른쪽 정렬 */}
                                                    <Grid item>
                                                        <CardActions>
                                                            <Button size="small" color="primary" onClick={() => handleModal()}>
                                                                <SettingsIcon />
                                                            </Button>
                                                            <Button size="small" color="primary" onClick={() => handleDeletelick()}>
                                                                <DeleteForeverIcon />
                                                            </Button>
                                                            <CarInit
                                                                isOpen={isOpen}
                                                                onRequestClose={closeModal}
                                                            />
                                                        </CardActions>
                                                    </Grid>
                                                </Grid>

                                                {/* 이미지 */}
                                                <Grid item style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                                    <img src={carInfo.imgUrl} alt="No image" style={{ width: 'auto', height: '200px' }} />
                                                </Grid>
                                                <br />

                                                <Grid container item spacing={2} justifyContent="center">
                                                    {/* 배터리 정보 (전체 넓이의 1/3) */}
                                                    <Grid item xs={4} align="center">
                                                        <Typography variant="body2" style={{ fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <ElectricalServicesIcon />

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
                                                        <Typography variant="body2" style={{ fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <ElectricalServicesIcon />
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
                                                        <Typography variant="body2" style={{ fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <BatteryChargingFullIcon />
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
                                )}
                        </Card>

                    </Box>
                </Grid>
            </Grid>
            <br />
            {showCard ? (
                <Grid container justifyContent="center">
                    <Grid item xs={12} sm={10} md={8} lg={6} xl={4}>
                        <Box sx={{ minWidth: 400, marginBottom: 2 }}>
                            <Card variant="outlined" sx={{ border: 1.5 }}>
                                <React.Fragment>
                                    <CardContent>
                                        <Grid container spacing={3} justifyContent="center" alignItems="center">
                                            <Grid item xs={12} sm={3} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>                        {/* 프로필 이미지 */}
                                                <Button size="small" color="primary" onClick={handleBatteryClick}>
                                                    내 배터리 확인
                                                </Button>
                                                {/* 상태에 저장된 데이터가 있으면 표시 */}
                                                {batteryData && (
                                                    <span>: {batteryData} %</span>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </React.Fragment>
                            </Card>
                        </Box>
                    </Grid>
                </Grid>
            ) : null}
            <Grid container justifyContent="center">
                <Grid item xs={12} sm={10} md={8} lg={6} xl={4}>
                    <Box sx={{ minWidth: 380 }}>
                        <Card variant="outlined" sx={{ border: 1.5 }}>{card3}</Card>
                    </Box>

                </Grid>
            </Grid>
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
