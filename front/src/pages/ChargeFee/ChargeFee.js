import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { makeStyles } from "@material-ui/core/styles";
import { Help, Info } from "@material-ui/icons";
import { Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import ChargeFeeInfo from "./ChargeFeeInfo";
import ChargeRoamingFeeInfo from "./ChargeRoamingFeeInfo";
import { ClickAwayListener } from "@material-ui/core";

const ChargeFee = () => {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [tooltipOpen, setToolTipOpen] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleTooltipClose = () => {
    setToolTipOpen(false);
  };

  const handleTooltipOpen = () => {
    setToolTipOpen(true);
  };

  return (
    <div className={classes.root}>
      <h1>전기차 충전요금 정보</h1>
      <div className={classes.callout}>
        <Info />
        <Typography variant="body2" style={{ marginLeft: "5px" }}>
          업체별 전기차 충전요금 공시 정보를 제공합니다. <br />
          (회원 / 비회원, 로밍사업 요금)
        </Typography>
      </div>
      <Typography variant="body2" className={classes.disclaimer}>
        전기차 충전요금 정보는 일일단위 갱신됩니다.
        <ClickAwayListener onClickAway={handleTooltipClose}>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Tooltip
              placement="left-start"
              title={
                <Typography style={{ fontSize: "9px" }}>
                  요금 정보는 공시 데이터를 바탕으로 하며,
                  <br />
                  업체별 프로모션 등 기타 정책에 의해
                  <br />
                  공시된 요금과 상이할 수 있습니다.
                </Typography>
              }
              open={tooltipOpen}
              onClose={handleTooltipClose}
              disableFocusListener
              disableHoverListener
              disableTouchListener
            >
              <Help onClick={handleTooltipOpen} />
            </Tooltip>
          </div>
        </ClickAwayListener>
      </Typography>
      <div className={classes.tabContainer}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="primary"
          indicatorColor="primary"
          variant="fullWidth"
        >
          <Tab
            label={
              <Typography variant="body2">
                업체별 충전요금
                <br />
                (회원 / 비회원)
              </Typography>
            }
          />
          <Tab
            label={
              <Typography variant="body2">
                업체별 충전요금
                <br />
                (로밍사업 요금)
              </Typography>
            }
          />
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
