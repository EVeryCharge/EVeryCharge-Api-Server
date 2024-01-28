import React from "react";
import { Typography } from "@material-ui/core";
import GoBackButton from "./GoBackButton";

const ErrorPage = () => {
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
        <Typography variant="h3">404 NOT FOUND</Typography>
        <p />
        <Typography variant="h4" style={{ marginBottom: "20px" }}>
          요청하신 페이지를 찾을 수 없습니다.
          <br />
          입력하신 주소가 정확한지 확인해주세요.
        </Typography>
        <GoBackButton />
      </div>
    </div>
  );
};

export default ErrorPage;
