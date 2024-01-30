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
  "1":"통신이상",
  "2":"충전대기",
  "3":"충전중",
  "4":"운영중지",
  "5":"점검중",
  "9":"상태미확인"
}


const ChargingStationStateTable = ({statId}) => {
    const[chargingStationData, setChargingStationData] = useState([]);
    useEffect(() => {
        // Axios를 사용하여 데이터를 가져옵니다.
        //임시데이터
        statId = "ME19A278";
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
              <TableCell>{ChargerType[row.chgerType]}</TableCell>
              <TableCell>{ChargerState[row.stat]}</TableCell> 
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
