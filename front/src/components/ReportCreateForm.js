import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@material-ui/core";

const ReportCreateForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [reportType, setReportType] = useState("수리보수");
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState({
    title: "",
    content: "",
    reportType: "",
    searchText: "",
  });

  const handleTitleChange = (event) => {
    const inputValue = event.target.value;
    setTitle(inputValue);
    setError((prevError) => ({ ...prevError, title: "" }));
  };

  const handleContentChange = (event) => {
    const inputValue = event.target.value;
    setContent(inputValue);
    setError((prevError) => ({ ...prevError, content: "" }));
  };

  const handleSearchChange = (event) => {
    const inputValue = event.target.value;
    setSearchText(inputValue);
    setError((prevError) => ({ ...prevError, searchText: "" }));
  };

  const handleReportTypeChange = (event) => {
    const inputValue = event.target.value;
    setReportType(inputValue);
    setError((prevError) => ({ ...prevError, reportType: "" }));
  };

  const validateInputs = () => {
    let isValid = true;
    const newError = { title: "", content: "", reportType: "", searchText: "" };

    if (title.trim() === "") {
      newError.title = "제목을 입력하세요.";
      isValid = false;
    }

    if (title.length > 30) {
      newError.title = "제목을 30자 이내로 입력하세요.";
      isValid = false;
    }

    if (content.trim() === "") {
      newError.content = "내용을 입력하세요.";
      isValid = false;
    }

    if (content.length > 500) {
      newError.content = "내용을 500자 이내로 입력하세요.";
      isValid = false;
    }

    if (reportType === "") {
      newError.reportType = "신고유형을 선택하세요.";
      isValid = false;
    }

    if (searchText.trim() === "") {
      newError.searchText = "충전소를 입력하세요.";
      isValid = false;
    }

    setError(newError);

    if (!isValid) {
      // 에러 메시지를 alert으로 표시
      alert("입력값을 확인해주세요.");
    }

    return isValid;
  };

  const handleCreateReport = () => {
    const isValid = validateInputs();

    if (isValid) {
      // TODO: 생성된 신고를 서버에 등록하는 로직을 추가

      // 예시: 신고 생성 후, 입력 필드 초기화
      setTitle("");
      setContent("");
      setReportType("fix");
      setSearchText("");
    }
  };

  return (
    <Box mt={4} mb={4}>
      <Box ml={2}>
        <Typography variant="h4" mb={2} mx={2}>
          신고내역 작성
        </Typography>
        <Typography
          variant="subtitle1"
          style={{
            fontWeight: "bold",
            color: "#008000",
            paddingLeft: "10px",
            marginTop: "5px",
          }}
        >
          작성 내용을 유지보수자가 확인합니다.
        </Typography>
      </Box>
      <hr />
      <Box alignItems="center" my={2} mx={2}>
        {/* 신고유형 콤보박스 */}
        <FormControl style={{ width: "30%", marginBottom: "10px" }}>
          <InputLabel>신고유형</InputLabel>
          <Select value={reportType} onChange={handleReportTypeChange}>
            <MenuItem value="수리보수">수리보수</MenuItem>
            <MenuItem value="정보변경">정보변경</MenuItem>
            <MenuItem value="기타">기타</MenuItem>
            {/* 추가적인 신고유형 항목들을 필요에 따라 추가 */}
          </Select>
          {error.reportType && (
            <Typography variant="caption" color="error">
              {error.reportType}
            </Typography>
          )}
        </FormControl>

        {/* 충전소 검색 입력란 */}
        <TextField
          label="충전소 검색"
          value={searchText}
          placeholder="충전소명 / 지역명을 입력하세요."
          helperText=""
          onChange={handleSearchChange}
          style={{ width: "30%", marginBottom: "10px", marginLeft: "10px" }}
        />
        {error.searchText && (
          <Typography variant="caption" color="error">
            {error.searchText}
          </Typography>
        )}

        {/* 제목 입력란 */}
        <TextField
          label="제목"
          placeholder="제목을 입력하세요(30자 이내)"
          helperText={`${title.length} / 30`}
          inputProps={{ maxLength: 30 }}
          value={title}
          onChange={handleTitleChange}
          style={{ width: "100%", marginBottom: "10px" }}
        />
        {error.title && (
          <Typography variant="caption" color="error">
            {error.title}
          </Typography>
        )}

        {/* 내용 입력란 */}
        <TextField
          label="내용"
          placeholder="내용을 입력하세요(500자 이내)"
          helperText={`${content.length} / 500`}
          inputProps={{ maxLength: 500 }}
          rowsMin={20}
          multiline
          rows={20}
          value={content}
          onChange={handleContentChange}
          style={{ width: "100%", marginBottom: "10px" }}
        />
        {error.content && (
          <Typography variant="caption" color="error">
            {error.content}
          </Typography>
        )}

        {/* 등록하기 버튼 */}
        <Box
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            marginRight: "10px",
            marginTop: "-20px",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateReport}
            style={{ marginTop: "10px" }}
          >
            등록하기
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ReportCreateForm;
