import React from "react";

const MapOverlayContent = ({ bnm, availableChger, totalChger, onClick }) => {
  const truncatedBnm = bnm.length >= 7 ? bnm.slice(0, 6) + "··" : bnm;
  const availableChgerColor = availableChger === 0 ? "red" : "green";

  const handleClick = () => {
    onClick();
  };

  return (
    <div
      onClick={handleClick}
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
      <div style={{ marginBottom: "1px", fontSize: "10px" }}>
        {truncatedBnm}
      </div>
      <div>
        <span style={{ color: availableChgerColor }}>{availableChger}</span> /{" "}
        {totalChger}
      </div>
    </div>
  );
};

export default MapOverlayContent;
