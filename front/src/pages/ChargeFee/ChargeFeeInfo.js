import React, { useEffect, useState } from "react";
import { HttpGet } from "../../services/HttpService";
import { Warning } from "@material-ui/icons";
import {
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "50px",
    width: "100%",
  },
  searchFilterContainer: {
    flexGrow: 1,
    backgroundColor: "#f2f2f2",
    paddingTop: "20px",
    paddingBottom: "20px",
    display: "flex",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
  },
  tableContainer: {
    backgroundColor: "#fff",
    paddingTop: "20px",
    paddingBottom: "20px",
    marginTop: "20px",
    fontWeight: "bold",
  },
  selectContainer: {
    marginTop: "10px",
    paddingRight: "10px",
    paddingLeft: "10px",
    marginBottom: "20px",
  },
  buttonContainer: {
    display: "flex",
    marginTop: "10px",
  },
}));

const ChargeFeeInfo = () => {
  const classes = useStyles();
  const [bnm, setBnm] = useState([]);
  const [bnmItem, setBnmItem] = useState([]);
  const [chgerType, setChgerType] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);

  useEffect(() => {
    const fetchBnmItem = async () => {
      try {
        const data = await HttpGet("/api/v1/chargeFeeInfo/item");
        setBnmItem([...data.bnmList]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchBnmItem();
    handleSearch();
  }, []);

  useEffect(() => {
    setSearchResult(null);
  }, [chgerType, bnm]);

  const handleSearch = async () => {
    try {
      const response = await HttpGet("/api/v1/chargeFeeInfo", {
        bnm: bnm.length > 0 ? bnm.join(", ") : undefined,
        chgerType: chgerType.length > 0 ? chgerType : undefined,
      });
      setSearchResult(response.chargeFeeDtoList);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleReset = () => {
    setBnm([]);
    setChgerType("");
    setSearchResult(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const indexOfLastRow = (page + 1) * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = searchResult
    ? searchResult.slice(indexOfFirstRow, indexOfLastRow)
    : null;

  return (
    <div className={classes.root}>
      <div className={classes.searchFilterContainer}>
        <div className={classes.selectContainer}>
          <FormControl fullWidth style={{ marginBottom: "20px" }}>
            <FormHelperText>업체명</FormHelperText>
            <Select
              value={bnm}
              onChange={(event) => setBnm(event.target.value)}
              displayEmpty
              style={{ width: "240px" }}
              multiple
              renderValue={(selected) =>
                selected.length > 0 ? selected.join(", ") : "전체"
              }
              MenuProps={{
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
                getContentAnchorEl: null,
                PaperProps: {
                  style: {
                    maxHeight: 340,
                  },
                },
              }}
            >
              {bnmItem.map((item) => (
                <MenuItem key={item} value={item}>
                  <Checkbox color="primary" checked={bnm.indexOf(item) > -1} />
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <FormHelperText>타입</FormHelperText>
            <Select
              value={chgerType}
              onChange={(event) => setChgerType(event.target.value)}
              displayEmpty
              style={{ width: "100px" }}
              MenuProps={{
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
                getContentAnchorEl: null,
              }}
            >
              <MenuItem value="">전체</MenuItem>
              <MenuItem value="급속">급속</MenuItem>
              <MenuItem value="완속">완속</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className={classes.buttonContainer}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleSearch}
            style={{ marginRight: "3px" }}
          >
            검색
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleReset}>
            초기화
          </Button>
        </div>
      </div>
      {searchResult && searchResult.length > 0 && (
        <TableContainer className={classes.tableContainer}>
          <TablePagination
            rowsPerPageOptions={[10, 20, 100]}
            component="div"
            count={searchResult.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="행 개수 :"
            labelDisplayedRows={({ from, to, count }) =>
              `${from} ~ ${to} / 총 ${count}건`
            }
          />
          <Table>
            <TableHead>
              <TableRow
                style={{
                  backgroundColor: "#e0e0e0",
                  borderBottom: "1.5px solid grey",
                }}
              >
                <TableCell align="center" colSpan={2}>
                  구분
                </TableCell>
                <TableCell align="center" colSpan={2}>
                  기준가 (원 / KW)
                </TableCell>
                <TableCell align="center" colSpan={2}>
                  등락폭 (원 / KW)
                </TableCell>
              </TableRow>
              <TableRow
                style={{
                  backgroundColor: "#e0e0e0",
                  borderBottom: "1.5px solid grey",
                }}
              >
                <TableCell align="center">업체명</TableCell>
                <TableCell align="center">타입</TableCell>
                <TableCell align="center">회원가</TableCell>
                <TableCell align="center">비회원가</TableCell>
                <TableCell align="center">회원가</TableCell>
                <TableCell align="center">비회원가</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentRows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{row.bnm}</TableCell>
                  <TableCell align="center">{row.chgerType}</TableCell>
                  <TableCell align="center">{row.memberFee}</TableCell>
                  <TableCell align="center">{row.nonMemberFee}</TableCell>
                  <TableCell
                    align="center"
                    style={{
                      color:
                        row.memberFeeChange > 0
                          ? "red"
                          : row.memberFeeChange < 0
                          ? "blue"
                          : "inherit",
                    }}
                  >
                    {row.memberFeeChange !== 0.0
                      ? `${row.memberFeeChange > 0 ? "+" : ""}${
                          row.memberFeeChange
                        }`
                      : "-"}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      color:
                        row.nonMemberFeeChange > 0
                          ? "red"
                          : row.nonMemberFeeChange < 0
                          ? "blue"
                          : "inherit",
                    }}
                  >
                    {row.nonMemberFeeChange !== 0.0
                      ? `${row.nonMemberFeeChange > 0 ? "+" : ""}${
                          row.nonMemberFeeChange
                        }`
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {searchResult && searchResult.length === 0 && (
        <Typography
          variant="body1"
          style={{
            display: "flex",
            marginTop: "30px",
            color: "grey",
            alignItems: "center",
          }}
        >
          <Warning />
          검색 조건에 일치하는 결과가 없습니다.
        </Typography>
      )}
    </div>
  );
};

export default ChargeFeeInfo;
