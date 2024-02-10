import { Box } from "@material-ui/core";
import ChargingStationSearchBar from "./ChargingStationSearchBar";
import ChargingStationSearchMap from "./ChargingStationSearchMap";
import { useEffect, useState } from "react";
import { HttpGet } from "../../services/HttpService";

const ChargingStationSearch = () => {
  const [searchResult, setSearchResult] = useState(null);
  const [userLat, setUserLat] = useState(null);
  const [userLng, setUserLng] = useState(null);

  useEffect(() => {
    console.log("검색 결과(리스트): ", searchResult);
  }, [searchResult]);

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
        <ChargingStationSearchBar
          onSearch={fetchSearchResult}
          searchResult={searchResult}
        />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <ChargingStationSearchMap />
      </Box>
    </Box>
  );
};

export default ChargingStationSearch;
