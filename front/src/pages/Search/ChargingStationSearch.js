import { Box } from "@material-ui/core";
import ChargingStationSearchBar from "./ChargingStationSearchBar";
import ChargingStationSearchMap from "./ChargingStationSearchMap";
import { useEffect, useState } from "react";
import { HttpGet } from "../../services/HttpService";

const ChargingStationSearch = () => {
  const [searchResult, setSearchResult] = useState(null);
  const [myLoc, setMyLoc] = useState(null);
  const [temporaryArray, setTemporaryArray] = useState([]);
  const [mapCenter, setMapCenter] = useState(null);

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
      setMyLoc({
        lat: 36.483034,
        lng: 126.902435,
      });
    }
  }, []);

  useEffect(() => {
    console.log("검색 결과(리스트): ", searchResult);
    if (searchResult) {
      setTemporaryArray(searchResult);
    }
  }, [searchResult]);

  const fetchSearchResult = async (searchParam) => {
    try {
      console.log("검색 조건: ", searchParam, "사용자 위도 / 경도: ", myLoc);

      const response = await HttpGet(
        "/api/v1/chargingStation/searchBaseDistance",
        {
          ...searchParam,
          ...myLoc,
        }
      );
      setSearchResult(response);
    } catch (error) {
      console.error("검색 결과 로딩 중 오류, error");
    }
  };

  const handleMapMove = (lat, lng) => {
    setMapCenter({ lat, lng });
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{}}>
        <ChargingStationSearchBar
          onSearch={fetchSearchResult}
          searchResult={searchResult}
          onMapMove={handleMapMove}
        />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <ChargingStationSearchMap
          temporaryArray={temporaryArray}
          myLoc={myLoc}
          propsMapCenter={mapCenter}
        />
      </Box>
    </Box>
  );
};

export default ChargingStationSearch;
