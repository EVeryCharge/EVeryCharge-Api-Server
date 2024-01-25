import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@material-ui/core";
import * as React from "react";

function createData(station, title, authorName, createdDate, isCompleted) {
  return { station, title, authorName, createdDate, isCompleted };
}

const rows = [
  // mock data todo: fetch
  createData(
    "서울시 종로구 1충전소",
    "1번 충전기 장애 관련 문의",
    "user1",
    "2024-01-24",
    true
  ),
  createData(
    "서울시 종로구 2충전소",
    "2번 충전기 장애 관련 문의",
    "user1",
    "2024-01-24",
    false
  ),
  createData(
    "서울시 종로구 3충전소",
    "3번 충전기 장애 관련 문의",
    "user1",
    "2024-01-24",
    true
  ),
  createData(
    "서울시 종로구 4충전소",
    "4번 충전기 장애 관련 문의",
    "user1",
    "2024-01-24",
    false
  ),
  createData(
    "서울시 종로구 5충전소",
    "5번 충전기 장애 관련 문의",
    "user1",
    "2024-01-24",
    true
  ),
  createData(
    "서울시 종로구 6충전소",
    "6번 충전기 장애 관련 문의",
    "user1",
    "2024-01-24",
    false
  ),
  createData(
    "서울시 종로구 7충전소",
    "7번 충전기 장애 관련 문의",
    "user1",
    "2024-01-24",
    true
  ),
  createData(
    "서울시 종로구 8충전소",
    "8번 충전기 장애 관련 문의",
    "user1",
    "2024-01-24",
    false
  ),
  createData(
    "서울시 종로구 9충전소",
    "9번 충전기 장애 관련 문의",
    "user1",
    "2024-01-24",
    true
  ),
  createData(
    "서울시 종로구 10충전소",
    "10번 충전기 장애 관련 문의",
    "user1",
    "2024-01-24",
    false
  ),
];

const ReportList = () => {
  const getStatusColor = (isCompleted) => {
    return isCompleted ? "#008000" : "#FFA500";
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box mt={4} mb={4}>
      <h2>신고내역 확인</h2>
      <p style={{ fontWeight: "bold", color: "#008000", paddingLeft: "10px" }}>
        충전소 장애 관련내용을 신고할 수 있습니다.
      </p>
      <hr />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>충전소</TableCell>
              <TableCell>글 제목</TableCell>
              <TableCell>신고자</TableCell>
              <TableCell>작성일</TableCell>
              <TableCell>처리여부</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row /* todo : link to report_detail */) => (
              <TableRow
                key={row.station}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.station}
                </TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.authorName}</TableCell>
                <TableCell>{row.createdDate}</TableCell>
                <TableCell style={{ color: getStatusColor(row.isCompleted) }}>
                  {row.isCompleted ? "완료" : "처리중"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination /* todo : pagination */
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default ReportList;
