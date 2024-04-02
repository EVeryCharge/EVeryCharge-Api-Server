import { Box, Button, Typography } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import GoBackButton from "../../components/Common/GoBackButton";

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
        <Typography variant="h5">{headerTitle}</Typography>
        <Typography
          variant="subtitle2"
          style={{
            fontWeight: "bold",
            color: "blue",
            paddingLeft: "5px",
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
            color="primary"
            component={Link}
            to={`/report/form`}
            style={{ marginRight: "2px" }}
          >
            신고하기
          </Button>
        )}
        <GoBackButton isEditPage={isEditPage} link={"/"} />
      </Box>
      <hr />
    </Box>
  );
};

export default ReportHeader;
