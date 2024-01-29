import React from "react";
import { Box, Typography, Button } from "@material-ui/core";

const ReportHeader = () => {
  return (
    <Box mt={4} mb={2}>
      <Box ml={2}>
        <Typography variant="h4">신고내역 확인</Typography>
        <Typography
          variant="subtitle1"
          style={{
            fontWeight: "bold",
            color: "#008000",
            paddingLeft: "10px",
            marginTop: "5px",
          }}
        >
          충전소 장애 관련 내용을 신고할 수 있습니다.
        </Typography>
      </Box>
      <Box
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-end",
          marginRight: "10px",
          marginTop: "-40px",
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          style={{ marginRight: "2px" }}
        >
          담당 충전소 신고내역 조회하기
        </Button>
        <Button variant="outlined" to={`/report/create`}>
          신고하기
        </Button>
      </Box>
      <hr />
    </Box>
  );
};

export default ReportHeader;
