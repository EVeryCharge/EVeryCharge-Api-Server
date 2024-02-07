import React, { useEffect, useMemo, useRef, useState } from "react";

const ChargingStationSearchMap = () => {
    const mapRef = useRef(null);
    const map = useRef(null); // 지도 객체를 useRef로 선언
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

    useMemo(() => {
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
        window.kakao.maps.load(() => initMap());
    }, [mapCenter]); // mapCenter 변경 시에도 initMap 호출

    const handleResetMap = () => {
        initMap(); // 함수를 호출하도록 수정
    };

    return (
        <div>
            <div
                id="map"
                style={{
                    marginTop: "20px",
                    width: "70%",
                    height: "calc(100vh - 165px)",
                    border: "1px solid #ccc",
                    overflow: "hidden",
                }}
                ref={mapRef}
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
