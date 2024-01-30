import { Box, Button, Typography } from "@material-ui/core";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import ReportHeader from "./ReportHeader";

const ReportDetail = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 신고 세부내역 API GET
  useEffect(() => {
    const fetchReportDetail = async () => {
      try {
        const response = await Axios.get(`/api/v1/reports/${id}`, {
          withCredentials: true,
        });
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching report detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportDetail();
  }, [id]);

  React.useEffect(() => {
    console.log("Data received:", data);
  }, [data]);

  // 신고 삭제 DELETE API
  const handleDelete = async () => {
    const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
    if (confirmDelete) {
      try {
        const response = await Axios.delete(`/api/v1/reports/${id}`, {
          withCredentials: true,
        });

        if (response.status === 200) {
          console.log("신고가 성공적으로 삭제되었습니다.");
          navigate("/report/list");
        } else {
          console.error(`신고 삭제 실패 : ${response.msg}`);
        }
      } catch (error) {
        console.error("신고 삭제 중 오류:", error);
      }
    }
  };

  if (loading) {
    return null;
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
    <>
      {/* 존재하지 않는 페이지 접근 시 예외 처리 */}
      {!data && (
        <ErrorPage
          errorCode="404 NOT FOUND"
          errorTitle="요청하신 페이지를 찾을 수 없습니다."
          errorDescription="입력하신 주소가 정확한지 확인해주세요."
        />
      )}

      {data && (
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
          {data.actorCanEdit && (
            <Box
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
                marginRight: "20px",
                marginTop: "-30px",
              }}
            >
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleDelete}
                style={{ marginRight: "2px" }}
              >
                수정하기
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleDelete}
              >
                삭제하기
              </Button>
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

export default ReportDetail;
