import React, {useEffect, useState} from 'react';
import Modal from 'react-modal';
import axios from 'axios';

const ChargerInfoModal = ({ isOpen, onRequestClose, items }) => {
  const [chargerStatusList, setChargerStatusList] = useState([]);
  
  const getStatus = (stat) => {
    switch(stat) {
      case '1':
        return "통신 이상";
      case '2':
        return "충전 대기";
      case '3':
        return "충전 중";
      case '4':
        return "운영 중지";
      case '5':
        return "점검 중";
      case '9':
        return "상태 미확인";
      default:
        return "알 수 없음";
    }
  };

  useEffect(() => {
    items.forEach(item => {
      axios.get(`https://apis.data.go.kr/B552584/EvCharger/getChargerInfo?serviceKey=xfxRkd9Ntag%2BmgCGh3yh%2B9f77aTMJlLPKaU7UMGBz9LnmwW3%2BnEtYZR6GRt%2BiyknBmvdVlkdC86laKLBVVttsw%3D%3D&numOfRows=999&pageNo=1&zcode=11&dataType=JSON&statId=${item.statId}`)
        .then(response => {
          setChargerStatusList(response.data.items.item);
          console.log(chargerStatusList[0].statId);
        })
        .catch(error => {
          console.log('Error fetching data', error);
        });
    });
  }, [items]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Selected Marker"
      style={{
        content: {
          width: '60%',  // 모달의 너비를 조절합니다.
          height: '60%',  // 모달의 높이를 조절합니다.
          margin: 'auto'  // 모달을 화면 중앙에 위치시킵니다.
        }
      }}
    >
      
      {chargerStatusList && chargerStatusList.map((item, index) => (
        <div key={index}>
          <h3>충전기 {item.chgerId}</h3>
          <p style={{ color: item.stat === '2' ? 'green' : 'initial' }}>상태: {getStatus(item.stat)}</p>
        </div>
      ))}
    </Modal>
  );
}

export default ChargerInfoModal;
