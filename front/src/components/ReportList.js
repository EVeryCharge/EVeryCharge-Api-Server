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
import Axios from "axios";
import * as React from "react";
import { Link } from "react-router-dom";
import ReportHeader from "./ReportHeader";

const ReportList = () => {
  const [data, setData] = React.useState({
    totalPages: 0,
    totalElements: 0,
    size: 0,
    content: [],
    number: 0,
  });

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  React.useEffect(() => {
    fetchData(page, rowsPerPage);
  }, [page, rowsPerPage]);

  React.useEffect(() => {
    console.log("Data received:", data);
  }, [data]);

  // 신고 리스트 API GET
  const fetchData = async (currentPage, pageSize) => {
    try {
      const response = await Axios.get(`https://api.eitcharge.site/api/v1/reports/list`, {
        params: {
          page: currentPage,
          pageSize: pageSize,
        },
        withCredentials: true,
      });

      console.log("Fetch request sent to:", response.config.url);
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getStatusColor = (isCompleted) => {
    return isCompleted ? "#008000" : "#FFA500";
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setPage(0);
    setRowsPerPage(newRowsPerPage);
  };

  return (
    <Box mt={4} mb={4}>
      <ReportHeader
        headerTitle={"신고내역 확인"}
        headerDescription={"충전소 관련 내용을 신고할 수 있습니다."}
        actorCanCreate={data?.content[0]?.actorCanCreate || false}
        actorCanManagerSearch={data?.content[0]?.actorCanManagerSearch || false}
        isEditPage={false}
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>유형</TableCell>
              <TableCell>충전소</TableCell>
              <TableCell>글 제목</TableCell>
              <TableCell>신고자</TableCell>
              <TableCell>작성일</TableCell>
              <TableCell>처리여부</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.content.map((row) => (
              <TableRow
                key={row.id}
                component={Link}
                to={`/report/${row.id}`}
                style={{
                  textDecoration: "none",
                }}
              >
                <TableCell>{row.reportType}</TableCell>
                <TableCell>{row.statNm}</TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.memberName}</TableCell>
                <TableCell>{formatDate(row.createDate)}</TableCell>
                <TableCell style={{ color: getStatusColor(row.completed) }}>
                  {row.completed ? "처리완료" : "처리중"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          component="div"
          count={data.totalElements}
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
