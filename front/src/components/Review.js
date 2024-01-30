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
    alignItems: 'flex-start',
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
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  textField: {
    width: '100%',
    marginBottom: '10px',
  },
  deleteButton: {
    fontSize: '0.5rem',
    marginTop: '8px',
  },
});

const Review = ({ chargingStationId }) => {
  const classes = useStyles();
  const [review, setReview] = useState({ data: { items: [] } });
  const [newReviewContent, setNewReviewContent] = useState('');
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 새로운 상태 추가
  const [isEditing, setIsEditing] = useState(false);
  const [editedReviewContent, setEditedReviewContent] = useState('');
  const [editingReviewId, setEditingReviewId] = useState(null); // 수정 중인 리뷰 아이템의 ID

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
      const { id: userIdFromApi, username } = userResponse.data.data.item;
      setUserId(userIdFromApi);
      setUserName(username);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("유저 정보를 불러오는 중 오류 발생:", error);
      setUserId(null);
      setIsLoggedIn(false);
    }
  };

  const handleSubmit = async () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!newReviewContent.trim()) {
      alert("후기 내용을 입력해주세요.");
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

  const handleDelete = async (reviewId, reviewUserId) => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (userId !== reviewUserId) {
      alert("자신이 작성한 후기만 삭제할 수 있습니다.");
      return;
    }

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

  // 새로운 함수 추가
  const handleEdit = (reviewId, content) => {
    setEditedReviewContent(content);
    setIsEditing(true);
    setEditingReviewId(reviewId);
  };

  // 새로운 함수 추가
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedReviewContent('');
    setEditingReviewId(null);
  };

  // 새로운 함수 추가
  const handleUpdate = async () => {
    if (!editedReviewContent || !editedReviewContent.trim()) {
      alert("후기 내용을 입력해주세요.");
      return;
    }

    try {
      // 수정 중인 리뷰 아이템의 ID를 사용하여 수정 요청
      await axios.put(`/api/v1/review/${chargingStationId}/${editingReviewId}`, {
        content: editedReviewContent,
      });

      console.log("후기 수정 성공");
      fetchData();
      setIsEditing(false);
      setEditedReviewContent('');
      setEditingReviewId(null);
    } catch (error) {
      console.error("후기를 수정하는 중 오류 발생:", error);
    }
  };

  return (
    <div className={classes.reviewContainer}>
      <Typography variant="h5">{chargingStationId} 이용후기</Typography>
      <div className={classes.reviewItem}>
        {isEditing ? (
          <>
            <TextField
              label="후기 수정"
              variant="outlined"
              multiline
              minRows={3}
              value={editedReviewContent}
              onChange={(e) => setEditedReviewContent(e.target.value)}
              className={classes.textField}
            />
            <Button variant="contained" color="primary" onClick={handleUpdate}>
              수정 완료
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCancelEdit}>
              취소
            </Button>
          </>
        ) : (
          <>
            <TextField
              label={Array.isArray(review.data.items) && review.data.items.length === 0
                ? "첫 후기를 작성해 보세요."
                : "후기 작성"
              }
              variant="outlined"
              multiline
              minRows={3}
              value={newReviewContent}
              onChange={(e) => setNewReviewContent(e.target.value)}
              className={classes.textField}
            />
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              작성
            </Button>
          </>
        )}
      </div>
      {Array.isArray(review.data.items) && review.data.items.length > 0 ? (
        review.data.items.map((reviewItem) => (
          <div key={reviewItem.id} className={classes.reviewItem}>
            <Typography variant="body2" className={classes.content}>
              {reviewItem.content || "내용이 없습니다."}
            </Typography>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <div>
                작성자: Member ID: {reviewItem.userId}
              </div>
              <div className={classes.createDate}>
                작성일자: {new Date(reviewItem.createDate).toLocaleDateString()}
              </div>
            </div>
            {isLoggedIn && userId === reviewItem.userId && (
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.deleteButton}
                  onClick={() => handleEdit(reviewItem.id, reviewItem.content)}
                >
                  수정
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  className={classes.deleteButton}
                  onClick={() => handleDelete(reviewItem.id, userId)}
                >
                  삭제
                </Button>
              </>
            )}
          </div>
        ))
      ) : null}
    </div>
  );
};

export default Review;
