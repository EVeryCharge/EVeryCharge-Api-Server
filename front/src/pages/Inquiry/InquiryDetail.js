import React, { useEffect, useState } from 'react';
import { HttpGet } from '../../services/HttpService';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography } from '@material-ui/core';

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

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2">
                    {inquiry.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    {inquiry.content}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    {inquiry.inquiryType}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                    {inquiry.writer}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default InquiryDetail;