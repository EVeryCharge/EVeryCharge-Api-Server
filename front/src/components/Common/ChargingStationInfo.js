import {
  Paper,
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
    <div>
      <Typography variant="subtitle1" style={{ marginTop: "20px" }}>
        {" "}
        {chargingStationData.statNm} 충전소 | {chargingStationData.addr}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>충전소ID</TableCell>
              <TableCell>운영기관</TableCell>
              <TableCell>주차가능</TableCell>
              <TableCell>제한사항</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{chargingStationData.statId}</TableCell>
              <TableCell>{chargingStationData.bnm}</TableCell>
              <TableCell>{chargingStationData.parkingFree}</TableCell>
              <TableCell>{chargingStationData.limitDetail}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ChargingStationInfo;
