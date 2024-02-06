import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import ChargerInfoModal from './modal/ChargerInfoModal';
import { debounce } from 'lodash';
import { HttpGet, HttpPost } from '../services/HttpService';  
const MapContainer = () => {
  const mapRef = useRef(null);
  let map; // 지도 객체를 담을 변수
  // const map = useRef(null);  
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 35.49213160000001, lng: 127.02977109999999 });


  useEffect(() => {
      map = new window.kakao.maps.Map(mapRef.current, {
      center: new window.kakao.maps.LatLng(mapCenter.lat, mapCenter.lng),
      level: 1
    });

    // 이벤트 리스너를 등록하여 지도의 중심 좌표가 변경될 때마다 서버에 데이터 요청
    window.kakao.maps.event.addListener(map, 'center_changed', function() {
      const newCenter = map.getCenter();
      setMapCenter({ lat: newCenter.getLat(), lng: newCenter.getLng() });

    });


  }, []);



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

  
    </div>
  );
}

export default MapContainer;
