import React, { useEffect, useMemo, useRef, useState } from "react";


const ChargingStationSearchMap = ({ temporaryArray }) => {
  const mapRef = useRef(null);
  const map = useRef(null); // 지도 객체를 useRef로 선언
  const [mapCenter, setMapCenter] = useState({
    lat: 36.39213160000001,
    lng: 127.02977109999999,
  });
  const [myLocation, setMyLocation] = useState({});
  const [keyword, setKeyword] = useState("서울시");
  const [markers, setMarkers] = useState([]); // 마커 배열을 상태로 관리
  const [searchData, setSearchData] = useState([]);


  const initMap = () => {
    const container = mapRef.current; // mapRef.current를 통해 container 참조
    const options = {
      center: new window.kakao.maps.LatLng(mapCenter.lat, mapCenter.lng),
      level: 3,
      maxLevel: 8
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
          const markerPosition = new window.kakao.maps.LatLng(
            item.lat,
            item.lng
          );
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

  useEffect(() => {
    window.kakao.maps.load(() => {
      initMap();
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    }

    function success(position) {
      setMyLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      console.log("내" + mapCenter.lng);
    }

    function error() {
      setMyLocation({
        lat: 36.483034,
        lng: 126.902435,
      });
      console.log("위치 받기 실패");
    }
  }, []); // 최초 렌더링 시에만 initMap 호출

  useEffect(() => {
    if (map.current) {
      map.current.setCenter(
        new window.kakao.maps.LatLng(mapCenter.lat, mapCenter.lng)
      );
    }
  }, [mapCenter]);

  const handleResetMap = () => {
    map.current.setCenter(
      new window.kakao.maps.LatLng(myLocation.lat, myLocation.lng)
    );
  };
  const handleResetMap2 = () => {
    fetchDataFromServerRangeQuery();
  };

  const handleResetMap3 = () => {
    setMyLocation({
      lat: 36.483034,
      lng: 126.902435,
    });
    console.log("llll" + mapCenter.lng);
  };

  const handleInputChange = (event) => {
    setKeyword(event.target.value);
  };
  const handleInputKeyPress = (event) => {
    if (event.key === "Enter") {
      fetchDataFromServerRangeQuery();
    }
  };

  return (
    <div>
      <div
        id="map"
        style={{
          margin: "20px",
          width: "97%",
          // height: "calc(100vh - 205px)",
          height: "calc(100vh - 225px)",
          border: "1px solid #ccc",
          overflow: "hidden",
        }}
        ref={mapRef}
      />
      <button
        style={{ position: "relative", zIndex: "2" }}
        onClick={handleResetMap} // 함수를 호출하도록 수정
      >
        내위치로 돌아가기
      </button>
      <button
        style={{ position: "relative", zIndex: "2" }}
        onClick={handleResetMap2} // 함수를 호출하도록 수정
      >
        test
      </button>
      <button
        style={{ position: "relative", zIndex: "2" }}
        onClick={handleResetMap3} // 함수를 호출하도록 수정
      >
        setlocation
      </button>
      <input
        type="text"
        value={keyword}
        onChange={handleInputChange}
        onKeyPress={handleInputKeyPress} // 엔터 키 입력을 처리하는 핸들러 추가
        placeholder="Enter keyword"
      />
    </div>
  );
};

export default ChargingStationSearchMap;
