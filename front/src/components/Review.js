import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography } from '@material-ui/core';

const Review = () => {
  const [review, setReview] = useState({ data: { items: [] } });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/v1/review");
      setReview(response.data || { data: { items: [] } });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <div>
      <Typography variant="h5">이용후기</Typography>
      {Array.isArray(review.data.items) ? (
        review.data.items.map((reviewItem) => (
          <div key={reviewItem.id} style={{ display: 'flex' }}>
            <div>{reviewItem.id}</div>
            <div>{reviewItem.content || "No content available"}</div>
          </div>
        ))
      ) : (
        <div>No reviews available</div>
      )}
    </div>
  );
};

export default Review;