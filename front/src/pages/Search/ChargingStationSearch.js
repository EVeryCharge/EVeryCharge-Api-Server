import { Box, CircularProgress, Fab } from "@material-ui/core";
import ChargingStationSearchBar from "./ChargingStationSearchBar";
import ChargingStationSearchMap from "./ChargingStationSearchMap";
import { useEffect, useState } from "react";
import { HttpGet } from "../../services/HttpService";
import { Search } from "@material-ui/icons";

const ChargingStationSearch = () => {
  const [searchResult, setSearchResult] = useState(null);
  const [myLoc, setMyLoc] = useState(null);
  const [temporaryArray, setTemporaryArray] = useState([]);
  const [mapCenter, setMapCenter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    }

    function success(position) {
      setMyLoc({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    }

    function error() {
      setMyLoc({
        lat: 36.483034,
        lng: 126.902435,
      });
    }
  }, []);

  useEffect(() => {
    if (searchResult) {
      setTemporaryArray(searchResult);
      setLoading(false);
    }
  }, [searchResult]);

  const fetchSearchResult = async (searchParam) => {
    try {
      setLoading(true);
      const response = await HttpGet(
        "/api/v1/chargingStation/searchBaseDistance",
        {
          ...searchParam,
          ...myLoc,
        }
      );
      setSearchResult(response);
    } catch (error) {
      console.error("검색 결과 로딩 중 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMapMove = (lat, lng) => {
    setMapCenter({ lat, lng });
  };

  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
    console.log("toggle", showSearchBar);
  };

  return (
    <Box style={{ overflow: "hidden" }}>
      <Fab
        color="primary"
        aria-label="search"
        style={{
          bottom: "100px",
          left: "10px",
          position: "fixed",
          zIndex: 9999,
        }}
        onClick={toggleSearchBar}
      >
        <Search />
      </Fab>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {loading && (
          <CircularProgress
            size="large"
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              zIndex: 9999,
            }}
          />
        )}
        <ChargingStationSearchBar
          onSearch={fetchSearchResult}
          searchResult={searchResult}
          onMapMove={handleMapMove}
          hidden={!showSearchBar}
        />
        <Box
          sx={{
            flexGrow: 1,
            marginLeft: showSearchBar ? 0 : "-460px",
            zIndex: 1,
          }}
        >
          <ChargingStationSearchMap // TODO : 오른쪽 지도 여백 문제 확인
            temporaryArray={temporaryArray}
            myLoc={myLoc}
            propsMapCenter={mapCenter}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ChargingStationSearch;
