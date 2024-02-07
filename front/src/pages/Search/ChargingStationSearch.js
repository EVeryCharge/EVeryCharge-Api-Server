import { Box } from "@material-ui/core";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ChargingStationSearchBar from "./ChargingStationSearchBar";
import ChargingStationSearchMap from "./ChargingStationSearchMap";

const ChargingStationSearch = () => {
  return (
    <Box sx={{ flexWrap: "wrap" }}>
      <ChargingStationSearchBar />
      <ChargingStationSearchMap />
    </Box>
  );
};

export default ChargingStationSearch;
