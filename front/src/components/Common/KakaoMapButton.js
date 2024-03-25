import React from "react";
import { IconButton, Tooltip } from "@material-ui/core";
import { Place } from "@material-ui/icons";

const KakaoMapButton = ({ addr }) => {
  const handleButtonClick = () => {
    const kakaoMapUrl = `https://map.kakao.com/?map_type=TYPE_MAP&q=${addr}&urlLevel=2`;
    window.open(kakaoMapUrl, "_blank");
  };

  return (
    <Tooltip title="카카오맵">
      <IconButton
        size="small"
        style={{ backgroundColor: "gold", marginLeft: "1px" }}
        onClick={handleButtonClick}
        disableRipple
      >
        <Place style={{ color: "royalblue" }} />
      </IconButton>
    </Tooltip>
  );
};

export default KakaoMapButton;
