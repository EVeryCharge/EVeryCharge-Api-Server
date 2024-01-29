import React, { useState } from "react";
import { Box, Button, TextareaAutosize, Typography } from "@material-ui/core";

const ReportCreateForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleCreateReport = () => {
    // TODO: 생성된 신고를 서버에 등록하는 로직을 추가

    // 예시: 신고 생성 후, 입력 필드 초기화
    setTitle("");
    setContent("");
  };

  return (
    <Box mt={4} mb={4}>
      <Typography variant="h4" mb={2}>
        신고 작성하기
      </Typography>

      {/* 제목 입력란 */}
      <TextareaAutosize
        placeholder="제목을 입력하세요"
        value={title}
        onChange={handleTitleChange}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      {/* 내용 입력란 */}
      <TextareaAutosize
        placeholder="내용을 입력하세요"
        rowsMin={10}
        value={content}
        onChange={handleContentChange}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      {/* 등록하기 버튼 */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateReport}
        style={{ position: "fixed", bottom: "10px", right: "10px" }}
      >
        등록하기
      </Button>
    </Box>
  );
};

export default ReportCreateForm;
