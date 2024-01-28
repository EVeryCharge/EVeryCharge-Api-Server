import React from "react";
import { Button } from "@material-ui/core";
import { useNavigate } from "react-router-dom";

const GoBackButton = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <Button variant="outlined" onClick={goBack}>
      이전으로
    </Button>
  );
};

export default GoBackButton;
