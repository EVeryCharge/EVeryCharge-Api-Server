import React, { useEffect, useMemo, useRef, useState } from "react";
import { HttpGet, HttpPost, HttpDelete, HttpPut } from '../../services/HttpService';  // 유틸리티 파일 경로를 업데이트하세요
import axios from 'axios';
import { debounce } from 'lodash';

const ChargingStationSearchMap = () => {
    const mapRef = useRef(null);
    const map = useRef(null); // 지도 객체를 useRef로 선언
    const [selectedItems, setSelectedItems] = useState([]);
    const [mapCenter, setMapCenter] = useState({
        lat: 36.39213160000001,
        lng: 127.02977109999999,
    });

    const initMap = () => {
        const container = mapRef.current; // mapRef.current를 통해 container 참조
        const options = {
            center: new window.kakao.maps.LatLng(mapCenter.lat, mapCenter.lng),
            level: 3,
        };

        map.current = new window.kakao.maps.Map(container, options); // useRef로 선언한 map에 할당
    };

    const fetchDataFromServerRangeQuery = (lat, lng) => {
        HttpGet(`/api/v1/chargingStation/search?pageSize=10&kw=안양시`)
            .then(response => {
                console.log(response);
                const items = response.chargingStationResponseDtoPage.content; // content 배열 추출

                items.forEach((itemData) => {
                    const { lat, lng } = itemData; // lat와 lng 값 추출
                    const markerPosition = new window.kakao.maps.LatLng(lat, lng);
                    const marker = new window.kakao.maps.Marker({
                        position: markerPosition
                    });
                    marker.setMap(map.current);

                    window.kakao.maps.event.addListener(marker, 'click', function() {
                        // 모달을 닫고, 선택된 충전소 ID를 설정한 후 다시 모달을 열기
                        setSelectedItems([itemData]);
                    });

                });
            })
            .catch(error => {
                console.log('Error fetching data', error);
            });
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        }

        function success(position) {
            setMapCenter({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            });
        }

        function error() {
            setMapCenter({
                lat: 36.483034,
                lng: 126.902435,
            });
            console.log("위치 받기 실패");
        }
    }, []);

    useEffect(() => {
        window.kakao.maps.load(() => {
            initMap();
            fetchDataFromServerRangeQuery(mapCenter.lat, mapCenter.lng);
        });
    }, [mapCenter]); // mapCenter 변경 시에도 initMap 호출

    const handleResetMap = () => {
        initMap(); // 함수를 호출하도록 수정
    };

    return (
        <div>
            <div
                id="map"
                style={{
                    margin: "20px",
                    width: "97%",
                    height: "calc(100vh - 205px)",
                    border: "1px solid #ccc",
                    overflow: "hidden",
                }}
                ref={mapRef}
                items={selectedItems}
            />
            <button
                style={{ position: "relative", zIndex: "2" }}
                onClick={handleResetMap} // 함수를 호출하도록 수정
            >
                위치 조정
            </button>
        </div>
    );
};

export default ChargingStationSearchMap;
