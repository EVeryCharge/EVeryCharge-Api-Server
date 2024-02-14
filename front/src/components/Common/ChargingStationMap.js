import React, { useEffect, useRef, useState } from "react";
import normalMarker from "../../assets/image/marker.png";
import { useSelectedItems } from "../../utils/StationInfoContext";
import ChargerInfoModal from "../UI/ChargerInfoModal";

import {
  Box,
  Button,
  Card,
  FormControl,
  InputAdornment,
  Switch,
  TextField,
  Typography,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import { HttpGet } from "../../services/HttpService";
import { Stack } from "@mui/material";
import ChargingStationSearchSwitch from "../../pages/Search/ChargingStationSearchSwitch";
const ChargingStationMap = () => {
  const mapRef = useRef(null);
  let map; // 지도 객체를 담을 변수
  const [isOpen, setIsOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9784 }); //중구
  const { setSelectedItem, getStatId } = useSelectedItems();
  const navigate = useNavigate();
  const [navigateSearchChecked, navigateSearch] = useState(false);

  useEffect(() => {
    map = new window.kakao.maps.Map(mapRef.current, {
      center: new window.kakao.maps.LatLng(mapCenter.lat, mapCenter.lng),
      level: 3,
      maxLevel: 10,
    });

    // 이벤트 리스너를 등록하여 지도의 중심 좌표가 변경될 때마다 서버에 데이터 요청
    window.kakao.maps.event.addListener(map, "center_changed", function () {
      const newCenter = map.getCenter();
      setMapCenter({ lat: newCenter.getLat(), lng: newCenter.getLng() });

      fetchDataFromServerRangeQueryDebounced(
        newCenter.getLat(),
        newCenter.getLng()
      );
    });

    fetchDataFromServerRangeQuery(mapCenter.lat, mapCenter.lng);
  }, []);

  useEffect(() => {
    if (navigateSearchChecked) {
      const timer = setTimeout(() => {
        navigate("/search");
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [navigateSearchChecked]);

  const handleNavigateSearch = () => {
    navigateSearch(!navigateSearchChecked);
  };

  const fetchDataFromServerRangeQuery = () => {
    const bounds = map.getBounds(); // 지도의 영역 가져오기
    const swLatLng = bounds.getSouthWest(); // 영역의 남서쪽 좌표 가져오기
    const neLatLng = bounds.getNorthEast(); // 영역의 북동쪽 좌표 가져오기

    HttpGet("/api/v1/chargingStation/location/search", {
      swLat: swLatLng.getLat(),
      swLng: swLatLng.getLng(),
      neLat: neLatLng.getLat(),
      neLng: neLatLng.getLng(),
    })
      .then((response) => {
        console.log(response);
        const item = response;

        item.forEach((itemData) => {
          const { lat, lng } = itemData;
          const markerPosition = new window.kakao.maps.LatLng(lat, lng);
          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
          });
          const markerImage = new window.kakao.maps.MarkerImage(
            normalMarker,
            new window.kakao.maps.Size(70, 70),
            new window.kakao.maps.Point(13, 34)
          );
          marker.setImage(markerImage);
          marker.setMap(map);

          window.kakao.maps.event.addListener(marker, "click", function () {
            // 모달을 닫고, 선택된 충전소 ID를 설정한 후 다시 모달을 열기
            setIsOpen(false);
            setSelectedItem(itemData);
            setIsOpen(true);
          });
        });
      })
      .catch((error) => {
        console.log("Error fetching data", error);
      });
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  const fetchDataFromServerRangeQueryDebounced = debounce(
    fetchDataFromServerRangeQuery,
    500
  ); //200ms마다 서버에 요청

  return (
    <div
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <ChargingStationSearchSwitch />
      <div
        id="map"
        sx={{
          flexGrow: 1,
        }}
        style={{
          width: "calc(100% - 2px)",
          height: "calc(100vh - 145px)",
          border: "1px solid #ccc",
          overflow: "hidden",
        }}
        ref={mapRef}
      />
      <ChargerInfoModal
        isOpen={isOpen}
        onRequestClose={closeModal}
        items={getStatId()}
      />
    </div>
  );
};

export default ChargingStationMap;
