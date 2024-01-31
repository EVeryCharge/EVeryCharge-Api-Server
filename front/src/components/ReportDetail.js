import { Box, Button, TextField, Typography } from "@material-ui/core";
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
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");

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

  useEffect(() => {
    console.log("Data received:", data);
  }, [data]);

  if (loading) {
    return null;
  }

  // 신고 삭제 API DELETE
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

  // 신고 답변 및 완료처리 API PUT
  const handleReplyReport = async () => {
    const isValid = validateReplyInputs();
    const confirmReply = window.confirm(
      `완료처리 이후 신고내역 / 처리결과 수정, 삭제가 불가능합니다.\n신고에 대한 답변 등록 및 완료처리하시겠습니까?`
    );
    if (confirmReply && isValid) {
      try {
        const requestData = {
          reply: reply,
        };

        const response = await Axios.put(
          `/api/v1/reports/${id}/complete`,
          requestData,
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          console.log("신고처리 완료, 처리답변 등록이 완료되었습니다.");
          alert("신고 처리 완료, 처리 답변 등록이 완료되었습니다");
          navigate(`report/${id}`);
        } else {
          console.error(`신고처리 실패 : ${response.msg}`);
        }
      } catch (error) {
        console.error("신고처리 중 오류:", error);
      }
    }
  };

  // 수정버튼 클릭 시 폼으로 리다이렉트
  const navigateModify = () => {
    navigate(`/report/form`, {
      state: {
        reportType: data.reportType,
        statId: data.statId,
        statNm: data.statNm,
        title: data.title,
        content: data.content,
        id: data.id,
        mode: "MODIFY",
      },
    });
  };

  const handleReplyChange = (event) => {
    const inputValue = event.target.value;
    setReply(inputValue);
  };

  // 입력값 검증
  const validateReplyInputs = () => {
    let isValid = true;
    const newError = {
      reply: "",
    };

    if (reply.trim() === "") {
      newError.reply = "처리 답변을 입력하세요.";
      isValid = false;
    }

    if (reply.length > 500) {
      newError.reply = "처리 답변을 500자 이내로 입력하세요.";
      isValid = false;
    }

    setError(newError);

    if (!isValid) {
      alert("입력값을 확인하세요.");
    }

    return isValid;
  };

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

          <Box alignItems="center" my={2} px={2}>
            <Typography variant="subtitle1">{`[유형] 충전소: [${data.reportType}] ${data.statNm}`}</Typography>
            <Typography variant="subtitle1">{`위치: ${data.addr}`}</Typography>
            <Typography variant="subtitle1">{`신고자: ${data.memberName}`}</Typography>
            <Typography variant="subtitle1">{`작성일: ${formatDate(
              data.createDate
            )}`}</Typography>
          </Box>
          <hr />

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

          <Box my={2} px={2}>
            <Typography variant="body1">
              {`처리결과: `}
              <span
                style={{
                  color: data.completed ? "#008000" : "#FFA500",
                  fontWeight: "bold",
                }}
              >
                {data.completed ? "처리완료" : "처리중"}
              </span>
            </Typography>

            {/* 유지보수자 신고 처리 결과 입력 */}
            {!data.completed && data.actorCanComplete && (
              <>
                <TextField
                  label="답변"
                  placeholder="처리 후 답변을 입력해주세요.(500자 이내)"
                  helperText={`${reply.length} / 500`}
                  inputProps={{ maxLength: 500 }}
                  rowsMin={13}
                  multiline
                  rows={13}
                  value={reply}
                  onChange={handleReplyChange}
                  style={{ width: "100%", marginTop: "10px" }}
                />
                {error.reply && (
                  <Typography variant="caption" color="error">
                    {error.reply}
                  </Typography>
                )}
              </>
            )}

            {/* 신고 처리 결과 */}
            {data.completed && (
              <Box>
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
            )}
          </Box>

          {/* 등록, 수정 버튼 */}
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
              {data.actorCanComplete && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleReplyReport}
                  style={{ marginRight: "2px" }}
                >
                  완료 처리하기
                </Button>
              )}
              <Button
                variant="outlined"
                color="inherit"
                onClick={navigateModify}
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
