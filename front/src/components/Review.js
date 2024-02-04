import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, makeStyles, TextField, Button, Select, MenuItem } from '@material-ui/core';


const useStyles = makeStyles({
  reviewContainer: {
    marginTop: '2px',
    borderBottom: '1px solid #ddd',
  },
  reviewItem: {
    padding: '1px',
    borderBottom: '1px solid #ddd',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  content: {
    fontSize: '1rem',
    marginTop: '5px',
    whiteSpace: 'pre-line',
  },
  author: {
    fontSize: '0.6rem',
    color: '#777',
    marginTop: '1px',
    display: 'flex',
    justifyContent: 'flex-start',
    width: '100%',
  },
  createDate: {
    fontSize: '0.6rem',
    color: '#777',
    marginTop: '1px',
    marginLeft: '10px',
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
  },
  textField: {
    width: '100%',
    marginBottom: '10px',
  },
  Button: {
    fontSize: '0.5rem',

  },

});

const Review = ({ chargingStationId }) => {
  const classes = useStyles();
  const [review, setReview] = useState({ data: { items: [] } });
  const [newReviewContent, setNewReviewContent] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editReviewId, setEditReviewId] = useState(null);
  const [editedReviewContent, setEditedReviewContent] = useState('');
  const [visibleReviews, setVisibleReviews] = useState(5); // Number of reviews to initially display

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
        rating: newReviewRating,
      });

      fetchData();
      setNewReviewContent('');
      setNewReviewRating(0);
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

  const handleEdit = (reviewId, content) => {
    setIsEditing(true);
    setEditReviewId(reviewId);
    setEditedReviewContent(content);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditReviewId(null);
    setEditedReviewContent('');
  };

  const [editedReviewRating, setEditedReviewRating] = useState(0);



  const handleUpdate = async (reviewId) => {
    if (!editedReviewContent || !editedReviewContent.trim()) {
      alert("후기 내용을 입력해주세요.");
      return;
    }

    try {
      await axios.put(`/api/v1/review/${chargingStationId}/${reviewId}`, {
        content: editedReviewContent,
        rating: editedReviewRating, // 수정된 평점 사용
      });

      console.log("후기 수정 성공");
      fetchData();
      setIsEditing(false);
      setEditReviewId(null);
      setEditedReviewContent('');
      setEditedReviewRating(0); // 수정 후 초기화
    } catch (error) {
      console.error("후기를 수정하는 중 오류 발생:", error);
    }
  };

  const handleMoreReviews = () => {
    setVisibleReviews((prev) => prev + 5); // Show the next 5 reviews
  };

  return (
    <div className={classes.reviewContainer}>
      <Typography variant="h5">이용후기</Typography>
      <div className={classes.reviewItem}>
        <TextField
          label={Array.isArray(review.data.items) && review.data.items.length === 0
            ? "첫 후기를 작성해 보세요."
            : "후기 작성"
          }
          variant="outlined"
          multiline
          minRows={1}
          value={newReviewContent}
          onChange={(e) => setNewReviewContent(e.target.value)}
          className={classes.textField}
        />
        <Select
          label="평점"
          variant="outlined"
          value={newReviewRating}
          onChange={(e) => setNewReviewRating(e.target.value)}
          className={classes.textField}
        >
          {[0, 1, 2, 3, 4, 5].map((rating) => (
            <MenuItem key={rating} value={rating}>
              {rating}점
            </MenuItem>
          ))}
        </Select>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          작성
        </Button>
      </div>
      {Array.isArray(review.data.items) && review.data.items.length > 0 ? (
        review.data.items.slice(0, visibleReviews).map((reviewItem) => (
          <div key={reviewItem.id} className={classes.reviewItem}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '1px' }}>
              <Typography variant="body2" className={classes.content} style={{ display: 'flex' }}>
                {isEditing && editReviewId === reviewItem.id ? (
                  <TextField
                    label="후기 수정"
                    variant="outlined"
                    multiline
                    minRows={1}
                    value={editedReviewContent}
                    onChange={(e) => setEditedReviewContent(e.target.value)}
                    className={classes.textField}
                  />
                ) : (
                  reviewItem.content || "내용이 없습니다."
                )}
              </Typography>
              {isLoggedIn && userId === reviewItem.userId && (
                <div>
                  {isEditing && editReviewId === reviewItem.id ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '1px' }}>
                      {/* 수정 완료 버튼 */}
                      <Button
                        color="primary"
                        onClick={() => handleUpdate(editReviewId)}
                        className={classes.Button}
                      >
                        수정 완료
                      </Button>
                      {/* 취소 버튼 */}
                      <Button
                        color="secondary"
                        onClick={handleCancelEdit}
                        className={classes.Button}
                      >
                        취소
                      </Button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '1px' }}>
                      {/* 수정 버튼 */}
                      <Button
                        color="primary"
                        className={classes.Button}
                        onClick={() => handleEdit(reviewItem.id, reviewItem.content)}
                      >
                        수정
                      </Button>
                      {/* 삭제 버튼 */}
                      <Button
                        color="secondary"
                        className={classes.Button}
                        onClick={() => handleDelete(reviewItem.id, userId)}
                      >
                        삭제
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <div className={classes.author}>
                {/* 작성자 ID 표시 */}
                평점: {isEditing && editReviewId === reviewItem.id ? (
                  // 수정 중에는 새로 입력한 평점을 표시
                  <Select
                    label="평점"
                    variant="outlined"
                    value={editedReviewRating}
                    onChange={(e) => setEditedReviewRating(e.target.value)}
                    className={classes.textField}
                    style={{ width: '50%' }}

                  >
                    {[0, 1, 2, 3, 4, 5].map((rating) => (
                      <MenuItem key={rating} value={rating}>
                        {rating}점
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  // 수정 중이 아니면 리뷰의 기존 평점을 표시
                  reviewItem.rating
                )}
              </div>
              <div className={classes.createDate}>
                {/* 작성일자 표시 */}
                {new Date(reviewItem.createDate).toLocaleString()}
              </div>
            </div>
          </div>
        ))
      ) : null}
      {Array.isArray(review.data.items) && review.data.items.length > visibleReviews && (
        <Button style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
          className={classes.Button}
          onClick={handleMoreReviews}
        >
          더보기
        </Button>
      )}
    </div>
  );
};

export default Review;