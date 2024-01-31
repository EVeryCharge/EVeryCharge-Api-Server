import React, { useEffect,useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';

const ChargerType = {
  "01":"DC차데모",
  "02":"AC완속",
  "03":"DC차데모+AC3상",
  "04":"DC콤보",
  "05":"DC차데모+DC콤보",
  "06":"DC차데모+AC상+DC콤보",
  "07":"AC상",
  "08":"DC콤보(완속)"
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
    useEffect(() => {
        // Axios를 사용하여 데이터를 가져옵니다.
        const url = `http://localhost:8090/api/v1/chargingStation/${statId}/chargers`;
        console.log(url);
        axios.get(url, {withCredentials: true})
          .then((response) => {
            // 요청이 성공하면 데이터를 상태에 저장합니다.
            console.log(response);
            console.log(response.data);
            const itemsArray = response.data.data[0].item;
            setChargingStationData(itemsArray);
            console.log(itemsArray);
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
            <TableCell>충전기 타입</TableCell>
            <TableCell>충전기 상태</TableCell>
            <TableCell>충전기 용량</TableCell>
            <TableCell>이용가능 시간</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {chargingStationData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{ChargerType[row.chgerType].description}</TableCell>
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
  );
};

export default ChargingStationStateTable;
