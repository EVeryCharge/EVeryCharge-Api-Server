import React from "react";
import { Typography } from "@material-ui/core";
import GoBackButton from "./GoBackButton";

const ErrorPage = ({ errorCode, errorTitle, errorDescription }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div>
        <Typography variant="h3">{errorCode}</Typography>
        <p />
        <Typography variant="h4" style={{ marginBottom: "20px" }}>
          {errorTitle}
          <br />
          {errorDescription}
        </Typography>
        <GoBackButton />
      </div>
    </div>
  );
};

export default ErrorPage;
