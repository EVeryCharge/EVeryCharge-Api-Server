import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";
import { LocationOn, Search } from "@material-ui/icons";
import { Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChargingStationSearchSwitch = ({ checked: externalChecked }) => {
  const [navigateSearchChecked, setNavigateSearchChecked] =
    useState(externalChecked);
  const navigate = useNavigate();

  useEffect(() => {
    if (navigateSearchChecked) {
      const timer = setTimeout(() => {
        navigate("/search");
      }, 200);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        navigate("/map");
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [navigateSearchChecked, navigate]);

  const handleNavigateSearch = () => {
    setNavigateSearchChecked(!navigateSearchChecked);
  };

  const handleMoveToSearch = () => {
    setNavigateSearchChecked(false);
  };

  const handleMoveToMap = () => {
    setNavigateSearchChecked(true);
  };

  return (
    <Box sx={{ zIndex: 9999, position: "fixed", top: "17%", left: "0%" }}>
      <Box style={{ cursor: "pointer", zIndex: "3" }}>
        <Card
          style={{
            backgroundColor: "#EFF8FB",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.4)",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: "2",
            paddingRight: "7px",
            paddingLeft: "7px",
            borderRadius: "10px",
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent={"center"}>
            <Typography
              onClick={handleMoveToSearch}
              variant={"subtitle2"}
              style={{
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
              }}
            >
              <LocationOn />
              주변검색
            </Typography>
            <Switch
              checked={navigateSearchChecked}
              onChange={handleNavigateSearch}
            />
            <Typography
              onClick={handleMoveToMap}
              variant={"subtitle2"}
              style={{
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Search />
              조건검색
            </Typography>
          </Stack>
        </Card>
      </Box>
    </Box>
  );
};

export default ChargingStationSearchSwitch;
