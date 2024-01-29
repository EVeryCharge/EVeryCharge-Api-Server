import React from 'react';
import { Typography, Button } from '@material-ui/core';

const Review = () => {
  return (
    <div>
      <Typography variant="h5">이용후기</Typography>
      <form >
        <div>
            <label>기존 후기들 자리</label>
        </div>
        <div>
            <textarea name="body"></textarea>
        </div>

        <button type="submit">글쓰기</button>
    </form>
    </div>
  );
};

export default Review;