import React, { useEffect,useState } from 'react';
import axios from 'axios';

//서버에 데이터 요청해서 받아올 것
const chargingStationDate = [
    {
      
    },
    
  ];



const ChargingStationStateTable = () => {
    const[chargingStationData, setChargingStationData] = useState([]);
    // 기본 뼈대 - 수정 필요

    useEffect(() => {
        // Axios를 사용하여 데이터를 가져옵니다.
        axios.get('/chargingStation/status/charger/test')
          .then((response) => {
            // 요청이 성공하면 데이터를 상태에 저장합니다.
            setChargingStationData(response.data);
            console.log(response.data);
          })
          .catch((error) => {
            // 오류가 발생하면 오류를 처리합니다.
            console.error('데이터를 불러오는 중 오류 발생:', error);
          });
      }, []); // 빈 배열을 두번째 인수로 전달하여 컴포넌트가 마운트될 때 한 번만 실행되도록 합니다.
    

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>구분</th>
            <th>출처발신</th>
            <th>상태정보</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>급속1</td>
            <td>차데모, AC3상, 콤보</td>
            <td>최근충전일시 2024-01-24 17:48</td>
          </tr>
        </tbody>
      </table>
    </div>

    
  );
};

export default ChargingStationStateTable;
