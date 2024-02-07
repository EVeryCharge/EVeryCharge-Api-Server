import React, { useEffect, useState } from 'react';
import { HttpGet } from '../../services/HttpService';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    type: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    content: {
        fontSize: 16,
        color: '#333',
        marginBottom: 20,
        whiteSpace: 'pre-line',
    },
    writer: {
        fontSize: 14,
        color: '#999',
    },
});

const InquiryDetail = ({  }) => {
    const [inquiry, setInquiry] = useState({});
    const {id} = useParams();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const url = `/api/v1/inquiry/${id}`;
            console.log(url);
            const response = await HttpGet(
                `/api/v1/inquiry/${id}`              
                );
                console.log("전송확인");
                console.log("fetch data 확인", response);
                setInquiry(response);
        } catch (error) {
            console.error("에러: ", error);
        }
    }

    const classes = useStyles();

    return (
        <Card>
            <CardContent>
                <Typography className={classes.type}>
                    문의 유형 : {inquiry.inquiryType}
                </Typography>
                <Typography className={classes.title} component="h2">
                    제목 : {inquiry.title}
                </Typography>
                <Typography className={classes.content} component="p">
                    내용 : {inquiry.content}
                </Typography>
                <Typography className={classes.writer} align="right">
                    작성자 : {inquiry.writer}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default InquiryDetail;