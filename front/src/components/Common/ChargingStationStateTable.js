import React, { useEffect,useState } from 'react';
import axios from 'axios';
import { HttpGet, HttpPost } from '../../services/HttpService';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@material-ui/core';

const ChargerType = {
  "1":"DC차데모",
  "2":"AC완속",
  "3":"DC차데모+AC3상",
  "4":"DC콤보",
  "5":"DC차데모+DC콤보",
  "6":"DC차데모+AC상+DC콤보",
  "7":"AC상",
  "8":"DC콤보(완속)"
}

const ChargerState = {
  "1":{ description: "통신이상", color: "red" },
  "2":{ description: "충전가능", color: "green" },
  "3":{ description: "충전중", color: "red" },
  "4":{ description: "운영중지", color: "red" },
  "5":{ description: "점검중", color: "red" },
  "9":{ description: "상태미확인", color: "black" }
}



const ChargingStationStateTable = ({statId}) => {
    const[chargingStationData, setChargingStationData] = useState([]);
    const availableChargersCount = chargingStationData.filter(row => row.stat === "2").length;
    useEffect(() => {
        console.log('ChargingStationStateTable 마운트')
        // Axios를 사용하여 데이터를 가져옵니다.
        HttpGet('/api/v1/chargingStation/chargerStatus',
        {statId: statId})
          .then((response) => {
            console.log(response);
            
            setChargingStationData(response);
            
          })
          .catch((error) => {
            // 오류가 발생하면 오류를 처리합니다.
            console.error('데이터를 불러오는 중 오류 발생:', error);
          });
      }, []); // 빈 배열을 두번째 인수로 전달하여 컴포넌트가 마운트될 때 한 번만 실행되도록 합니다.
    

  return (
    <div>
    <Typography variant="subtitle1">
      충전기 전체 {chargingStationData.length}대 | 충전가능 <span style={{ color: 'green' }}>{availableChargersCount}</span>대 
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
              <TableCell
                style={{ color: ChargerState[row.stat]?.color}}>
                  {ChargerState[row.stat].description}</TableCell> 
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
