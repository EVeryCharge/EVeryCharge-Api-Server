import React, { useEffect,useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';




const ChargingStationStateTable = (stationId) => {
    const[chargingStationData, setChargingStationData] = useState([]);
    

    useEffect(() => {
        // Axios를 사용하여 데이터를 가져옵니다.
        axios.get(Credential,'http://localhost:8090/station/ME183219/chargers')
          .then((response) => {
            // 요청이 성공하면 데이터를 상태에 저장합니다.
            console.log(response.items);
            setChargingStationData(response.data);
            console.log(response.data);
          })
          .catch((error) => {
            // 오류가 발생하면 오류를 처리합니다.
            console.error('데이터를 불러오는 중 오류 발생:', error);
          });
      }, []); // 빈 배열을 두번째 인수로 전달하여 컴포넌트가 마운트될 때 한 번만 실행되도록 합니다.
    

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
          <TableCell>충전기 ID</TableCell>
            <TableCell>충전기 상태</TableCell>
            <TableCell>충전기 타입</TableCell>
            <TableCell>마지막 충전 시간</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {chargingStationData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.chgerId}</TableCell>
              <TableCell>{row.stat}</TableCell>
              <TableCell>{row.chgerType}</TableCell>
              <TableCell>{row.lastTsdt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ChargingStationStateTable;
