import { Button, Tooltip } from "@material-ui/core";
import { GpsFixedOutlined } from "@material-ui/icons";
import React, { useEffect, useRef, useState } from "react";
import ChargerInfoModal from '../../components/UI/ChargerInfoModal';
import { useSelectedItems } from '../../utils/StationInfoContext';
import normalMarker from '../../assets/image/marker.png';
import selectMarker from '../../assets/image/selectMarker.png';



const ChargingStationSearchMap = ({
  temporaryArray,
  myLoc,
  propsMapCenter,
  setMapLoc
}) => {
  const mapRef = useRef(null);
  const map = useRef(null); // 지도 객체를 useRef로 선언
  const { setSelectedItem, getStatId } = useSelectedItems();
  const [isOpen, setIsOpen] = useState(false);

  const [mapCenter, setMapCenter] = useState({
    lat: 37.5665,
    lng: 126.9784,
  });

  const [mapCenterLoc, setMapCenterLoc] = useState({
    lat: 37.5665,
    lng: 126.9784,
  });

  const [markers, setMarkers] = useState([]); // 마커 배열을 상태로 관리
  const [selectedMarker, setSelectedMarker] = useState([]); // 마커 배열을 상태로 관리


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
      // console.log("temporaryArray is undefined or does not contain 'content'");
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
        const markerImage = (item.lat === mapCenter.lat && item.lng === mapCenter.lng) ?  
        new window.kakao.maps.MarkerImage(
            selectMarker,
            new window.kakao.maps.Size(70, 70), 
            new window.kakao.maps.Point(13, 34)
        ) : 
        new window.kakao.maps.MarkerImage(
            normalMarker,
            new window.kakao.maps.Size(70, 70), 
            new window.kakao.maps.Point(13, 34)
        );
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
          map: map.current,
        });
        marker.setImage(markerImage)
        window.kakao.maps.event.addListener(marker, 'click', function () {
          // 모달을 닫고, 선택된 충전소 ID를 설정한 후 다시 모달을 열기
          setIsOpen(false);
          setSelectedItem(item);
          setIsOpen(true);
        });
        return marker;
      });
      setMarkers(newMarkers);
      
      // console.log(items);
    } else {
      // console.log("latLngArray is empty");
    }
  };

  // props로 mapCenter를 전달받을 시 mapCenter를 수정한다. (이상제)
  useEffect(() => {
    if (propsMapCenter) {
      setSelectedMarker({
        lat: propsMapCenter.lat,
        lng: propsMapCenter.lng,
      });
      setMapCenter({
        lat: propsMapCenter.lat,
        lng: propsMapCenter.lng,
      });
      map.current.setLevel(1);
    }
    console.log(selectedMarker)
  }, [propsMapCenter]);

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

  const handleResetMap = () => {
    map.current.setCenter(new window.kakao.maps.LatLng(myLoc.lat, myLoc.lng));
    map.current.setLevel(3);
  };

  useEffect(() => {
    console.log(mapCenterLoc);
    setMapLoc({
      lat: mapCenterLoc.lat,
      lng: mapCenterLoc.lng
    });
  }, [mapCenterLoc, setMapLoc]);

  const researchMapCenter = () => {
    const centerLat = map.current.getCenter().getLat();
    const centerLng = map.current.getCenter().getLng();
    setMapCenterLoc({
      lat: centerLat,
      lng: centerLng
    })
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
      <ChargerInfoModal isOpen={isOpen} onRequestClose={closeModal} items={getStatId()} />

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
        size="large" // 이 부분을 수정
        onClick={researchMapCenter}
      >
        현 위치에서 재검색
      </Button>
    </div>
  );
};

export default ChargingStationSearchMap;
