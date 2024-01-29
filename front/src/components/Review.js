import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, makeStyles, TextField, Button, Grid } from '@material-ui/core';


const useStyles = makeStyles({
  reviewContainer: {
    marginTop: '20px',
    borderBottom: '1px solid #ddd',
  },
  reviewItem: {
    padding: '10px',
    borderTop: '1px solid #ddd',
    display: 'flex',
    flexDirection: 'column',  // 추가: 컨텐츠와 작성일자를 세로로 나열
  },
  content: {
    fontSize: '1rem',
    marginBottom: '8px',
    whiteSpace: 'pre-line',  // 추가: 공백과 줄 바꿈 유지
  },
  createDate: {
    fontSize: '0.8rem',
    color: '#777',
    marginTop: '4px',
    alignSelf: 'flex-end',  // 추가: 작성일자를 우측으로 정렬
  },
  textField: {
    width: '100%',
    marginBottom: '10px',  // 추가: 여백 추가
  },
  deleteButton: {
    fontSize: '0.8rem',  // 버튼의 글꼴 크기를 작게 조절합니다.
    padding: '4px 8px',  // 버튼의 패딩을 작게 조절합니다.
    marginLeft: 'auto',   // 우측 정렬을 위해 marginLeft: 'auto' 추가
  },
});

const Review = ({ chargingStationId }) => {
  const classes = useStyles();
  const [review, setReview] = useState({ data: { items: [] } });
  const [newReviewContent, setNewReviewContent] = useState('');

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
              <Button
                variant="outlined"
                color="secondary"
                className={classes.deleteButton}
                onClick={() => handleDelete(reviewItem.id)}
              >
                삭제
              </Button>
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