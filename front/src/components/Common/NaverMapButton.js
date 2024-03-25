import React from "react";
import { IconButton, Tooltip } from "@material-ui/core";
import { Place } from "@material-ui/icons";

const NaverMapButton = ({ addr }) => {
  const handleButtonClick = () => {
    const naverMapUrl = `http://m.map.naver.com/route.nhn?menu=route&sx=127&sy=37.5&ename=${addr}&ex=127.5&ey=37.4&pathType=0&showMap=true`;
    window.open(naverMapUrl, "_blank");
  };

  return (
    <Tooltip title="네이버 지도">
      <IconButton
        size="small"
        style={{ backgroundColor: "white", marginLeft: "1px" }}
        onClick={handleButtonClick}
        disableRipple
      >
        <Place style={{ color: "limegreen" }} />
      </IconButton>
    </Tooltip>
  );
};

export default NaverMapButton;
