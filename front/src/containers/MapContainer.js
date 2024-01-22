import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import ChargerInfoModal from './modal/ChargerInfoModal';

const MapContainer = () => {
  const mapRef = useRef(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    axios.get('http://apis.data.go.kr/B552584/EvCharger/getChargerInfo?serviceKey=xfxRkd9Ntag%2BmgCGh3yh%2B9f77aTMJlLPKaU7UMGBz9LnmwW3%2BnEtYZR6GRt%2BiyknBmvdVlkdC86laKLBVVttsw%3D%3D&numOfRows=999&pageNo=1&zcode=11&dataType=JSON')
      .then(response => {
        const { item } = response.data.items;
        const map = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(37.49213160000001, 127.02977109999999),
          level: 3
        });

        item.forEach((itemData) => {
            const { lat, lng, stat } = itemData;
            const markerPosition = new window.kakao.maps.LatLng(lat, lng);
            const marker = new window.kakao.maps.Marker({
              position: markerPosition
            });
            marker.setMap(map);
          
            window.kakao.maps.event.addListener(marker, 'click', function() {
              // 모달을 닫고, 선택된 충전소 ID를 설정한 후 다시 모달을 열기
              setModalIsOpen(false);
              setSelectedItems([itemData]);
              setModalIsOpen(true);
          });
        });
      })
      .catch(error => {
        console.log('Error fetching data', error);
      });
  }, []);

  return (
    <div 
      style={{
        textAlign: 'center',
        padding: '20px'
      }}
    >
      <h1>전기차 충전소 지도</h1>
      <p>주변의 전기차 충전소 위치를 확인하세요.</p>
      <div 
        id="map" 
        style={{
          width: '45%', 
          height: '60vh', 
          margin: '20px auto', 
          border: '1px solid #ccc', 
          borderRadius: '10px', 
          overflow: 'hidden' 
        }}
        ref={mapRef}
      />

      <ChargerInfoModal 
        isOpen={modalIsOpen} 
        onRequestClose={() => setModalIsOpen(false)} 
        items={selectedItems} 
      />

      <p>위치 정보는 실시간으로 업데이트되며, 마커를 클릭하면 더 자세한 정보를 확인할 수 있습니다.</p>
      <p>더 많은 기능과 정보를 추가해보세요!</p>
    </div>
  );
}

export default MapContainer;
