import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    Button,
} from "@material-ui/core";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

const bull = (
    <Box
        component="span"
        sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
        •
    </Box>
);

const card = (
    <React.Fragment>
        <CardContent>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={3} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img src="https://via.placeholder.com/80" alt="설명" style={{ width: '80px', height: '80px', marginLeft: '-30px', }} />
                </Grid>
                {/* 세로 Divider 추가 */}
                <Grid item xs={6}>

                    <Typography variant="h5" component="div">
                        크크루삥뽕
                    </Typography>

                    <Typography variant="body2" style={{ marginTop: '5px' }}>
                        임지원
                    </Typography>

                    <Typography variant="body2">
                        dlark0210@naver.com
                    </Typography>

                </Grid>

                <Grid item xs={2}>
                    <CardActions>
                        <Button size="small">수정하기</Button>
                    </CardActions>
                </Grid>
            </Grid>
        </CardContent>
    </React.Fragment>
);

const card2 = (
    <React.Fragment>
        <CardContent>
            <Grid container direction="column" spacing={2} alignItems="flex-start">

                {/* 차종 이름 - 왼쪽 정렬 */}
                <Grid item style={{ alignSelf: 'flex-start' }}>
                    <Typography variant="h5" component="div" style={{ textAlign: 'left' }}>
                        차종이름
                    </Typography>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        브랜드
                    </Typography>
                </Grid>

                {/* 이미지 */}
                <Grid item style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <img src="https://via.placeholder.com/600x200" alt="설명" style={{ width: '600px', height: '200px' }} />
                </Grid>

                <Grid container item spacing={2} justifyContent="center">
                    {/* 배터리 정보 (전체 넓이의 1/3) */}
                    <Grid item xs={4} align="center">
                        <Typography variant="body2" >
                            배터리
                        </Typography>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            100
                        </Typography>
                    </Grid>

                    {/* 충전 방식 (전체 넓이의 1/3) */}
                    <Grid item xs={4} align="center">
                        <Typography variant="body2" >
                            충전방식
                        </Typography>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            100
                        </Typography>
                    </Grid>

                    {/* 충전기 타입 (전체 넓이의 1/3) */}
                    <Grid item xs={4} align="center">
                        <Typography variant="body2" >
                            충전기 타입
                        </Typography>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            100
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </CardContent>
    </React.Fragment>
);

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

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <h3>마이페이지</h3>

            <Box sx={{ minWidth: 700 }}>
                <Card variant="outlined" sx={{ border: 1.5 }}>{card}</Card>
            </Box>
            <br />
            <Box sx={{ minWidth: 700 }}>
                <Card variant="outlined" sx={{ border: 1.5 }}>{card2}</Card>
            </Box>
            <br />
            <Box sx={{ minWidth: 700 }}>
                <Card variant="outlined" sx={{ border: 1.5 }}>{card3}</Card>
            </Box>

            <Button variant="outlined" color="secondary" component={Link}
                to="/carInit" >
                내 차 등록
            </Button>

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
