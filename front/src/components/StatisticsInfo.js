import React from 'react';
import { Typography, Button } from '@material-ui/core';

const StatisticsInfo = () => {
  return (
    <div>
      <Typography variant="h5">통계정보</Typography>
      <Typography variant="body1">전기차 및 충전기 통계</Typography>
      <Button variant="contained" color="primary">바로가기</Button>
    </div>
  );
};

export default StatisticsInfo;
