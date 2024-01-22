import React from 'react';
import { Typography, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
const ChargingStationInfo = () => {
  return (
    <div>
      <Typography variant="h5">전기차 충전소 조회</Typography>
      <Typography variant="body1">충전소 조회</Typography>
      <Link to="/map"> {/* 버튼을 Link 컴포넌트로 감쌈 */}
        <Button variant="contained" color="primary">조회하기</Button>
      </Link>
    </div>
  );
};

export default ChargingStationInfo;
