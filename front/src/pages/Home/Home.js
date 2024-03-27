import {
  Button,
  ClickAwayListener,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import React, { useState } from "react";

import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Box from "@mui/material/Box";
import MobileStepper from "@mui/material/MobileStepper";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";

import { Chat, Help, MyLocation, Search, ThumbUp } from "@material-ui/icons";
import { PriceChange } from "@mui/icons-material";
import { CardActionArea } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
const images = [
  {
    label: "San Francisco ? Oakland Bay Bridge, United States",
    imgPath: require("../../assets/image/banner1.png"),
  },
  {
    label: "Bird",
    imgPath: require("../../assets/image/banner2.png"),
  },
  {
    label: "Bali, Indonesia",
    imgPath: require("../../assets/image/banner3.png"),
  },
  {
    label: "Go?, Serbia",
    imgPath: require("../../assets/image/banner4.png"),
  },
];

const Home = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const [open, setOpen] = useState(false);
  const maxSteps = images.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleFirst = () => {
    setActiveStep((prevActiveStep) => 0);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleLast = () => {
    setActiveStep((prevActiveStep) => maxSteps - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };
  const navigate = useNavigate();

  const handleMapClick = () => {
    navigate("/map");
  };
  const handleSearchClick = () => {
    navigate("/search");
  };
  const handleReportClick = () => {
    navigate("/report/list");
  };
  const handleInquiryClick = () => {
    navigate("/inquiry");
  };
  const handleChargeFeeClick = () => {
    navigate("/fee");
  };

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 1500);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          borderRadius: "50px",
          marginTop: "20px",
        }}
      >
        <Box
          sx={{
            maxWidth: "800px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <AutoPlaySwipeableViews
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "background.default",
            }}
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={activeStep}
            onChangeIndex={handleStepChange}
            enableMouseEvents
          >
            {images.map((step, index) => (
              <div key={step.label} style={{ borderRadius: "50px" }}>
                {Math.abs(activeStep - index) <= 2 ? (
                  <Box
                    component="img"
                    sx={{
                      display: "block",
                      overflow: "hidden",
                      width: "100%",
                      height: "auto",
                      borderRadius: "50px",
                    }}
                    src={step.imgPath}
                    alt={step.label}
                  />
                ) : null}
              </div>
            ))}
          </AutoPlaySwipeableViews>
          <MobileStepper
            steps={maxSteps}
            position="static"
            activeStep={activeStep}
            nextButton={
              <Button
                size="small"
                onClick={activeStep === maxSteps - 1 ? handleFirst : handleNext}
              >
                {theme.direction === "rtl" ? (
                  <KeyboardArrowLeft />
                ) : (
                  <KeyboardArrowRight />
                )}
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={activeStep === 0 ? handleLast : handleBack}
              >
                {theme.direction === "rtl" ? (
                  <KeyboardArrowRight />
                ) : (
                  <KeyboardArrowLeft />
                )}
              </Button>
            }
          />
        </Box>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: window.innerWidth < 960 ? "column" : "row",
          justifyContent: "center",
          marginBottom: "50px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: "20px",
            marginRight: "5px",
            marginLeft: "5px",
            justifyContent: "space-around",
          }}
        >
          <Card
            sx={{
              width: "150px",
              height: "150px",
              border: "2px solid #3F51B5",
              boxShadow: "none",
              marginRight: "10px",
            }}
          >
            <CardActionArea sx={{ height: "100%" }} onClick={handleMapClick}>
              <CardContent
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MyLocation
                  style={{
                    fontSize: "4rem",
                    textAlign: "center",
                    color: "#3F51B5",
                  }}
                />
                <Typography
                  style={{
                    marginTop: "5px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  위치 주변
                  <br />
                  충전소 검색
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card
            sx={{
              width: "150px",
              height: "150px",
              border: "2px solid #3F51B5",
              boxShadow: "none",
            }}
            onClick={handleSearchClick}
          >
            <CardActionArea sx={{ height: "100%" }}>
              <CardContent
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Search
                  style={{
                    fontSize: "4rem",
                    textAlign: "center",
                    color: "#3F51B5",
                  }}
                />
                <Typography
                  style={{
                    marginTop: "5px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  사용자 조건 <br />
                  충전소 검색
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginRight: "5px",
            marginLeft: "5px",
            marginTop: "20px",
            justifyContent: "space-around",
          }}
        >
          <Card
            sx={{
              width: "150px",
              height: "150px",
              border: "2px solid #3F51B5",
              boxShadow: "none",
              marginRight: "10px",
            }}
            onClick={handleChargeFeeClick}
          >
            <CardActionArea sx={{ height: "100%" }}>
              <CardContent
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <PriceChange
                  style={{
                    fontSize: "4rem",
                    textAlign: "center",
                    color: "#3F51B5",
                  }}
                />
                <Typography
                  style={{
                    marginTop: "5px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  전기차 충전업체 <br />
                  요금정보 안내
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card
            sx={{
              width: "150px",
              height: "150px",
              border: "2px solid #3F51B5",
              boxShadow: "none",
            }}
            onClick={handleInquiryClick}
          >
            <CardActionArea sx={{ height: "100%" }}>
              <CardContent
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Help
                  style={{
                    fontSize: "4rem",
                    textAlign: "center",
                    color: "#3F51B5",
                  }}
                />
                <Typography
                  style={{
                    marginTop: "5px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  시스템 관리자
                  <br />
                  1대1 문의
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: "20px",
            marginRight: "5px",
            marginLeft: "5px",
            justifyContent: "space-around",
          }}
        >
          <Card
            sx={{
              width: "150px",
              height: "150px",
              border: "2px solid #3F51B5",
              boxShadow: "none",
              marginRight: "10px",
            }}
            onClick={handleReportClick}
          >
            <CardActionArea sx={{ height: "100%" }}>
              <CardContent
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Chat
                  style={{
                    fontSize: "4rem",
                    textAlign: "center",
                    color: "#3F51B5",
                  }}
                />
                <Typography
                  style={{
                    marginTop: "5px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  충전소 신고 /<br /> 정보변경 요청
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <ClickAwayListener onClickAway={handleTooltipClose}>
            <div>
              <Tooltip
                placement="left-start"
                title="추가 예정 기능입니다."
                open={open}
                onClose={handleTooltipClose}
                disableFocusListener
                disableHoverListener
                disableTouchListener
              >
                <Card
                  sx={{
                    width: "150px",
                    height: "150px",
                    border: "2px solid grey",
                    boxShadow: "none",
                  }}
                  onClick={handleTooltipOpen}
                >
                  <CardActionArea sx={{ height: "100%" }}>
                    <CardContent
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <ThumbUp
                        style={{
                          fontSize: "4rem",
                          textAlign: "center",
                          color: "grey",
                        }}
                      />
                      <Typography
                        style={{
                          marginTop: "5px",
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        추천 충전소
                        <br />
                        목록 조회
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Tooltip>
            </div>
          </ClickAwayListener>
        </div>
      </div>
    </>
  );
};

export default Home;
