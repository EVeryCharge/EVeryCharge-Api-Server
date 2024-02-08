import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  InputAdornment,
  InputLabel,
  MenuItem,
  TextField,
  makeStyles,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import Select from "@mui/material/Select";
import ToggleButton from "@mui/material/ToggleButton";
import { HttpGet } from "../../services/HttpService";

const ChargingStationSearchBar = () => {
  const classes = useStyles();
  const [chargable, setChargable] = useState(true);
  const [parkingFree, setParkingFree] = useState(false);
  const [limit, setLimit] = useState(true);

  const [zcode, setZcode] = useState("");
  const [zscode, setZscode] = useState("");
  const [busiIds, setBusiIds] = useState([]);
  const [chgerId, setChgerId] = useState([]);
  const [baseItem, setBaseItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await HttpGet("/api/v1/chargingStation/search/item");
        setBaseItem(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChargableChange = () => {
    setChargable(!chargable);
  };

  const handleParkingFreeChange = () => {
    setParkingFree(!parkingFree);
  };

  const handleLimitChange = () => {
    setLimit(!limit);
  };

  const handleZcodeChange = async (event) => {
    const selectedZcode = event.target.value;
    setZcode(selectedZcode);

    try {
      const regionDetailItem = await HttpGet(
        "/api/v1/chargingStation/search/region",
        { zcode: selectedZcode }
      );

      setBaseItem((prevBaseItem) => ({
        ...prevBaseItem,
        zscodes: regionDetailItem.zscodes,
        regionDetailNames: regionDetailItem.regionDetialNames,
      }));
      setZscode("");
    } catch (error) {
      console.error("Error fetching region detail data:", error);
    }
  };

  const handleZscodeChange = (event) => {
    setZscode(event.target.value);
  };

  const handleBusiIdsChange = (event) => {
    setBusiIds(event.target.value);
  };

  const handleChgerIdChange = (event) => {
    setChgerId(event.target.value);
  };

  return (
    <Card variant="outlined" className={classes.baseLayer}>
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

      <Box className={classes.comboContainer}>
        {baseItem && (
          <>
            <Box>
              <InputLabel className={classes.inputLabelStyle}>
                지역 단위
              </InputLabel>
              <Select
                size="small"
                sx={{ fontSize: "11px", mr: "10px", width: "130px" }}
                value={zcode}
                onChange={handleZcodeChange}
                displayEmpty
                className={classes.selectEmpty}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 190,
                    },
                  },
                }}
              >
                <MenuItem value="">전체</MenuItem>
                {baseItem.zcodes.map((code, index) => (
                  <MenuItem key={index} value={code}>
                    {baseItem.regionNames[index]}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box>
              <InputLabel className={classes.inputLabelStyle}>
                세부 지역
              </InputLabel>
              <Select
                size="small"
                sx={{ fontSize: "11px", mr: "10px", width: "100px" }}
                value={zscode}
                onChange={handleZscodeChange}
                displayEmpty
                className={classes.selectEmpty}
                disabled={
                  !baseItem || baseItem.zscodes === null || zcode === ""
                }
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 190,
                    },
                  },
                }}
              >
                <MenuItem value="">전체</MenuItem>
                {baseItem &&
                  baseItem.zscodes &&
                  baseItem.zscodes.map((code, index) => (
                    <MenuItem key={index} value={code}>
                      {baseItem.regionDetailNames[index]}
                    </MenuItem>
                  ))}
              </Select>
            </Box>
            <Box>
              <InputLabel className={classes.inputLabelStyle}>
                운영기관
              </InputLabel>
              <Select
                size="small"
                multiple
                value={busiIds}
                onChange={handleBusiIdsChange}
                displayEmpty
                sx={{ fontSize: "11px", mr: "10px", width: "100px" }}
                className={classes.selectEmpty}
                renderValue={(selected) => (
                  <div>
                    {selected.length === 0
                      ? "전체"
                      : `${selected.length}개 선택됨`}
                  </div>
                )}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 190,
                    },
                  },
                }}
              >
                {baseItem.busiIds.map((code, index) => (
                  <MenuItem key={index} value={code}>
                    {baseItem.bnms[index]}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box>
              <InputLabel className={classes.inputLabelStyle}>
                충전기 타입
              </InputLabel>
              <Select
                size="small"
                multiple
                value={chgerId}
                onChange={handleChgerIdChange}
                displayEmpty
                sx={{ fontSize: "11px", mr: "10px", width: "100px" }}
                className={classes.selectEmpty}
                renderValue={(selected) => (
                  <div>
                    {selected.length === 0
                      ? "전체"
                      : `${selected.length}개 선택됨`}
                  </div>
                )}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 190,
                    },
                  },
                }}
              >
                <MenuItem value="">전체</MenuItem>
                {baseItem.chgerIds.map((code, index) => (
                  <MenuItem key={index} value={code}>
                    {baseItem.chgerTypes[index]}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </>
        )}
      </Box>
      <hr />
      <Box>{/* 충전소 리스트 */}</Box>
    </Card>
  );
};

export default ChargingStationSearchBar;

const useStyles = makeStyles({
  baseLayer: {
    backgroundColor: "#EFF8FB",
    width: "500px",
    height: "calc(100vh - 205px)",
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
    justifyContent: "flext-start",
    alignItems: "center",
    marginTop: "30px",
    marginBottom: "40px",
  },
  inputLabelStyle: {
    marginLeft: "2px",
    marginBottom: "5px",
    fontSize: "10px",
  },
  selectMenu: {
    maxHeight: "50px",
    fontSize: "11pt", // 폰트 크기 설정
  },
});
