import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, makeStyles, TextField, Button } from '@material-ui/core';

const useStyles = makeStyles({
  reviewContainer: {
    marginTop: '20px',
    borderBottom: '1px solid #ddd',
  },
  reviewItem: {
    padding: '10px',
    borderTop: '1px solid #ddd',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    fontSize: '1rem',
    marginBottom: '8px',
    whiteSpace: 'pre-line',
  },
  createDate: {
    fontSize: '0.8rem',
    color: '#777',
    marginTop: '4px',
    alignSelf: 'flex-end',
  },
  textField: {
    width: '100%',
    marginBottom: '10px',
  },
  deleteButton: {
    fontSize: '0.8rem',
    padding: '4px 8px',
    marginLeft: 'auto',
    marginTop: 0,
  },
});

const Review = ({ chargingStationId }) => {
  const classes = useStyles();
  const [review, setReview] = useState({ data: { items: [] } });
  const [newReviewContent, setNewReviewContent] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchData();
    fetchUserId();
  }, [chargingStationId]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/v1/review/${chargingStationId}`);
      setReview(response.data || { data: { items: [] } });
    } catch (error) {
      console.error("데이터를 불러오는 중 오류 발생:", error);
    }
  };

  const fetchUserId = async () => {
    try {
      const userResponse = await axios.get(`/api/v1/members/me`);
      const userIdFromApi = userResponse.data.data.item.id;
      setUserId(userIdFromApi);
    } catch (error) {
      console.error("유저 정보를 불러오는 중 오류 발생:", error);
    }
  };

  const isLoggedIn = !!sessionStorage.getItem("username");

  const handleSubmit = async () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      await axios.post(`/api/v1/review/${chargingStationId}`, {
        content: newReviewContent,
      });

      fetchData();
      setNewReviewContent('');
    } catch (error) {
      console.error("후기를 작성하는 중 오류 발생:", error);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('삭제하시겠습니까?')) {
      return;
    }

    try {
      await axios.delete(`/api/v1/review/${chargingStationId}/${reviewId}`);
      fetchData();
    } catch (error) {
      console.error("후기를 삭제하는 중 오류 발생:", error);
    }
  };

  return (
    <div className={classes.reviewContainer}>
      <Typography variant="h5">{chargingStationId} 이용후기</Typography>
      <div className={classes.reviewItem}>
        <TextField
          label={Array.isArray(review.data.items) && review.data.items.length === 0
            ? "첫 후기를 작성해 보세요."
            : "후기 작성"
          }
          variant="outlined"
          multiline
          rows={3}
          value={newReviewContent}
          onChange={(e) => setNewReviewContent(e.target.value)}
          className={classes.textField}
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          작성
        </Button>
      </div>
      {Array.isArray(review.data.items) && review.data.items.length > 0 ? (
        review.data.items.map((reviewItem) => (
          <div key={reviewItem.id} className={classes.reviewItem}>
            <Typography variant="body2" className={classes.content}>
              {reviewItem.content || "내용이 없습니다."}
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              {userId === reviewItem.userId && (
                <Button
                  variant="outlined"
                  color="secondary"
                  className={classes.deleteButton}
                  onClick={() => handleDelete(reviewItem.id)}
                >
                  삭제
                </Button>
              )}
            </div>
            <Typography variant="caption" className={classes.createDate}>
              작성일자: {new Date(reviewItem.createDate).toLocaleDateString()}
            </Typography>
          </div>
        ))
      ) : null}
    </div>
  );
};

export default Review;
