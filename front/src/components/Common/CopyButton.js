import React, { useState } from "react";
import { IconButton, Tooltip } from "@material-ui/core";
import { ContentCopy } from "@mui/icons-material";

const CopyButton = ({ addr }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(addr);
    setCopySuccess(true);
    setTimeout(() => {
      setCopySuccess(false);
    }, 1000);
  };

  return (
    <Tooltip title={copySuccess ? "주소가 복사되었습니다" : "주소 복사"}>
      <IconButton
        size="small"
        onClick={handleCopy}
        aria-label="주소 복사"
        disableRipple
        style={{ marginLeft: "10px", backgroundColor: "lightgrey" }}
      >
        <ContentCopy style={{ color: "black" }} />
      </IconButton>
    </Tooltip>
  );
};

export default CopyButton;
