import React from "react";

const OverlayContent = ({ bnm, availableChger, totalChger }) => {
  // 기관명 7글자로 truncate
  const truncatedBnm = bnm.length >= 7 ? bnm.slice(0, 6) + "··" : bnm;
  // 사용가능 충전기 개수에 따라 색깔 변경
  const availableChgerColor = availableChger === 0 ? "red" : "green";

  return (
    <div
      style={{
        textAlign: "center",
        fontWeight: "bold",
        fontSize: "12px",
        backgroundColor: "white",
        border: "3px solid lightBlue",
        paddingTop: "3px",
        paddingBottom: "3px",
        paddingLeft: "5px",
        borderTopRightRadius: "20px",
        borderBottomRightRadius: "20px",
        position: "absolute",
        left: "67px",
        top: "-20px",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "85px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          marginBottom: "1px",
          fontSize: "10px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {truncatedBnm}
      </div>
      <div
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ color: availableChgerColor }}>{availableChger}</span> /{" "}
        {totalChger}
      </div>
    </div>
  );
};

export default OverlayContent;
