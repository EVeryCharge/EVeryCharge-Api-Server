import React, { useEffect, useState } from "react";
import { Box, Typography } from "@material-ui/core";
import { useParams } from "react-router-dom";
import axios from "axios";
import GoBackButton from "./GoBackButton";
import ErrorPage from "./ErrorPage";
import ReportHeader from "./ReportHeader";

const ReportDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchReportDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8090/api/v1/reports/${id}`,
          { withCredentials: true }
        );
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching report detail:", error);
      }
    };

    fetchReportDetail();
  }, [id]);

  React.useEffect(() => {
    console.log("Data received:", data);
  }, [data]);

  if (!data) {
    // 로딩 시
    // return <></>;
    // TODO: 최종적으로 data 없을 시에는 에러페이지 반환하게끔 구현
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
      <ReportHeader
        headerTitle={"신고내역 확인"}
        headerDescription={"충전소 관련 내용을 신고할 수 있습니다."}
        actorCanCreate={data.actorCanCreate}
        actorCanManagerSearch={data.actorCanManagerSearch}
        isEditPage={false}
      />

      {/* 작성 정보 구역 */}
      <Box alignItems="center" my={2} px={2}>
        <Typography variant="subtitle1">{`[유형] 충전소: [${data.reportType}] ${data.statNm}`}</Typography>
        <Typography variant="subtitle1">{`위치: ${data.addr}`}</Typography>
        <Typography variant="subtitle1">{`신고자: ${data.memberName}`}</Typography>
        <Typography variant="subtitle1">
          {`작성일: ${formatDate(data.createDate)}`}
        </Typography>
      </Box>
      <hr />

      {/* 글 제목 및 내용 구역 */}
      <Box alignItems="center" my={2} px={2} height={300}>
        <Typography variant="h5">{data.title}</Typography>
        <Typography
          variant="body1"
          style={{
            paddingLeft: "3px",
            paddingRight: "10px",
            paddingTop: "10px",
          }}
        >
          {data.content}
        </Typography>
      </Box>
      <hr />

      {/* 처리 결과 구역 */}
      <Box my={2} px={2}>
        <Typography variant="body1">
          {`처리결과: `}
          <span
            style={{
              color: data.completed ? "#008000" : "#FFA500",
              fontWeight: "bold",
            }}
          >
            {data.completed ? "완료" : "진행중"}
          </span>
        </Typography>
        {data.replierName && (
          <Typography variant="body1">{`처리자: ${data.replierName}`}</Typography>
        )}
        {data.replyCreatedDate && (
          <Typography variant="body1">{`처리일: ${formatDate(
            data.replyCreatedDate
          )}`}</Typography>
        )}
        {data.reply && (
          <Typography variant="body1">{`${data.reply}`}</Typography>
        )}
      </Box>
    </Box>
  );
};

export default ReportDetail;
