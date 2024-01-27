import React, { useEffect, useState } from "react";
import { Box, Typography, Divider } from "@material-ui/core";
import { useParams } from "react-router-dom";
import axios from "axios";

const ReportDetail = () => {
  const { id } = useParams();
  const [reportDetail, setReportDetail] = useState(null);

  useEffect(() => {
    const fetchReportDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8090/api/v1/reports/${id}`
        );
        setReportDetail(response.data.data);
      } catch (error) {
        console.error("Error fetching report detail:", error);
      }
    };

    fetchReportDetail();
  }, [id]);

  if (!reportDetail) {
    return <div>Loading...</div>;
  }

  const getStatusColor = (isCompleted) => {
    return isCompleted ? "#008000" : "#FFA500";
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return ""; // 혹은 다른 기본값으로 설정해도 됩니다.
    }

    const formattedDate = new Date(dateString);
    const year = formattedDate.getFullYear();
    const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
    const day = String(formattedDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  return (
    <Box mt={4} mb={4}>
      <h2>신고내역 확인</h2>
      <p style={{ fontWeight: "bold", color: "#008000", paddingLeft: "10px" }}>
        충전소 장애 관련 내용을 신고할 수 있습니다.
      </p>
      <hr />

      {/* 작성 정보 구역 */}
      <Box alignItems="center" my={2} pl={2}>
        <Typography variant="subtitle1">{`[유형] 충전소: [${reportDetail.reportType}] ${reportDetail.statNm}`}</Typography>
        <Typography variant="subtitle1">{`신고자: ${reportDetail.memberName}`}</Typography>
        <Typography variant="subtitle1">{`작성일: ${formatDate(
          reportDetail.createDate
        )}`}</Typography>
      </Box>
      <hr />

      {/* 글 제목 및 내용 구역 */}
      <Box alignItems="center" my={2} pl={2} height={300}>
        <Typography variant="h4">{reportDetail.title}</Typography>
        <Typography variant="body1">{reportDetail.content}</Typography>
      </Box>
      <hr />

      {/* 처리 결과 구역 */}
      <Box my={2} pl={2}>
        <Typography
          variant="body1"
          style={{ color: getStatusColor(reportDetail.completed) }}
        >{`처리 결과: ${
          reportDetail.completed ? "완료" : "처리중"
        }`}</Typography>
        {reportDetail.replierName && (
          <Typography variant="body1">{`처리자: ${reportDetail.replierName}`}</Typography>
        )}
        {reportDetail.replyCreatedDate && (
          <Typography variant="body1">{`처리일: ${formatDate(
            reportDetail.replyCreatedDate
          )}`}</Typography>
        )}
        {reportDetail.reply && (
          <Typography variant="body1">{`${reportDetail.reply}`}</Typography>
        )}
      </Box>
    </Box>
  );
};

export default ReportDetail;
