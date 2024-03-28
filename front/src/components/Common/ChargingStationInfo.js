import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Help } from "@material-ui/icons";
import { ContentCopy } from "@mui/icons-material";
import React, { useCallback, useEffect, useState } from "react";
import { HttpGet } from "../../services/HttpService";
import CopyButton from "./CopyButton";
import NaverMapButton from "./NaverMapButton";
import KakaoMapButton from "./KakaoMapButton";

const ChargingStationInfo = ({ statId }) => {
  const [chargingStationData, setChargingStationData] = useState({});

  useEffect(() => {
    HttpGet("/api/v1/chargingStation/info", { statId: statId })
      .then((response) => {
        setChargingStationData(response);
      })
      .catch((error) => {
        console.error("데이터를 불러오는 중 오류 발생:", error);
      });
  }, []);

  const tableCellStyle = {
    padding: "4px",
    textAlign: "center", // 글자를 가운데 정렬합니다.
    fontWeight: "bold",
    paddingTop: "13px",
    paddingBottom: "13px",
  };
  const tableCellStyle2 = {
    padding: "4px",
    textAlign: "center", // 글자를 가운데 정렬합니다.
    paddingTop: "13px",
    paddingBottom: "13px",
  };

  return (
    <div
      style={{
        marginBottom: "20px",
        marginLeft: "-21.5px",
        marginRight: "10px",
        width: "102.5%"
      }}
    >
      <div
        style={{
          marginBottom: "px",
          padding: "3px",
          display: "flex",
          alignItems: "center",
          backgroundColor: "lightblue",
        }}
      >
        <Typography
          variant="subtitle1"
          style={{ fontWeight: "bold", marginRight: "5px" }}
        >
          {chargingStationData.statNm}
        </Typography>
        <Typography
          variant="subtitle2"
          style={{ color: "grey", marginTop: "2px" }}
        >
          {" "}
          {chargingStationData.addr}
        </Typography>
        <CopyButton addr={chargingStationData.addr} />
        <NaverMapButton addr={chargingStationData.addr} />
        <KakaoMapButton addr={chargingStationData.addr} />
      </div>

      {/* 충전소 기본정보 */}
      <TableContainer >
        <Table style={{ border: "1px groove lightgrey" }}>
          <TableHead>
            <TableRow style={{ borderBottom: "1.5px solid grey" }}>
              <TableCell style={tableCellStyle}>충전소ID</TableCell>
              <TableCell style={tableCellStyle}>운영기관</TableCell>
              <TableCell style={tableCellStyle}>
                주차가능
              </TableCell>
              <TableCell style={tableCellStyle}>
                개방여부
              </TableCell>
              <TableCell style={tableCellStyle}>
                제한사항
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell style={tableCellStyle2}>{chargingStationData.statId}</TableCell>
              <TableCell style={tableCellStyle2}>{chargingStationData.bnm}</TableCell>
              <TableCell
                align="center"
                style={{
                  color: chargingStationData.limitYn === "Y" ? "green" : "red",
                  padding: "4px",
                  textAlign: "center", // 글자를 가운데 정렬합니다.
                  paddingTop: "13px",
                  paddingBottom: "13px",
                }}
              >
                {chargingStationData.limitYn === "Y" ? "O" : "X"}
              </TableCell>
              <TableCell
                align="center"
                style={{
                  color:
                    chargingStationData.parkingFree === "Y" ? "green" : "red",
                }}
              >
                {chargingStationData.parkingFree === "Y" ? "O" : "X"}
              </TableCell>
              <TableCell style={tableCellStyle2}>
                {chargingStationData.limitDetail}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <div
        style={{
          marginTop: "20px",
          marginBottom: "3px",
          padding: "3px",
          display: "flex",
          alignItems: "center",
          backgroundColor: "whitesmoke",
        }}
      >
        <Typography
          variant="subtitle1"
          style={{ fontWeight: "bold", marginRight: "5px" }}
        >
          충전요금
        </Typography>
        <Typography
          variant="subtitle2"
          style={{ color: "grey", marginTop: "2px", marginRight: "2px" }}
        >
          {"(원 / 1kW)"}
        </Typography>
        <Tooltip
          placement="right-start"
          title="요금 정보는 공시 데이터를 바탕으로 하며, 업체별 프로모션 등 기타 정책에 의해 공시된 요금과 상이할 수 있습니다."
        >
          <Help style={{ color: "grey", fontSize: "20" }} />
        </Tooltip>
      </div>

      {/* 요금 정보 */}
      <TableContainer>
        <Table style={{ border: "1px groove lightgrey" }}>
          <TableHead>
            <TableRow style={{ borderBottom: "1.5px solid grey" }}>
              <TableCell
                style={{
                  fontWeight: "bold",
                  borderRight: "1px groove lightgrey",
                }}
              >
                구분
              </TableCell>
              <TableCell align="center" style={{ fontWeight: "bold" }}>
                회원
              </TableCell>
              <TableCell
                align="center"
                style={{
                  fontWeight: "bold",
                  borderRight: "1px groove lightgrey",
                }}
              >
                변동
              </TableCell>
              <TableCell align="center" style={{ fontWeight: "bold" }}>
                비회원
              </TableCell>
              <TableCell align="center" style={{ fontWeight: "bold" }}>
                변동
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chargingStationData.chargeFeeList &&
              chargingStationData.chargeFeeList.map((row, index) => (
                <TableRow key={index}>
                  <TableCell style={{ borderRight: "1px groove lightgrey" }}>
                    {row.chgerType}
                  </TableCell>
                  <TableCell align="center">{row.memberFee}</TableCell>
                  <TableCell
                    align="center"
                    style={{ borderRight: "1px groove lightgrey" }}
                  >
                    {row.memberFeeChange && row.memberFeeChange !== 0 ? (
                      <>
                        {row.memberFeeChange > 0 ? (
                          <span style={{ color: "red" }}>↑ </span>
                        ) : (
                          <span style={{ color: "blue" }}>↓ </span>
                        )}
                        {row.memberFeeChange}
                      </>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell align="center">{row.nonMemberFee}</TableCell>
                  <TableCell align="center">
                    {row.nonMemberFeeChange && row.nonMemberFeeChange !== 0 ? (
                      <>
                        {row.nonMemberFeeChange > 0 ? (
                          <span style={{ color: "red" }}>↑ </span>
                        ) : (
                          <span style={{ color: "blue" }}>↓ </span>
                        )}
                        {row.nonMemberFeeChange}
                      </>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ChargingStationInfo;
