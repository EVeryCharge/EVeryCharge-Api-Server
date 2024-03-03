import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Warning } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { HttpGet } from "../../services/HttpService";

const ChargeRoamingFeeInfo = () => {
  const classes = useStyles();
  const [memberBnmItem, setMemberBnmItem] = useState([]);
  const [chgerBnmItem, setChgerBnmItem] = useState([]);
  const [memberBnm, setMemberBnm] = useState(["환경부"]);
  const [chgerBnm, setChgerBnm] = useState(["환경부"]);
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    const fetchBnmItem = async () => {
      try {
        const data = await HttpGet("/api/v1/chargeFeeInfo/roaming/item");
        setMemberBnmItem([...data.memberBnmList]);
        setChgerBnmItem([...data.chargerBnmList]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchBnmItem();
    handleSearch();
  }, []);

  const handleSearch = async () => {
    if (memberBnm.length === 0 || chgerBnm.length === 0) {
      alert("검색 조건을 확인해주세요.");
      return;
    }

    try {
      const response = await HttpGet("/api/v1/chargeFeeInfo/roaming", {
        memberBnm: memberBnm.join(", "),
        chgerBnm: chgerBnm.join(", "),
      });
      setSearchResult(response.chargeRoamingFeeList);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleReset = () => {
    setMemberBnm([]);
    setChgerBnm([]);
  };

  return (
    <div className={classes.root}>
      <div className={classes.searchFilterContainer}>
        <div className={classes.selectContainer}>
          <FormControl
            className={classes.formControl}
            style={{ marginRight: "20px" }}
          >
            <FormHelperText style={{ color: "black", fontWeight: "bold" }}>
              사용자 가입업체
            </FormHelperText>
            <div className={classes.scrollContainer}>
              {memberBnmItem.map((item) => (
                <FormControlLabel
                  key={item}
                  control={
                    <Checkbox
                      checked={memberBnm.includes(item)}
                      onChange={() => {
                        if (memberBnm.includes(item)) {
                          setMemberBnm(memberBnm.filter((el) => el !== item));
                        } else {
                          setMemberBnm([...memberBnm, item]);
                        }
                      }}
                      color="primary"
                    />
                  }
                  label={item}
                />
              ))}
            </div>
            <Typography
              variant="body2"
              align="right"
              style={{ marginTop: "10px", color: "blue", fontWeight: "bold" }}
            >
              {memberBnm.length > 0
                ? `${memberBnm.length}개 선택됨`
                : "업체를 선택해주세요"}
            </Typography>
          </FormControl>
          <FormControl className={classes.formControl}>
            <FormHelperText style={{ color: "black", fontWeight: "bold" }}>
              충전기 운영업체
            </FormHelperText>
            <div className={classes.scrollContainer}>
              {chgerBnmItem.map((item) => (
                <FormControlLabel
                  key={item}
                  control={
                    <Checkbox
                      checked={chgerBnm.includes(item)}
                      onChange={() => {
                        if (chgerBnm.includes(item)) {
                          setChgerBnm(chgerBnm.filter((el) => el !== item));
                        } else {
                          setChgerBnm([...chgerBnm, item]);
                        }
                      }}
                      color="primary"
                    />
                  }
                  label={item}
                />
              ))}
            </div>
            <Typography
              variant="body2"
              align="right"
              style={{ marginTop: "10px", color: "blue", fontWeight: "bold" }}
            >
              {chgerBnm.length > 0
                ? `${chgerBnm.length}개 선택됨`
                : "업체를 선택해주세요"}
            </Typography>
          </FormControl>
        </div>
        <div className={classes.buttonContainer}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleReset}
            style={{ marginRight: "3px" }}
          >
            초기화
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleSearch}
            style={{ marginRight: "3px" }}
          >
            검색
          </Button>
        </div>
      </div>
      {searchResult && searchResult.length > 0 && (
        <TableContainer className={classes.tableContainer}>
          <Table>
            <TableHead>
              <TableRow className={classes.tableHeader}>
                {searchResult[0].map((cell, index) => (
                  <TableCell
                    key={index}
                    align="center"
                    style={{ border: "1.5px solid grey", fontWeight: "bold" }}
                  >
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {searchResult.slice(1).map((row, index) => (
                <TableRow key={index}>
                  {row.map((cell, cellIndex) => (
                    <TableCell
                      key={cellIndex}
                      style={{
                        border:
                          cellIndex === 0
                            ? "1.5px solid grey"
                            : "1px groove lightGrey",
                        fontWeight: cellIndex === 0 ? "bold" : undefined,
                        backgroundColor:
                          cellIndex === 0 ? "#f5f5f5" : undefined,
                        width: "200px",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "200px",
                          overflowX: "auto",
                          textAlign: "center",
                          margin: "auto",
                        }}
                      >
                        {typeof cell === "string" && cell.includes("\n")
                          ? cell.split("\n").map((text, index) => (
                              <React.Fragment key={index}>
                                {text}
                                <br />
                              </React.Fragment>
                            ))
                          : cell || "공시 정보 없음"}
                      </div>
                    </TableCell>
                  ))}
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
  tableHeader: {
    backgroundColor: "#e0e0e0",
    borderBottom: "1.5px solid grey",
  },
  selectContainer: {
    marginTop: "10px",
    paddingRight: "10px",
    paddingLeft: "10px",
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  buttonContainer: {
    marginTop: "10px",
    display: "flex",
    justifyContent: "flex-end",
    paddingRight: "10px",
    width: "100%",
  },
  scrollContainer: {
    display: "flex",
    flexDirection: "column",
    maxHeight: "300px",
    overflowY: "auto",
    paddingLeft: "10px",
    border: "1.5px groove lightGrey",
  },
}));

export default ChargeRoamingFeeInfo;
