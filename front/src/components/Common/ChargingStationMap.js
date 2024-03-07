import React, { useEffect, useRef, useState } from "react";
import normalMarker from "../../assets/image/marker.png";
import selectMarker from "../../assets/image/selectMarker.png";
import { useSelectedItems } from "../../utils/StationInfoContext";
import { GpsFixedOutlined } from "@material-ui/icons";
import ChargerInfoModal from "../UI/ChargerInfoModal";

import { debounce } from "lodash";
import { HttpGet } from "../../services/HttpService";
import { Button, Tooltip } from "@material-ui/core";
import ChargingStationSearchSwitch from "../../pages/Search/ChargingStationSearchSwitch";
import ReactDOM from "react-dom";
import MapOverlayContent from "./MapOverlayContent";

const ChargingStationMap = () => {
  const mapRef = useRef(null);
  const map = useRef(null);
  const [items, setItems] = useState([]);
  const [myLoc, setMyLoc] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { setSelectedItem, getStatId } = useSelectedItems();
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState([]);
  const [customOverlays, setCustomOverlays] = useState([]);
  const [selectedOverlay, setSelectedOverlay] = useState(null);

  // 위치 정보 동의 시 접속 위치를 고정
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    }

    function success(position) {
      setMyLoc({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    }

    function error() {
      setMyLoc({
        lat: 37.5665,
        lng: 126.9784,
      });
    }
  }, []);

  // 현 접속 위치 고정 시 최초 1회 지도 마운트
  useEffect(() => {
    if (myLoc) {
      initMap();
    }
  }, [myLoc]);

  useEffect(() => {
    setMarkerAndCustomOverlay(items);
  }, [items]);

  useEffect(() => {
    if (selectedMarker.lng != null) {
      setMarkerAndCustomOverlay(items);
    }
  }, [selectedMarker]);

  // 지도 레벨 5 이상일 시 오버레이 숨김 (선택된 오버레이 제외)
  useEffect(() => {
    if (map && map.current) {
      const zoomChangeHandler = () => {
        const currentLevel = map.current.getLevel();
        customOverlays.forEach((overlay) => {
          if (selectedOverlay && overlay === selectedOverlay) {
            overlay.setVisible(true);
          } else if (currentLevel <= 4) {
            overlay.setVisible(true);
          } else {
            overlay.setVisible(false);
          }
        });
      };

      window.kakao.maps.event.addListener(
        map.current,
        "zoom_changed",
        zoomChangeHandler
      );

      return () => {
        window.kakao.maps.event.removeListener(
          map.current,
          "zoom_changed",
          zoomChangeHandler
        );
      };
    }
  }, [map.current, customOverlays, selectedMarker]);

  const initMap = () => {
    const container = mapRef.current;
    const options = {
      center: new window.kakao.maps.LatLng(myLoc.lat, myLoc.lng),
      level: 2,
      maxLevel: 5,
    };
    map.current = new window.kakao.maps.Map(container, options);
    // 최초 지도 접근 시 지도상 주변 충전소를 불러오기(최초 1회만 실행)
    fetchDataFromServerRangeQuery();

    // 이벤트 리스너를 등록하여 지도의 중심 좌표가 변경될 때마다 서버에 데이터 요청
    window.kakao.maps.event.addListener(
      map.current,
      "center_changed",
      function () {
        // const newCenter = map.current.getCenter();

        // 이후의 지도 이동시에는 디바운스로 주변 충전소 불러오기
        fetchDataFromServerRangeQueryDebounced();
        // newCenter.getLat(),
        // newCenter.getLng()
      }
    );
  };

  // 요청을 보내 마커 정보 데이터를 가져온 후 items에 저장
  const fetchDataFromServerRangeQuery = () => {
    const bounds = map.current.getBounds(); // 지도의 영역 가져오기
    const swLatLng = bounds.getSouthWest(); // 영역의 남서쪽 좌표 가져오기
    const neLatLng = bounds.getNorthEast(); // 영역의 북동쪽 좌표 가져오기

    HttpGet("/api/v1/chargingStation/location/search", {
      swLat: swLatLng.getLat(),
      swLng: swLatLng.getLng(),
      neLat: neLatLng.getLat(),
      neLng: neLatLng.getLng(),
    })
      .then((response) => {
        const items = response;
        setItems(items);
      })
      .catch((error) => {
        console.log("Error fetching data", error);
      });
  };

  // 지도 고정 시 3000ms 마다 서버에 요청
  const fetchDataFromServerRangeQueryDebounced = debounce(
    fetchDataFromServerRangeQuery,
    3000
  );

  const setMarkerAndCustomOverlay = (items) => {
    // 기존 마커, 오버레이를 모두 삭제
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    customOverlays.forEach((overlay) => {
      overlay.setMap(null);
    });

    const newCustomOverlays = items.map((item) => {
      const markerPosition = new window.kakao.maps.LatLng(item.lat, item.lng);
      const contentBeforeRender = (
        <MapOverlayContent
          bnm={item.bnm}
          availableChger={item.availableChger}
          totalChger={item.totalChger}
          onClick={() => handleMarkerAndOverlayClick(item)}
        />
      );

      // React 컴포넌트로 content를 렌더링 후 마운트
      const content = document.createElement("div");
      ReactDOM.render(contentBeforeRender, content);

      const customOverlay = new window.kakao.maps.CustomOverlay({
        content: content,
        position: markerPosition,
        map: map.current,
        clickable: true,
        zIndex:
          item.lat === selectedMarker.lat && item.lng === selectedMarker.lng
            ? 3
            : 1,
      });

      if (
        selectedMarker &&
        selectedMarker.lat === item.lat &&
        selectedMarker.lng === item.lng
      ) {
        customOverlay.setVisible(true);
        setSelectedOverlay(customOverlay);
      } else if (map.current.getLevel() <= 4) {
        customOverlay.setVisible(true);
      } else {
        customOverlay.setVisible(false);
      }

      return customOverlay;
    });
    setCustomOverlays(newCustomOverlays);

    const newMarkers = items.map((item) => {
      const { lat, lng } = item;
      const markerPosition = new window.kakao.maps.LatLng(lat, lng);
      const markerImage =
        lat === selectedMarker.lat && lng === selectedMarker.lng
          ? new window.kakao.maps.MarkerImage(
              selectMarker,
              new window.kakao.maps.Size(70, 70),
              new window.kakao.maps.Point(13, 34)
            )
          : new window.kakao.maps.MarkerImage(
              normalMarker,
              new window.kakao.maps.Size(70, 70),
              new window.kakao.maps.Point(13, 34)
            );
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        map: map.current,
        zIndex:
          lat === selectedMarker.lat && lng === selectedMarker.lng ? 4 : 2,
      });
      marker.setImage(markerImage);

      window.kakao.maps.event.addListener(marker, "click", function () {
        handleMarkerAndOverlayClick(item);
      });
      return marker;
    });
    setMarkers(newMarkers);
  };

  // 마커와 커스텀 오버레이의 클릭 이벤트 핸들러 함수
  const handleMarkerAndOverlayClick = (item) => {
    // 모달을 닫고, 선택된 충전소 ID를 설정한 후 다시 모달을 열기
    setIsOpen(false);
    setSelectedItem(item);

    // 클릭된 마커와 오버레이를 상단에 노출, selected로 전환
    setSelectedMarker({ lat: item.lat, lng: item.lng });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleResetMap = () => {
    map.current.setCenter(new window.kakao.maps.LatLng(myLoc.lat, myLoc.lng));
  };

  return (
    <div
      style={{
        position: "relative",
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
      <Tooltip title="접속 위치로 지도 이동" placement="left-start">
        <Button
          style={{
            position: "absolute",
            zIndex: "2",
            backgroundColor: "white",
            color: "black",
            bottom: "10px",
            right: "40px",
            justifyContent: "center",
            borderRadius: "20px",
          }}
          variant="contained"
          color="primary"
          onClick={handleResetMap}
          size="large"
        >
          <GpsFixedOutlined />
        </Button>
      </Tooltip>
    </div>
  );
};

export default ChargingStationMap;
