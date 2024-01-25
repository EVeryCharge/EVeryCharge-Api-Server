import React from 'react';

//서버에 데이터 요청해서 받아올 것
const chargingStationDate = [
    {
      
    },
    
  ];

const ChargingStationStateTable = () => {
    // 기본 뼈대 - 수정 필요
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
            <td>급속1</td>
            <td>차데모, AC3상, 콤보</td>
            <td>최근충전일시 2024-01-24 17:48</td>
        </tbody>
      </table>
    </div>
  );
};

export default ChargingStationStateTable;
