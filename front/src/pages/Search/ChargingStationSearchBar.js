import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  TextField,
  Typography,
  makeStyles,
  Grid
} from "@material-ui/core";
import { ErrorOutline, Search } from "@material-ui/icons";
import ElectricCarIcon from "@mui/icons-material/ElectricCar";
import { Pagination } from "@mui/material";
import Select from "@mui/material/Select";
import ToggleButton from "@mui/material/ToggleButton";
import React, { useEffect, useState } from "react";
import { HttpGet } from "../../services/HttpService";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';




/**
 * 작성자 : 이상제
 * 전기차 충전소 검색 바 / 콘솔 구현
 * */
const ChargingStationSearchBar = ({
  onSearch,
  searchResult,
  setSearchResult,
  onMapMove,
  showSearchBar,
  mapLoc,
  check,
}) => {
  const classes = useStyles();
  const [chargeable, setChargeable] = useState(true);
  const [parkingFree, setParkingFree] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [range, setRange] = useState(3000);
  const [zcode, setZcode] = useState("");
  const [zscode, setZscode] = useState("");
  const [busiId, setBusiId] = useState([]);
  const [chgerId, setChgerId] = useState([]);
  const [kw, setKw] = useState("");
  const [page, setPage] = useState(1);
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
  useEffect(() => {
    if (check === true) {
      handleSearch();
    }
  }, [mapLoc]);

  // 검색 조건이 변경될 때마다 검색 결과를 언마운트
  useEffect(() => {
    setSearchResult(null);
  }, [chargeable, parkingFree, isOpen, zcode, zscode, busiId, chgerId, kw]);

  const handleChargeableChange = () => {
    setChargeable(!chargeable);
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
    setZscode("");
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

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    setPage(1);
    onSearch({
      chargeable: chargeable ? "Y" : undefined,
      parkingFree: parkingFree ? "Y" : undefined,
      limitYn: isOpen ? "N" : undefined,
      zcode: zcode || undefined,
      zscode: zscode || undefined,
      isPrimary: busiId.length > 0 ? "Y" : undefined,
      busiId: busiId.length > 0 ? busiId.join(", ") : undefined,
      chgerType: chgerId.length > 0 ? chgerId.join(", ") : undefined,
      kw: kw || undefined,
      range: range || undefined,
      page: 1 || undefined,
    });
  };

  const handlePageMove = (event, newPage) => {
    setPage(newPage);
    onSearch({
      chargeable: chargeable ? "Y" : undefined,
      parkingFree: parkingFree ? "Y" : undefined,
      limitYn: isOpen ? "N" : undefined,
      zcode: zcode || undefined,
      zscode: zscode || undefined,
      isPrimary: busiId.length > 0 ? "Y" : undefined,
      busiId: busiId.length > 0 ? busiId.join(", ") : undefined,
      chgerType: chgerId.length > 0 ? chgerId.join(", ") : undefined,
      kw: kw || undefined,
      range: range || undefined,
      page: newPage || undefined,
    });
  };

  const handleMapMove = (lat, lng) => {
    onMapMove(lat, lng);
  };

  const handleReset = () => {
    setChargeable(true);
    setParkingFree(false);
    setOpen(false);
    setRange(3000);
    setZcode("");
    setZscode("");
    setBusiId([]);
    setChgerId([]);
    setKw("");
  };

  const [parentHeight, setParentHeight] = useState(0);

  useEffect(() => {
    function handleResize() {
      const parentGrid = document.getElementById('parentGrid');
      if (parentGrid) {
        const height = parentGrid.clientHeight - 240; // 부모 그리드의 높이에서 20px 빼기
        setParentHeight(height);
      }
    }

    // 초기 실행
    handleResize();

    // resize 이벤트 리스너 추가
    window.addEventListener('resize', handleResize);

    // cleanup 함수
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // 빈 배열은 처음 한 번만 실행됨을 의미

  return (

    <Grid container id="parentGrid" justifyContent="left" style={{
      maxWidth: "430px",
    }}>
      <Grid item xs={12} md={5} xl={5} lg={5}>
        <Card
          variant="outlined"
          className={classes.baseLayer}
          style={{
            minWidth: "360px",
            maxWidth: "430px"
          }}
        >
          <Grid container >
            <Grid item xs={12} xl={12}>
              <Box className={classes.searchBarAndToggleContainer}>
                <Box sx={{ display: "flex", width: "90%", alignItems: "center" }}>
                  <FormControl fullWidth>
                    <TextField
                      size="small"
                      sx={{ fontSize: "11px" }}
                      label="충전소 검색"
                      placeholder="검색어를 입력해주세요."
                      variant="outlined"
                      color="primary"
                      value={kw}
                      onKeyPress={handleKeyPress}
                      onChange={handleKwChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search color="primary" />
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
                    style={{
                      fontSize: "12px", marginRight: "10px", minWidth: "90px"
                    }}
                    color="secondary"
                    onClick={handleReset}

                  >
                    조건 초기화
                  </Button>
                  <ToggleButton
                    size="big"
                    color="primary"
                    sx={{
                      fontSize: "12px",
                      mr: "10px",
                      "&.Mui-selected": {
                        borderColor: "blue",
                        borderWidth: "1px",
                        color: "blue",
                        fontWeight: "bold",
                        minWidth: "80px"
                      },
                    }}
                    value="chargeable"
                    selected={chargeable}
                    onChange={handleChargeableChange}
                  >
                    충전가능
                  </ToggleButton>
                  <ToggleButton
                    size="small"
                    color="primary"
                    sx={{
                      fontSize: "12px",
                      mr: "10px",
                      "&.Mui-selected": {
                        borderColor: "blue",
                        borderWidth: "1px",
                        color: "blue",
                        fontWeight: "bold",
                        minWidth: "80px"
                      },
                    }}
                    value="parkingFree"
                    selected={parkingFree}
                    onChange={handleParkingFreeChange}
                  >
                    무료주차
                  </ToggleButton>
                  <ToggleButton
                    size="small"
                    color="primary"
                    sx={{
                      fontSize: "12px",
                      mr: "10px",
                      "&.Mui-selected": {
                        borderColor: "blue",
                        borderWidth: "1px",
                        color: "blue",
                        fontWeight: "bold",

                      },
                    }}
                    value="isOpen"
                    selected={isOpen}
                    onChange={handleOpenChange}
                  >
                    상시개방
                  </ToggleButton>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} xl={12}>
              <Box className={classes.comboContainer}>
                {baseItem && (
                  <>
                    <Box>
                      <InputLabel
                        className={classes.inputLabelStyle}
                        style={{
                          color: range !== "" ? "blue" : undefined,
                        }}
                      >
                        반경 단위
                      </InputLabel>
                      <Select
                        size="small"
                        sx={{
                          fontSize: "12px",
                          mr: "10px",
                          width: "80px",
                          border: range !== "" ? "1px solid blue" : "1px solid grey",
                          color: range !== "" ? "blue" : undefined,
                          fontWeight: range !== "" ? "bold" : undefined,
                        }}
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
                      <InputLabel
                        className={classes.inputLabelStyle}
                        style={{
                          color: zcode !== "" ? "blue" : undefined,
                        }}
                      >
                        지역 단위
                      </InputLabel>
                      <Select
                        size="small"
                        sx={{
                          fontSize: "12px",
                          mr: "10px",
                          width: "120px",
                          border: zcode !== "" ? "1px solid blue" : "1px solid grey",
                          color: zcode !== "" ? "blue" : undefined,
                          fontWeight: zcode !== "" ? "bold" : undefined,
                        }}
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
                      <InputLabel
                        className={classes.inputLabelStyle}
                        style={{
                          color: zscode !== "" ? "blue" : undefined,
                        }}
                      >
                        세부 지역
                      </InputLabel>
                      <Select
                        size="small"
                        sx={{
                          fontSize: "12px",
                          mr: "10px",
                          width: "120px",
                          border: zscode !== "" ? "1px solid blue" : "1px solid grey",
                          color: zscode !== "" ? "blue" : undefined,
                          fontWeight: zscode !== "" ? "bold" : undefined,
                        }}
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
                <Divider />
                {baseItem && (
                  <>
                    <Box>
                      <InputLabel
                        className={classes.inputLabelStyle}
                        style={{
                          color: busiId.length > 0 ? "blue" : undefined,
                        }}
                      >
                        운영기관
                      </InputLabel>
                      <Select
                        size="small"
                        multiple
                        value={busiId}
                        onChange={handleBusiIdChange}
                        displayEmpty
                        sx={{
                          fontSize: "12px",
                          mr: "10px",
                          width: "165px",
                          border:
                            busiId.length > 0 ? "1px solid blue" : "1px solid grey",
                        }}
                        className={classes.selectEmpty}
                        renderValue={(selected) => (
                          <div
                            style={{
                              color: selected.length === 0 ? "black" : "blue",
                              fontWeight: selected.length === 0 ? undefined : "bold",
                            }}
                          >
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
                      <InputLabel
                        className={classes.inputLabelStyle}
                        style={{
                          color: chgerId.length > 0 ? "blue" : undefined,
                        }}
                      >
                        충전기 타입
                      </InputLabel>
                      <Select
                        size="small"
                        multiple
                        value={chgerId}
                        onChange={handleChgerIdChange}
                        displayEmpty
                        sx={{
                          fontSize: "12px",
                          mr: "10px",
                          width: "165px",
                          border:
                            chgerId.length > 0 ? "1px solid blue" : "1px solid grey",
                        }}
                        className={classes.selectEmpty}
                        renderValue={(selected) => (
                          <div
                            style={{
                              color: selected.length === 0 ? "black" : "blue",
                              fontWeight: selected.length === 0 ? undefined : "bold",
                            }}
                          >
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
            </Grid>
            <Grid container className={classes.ListContainer} style={{ height: parentHeight }}>
              <Grid item xs={12} xl={12} >
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
                      <ListItem
                        key={index}
                        className={classes.ListItemContainer}
                        onClick={() => handleMapMove(data.lat, data.lng)}
                      >
                        <div className={classes.ListItemInfo}>
                          <div style={{ maxWidth: "220px" }}>
                            <Typography
                              variant="subtitle1"
                              style={{
                                fontWeight: "bold",
                                overflow: "hidden", // 내용이 넘치면 숨깁니다.
                                textOverflow: "ellipsis", // 넘치는 텍스트를 말줄임표로 표시합니다.
                                whiteSpace: "nowrap", // 텍스트를 한 줄로 표시합니다.
                              }}
                            >
                              {data.statNm}
                            </Typography>
                          </div>
                          <Typography variant="subtitle2">{data.bnm}</Typography>{" "}
                          <div style={{ display: "flex" }}>
                            <Typography
                              variant="subtitle2"
                              style={{ fontWeight: "bold", marginRight: "5px" }}
                            >
                              {data.distance}
                            </Typography>
                            <div style={{ maxWidth: "210px" }}>
                              <Typography
                                variant="subtitle2"
                                style={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  flexShrink: 1, // 필요한 경우 축소를 허용
                                }}
                              >
                                {data.addr}
                              </Typography>{" "}
                            </div>
                          </div>
                          <div className={classes.ListItemYnContainer}>
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
                                label={`${baseItem.chgerTypes[
                                  baseItem.chgerIds.indexOf(chgerType)
                                ]
                                  }`}
                                style={{ marginBottom: "5px", marginRight: "5px" }}
                              />
                            ))}
                          </div>
                          {data.fileurls && data.fileurls.length > 0 && (
                            <Swiper
                              spaceBetween={5}
                              slidesPerView={2}
                              navigation={true}
                              modules={[Navigation]}
                              style={{ width: '240px', height: '100px' }}
                            >
                              {data.fileurls.map((url, index) => (
                                <SwiperSlide key={index} style={{ width: '100px', height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                  <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <img src={url} alt="preview" style={{ width: '100%', height: '100%' }} />
                                  </div>
                                </SwiperSlide>
                              ))}
                            </Swiper>
                          )}
                        </div>
                        <Chip
                          label="이동"
                          style={{
                            fontWeight: "bold",
                          }}
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
                      onChange={handlePageMove}
                      page={page}
                      color="primary"
                    />
                  </Box>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ChargingStationSearchBar;

const useStyles = makeStyles({
  baseLayer: {
    display: "flex",
    backgroundColor: "#EFF8FB",
    height: "60vh",
    padding: "20px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.4)",
    transition: "transform 0.3s ease",
  },
  searchBarAndToggleContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    maxWidth: "100%",
  },
  toggleContainer: {
    display: "flex",
    marginTop: "10px",
  },
  comboContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: "10px",
    marginBottom: "5px",
  },
  inputLabelStyle: {
    marginLeft: "2px",
    marginBottom: "5px",
    fontSize: "11px",
  },
  ListContainer: {
    overflowY: "auto",
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#888',
      borderRadius: '10px',
    },
    '&::-webkit-scrollbar-button': {
      display: 'none',
    },
  },
  ListItemContainer: {
    borderBottom: "1px groove grey",
    paddingTop: "10px",
    paddingBottom: "3px",
    padding: "2px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    transition: "background-color 0.1s",
    "&:hover": {
      backgroundColor: "#f0f0f0",
    },
    fontSize: "16px",
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
    color: "gray",
  },
  PaginationContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
});
