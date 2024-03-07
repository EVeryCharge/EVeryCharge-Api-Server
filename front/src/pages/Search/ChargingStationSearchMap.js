import { Button, Tooltip } from "@material-ui/core";
import { GpsFixedOutlined, Refresh } from "@material-ui/icons";
import React, { useEffect, useRef, useState } from "react";
import normalMarker from "../../assets/image/marker.png";
import selectMarker from "../../assets/image/selectMarker.png";
import ChargerInfoModal from "../../components/UI/ChargerInfoModal";
import { useSelectedItems } from "../../utils/StationInfoContext";
import MapOverlayContent from "../../components/Common/MapOverlayContent";
import ReactDOM from "react-dom";

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
  const [selectedOverlay, setSelectedOverlay] = useState(null);

  useEffect(() => {
    setMarkerAndCustomOverlay(items);
  }, [items]);

  // props로 mapCenter를 전달받을 시 mapCenter를 수정
  useEffect(() => {
    if (propsMapCenter) {
      setSelectedMarker({
        lat: propsMapCenter.lat,
        lng: propsMapCenter.lng,
      });
    }
  }, [propsMapCenter]);

  useEffect(() => {
    if (selectedMarker.lng != null) {
      setMarkerAndCustomOverlay(items);
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

  // 지도 레벨 6 이상일 시 오버레이 숨김 (선택된 오버레이 제외)
  useEffect(() => {
    if (map && map.current) {
      const zoomChangeHandler = () => {
        const currentLevel = map.current.getLevel();
        customOverlays.forEach((overlay) => {
          if (selectedOverlay && overlay === selectedOverlay) {
            overlay.setVisible(true);
          } else if (currentLevel <= 5) {
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

  const setMarkerAndCustomOverlay = (items) => {
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
        } else if (map.current.getLevel() <= 5) {
          customOverlay.setVisible(true);
        } else {
          customOverlay.setVisible(false);
        }

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

        window.kakao.maps.event.addListener(marker, "click", function () {
          handleMarkerAndOverlayClick(item);
        });
        return marker;
      });

      setMarkers(newMarkers);
    }
  };

  const handleResetMap = () => {
    map.current.setCenter(new window.kakao.maps.LatLng(myLoc.lat, myLoc.lng));
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
