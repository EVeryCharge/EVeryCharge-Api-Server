import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ChargerInfoModal from "../UI/ChargerInfoModal";
import { useSelectedItems } from "../../utils/StationInfoContext";
import normalMarker from '../../assets/image/marker.png';

import { debounce } from "lodash";
import { HttpGet, HttpPost } from "../../services/HttpService";
import {
  Box,
  Button,
  Card,
  FormControl,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { useNavigate } from "react-router-dom";
const ChargingStationMap = () => {
  const mapRef = useRef(null);
  let map; // 지도 객체를 담을 변수
  const [isOpen, setIsOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9784 }); //중구
  const { setSelectedItem, getStatId } = useSelectedItems();
  const navigate = useNavigate();

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
          marker.setImage(markerImage)
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

  const handleSearchClick = () => {
    navigate("/search");
  };

  return (
    <div
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box sx={{ zIndex: 2, position: "fixed", top: "10%", left: "0%" }}>
        <Box
          onClick={handleSearchClick}
          style={{ cursor: "pointer", zIndex: "3" }}
        >
          <Card
            style={{
              backgroundColor: "#EFF8FB",
              width: "250px",
              padding: "10px",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.4)",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: "2",
            }}
          >
            <FormControl fullWidth>
              <TextField
                size="small"
                sx={{ fontSize: "11px", cursor: "pointer" }}
                label="충전소 검색"
                disabled
                variant="outlined"
                color="primary"
                InputProps={{
                  style: { cursor: "pointer", color: "black" },
                  inputProps: {
                    onClick: handleSearchClick,
                  },
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="primary" />
                      <Button color="primary" onClick={handleSearchClick}>
                        충전소 검색을 시작해보세요!
                      </Button>
                    </InputAdornment>
                  ),
                  // 여기에 버튼 요소를 넣어서 해결하기
                  endAdornment: (
                    <InputAdornment position="start"></InputAdornment>
                  ),
                }}
              />
            </FormControl>
          </Card>
        </Box>
      </Box>
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
