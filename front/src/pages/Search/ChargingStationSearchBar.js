import React from "react";
import {
  Box,
  Card,
  InputAdornment,
  TextField,
  makeStyles,
  MenuItem,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import ToggleButton from "@mui/material/ToggleButton";
import Select from "@mui/material/Select";

const ChargingStationSearchBar = () => {
  const classes = useStyles();
  const [chargable, setChargable] = React.useState(true);
  const [parkingFree, setParkingFree] = React.useState(false);
  const [limit, setLimit] = React.useState(true);

  const [zcode, setZcode] = React.useState("");
  const [zscode, setZscode] = React.useState("");
  const [busiId, setBusiId] = React.useState("");
  const [chgerId, setChgerId] = React.useState("");

  const handleChargableChange = () => {
    setChargable(!chargable);
  };

  const handleParkingFreeChange = () => {
    setParkingFree(!parkingFree);
  };

  const handleLimitChange = () => {
    setLimit(!limit);
  };

  const handleZcodeChange = (event) => {
    setZcode(event.target.value);
  };

  const handleZscodeChange = (event) => {
    setZscode(event.target.value);
  };

  const handleBusiIdChange = (event) => {
    setBusiId(event.target.value);
  };

  const handleChgerIdChange = (event) => {
    setChgerId(event.target.value);
  };

  return (
    <Card variant="outlined" className={classes.baseLayer}>
      {/* 검색 */}
      <Box className={classes.searchBarAndToggleContainer}>
        <TextField
          size="small"
          sx={{ fontSize: "11px", width: "100%" }}
          label="충전소 검색"
          placeholder="검색어를 입력해주세요."
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
        />
        {/* 충전가능, 무료주차, 개방여부 토글버튼 */}
        <Box className={classes.toggleContainer}>
          <ToggleButton
            size="small"
            sx={{ fontSize: "11px", mr: "10px" }}
            value="chargable"
            selected={chargable}
            onChange={handleChargableChange}
          >
            충전가능
          </ToggleButton>
          <ToggleButton
            size="small"
            sx={{ fontSize: "11px", mr: "10px" }}
            value="parkingFree"
            selected={parkingFree}
            onChange={handleParkingFreeChange}
          >
            무료주차
          </ToggleButton>
          <ToggleButton
            size="small"
            sx={{ fontSize: "11px", mr: "10px" }}
            value="limit"
            selected={limit}
            onChange={handleLimitChange}
          >
            개방여부
          </ToggleButton>
        </Box>
      </Box>

      {/* 콤보박스 */}
      <Box className={classes.comboContainer}>
        <Select
          size="small"
          sx={{ fontSize: "11px", mr: "10px" }}
          value={zcode}
          onChange={handleZcodeChange}
          displayEmpty
          className={classes.selectEmpty}
          inputProps={{ "aria-label": "지역단위" }}
        >
          <MenuItem value="" disabled>
            지역단위
          </MenuItem>
        </Select>
        <Select
          size="small"
          sx={{ fontSize: "11px", mr: "10px" }}
          value={zscode}
          onChange={handleZscodeChange}
          displayEmpty
          className={classes.selectEmpty}
          inputProps={{ "aria-label": "세부지역" }}
        >
          <MenuItem value="" disabled>
            세부지역
          </MenuItem>
        </Select>
        <Select
          size="small"
          sx={{ fontSize: "11px", mr: "10px" }}
          value={busiId}
          onChange={handleBusiIdChange}
          displayEmpty
          className={classes.selectEmpty}
          inputProps={{ "aria-label": "운영기관" }}
        >
          <MenuItem value="" disabled>
            운영기관
          </MenuItem>
        </Select>
        <Select
          size="small"
          sx={{ fontSize: "11px", mr: "10px" }}
          value={chgerId}
          onChange={handleChgerIdChange}
          displayEmpty
          className={classes.selectEmpty}
          inputProps={{ "aria-label": "충전기타입" }}
        >
          <MenuItem value="" disabled>
            충전기타입
          </MenuItem>
        </Select>
      </Box>
      {/* TODO 가나다 순 / 거리 순 */}
      <hr />
      <Box>{/* 충전소 리스트 */}</Box>
    </Card>
  );
};

export default ChargingStationSearchBar;

const useStyles = makeStyles({
  baseLayer: {
    backgroundColor: "#EFF8FB",
    width: "400px",
    height: "100%",
    padding: "20px",
    borderRadius: "10px",
  },

  searchBarAndToggleContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
  },

  toggleContainer: {
    display: "flex",
    marginTop: "10px",
  },

  comboContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "30px",
    marginBottom: "40px",
  },
});
