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

const ChargingStationMap = () => {
  const mapRef = useRef(null);
  const map = useRef(null);
  const [item, setItem] = useState([]);
  const [myLoc, setMyLoc] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: null, lng: null }); //중구
  const [isOpen, setIsOpen] = useState(false);
  const { setSelectedItem, getStatId } = useSelectedItems();
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState([]);
  const [customOverlays, setCustomOverlays] = useState([]);
  const [selectedOverlay, setSelectedOverlay] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    }

    function success(position) {
      setMyLoc({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setMapCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    }

    function error() {
      setMyLoc({
        lat: 37.5665,
        lng: 126.9784,
      });
      setMapCenter({
        lat: 37.5665,
        lng: 126.9784,
      });
    }
  }, []);

  useEffect(() => {
    if (myLoc) {
      initMap();
    }
  }, [myLoc]);

  useEffect(() => {
    setMarkerAndCustomOverlay(item);
  }, [item]);

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
        const newCenter = map.current.getCenter();
        setMapCenter({ lat: newCenter.getLat(), lng: newCenter.getLng() });

        // 이후의 지도 이동시에는 디바운스로 주변 충전소 불러오기
        fetchDataFromServerRangeQueryDebounced(
          newCenter.getLat(),
          newCenter.getLng()
        );
      }
    );
  };

  // 요청을 보내 마커 정보 데이터를 가져온 후 item에 저장
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
        const item = response;
        setItem(item);
      })
      .catch((error) => {
        console.log("Error fetching data", error);
      });
  };

  const setMarkerAndCustomOverlay = (item) => {
    // 기존 마커, 오버레이를 모두 삭제
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    // customOverlays.forEach((overlay) => {
    //   overlay.setMap(null);
    // });

    const newMarkers = item.map((item) => {
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
        // 모달을 닫고, 선택된 충전소 ID를 설정한 후 다시 모달을 열기
        setIsOpen(false);
        setSelectedItem(item);

        // 클릭된 마커와 오버레이를 상단에 노출, selected로 전환
        setSelectedMarker({ lat: item.lat, lng: item.lng });
        console.log("selectedMarker", selectedMarker);
        setIsOpen(true);
      });
      return marker;
    });
    setMarkers(newMarkers);
    console.log("뉴마커", newMarkers);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const fetchDataFromServerRangeQueryDebounced = debounce(
    fetchDataFromServerRangeQuery,
    3000
  ); //지도 고정 시 3000ms 마다 서버에 요청

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
