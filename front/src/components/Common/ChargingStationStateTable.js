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
  "01": "DC차데모",
  "02": "AC완속",
  "03": "DC차데모 + AC3상",
  "04": "DC콤보",
  "05": "DC차데모 + DC콤보",
  "06": "DC차데모 + AC상 + DC콤보",
  "07": "AC상",
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

  const tableCellStyle = {
    padding: "4px",
    textAlign: "center",
    fontWeight: "bold",
    paddingTop: "13px",
    paddingBottom: "13px",
  };
  const tableCellStyle2 = {
    padding: "4px",
    textAlign: "center", 
    paddingTop: "13px",
    paddingBottom: "13px",
  };

  return (
    <div
      style={{
        marginBottom: "20px",
        marginLeft: "-22.5px",
        marginRight: "10px",
        width: "102.5%",
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
              <TableCell style={tableCellStyle}>타입</TableCell>
              <TableCell style={tableCellStyle}>상태</TableCell>
              <TableCell style={tableCellStyle}>용량</TableCell>
              <TableCell style={tableCellStyle}>이용시간</TableCell>
              <TableCell style={tableCellStyle}>최근이용</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chargingStationData.map((row, index) => (
              <TableRow key={index}>
                <TableCell style={tableCellStyle2}>
                  {ChargerType[row.chgerType] || "확인불가"}
                </TableCell>
                <TableCell
                  style={{
                    color: ChargerState[row.stat]?.color,
                    padding: "4px",
                    textAlign: "center",
                  }}
                >
                  {ChargerState[row.stat].description}
                </TableCell>
                <TableCell style={tableCellStyle2}>
                  {row.output ? row.output + "kW" : "확인불가"}
                </TableCell>
                <TableCell style={tableCellStyle2}>{row.useTime}</TableCell>
                <TableCell style={tableCellStyle2}>
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
