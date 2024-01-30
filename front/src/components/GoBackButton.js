import React from "react";
import { Button } from "@material-ui/core";
import { useNavigate } from "react-router-dom";

const GoBackButton = ({ isEditPage }) => {
  const navigate = useNavigate();

  const goBack = () => {
    if (isEditPage) {
      const confirmMessage =
        "작성 중인 내용은 저장되지 않습니다.\n정말로 이전 화면으로 이동하시겠습니까?";
      const isConfirmed = window.confirm(confirmMessage);

      if (isConfirmed) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  return (
    <Button variant="outlined" onClick={goBack}>
      이전으로
    </Button>
  );
};

export default GoBackButton;
