import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Card, CardContent, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  reviewContainer: {
    marginTop: '20px',
  },
  reviewItem: {
    display: 'flex',
    flexDirection: 'column',
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
  content: {
    fontSize: '1.2rem',
    marginBottom: '8px',
  },
  createDate: {
    fontSize: '1.22rem',
    color: '#777',
    marginTop: '4px',
  },
});



const Review = ({ chargingStationId }) => {
  const classes = useStyles();
  const [review, setReview] = useState({ data: { items: [] } });

  useEffect(() => {
    fetchData();
  }, [chargingStationId]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/v1/review/${chargingStationId}`);
      setReview(response.data || { data: { items: [] } });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <div className={classes.reviewContainer}>
      <Typography variant="h5">이용후기</Typography>
      {Array.isArray(review.data.items) && review.data.items.length > 0 ? (
        review.data.items.map((reviewItem) => (
          <Card key={reviewItem.id} className={classes.reviewItem}>
            <CardContent>
              <Typography variant="body2" className={classes.content}>
                {reviewItem.content || "No content available"}
              </Typography>
              <Typography variant="caption" className={classes.createDate}>
                작성일자: {new Date(reviewItem.createDate).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <div>
          <Typography variant="body2">
            충전소 정보를 찾을 수 없습니다.
          </Typography>
        </div>
      )}
    </div>
  );
};

export default Review;