import React, {useEffect, useState} from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import  { useSelectedItems } from '../../utils/StationInfoContext';
import  Review  from '../../pages/Review/Review';
import ChargingStationStateTable from '../Common/ChargingStationStateTable';
import ChargingStationInfo from '../Common/ChargingStationInfo';
const ChargerInfoModal = ({ isOpen, onRequestClose }) => {
  const { setSelectedItem, getStatId, getSelectedItem } = useSelectedItems();

  const closeModal = () => {
    onRequestClose();
  };
  

  useEffect(() => {
    console.log('ChargerInfoModal 마운트');
    
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Selected Marker"
      
      style={{
        overlay: {
          zIndex: 1000, // 모달 배경의 z-index
        },
        content: {
          width: '50%',  // 모달의 너비를 조절합니다.
          height: '60%',  // 모달의 높이를 조절합니다.
          margin: 'auto'  // 모달을 화면 중앙에 위치시킵니다.
        }
      }}
    >
      
      <ChargingStationStateTable statId={getStatId()} />
      <ChargingStationInfo item={getSelectedItem()}></ChargingStationInfo>
      <Review chargingStationId={getStatId()}></Review>
    </Modal>
  );
}

export default ChargerInfoModal;
