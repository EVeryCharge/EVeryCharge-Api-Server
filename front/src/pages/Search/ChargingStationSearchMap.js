import { Button, Tooltip } from "@material-ui/core";
import { GpsFixedOutlined, Refresh } from "@material-ui/icons";
import React, { useEffect, useRef, useState } from "react";
import normalMarker from "../../assets/image/marker.png";
import selectMarker from "../../assets/image/selectMarker.png";
import ChargerInfoModal from "../../components/UI/ChargerInfoModal";
import { useSelectedItems } from "../../utils/StationInfoContext";

const ChargingStationSearchMap = ({
  temporaryArray,
  myLoc,
  propsMapCenter,
  setMapLoc,
}) => {
  const mapRef = useRef(null);
  const map = useRef(null);
  const { setSelectedItem, getStatId } = useSelectedItems();
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    lat: null,
    lng: null,
  });
  const [mapCenterLoc, setMapCenterLoc] = useState({
    lat: null,
    lng: null,
  });
  const [markers, setMarkers] = useState([]);
  const [customOverlays, setCustomOverlays] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState([]);

  const initMap = () => {
    const container = mapRef.current;
    const options = {
      center: new window.kakao.maps.LatLng(myLoc.lat, myLoc.lng),
      level: 2,
      maxLevel: 10,
    };

    map.current = new window.kakao.maps.Map(container, options);
  };

  const fetchDataFromServerRangeQuery = async () => {
    if (!temporaryArray || !temporaryArray.content) {
      return;
    }
    const newItems = temporaryArray ? temporaryArray.content : [];
    setSelectedMarker({
      lat: null,
      lng: null,
    });
    setItems(newItems);
    map.current.setLevel(2);
  };

  useEffect(() => {
    marker(items);
  }, [items]);

  useEffect(() => {
    if (map && map.current && map.current.getLevel() >= 3) {
      console.log(map.current.getLevel());
      customOverlays.forEach((overlay) => {
        overlay.setVisible(false);
      });
    } else {
      customOverlays.forEach((overlay) => {
        overlay.setVisible(true);
      });
    }
  }, [map.current]);

  // 마커와 커스텀 오버레이의 클릭 이벤트 핸들러 함수
  const handleMarkerClick = (item) => {
    // 모달을 닫고, 선택된 충전소 ID를 설정한 후 다시 모달을 열기
    setIsOpen(false);
    setSelectedItem(item);

    // 클릭된 마커와 오버레이를 상단에 노출, selected로 전환
    setSelectedMarker({ lat: item.lat, lng: item.lng });
    setIsOpen(true);
  };

  const marker = (items) => {
    // 기존 마커, 오버레이를 모두 삭제
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    customOverlays.forEach((overlay) => {
      overlay.setMap(null);
    });

    if (items.length > 0) {
      const firstItem = items[0];
      setMapCenter({
        lat: firstItem.lat,
        lng: firstItem.lng,
      });

      const newCustomOverlays = items.map((item) => {
        const markerPosition = new window.kakao.maps.LatLng(item.lat, item.lng);

        const availableChgerColor = item.availableChger === 0 ? "red" : "green";
        const content = document.createElement("div");

        let truncatedBnm =
          item.bnm.length >= 7 ? item.bnm.slice(0, 6) + "··" : item.bnm;

        content.style.cssText = `
          text-align: center;
          font-weight: bold;
          font-size: 12px;
          background-color: white;
          border: 3px solid lightBlue;
          padding-top: 3px;
          padding-bottom: 3px;
          padding-left: 5px;
          border-top-right-radius: 20px;
          border-bottom-right-radius: 20px;
          position: absolute;
          left: 67px;
          top: -20px;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 85px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
        `;

        content.innerHTML = `
          <div style="margin-bottom: 1px; 
            font-size: 10px; 
            overflow: hidden; 
            text-overflow: ellipsis; 
            white-space: nowrap;"
              >${truncatedBnm}
          </div>
          <div style="overflow: hidden; 
            text-overflow: ellipsis; 
            white-space: nowrap;">
            <span style="color: ${availableChgerColor};"
            >${item.availableChger}</span> / ${item.totalChger}
          </div>
        `;

        // 커스텀 오버레이 클릭 이벤트 설정
        content.addEventListener("click", function () {
          handleMarkerClick(item);
        });

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

        return customOverlay;
      });
      setCustomOverlays(newCustomOverlays);

      const newMarkers = items.map((item) => {
        const markerPosition = new window.kakao.maps.LatLng(item.lat, item.lng);
        const markerImage =
          item.lat === selectedMarker.lat && item.lng === selectedMarker.lng
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
            item.lat === selectedMarker.lat && item.lng === selectedMarker.lng
              ? 4
              : 2,
        });
        marker.setImage(markerImage);

        // 마커 클릭 이벤트 등록
        window.kakao.maps.event.addListener(marker, "click", function () {
          handleMarkerClick(item);
        });
        return marker;
      });

      setMarkers(newMarkers);
    }
  };
  // props로 mapCenter를 전달받을 시 mapCenter를 수정
  useEffect(() => {
    if (propsMapCenter) {
      setSelectedMarker({
        lat: propsMapCenter.lat,
        lng: propsMapCenter.lng,
      });

      map.current.setLevel(1);
    }
  }, [propsMapCenter]);

  useEffect(() => {
    if (selectedMarker.lng != null) {
      marker(items);
      console.log("select");
      setMapCenter({
        lat: selectedMarker.lat,
        lng: selectedMarker.lng,
      });
    }
  }, [selectedMarker]);

  useEffect(() => {
    fetchDataFromServerRangeQuery();
  }, [temporaryArray]);

  useEffect(() => {
    if (myLoc) {
      initMap();
    }
  }, [myLoc]); // 최초 렌더링 시에만 initMap 호출

  useEffect(() => {
    if (map.current) {
      map.current.setCenter(
        new window.kakao.maps.LatLng(mapCenter.lat, mapCenter.lng)
      );
    }
  }, [mapCenter]);

  useEffect(() => {
    if (mapCenterLoc.lat != null) {
      console.log("mapCenterLoc" + mapCenterLoc.lat);
      setMapLoc({
        lat: mapCenterLoc.lat,
        lng: mapCenterLoc.lng,
      });
    }
  }, [mapCenterLoc, setMapLoc]);

  const handleResetMap = () => {
    map.current.setCenter(new window.kakao.maps.LatLng(myLoc.lat, myLoc.lng));
    map.current.setLevel(2);
  };

  const researchMapCenter = () => {
    const centerLat = map.current.getCenter().getLat();
    const centerLng = map.current.getCenter().getLng();
    setMapCenterLoc({
      lat: centerLat,
      lng: centerLng,
    });
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <div
        id="map"
        style={{
          width: "100%",
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

      <Button
        style={{
          position: "absolute",
          zIndex: "2",
          color: "white",
          justifyContent: "center",
          borderRadius: "20px",
          bottom: "30px",
          right: "50%",
          transform: "translate(50%, 50%)",
        }}
        variant="contained"
        color="primary"
        size="large"
        onClick={researchMapCenter}
      >
        <Refresh style={{ marginRight: "3px" }} />현 위치에서 재검색
      </Button>
    </div>
  );
};

export default ChargingStationSearchMap;
