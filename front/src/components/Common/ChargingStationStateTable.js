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
  1: { description: "통신이상", color: "black" },
  2: { description: "충전가능", color: "green" },
  3: { description: "충전중", color: "orange" },
  4: { description: "운영중지", color: "red" },
  5: { description: "점검중", color: "red" },
  9: { description: "상태미확인", color: "black" },
};

const ChargingStationStateTable = ({ statId }) => {
  const [chargingStationData, setChargingStationData] = useState([]);
  const availableChargersCount = chargingStationData.filter(
    (row) => row.stat === "2"
  ).length;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

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
    <div
      style={{
        marginBottom: "20px",
        padding: "5px",
      }}
    >
      <Typography
        variant="subtitle1"
        style={{
          fontWeight: "bold",
          marginBottom: "3px",
          padding: "3px",
          backgroundColor: "whitesmoke",
        }}
      >
        충전기 전체 {chargingStationData.length}대 | 충전가능
        <span style={{ color: "green" }}> {availableChargersCount}대</span>
      </Typography>
      <TableContainer>
        <Table style={{ border: "1px groove lightgrey" }}>
          <TableHead>
            <TableRow style={{ borderBottom: "1.5px solid grey" }}>
              <TableCell style={{ fontWeight: "bold" }}>타입</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>상태</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>용량</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>이용시간</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>최근이용</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chargingStationData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{ChargerType[row.chgerType]}</TableCell>
                <TableCell style={{ color: ChargerState[row.stat]?.color }}>
                  {ChargerState[row.stat].description}
                </TableCell>
                <TableCell>
                  {row.output ? row.output + "kW" : "확인불가"}
                </TableCell>
                <TableCell>{row.useTime}</TableCell>
                <TableCell>
                  {row.lastTedt ? formatDate(row.lastTedt) : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ChargingStationStateTable;
