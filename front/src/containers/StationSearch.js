import React, { useEffect, useRef, useState, useMemo } from 'react';
import axios from 'axios';
import ChargerInfoModal from './modal/ChargerInfoModal';
import { debounce } from 'lodash';
import { HttpGet, HttpPost } from '../services/HttpService';
const SearchMap = () => {
  const mapRef = useRef(null);
  let map; // 지도 객체를 담을 변수
  // const map = useRef(null);  
  const [mapCenter, setMapCenter] = useState({ lat: 36.39213160000001, lng: 127.02977109999999 });


  const initMap = () => {
    const container = document.getElementById("map");
    const options = {
      center: new window.kakao.maps.LatLng(mapCenter.lat, mapCenter.lng),
      level: 3
    };

    map = new window.kakao.maps.Map(container, options);
  }

  useMemo(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    }

    function success(position) {
      setMapCenter({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    }

    function error() {
      setMapCenter({
        latitude: 36.483034,
        longitude: 126.902435
      });
      console.log("위치 받기 실패");
    }
  }, [navigator.geolocation.getCurrentPosition]);


  useEffect(() => {
    window.kakao.maps.load(()=>initMap());
  }, [mapRef]);



  return (
    <div >


      <div
        id="map"
        style={{
          marginTop: '20px',
          width: '70%',
          height: 'calc(100vh - 165px)',
          border: '1px solid #ccc',
          overflow: 'hidden'
        }}
        ref={mapRef}
        
      />
      <button
        style={{ position: "relative", zIndex: "2" }}
        onClick={() => initMap}
      >위치 조정</button>

    </div>
  );
}

export default SearchMap;
