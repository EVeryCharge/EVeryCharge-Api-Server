import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ChargerInfoBottomSheet.css"; // CSS 파일 추가

const ChargerInfoBottomSheet = ({ isOpen, items }) => {
  const [chargerStatusList, setChargerStatusList] = useState([]);

  const getStatus = (stat) => {
    switch (stat) {
      case "1":
        return "통신 이상";
      case "2":
        return "충전 대기";
      case "3":
        return "충전 중";
      case "4":
        return "운영 중지";
      case "5":
        return "점검 중";
      case "9":
        return "상태 미확인";
      default:
        return "알 수 없음";
    }
  };

  useEffect(() => {
    items.forEach((item) => {
      axios
        .get(
          `https://apis.data.go.kr/B552584/EvCharger/getChargerInfo?serviceKey=xfxRkd9Ntag%2BmgCGh3yh%2B9f77aTMJlLPKaU7UMGBz9LnmwW3%2BnEtYZR6GRt%2BiyknBmvdVlkdC86laKLBVVttsw%3D%3D&numOfRows=999&pageNo=1&zcode=11&dataType=JSON&statId=${item.statId}`
        )
        .then((response) => {
          setChargerStatusList(response.data.items.item);
          // console.log(chargerStatusList[0].statId);
        })
        .catch((error) => {
          console.log("Error fetching data", error);
        });
    });
  }, [items]);

  return (
    <div className={`bottomSheet ${isOpen ? "open" : ""}`}>
      {chargerStatusList &&
        chargerStatusList.map((item, index) => (
          <div key={index} className="bottomSheet-item">
            <h3>충전기 {item.chgerId}</h3>
            <p style={{ color: item.stat === "2" ? "green" : "initial" }}>
              상태: {getStatus(item.stat)}
            </p>
          </div>
        ))}
    </div>
  );
};
export default ChargerInfoBottomSheet;
