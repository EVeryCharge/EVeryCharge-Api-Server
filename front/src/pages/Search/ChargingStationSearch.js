import { Box } from "@material-ui/core";
import ChargingStationSearchBar from "./ChargingStationSearchBar";
import ChargingStationSearchMap from "./ChargingStationSearchMap";
import { useEffect, useState } from "react";
import { HttpGet } from "../../services/HttpService";

const ChargingStationSearch = () => {
  // useState로 searchParam에 대한 변화 감지
  const [searchResult, setSearchResult] = useState(null);
  const [userLat, setUserLat] = useState(null);
  const [userLng, setUserLng] = useState([null]);
  
  //지도를 위해 추가
  const [temporaryArray, setTemporaryArray] = useState([]);
  const [myLoc, setMyLoc] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    }

    function success(position) {
      setMyLoc({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      console.log(myLoc);
    }

    function error() {
      console.log("너");
    }
  }, []);

  useEffect(() => {
    console.log("검색 결과(리스트): ", searchResult);
    // 검색 결과가 변경될 때마다 temporaryArray 업데이트
    if (searchResult) {
      setTemporaryArray(searchResult); // 검색 결과를 temporaryArray에 저장
    }
  }, [searchResult]);
  // 추가 끝

  const fetchSearchResult = async (searchParam) => {
    try {
      console.log(
        "검색 조건: ",
        searchParam,
        "사용자 위도 / 경도: ",
        userLat,
        userLng
      );

      const response = await HttpGet(
        "/api/v1/chargingStation/searchBaseDistance",
        {
          ...searchParam,
          lat: userLat,
          lng: userLng,
        }
      );
      setSearchResult(response);
    } catch (error) {
      console.error("검색 결과 로딩 중 오류, error");
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{}}>
        <ChargingStationSearchBar onSearch={fetchSearchResult} />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <ChargingStationSearchMap temporaryArray={temporaryArray} myLoc={myLoc} />
      </Box>
    </Box>
  );
};

export default ChargingStationSearch;
