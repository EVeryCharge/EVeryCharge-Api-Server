import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { HttpGet } from "../../services/HttpService";

const ChargingStationInfo = ({ statId }) => {
  const [chargingStationData, setChargingStationData] = useState([]);

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
      <TableContainer>
        <Table style={{ border: "1px groove lightgrey" }}>
          <TableHead>
            <TableRow style={{ borderBottom: "1.5px solid grey" }}>
              <TableCell style={{ fontWeight: "bold" }}>충전소ID</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>운영기관</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>주차가능</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>개방여부</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>제한사항</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{chargingStationData.statId}</TableCell>
              <TableCell>{chargingStationData.bnm}</TableCell>
              <TableCell>
                {chargingStationData.limitYn === "Y" ? "O" : "X"}
              </TableCell>
              <TableCell>
                {chargingStationData.parkingFree === "Y" ? "O" : "X"}
              </TableCell>
              <TableCell>{chargingStationData.limitDetail}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ChargingStationInfo;
