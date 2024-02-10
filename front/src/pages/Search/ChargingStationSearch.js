import { Box } from "@material-ui/core";
import ChargingStationSearchBar from "./ChargingStationSearchBar";
import ChargingStationSearchMap from "./ChargingStationSearchMap";
import { useEffect, useState } from "react";
import { HttpGet } from "../../services/HttpService";

const ChargingStationSearch = () => {
  // useState로 searchParam에 대한 변화 감지
  const [searchResult, setSearchResult] = useState(null);
  const [userLat, setUserLat] = useState(null);
  const [userLng, setUserLng] = useState(null);

  const fetchSearchResult = (searchParam) => {
    try {
      console.log(
        "검색 조건: ",
        searchParam,
        "사용자 위도 / 경도: ",
        userLat,
        userLng
      );

      // List로 바인딩 param 별도 정제 (chgerType, busiId)
      const chgerTypeParam = searchParam.chgerType
        ? searchParam.chgerType.map((type) => `${type}`).join("&")
        : "";
      const busiIdParam = searchParam.busiId
        ? searchParam.busiId.map((id) => `${id}`).join("&")
        : "";
      const { chgerType, busiId, ...restParam } = searchParam;

      const response = HttpGet("/api/v1/chargingStation/searchBaseDistance", {
        ...restParam,
        chgerType: chgerTypeParam,
        busiId: busiIdParam,
        lat: userLat,
        lng: userLng,
      });

      setSearchResult(response);
      console.log("검색 결과(리스트): ", searchResult);
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
        <ChargingStationSearchMap />
      </Box>
    </Box>
  );
};

export default ChargingStationSearch;
