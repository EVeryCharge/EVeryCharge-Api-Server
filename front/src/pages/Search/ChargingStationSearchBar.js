import {
  Box,
  Button,
  Card,
  Chip,
  FormControl,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { ErrorOutline, Search } from "@material-ui/icons";
import Select from "@mui/material/Select";
import ToggleButton from "@mui/material/ToggleButton";
import React, { useEffect, useState } from "react";
import { HttpGet } from "../../services/HttpService";
import ElectricCarIcon from "@mui/icons-material/ElectricCar";
import { Pagination } from "@mui/material";

/**
 * 작성자 : 이상제
 * 전기차 충전소 검색 바 / 콘솔 구현
 * */
const ChargingStationSearchBar = ({
  onSearch,
  searchResult,
  onMapMove,
  hidden,
}) => {
  const classes = useStyles();
  const [chargable, setChargable] = useState(true);
  const [parkingFree, setParkingFree] = useState(true);
  const [isOpen, setOpen] = useState(true);
  const [range, setRange] = useState(3000);
  const [zcode, setZcode] = useState("");
  const [zscode, setZscode] = useState("");
  const [busiId, setBusiId] = useState([]);
  const [chgerId, setChgerId] = useState([]);
  const [kw, setKw] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
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

  const handleOpenChange = () => {
    setOpen(!isOpen);
  };

  const handleRangeChange = (event) => {
    const selectedRange = event.target.value;

    setZcode("");
    setRange(selectedRange);
  };

  const handleZcodeChange = async (event) => {
    const selectedZcode = event.target.value;

    setRange("");
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

  const handleBusiIdChange = (event) => {
    setBusiId(event.target.value);
  };

  const handleChgerIdChange = (event) => {
    setChgerId(event.target.value);
  };

  const handleKwChange = (event) => {
    setKw(event.target.value);
  };

  const handleSearch = () => {
    onSearch({
      stat: chargable ? 2 : undefined,
      parkingFree: parkingFree ? "Y" : undefined,
      limitYn: isOpen ? "N" : undefined,
      zcode: zcode || undefined,
      zscode: zscode || undefined,
      isPrimary: busiId.length > 0 ? "Y" : undefined,
      busiId: busiId.length > 0 ? busiId.join(", ") : undefined,
      chgerType: chgerId.length > 0 ? chgerId.join(", ") : undefined,
      kw: kw || undefined,
      page: page || undefined,
      pageSize: pageSize || undefined,
      range: range || undefined,
    });
  };

  const handleMapMove = (lat, lng) => {
    onMapMove(lat, lng);
  };

  const handleReset = () => {
    setChargable(true);
    setParkingFree(false);
    setOpen(true);
    setRange(3000);
    setZcode("");
    setZscode("");
    setBusiId([]);
    setChgerId([]);
    setKw("");
  };

  return (
    <Card
      variant="outlined"
      className={classes.baseLayer}
      style={{ visibility: hidden ? "hidden" : "visible" }}
    >
      <Box className={classes.searchBarAndToggleContainer}>
        <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
          <FormControl fullWidth>
            <TextField
              size="small"
              sx={{ fontSize: "11px" }}
              label="충전소 검색"
              placeholder="검색어를 입력해주세요."
              variant="outlined"
              color="primary"
              value={kw}
              onChange={handleKwChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
          <FormControl>
            <Button
              variant="contained"
              color="primary"
              style={{ marginLeft: "3px" }}
              onClick={handleSearch}
            >
              검색
            </Button>
          </FormControl>
        </Box>
        <Box className={classes.toggleContainer}>
          <Button
            size="small"
            variant="outlined"
            style={{ fontSize: "11px", marginRight: "10px" }}
            color="secondary"
            onClick={handleReset}
          >
            조건 초기화
          </Button>
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
            value="isOpen"
            selected={isOpen}
            onChange={handleOpenChange}
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
                반경 단위
              </InputLabel>
              <Select
                size="small"
                sx={{ fontSize: "11px", mr: "10px", width: "100px" }}
                value={range}
                displayEmpty
                onChange={handleRangeChange}
                className={classes.selectEmpty}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 190,
                    },
                  },
                }}
              >
                <MenuItem value="">전국</MenuItem>
                {baseItem.ranges.map((code, index) => (
                  <MenuItem key={index} value={code}>
                    {baseItem.rangeNames[index]}
                  </MenuItem>
                ))}
              </Select>
            </Box>
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
          </>
        )}
      </Box>
      <Box className={classes.comboContainer}>
        {baseItem && (
          <>
            <Box>
              <InputLabel className={classes.inputLabelStyle}>
                운영기관
              </InputLabel>
              <Select
                size="small"
                multiple
                value={busiId}
                onChange={handleBusiIdChange}
                displayEmpty
                sx={{ fontSize: "11px", mr: "10px", width: "130px" }}
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
                sx={{ fontSize: "11px", mr: "10px", width: "210px" }}
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
      {/* 검색 결과 리스트 */}
      <Box className={classes.ListContainer}>
        <List>
          {searchResult && searchResult.content.length === 0 && (
            <Box className={classes.NoSearchResultContainer}>
              <ErrorOutline style={{ marginRight: "5px" }} />
              <Typography variant="body1">검색 결과가 없습니다.</Typography>
            </Box>
          )}

          {searchResult &&
            searchResult.content &&
            searchResult.content.map((data, index) => (
              <ListItem key={index} className={classes.ListItemContainer}>
                <div className={classes.ListItemInfo}>
                  <Typography
                    variant="h6"
                    style={{ fontWeight: "bold", color: "blue" }}
                  >
                    {data.statNm}
                  </Typography>
                  <Typography variant="subtitle2">{data.bnm}</Typography>{" "}
                  <div style={{ display: "flex" }}>
                    <Typography
                      variant="subtitle2"
                      style={{ fontWeight: "bold", marginRight: "5px" }}
                    >
                      {data.distance} {/* 0km */}
                    </Typography>
                    <Typography variant="subtitle2">{data.addr}</Typography>{" "}
                    {/* 주소 */}
                  </div>
                  <div className={classes.ListItemYnContainer}>
                    {/* parkingFree가 true인 경우 무료주차 Chip, false인 경우 유료주차 Chip 표시 */}
                    {data.parkingFree ? (
                      <Chip
                        label="무료주차"
                        color="primary"
                        variant="outlined"
                      />
                    ) : (
                      <Chip label="유료주차" variant="outlined" />
                    )}
                    {data.limitYn ? (
                      <Chip label="비개방" variant="outlined" />
                    ) : (
                      <Chip label="개방" color="primary" variant="outlined" />
                    )}
                  </div>
                  <div className={classes.ListChargerTypeContainer}>
                    {data.chgerTypes.map((chgerType, index) => (
                      <Chip
                        key={index}
                        icon={<ElectricCarIcon />}
                        label={`${baseItem.chgerTypes[chgerType]}`}
                        style={{ marginBottom: "5px" }}
                      />
                    ))}
                  </div>
                </div>
                <Chip
                  label="이동"
                  color="secondary"
                  clickable
                  onClick={() => handleMapMove(data.lat, data.lng)}
                />
              </ListItem>
            ))}
        </List>
        {searchResult && searchResult.content.length > 0 && (
          <Box className={classes.PaginationContainer}>
            <Pagination
              count={searchResult.totalPages}
              page={page}
              color="primary"
            />
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default ChargingStationSearchBar;

const useStyles = makeStyles({
  baseLayer: {
    backgroundColor: "#EFF8FB",
    width: "420px",
    height: "70vh",
    padding: "20px",
    borderRadius: "10px",
  },
  searchBarAndToggleContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    maxWidth: "100%",
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
    marginTop: "10px",
    marginBottom: "10px",
  },
  inputLabelStyle: {
    marginLeft: "2px",
    marginBottom: "5px",
    fontSize: "10px",
  },
  ListContainer: {
    overflowY: "auto",
    maxHeight: "40vh",
  },
  ListItemContainer: {
    borderBottom: "1px groove grey",
    marginBottom: "15px",
    padding: "2px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "11px",
  },
  ListItemInfo: {
    display: "flex",
    flexDirection: "column",
  },
  ListItemYnContainer: {
    display: "flex",
    marginTop: "5px",
    "& > *": {
      marginRight: "5px",
    },
  },
  ListChargerTypeContainer: {
    marginTop: "5px",
    marginBottom: "10px",
  },
  NoSearchResultContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "200px",
    color: "gray",
  },
  PaginationContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
});
