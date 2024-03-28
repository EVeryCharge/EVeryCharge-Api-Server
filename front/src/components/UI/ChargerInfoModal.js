import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import { useSelectedItems } from "../../utils/StationInfoContext";
import Review from "../../pages/Review/Review";
import ChargingStationStateTable from "../Common/ChargingStationStateTable";
import ChargingStationInfo from "../Common/ChargingStationInfo";
import { Box } from "@material-ui/core";
const ChargerInfoModal = ({ isOpen, onRequestClose }) => {
  const { getStatId } = useSelectedItems();

  const closeModal = () => {
    onRequestClose();
  };

  useEffect(() => { }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Selected Marker"
      style={{
        overlay: {
          zIndex: 1000, // 모달 배경의 z-index
          marginLeft: "-41px"
        },
        content: {
          maxWidth: "1200px", // 최대 너비 설정
          width: "89%", // 모달의 너비를 조절합니다.
          height: "60%", // 모달의 높이를 조절합니다.
          display: "flex",
          justifyContent: "center", // 수평 가운데 정렬
          margin: "auto", 
          marginTop: "15vh",
          
        },
      }}
    >
      <Box style={{ maxWidth: "1000px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <ChargingStationInfo statId={getStatId()} />
        <ChargingStationStateTable statId={getStatId()} />
        <Review chargingStationId={getStatId()}></Review>
      </Box>
    </Modal>
  );
};

export default ChargerInfoModal;
