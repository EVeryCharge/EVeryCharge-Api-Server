import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { HttpGet } from "../../services/HttpService";
import { Help } from "@material-ui/icons";

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

  return (
    <div
      style={{
        marginBottom: "20px",
        padding: "5px",
      }}
    >
      <div
        style={{
          marginBottom: "3px",
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
          {chargingStationData.statNm} 충전소{" "}
        </Typography>
        <Typography
          variant="subtitle2"
          style={{ color: "grey", marginTop: "2px" }}
        >
          {" "}
          {chargingStationData.addr}
        </Typography>
      </div>

      {/* 충전소 기본정보 */}
      <TableContainer>
        <Table style={{ border: "1px groove lightgrey" }}>
          <TableHead>
            <TableRow style={{ borderBottom: "1.5px solid grey" }}>
              <TableCell style={{ fontWeight: "bold" }}>충전소ID</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>운영기관</TableCell>
              <TableCell align="center" style={{ fontWeight: "bold" }}>
                주차가능
              </TableCell>
              <TableCell align="center" style={{ fontWeight: "bold" }}>
                개방여부
              </TableCell>
              <TableCell align="center" style={{ fontWeight: "bold" }}>
                제한사항
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{chargingStationData.statId}</TableCell>
              <TableCell>{chargingStationData.bnm}</TableCell>
              <TableCell
                align="center"
                style={{
                  color: chargingStationData.limitYn === "Y" ? "green" : "red",
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
              <TableCell align="center">
                {chargingStationData.limitDetail}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <div
        style={{
          marginTop: "5px",
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
                    {row.memberFeeChange !== 0 ? (
                      <>
                        {row.memberFeeChange > 0 ? (
                          <span style={{ color: "red" }}>↑ </span>
                        ) : (
                          <span style={{ color: "blue" }}>↓ </span>
                        )}
                        {Math.abs(row.memberFeeChange)}
                      </>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell align="center">{row.nonMemberFee}</TableCell>
                  <TableCell align="center">
                    {row.nonMemberFeeChange !== 0 ? (
                      <>
                        {row.nonMemberFeeChange > 0 ? (
                          <span style={{ color: "red" }}>↑ </span>
                        ) : (
                          <span style={{ color: "blue" }}>↓ </span>
                        )}
                        {Math.abs(row.nonMemberFeeChange)}
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
