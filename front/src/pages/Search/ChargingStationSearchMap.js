import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@material-ui/core";

const ChargingStationSearchMap = ({
  temporaryArray,
  myLoc,
  propsMapCenter,
}) => {
  const mapRef = useRef(null);
  const map = useRef(null); // 지도 객체를 useRef로 선언
  const [mapCenter, setMapCenter] = useState({
    lat: 36.483034,
    lng: 126.902435,
  });

  const [markers, setMarkers] = useState([]); // 마커 배열을 상태로 관리

  const initMap = () => {
    const container = mapRef.current; // mapRef.current를 통해 container 참조
    const options = {
      center: new window.kakao.maps.LatLng(myLoc.lat, myLoc.lng),
      level: 3,
      maxLevel: 10,
    };

    map.current = new window.kakao.maps.Map(container, options); // useRef로 선언한 map에 할당
  };

  const fetchDataFromServerRangeQuery = async () => {
    if (!temporaryArray || !temporaryArray.content) {
      console.log("temporaryArray is undefined or does not contain 'content'");
      return;
    }
    map.current.setLevel(3);
    const items = temporaryArray ? temporaryArray.content : [];

    // 기존 마커를 모두 삭제
    markers.forEach((marker) => marker.setMap(null));

    if (items.length > 0) {
      const firstItem = items[0];
      setMapCenter({
        lat: firstItem.lat,
        lng: firstItem.lng,
      });

      const newMarkers = items.map((item) => {
        const markerPosition = new window.kakao.maps.LatLng(item.lat, item.lng);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
          map: map.current,
        });
        return marker;
      });
      setMarkers(newMarkers);
      console.log(items);
    } else {
      console.log("latLngArray is empty");
    }
  };

  // props로 mapCenter를 전달받을 시 mapCenter를 수정한다. (이상제)
  useEffect(() => {
    if (propsMapCenter) {
      setMapCenter({
        lat: propsMapCenter.lat,
        lng: propsMapCenter.lng,
      });
    }
  }, [propsMapCenter]);

  useEffect(() => {
    fetchDataFromServerRangeQuery();
  }, [temporaryArray]);

  useEffect(() => {
    if (myLoc) {
      // myLoc이 null이 아닐 때만 initMap 호출
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

  const handleResetMap = () => {
    map.current.setCenter(new window.kakao.maps.LatLng(myLoc.lat, myLoc.lng));
    map.current.setLevel(3);
  };

  return (
    <div style={{ position: "relative" }}>
      {" "}
      {/* 부모 요소를 relative로 설정 */}
      <div
        id="map"
        style={{
          margin: "20px",
          width: "97%",
          // height: "calc(100vh - 205px)",
          height: "calc(100vh - 195px)",
          border: "1px solid #ccc",
          overflow: "hidden",
        }}
        ref={mapRef}
      />
      <Button
        style={{
          position: "absolute",
          zIndex: "2",
          bottom: "10px",
          right: "40px",
        }}
        variant="contained"
        color="primary"
        onClick={handleResetMap} // 함수를 호출하도록 수정
      >
        내 위치 기준 지도 정렬
      </Button>
    </div>
  );
};

export default ChargingStationSearchMap;
