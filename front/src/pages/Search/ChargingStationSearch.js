import { Box } from "@material-ui/core";
import ChargingStationSearchBar from "./ChargingStationSearchBar";
import ChargingStationSearchMap from "./ChargingStationSearchMap";

const ChargingStationSearch = () => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ display: "flex" }}>
        <ChargingStationSearchBar />
      </Box>
      <Box sx={{ display: "flex-1" }}>
        <ChargingStationSearchMap />
      </Box>
    </Box>
  );
};

export default ChargingStationSearch;
