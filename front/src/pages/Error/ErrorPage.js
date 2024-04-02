import { Typography } from "@material-ui/core";
import { TaxiAlert } from "@mui/icons-material";
import React from "react";
import GoBackButton from "../../components/Common/GoBackButton";

const ErrorPage = ({ errorCode, errorTitle, errorDescription }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
      }}
    >
      <div>
        <Typography variant="h3">
          <TaxiAlert style={{ fontSize: "64px" }} />
          {errorCode}
        </Typography>
        <p />
        <Typography variant="h4" style={{ marginBottom: "20px" }}>
          {errorTitle}
          <br />
          {errorDescription}
        </Typography>
        <GoBackButton link={"/"} />
      </div>
    </div>
  );
};

export default ErrorPage;
