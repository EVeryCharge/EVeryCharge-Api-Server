import { Box, Paper, Typography, Divider } from "@material-ui/core";
import { useParams } from "react-router-dom";

// 가상의 데이터를 가져오기 위한 함수 (실제 데이터 호출로 대체해야 함)
const fetchReportDetail = (id) => {
  // id에 해당하는 상세 정보를 가져오는 비동기 작업 수행
  // 예를 들어, 서버 API 호출 또는 저장된 데이터베이스에서 가져오기 등
  return {
    author: "작성자1",
    date: "2022-01-25",
    title: "2번 충전기 장애 관련 문의",
    content: "충전기 2번이 작동하지 않습니다. 수리가 필요합니다.",
    result: {
      isCompleted: "완료", // '처리 중' 또는 '완료'
      comment: "안녕하세요, 업체입니다. 처리 완료했습니다.",
    },
  };
};

const ReportDetail = () => {
  const { id } = useParams();
  const reportDetail = fetchReportDetail(id);

  return (
    <Box mt={4} mb={4}>
      <h2>신고내역 상세보기</h2>
      <p style={{ fontWeight: "bold", color: "#008000", paddingLeft: "10px" }}>
        충전소 장애 관련 내용을 신고할 수 있습니다.
      </p>
      <hr />

      {/* 작성 정보 구역 */}
      <Box display="flex" alignItems="center" mb={2}>
        {/* 1-1. 작성자 이름(좌상단) */}
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          marginRight="5"
        >{`작성자: ${reportDetail.author}`}</Typography>
        {/* 1-2. 작성일(작성자 이름 오른쪽) */}
        <Typography
          variant="subtitle2"
          style={{ marginLeft: "5px" }}
        >{`작성일: ${reportDetail.date}`}</Typography>
      </Box>

      {/* 글 제목 구역 */}
      <Typography variant="h4" gutterBottom>
        {reportDetail.title}
      </Typography>

      {/* 글 내용 구역 */}
      <Typography variant="body1" paragraph>
        {reportDetail.content}
      </Typography>

      <Divider />

      {/* 처리 결과 구역 */}
      <Box mt={2}>
        {/* 4-1. 처리 결과 표시 (예 : 처리 결과 : ) */}
        <Typography
          variant="h6"
          gutterBottom
        >{`처리 결과: ${reportDetail.result.isCompleted}`}</Typography>
        {/* 4-2. 처리 댓글 */}
        <Typography variant="body1">{`처리 댓글: ${reportDetail.result.comment}`}</Typography>
      </Box>
    </Box>
  );
};

export default ReportDetail;
