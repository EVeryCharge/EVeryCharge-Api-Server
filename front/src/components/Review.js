import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  reviewContainer: {
    marginTop: '20px',
    borderBottom: '1px solid #ddd',
  },
  reviewItem: {
    padding: '10px',
    borderTop: '1px solid #ddd',
  },
  content: {
    fontSize: '1rem',
    marginBottom: '8px',
  },
  createDate: {
    fontSize: '0.8rem',
    color: '#777',
    marginTop: '4px',
  },
  createDateWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
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
      console.error("데이터를 불러오는 중 오류 발생:", error);
    }
  }

  return (
    <div className={classes.reviewContainer}>
      <Typography variant="h5">{chargingStationId} 이용후기</Typography>
      {Array.isArray(review.data.items) && review.data.items.length > 0 ? (
        review.data.items.map((reviewItem) => (
          <div key={reviewItem.id} className={classes.reviewItem}>
            <div>
              <Typography variant="body2" className={classes.content}>
                {reviewItem.content || "내용이 없습니다."}
              </Typography>
            </div>
            <div className={classes.createDateWrapper}>
              <Typography variant="caption" className={classes.createDate}>
                작성일자: {new Date(reviewItem.createDate).toLocaleDateString()}
              </Typography>
            </div>
          </div>
        ))
      ) : (
        <div>
          <Typography variant="body2">
            이용 후기가 없습니다. 후기를 작성해 보세요.
          </Typography>
        </div>
      )}
    </div>
  );
};

export default Review;
