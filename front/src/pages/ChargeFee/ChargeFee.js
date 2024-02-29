import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import ChargeFeeInfo from "./ChargeFeeInfo";
import ChargeRoamingFeeInfo from "./ChargeRoamingFeeInfo";
import { Info } from "@material-ui/icons";
import { Typography } from "@mui/material";

const ChargeFee = () => {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <h1>전기차 충전요금 정보</h1>
      <div className={classes.callout}>
        <Info />
        <Typography variant="body1" style={{ marginLeft: "5px" }}>
          업체별 회원 / 비회원, 로밍 전기차 충전 요금을 조회할 수 있습니다.
        </Typography>
      </div>
      <Typography variant="body2" className={classes.disclaimer}>
        전기차 충전요금 정보는 일일단위로 업데이트됩니다.
      </Typography>
      <div className={classes.tabContainer}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="primary"
          indicatorColor="primary"
          variant="fullWidth"
        >
          <Tab label="업체별 회원 / 비회원 충전요금 비교" />
          <Tab label="업체별 로밍사업자 충전요금 비교" />
        </Tabs>
        {value === 0 && <ChargeFeeInfo />}
        {value === 1 && <ChargeRoamingFeeInfo />}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100vh",
  },
  callout: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "20px 0",
    padding: "10px",
    backgroundColor: "#f2f2f2",
    borderRadius: "5px",
  },
  disclaimer: {
    textAlign: "right",
    fontSize: "0.8rem",
    color: "#666",
    marginTop: "5px",
  },
  tabContainer: {
    marginTop: "20px",
    flexGrow: 1,
    width: "70%",
  },
}));

export default ChargeFee;
