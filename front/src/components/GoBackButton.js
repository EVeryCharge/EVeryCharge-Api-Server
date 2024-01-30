import React from "react";
import { Button } from "@material-ui/core";
import { useNavigate } from "react-router-dom";

const GoBackButton = () => {
  const navigate = useNavigate();

  const goBack = ({ isEditPage }) => {
    if (isEditPage) {
      const confirmMessage =
        "작성 중인 내용은 저장되지 않습니다. 정말로 이전 화면으로 이동하시겠습니까?";
      const isConfirmed = window.confirm(confirmMessage);

      if (isConfirmed) {
        // 여기서 작성하던 내용을 저장하지 않고 이전 페이지로 이동하는 로직을 추가할 수 있습니다.
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
