import React, { useEffect, useState } from "react";
import { Box, Typography } from "@material-ui/core";
import { useParams } from "react-router-dom";
import axios from "axios";
import GoBackButton from "./GoBackButton";
import ErrorPage from "./ErrorPage";
import ReportHeader from "./ReportHeader";

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
    // 로딩 시
    // return <></>;
    // TODO: 최종적으로 reportDetail 없을 시에는 에러페이지 반환하게끔 구현
    return <ErrorPage />;
  }

  const formatDate = (dateString) => {
    if (!dateString) {
      return "";
    }

    const formattedDate = new Date(dateString);
    const year = formattedDate.getFullYear();
    const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
    const day = String(formattedDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  return (
    <Box mt={4} mb={4}>
      <ReportHeader />

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
        <Typography
          variant="body1"
          style={{
            paddingLeft: "3px",
            paddingRight: "10px",
            paddingTop: "10px",
          }}
        >
          {reportDetail.content}
        </Typography>
      </Box>
      <hr />

      {/* 처리 결과 구역 */}
      <Box my={2} pl={2}>
        <Typography variant="body1">
          {`처리결과: `}
          <span
            style={{
              color: reportDetail.completed ? "#008000" : "#FFA500",
              fontWeight: "bold",
            }}
          >
            {reportDetail.completed ? "완료" : "진행중"}
          </span>
        </Typography>
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
        <Box mt={1}>
          <GoBackButton />
        </Box>
      </Box>
    </Box>
  );
};

export default ReportDetail;
