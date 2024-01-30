import React, { useState, useEffect } from "react";
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
  const [searchKw, setSearchKw] = useState("");
  const [searchStatId, setSearchStatId] = useState("");
  const [chargingStations, setChargingStations] = useState([]);
  const [error, setError] = useState({
    title: "",
    content: "",
    reportType: "",
    searchKw: "",
  });

  useEffect(() => {
    // searchKw가 변경되었을 때 API 요청
    if (searchKw.trim() !== "") {
      fetchChargingStations();
    }
  }, [searchKw]);

  const fetchChargingStations = async () => {
    try {
      const response = await fetch(
        `http://localhost:8090/api/v1/reports/station?kw=${encodeURIComponent(
          searchKw
        )}`
      );
      const result = await response.json();

      if (result.success && result.data) {
        setChargingStations(result.data.chargingStations);
        setError((prevError) => ({ ...prevError, searchKw: "" }));
      } else {
        setChargingStations([]);
        setError((prevError) => ({
          ...prevError,
          searchKw: result.data.errorMsg,
        }));
      }
    } catch (error) {
      console.error("API 요청 중 에러:", error);
      setError((prevError) => ({
        ...prevError,
        searchKw: "요청 중 에러가 발생했습니다. 잠시 후에 시도해주세요",
      }));
    }
  };

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
    setSearchKw(inputValue);
    setSearchStatId(""); // 검색어가 변경되면 statId도 초기화
    setError((prevError) => ({ ...prevError, searchKw: "" }));
  };

  const handleReportTypeChange = (event) => {
    const inputValue = event.target.value;
    setReportType(inputValue);
    setError((prevError) => ({ ...prevError, reportType: "" }));
  };

  const handleChargingStationSelect = (station) => {
    setSearchKw(station.statNm);
    setSearchStatId(station.statId);
  };

  // 예외 처리
  const validateInputs = () => {
    let isValid = true;
    const newError = { title: "", content: "", reportType: "", statId: "" };

    if (title.trim() === "") {
      newError.title = "제목을 입력하세요.";
      isValid = false;
    }

    if (content.trim() === "") {
      newError.content = "내용을 입력하세요.";
      isValid = false;
    }

    if (reportType === "") {
      newError.reportType = "신고유형을 선택하세요.";
      isValid = false;
    }

    if (searchStatId === null) {
      newError.searchStatId = "충전소를 선택하세요.";
      isValid = false;
    }

    setError(newError);

    if (!isValid) {
      alert("입력값을 확인하세요.");
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
      setSearchKw("");
    }
  };

  return (
    <Box mt={4} mb={4}>
      {/* 헤더 */}
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
        <Box display="flex" flexDirection="row">
          {/* 신고유형 콤보박스 */}
          <FormControl style={{ width: "100px", marginBottom: "10px" }}>
            <InputLabel>신고유형</InputLabel>
            <Select
              value={reportType}
              onChange={handleReportTypeChange}
              displayEmpty
            >
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
          <Box>
            <TextField
              label="충전소 검색"
              value={searchKw}
              placeholder="충전소명 / 지역명을 입력하세요."
              helperText={error.searchKw}
              onChange={handleSearchChange}
              style={{
                width: "500px",
                marginLeft: "10px",
              }}
            />
            {/* 드롭다운에 표시할 충전소 목록 */}
            {chargingStations &&
              chargingStations.length > 0 &&
              !searchStatId && (
                <Box
                  position="absolute"
                  zIndex="1"
                  bgcolor="rgb(211, 211, 211)"
                  width="490px"
                  paddingLeft="10px"
                  marginLeft="10px"
                  maxHeight="400px"
                  overflow="auto"
                >
                  {chargingStations.map((station) => (
                    <div
                      key={station.statId}
                      onClick={() => handleChargingStationSelect(station)}
                      style={{ cursor: "pointer", padding: "8px 0" }}
                    >
                      <Typography variant="body1">{station.statNm}</Typography>
                      <Typography variant="body2">{station.addr}</Typography>
                    </div>
                  ))}
                </Box>
              )}
            {error.searchStatId && (
              <Typography variant="caption" color="error">
                {error.searchStatId}
              </Typography>
            )}
          </Box>

          <Box>
            {/* 선택된 충전소의 statId 표시 */}
            {searchStatId && (
              <TextField
                label="충전소 ID"
                value={searchStatId}
                disabled
                style={{
                  width: "100px",
                  marginBottom: "10px",
                  marginLeft: "10px",
                }}
              />
            )}
          </Box>
        </Box>

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
          rowsMin={13}
          multiline
          rows={13}
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
