import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import ChargerInfoModal from '../UI/ChargerInfoModal';
import  { useSelectedItems } from '../../utils/StationInfoContext';

import { debounce } from 'lodash';
import { HttpGet, HttpPost } from '../../services/HttpService';
const ChargingStationMap = () => {
  const mapRef = useRef(null);
  let map; // 지도 객체를 담을 변수
  const [isOpen, setIsOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9784 });  //중구
  const { setSelectedItem, getStatId } = useSelectedItems();

  useEffect(() => {
      map = new window.kakao.maps.Map(mapRef.current, {
      center: new window.kakao.maps.LatLng(mapCenter.lat, mapCenter.lng),
      level: 6
    });

    // 이벤트 리스너를 등록하여 지도의 중심 좌표가 변경될 때마다 서버에 데이터 요청
    window.kakao.maps.event.addListener(map, 'center_changed', function() {
      const newCenter = map.getCenter();
      setMapCenter({ lat: newCenter.getLat(), lng: newCenter.getLng() });

    
      fetchDataFromServerRangeQueryDebounced(newCenter.getLat(), newCenter.getLng());
    });

    fetchDataFromServerRangeQuery(mapCenter.lat, mapCenter.lng);
  }, []);

  const fetchDataFromServerRangeQuery = () => {
    const bounds = map.getBounds(); // 지도의 영역 가져오기
    const swLatLng = bounds.getSouthWest(); // 영역의 남서쪽 좌표 가져오기
    const neLatLng = bounds.getNorthEast(); // 영역의 북동쪽 좌표 가져오기

    HttpGet('/api/v1/chargingStation/location/search',{
        swLat: swLatLng.getLat(),
        swLng: swLatLng.getLng(),
        neLat: neLatLng.getLat(),
        neLng: neLatLng.getLng()
      })
      .then(response => {
        console.log(response);
        const item = response;
        
        item.forEach((itemData) => {
          const { lat, lng } = itemData;
          const markerPosition = new window.kakao.maps.LatLng(lat, lng);
          const marker = new window.kakao.maps.Marker({
            position: markerPosition
          });
          marker.setMap(map);
          
          window.kakao.maps.event.addListener(marker, 'click', function() {
            // 모달을 닫고, 선택된 충전소 ID를 설정한 후 다시 모달을 열기
            setIsOpen(false);
            setSelectedItem(itemData);
            setIsOpen(true);
          });

        });
      })
      .catch(error => {
        console.log('Error fetching data', error);
      });
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  const fetchDataFromServerRangeQueryDebounced = debounce(fetchDataFromServerRangeQuery, 500); //200ms마다 서버에 요청

  return (
      <div 
      style={{
        textAlign: 'center',
        padding: '10px'
      }}
    >
      <h3>전기차 충전소 지도</h3>
      <div 
        id="map" 
        style={{
          width: '100%', 
          height: 'calc(100vh - 40px)',
          margin: '20px auto', 
          border: '1px solid #ccc', 
          borderRadius: '10px', 
          overflow: 'hidden' 
        }}
        ref={mapRef}
      />
      <ChargerInfoModal isOpen={isOpen} onRequestClose={closeModal} items={getStatId()} />
      <p>지도의 위치가 변경될 때마다 실시간으로 데이터를 업데이트하며, 마커를 클릭하면 더 자세한 정보를 확인할 수 있습니다.</p>
      <p>더 많은 기능과 정보를 추가해보세요!</p>
    </div>
    
  );
}

export default ChargingStationMap;
