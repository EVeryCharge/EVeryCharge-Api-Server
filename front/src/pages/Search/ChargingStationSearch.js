import { Box, CircularProgress, Fab, Tooltip } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { useEffect, useState } from "react";
import { HttpGet } from "../../services/HttpService";
import ChargingStationSearchBar from "./ChargingStationSearchBar";
import ChargingStationSearchMap from "./ChargingStationSearchMap";

const ChargingStationSearch = () => {
  const [searchResult, setSearchResult] = useState(null);
  const [myLoc, setMyLoc] = useState(null);
  const [temporaryArray, setTemporaryArray] = useState([]);
  const [mapCenter, setMapCenter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(true);
  const [mapLoc, setMapLoc] = useState({});

  useEffect(() => {
    console.log("map " + mapLoc.lat +" "+ mapLoc.lng);
  }, [mapLoc]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    }

    function success(position) {
      setMyLoc({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setMapLoc
      ({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    }

    function error() {
      setMyLoc({
        lat: 37.5665,
        lng: 126.9784,
      });
      setMapLoc
      ({
        lat: 37.5665,
        lng: 126.9784,
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
          ...mapLoc,
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
  };

  return (
    <Box style={{ overflow: "hidden" }}>
      <Tooltip title="검색 창 열기 / 닫기" placement="right-end">
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
      </Tooltip>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {loading && (
          <CircularProgress
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              zIndex: 9999,
            }}
          />
        )}
        <Box sx={{ zIndex: 2, position: "fixed" }}>
          <ChargingStationSearchBar
            onSearch={fetchSearchResult}
            searchResult={searchResult}
            setSearchResult={setSearchResult}
            onMapMove={handleMapMove}
            showSearchBar={showSearchBar}
            mapLoc={mapLoc}
          />
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            zIndex: 1,
          }}
        >
          <ChargingStationSearchMap
            temporaryArray={temporaryArray}
            myLoc={myLoc}
            propsMapCenter={mapCenter}
            setMapLoc={setMapLoc}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ChargingStationSearch;
