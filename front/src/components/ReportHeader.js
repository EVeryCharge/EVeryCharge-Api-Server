import React from "react";
import { Box, Typography, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import GoBackButton from "./GoBackButton";

const ReportHeader = ({
  actorCanCreate,
  actorCanManagerSearch,
  isEditPage,
  headerTitle,
  headerDescription,
}) => {
  return (
    <Box mt={4} mb={2}>
      <Box ml={2}>
        <Typography variant="h4">{headerTitle}</Typography>
        <Typography
          variant="subtitle1"
          style={{
            fontWeight: "bold",
            color: "#008000",
            paddingLeft: "10px",
            marginTop: "5px",
          }}
        >
          {headerDescription}
        </Typography>
      </Box>
      <Box
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-end",
          marginRight: "20px",
          marginTop: "-30px",
        }}
      >
        {actorCanManagerSearch && (
          <Button
            variant="outlined"
            color="primary"
            style={{ marginRight: "4px" }}
          >
            담당 충전소 신고내역 조회
          </Button>
        )}
        {actorCanCreate && (
          <Button
            variant="outlined"
            component={Link}
            to={`/report/create`}
            style={{ marginRight: "2px" }}
          >
            신고하기
          </Button>
        )}
        <GoBackButton isEditPage={isEditPage} />
      </Box>
      <hr />
    </Box>
  );
};

export default ReportHeader;
