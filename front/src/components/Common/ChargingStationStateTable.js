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

const ChargerType = {
  1: "DC차데모",
  2: "AC완속",
  3: "DC차데모+AC3상",
  4: "DC콤보",
  5: "DC차데모+DC콤보",
  6: "DC차데모+AC상+DC콤보",
  7: "AC상",
  8: "DC콤보(완속)",
};

const ChargerState = {
  1: { description: "통신이상", color: "red" },
  2: { description: "충전가능", color: "green" },
  3: { description: "충전중", color: "red" },
  4: { description: "운영중지", color: "red" },
  5: { description: "점검중", color: "red" },
  9: { description: "상태미확인", color: "black" },
};

const ChargingStationStateTable = ({ statId }) => {
  const [chargingStationData, setChargingStationData] = useState([]);
  const availableChargersCount = chargingStationData.filter(
    (row) => row.stat === "2"
  ).length;

  useEffect(() => {
    HttpGet("/api/v1/chargingStation/chargerStatus", { statId: statId })
      .then((response) => {
        setChargingStationData(response);
      })
      .catch((error) => {
        console.error("데이터를 불러오는 중 오류 발생:", error);
      });
  }, []);

  return (
    <div>
      <Typography variant="subtitle1">
        충전기 전체 {chargingStationData.length}대 | 충전가능{" "}
        <span style={{ color: "green" }}>{availableChargersCount}</span>대
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>충전기 타입</TableCell>
              <TableCell>충전기 상태</TableCell>
              <TableCell>충전기 용량</TableCell>
              <TableCell>이용가능 시간</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chargingStationData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{ChargerType[row.chgerType]}</TableCell>
                <TableCell style={{ color: ChargerState[row.stat]?.color }}>
                  {ChargerState[row.stat].description}
                </TableCell>
                <TableCell>{row.output + "kW"}</TableCell>
                <TableCell>{row.useTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ChargingStationStateTable;
