import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HttpGet, HttpPost, HttpPut } from "../../services/HttpService";
import RedirectIfNotLoggedIn from "../../utils/RedirectIfNotLoggedIn";
import ReportHeader from "./ReportHeader";

const ReportForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 신고 수정하기로 접근 시 신고 상세페이지에서 주입받는 props
  const {
    reportType: propReportType,
    statId: propStatId,
    statNm: propStatNm,
    title: propTitle,
    content: propContent,
    id: propId,
    mode: propMode,
  } = location.state || {};

  const [title, setTitle] = useState(propTitle || "");
  const [content, setContent] = useState(propContent || "");
  const [reportType, setReportType] = useState(propReportType || "수리보수");
  const [searchKw, setSearchKw] = useState(propStatNm || "");
  const [searchStatId, setSearchStatId] = useState(propStatId || "");
  const [chargingStations, setChargingStations] = useState([]);
  const [mode, setMode] = useState(propMode || "CREATE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    title: "",
    content: "",
    reportType: "",
    searchKw: "",
    searchStatId: "",
  });

  // 충전소 검색 API GET
  const fetchChargingStations = useCallback(async () => {
    try {
      const response = await HttpGet("/api/v1/reports/station", {
        kw: searchKw,
      });
      const result = response;

      if (result.success && result.data) {
        setChargingStations(result.data.chargingStations);
        setError((prevError) => ({ ...prevError, searchKw: "" }));
      } else {
        setChargingStations([]);
        setError(() => ({
          searchKw: "검색 결과가 없습니다.",
        }));
      }
    } catch (error) {
      console.error("API 요청 중 에러:", error);
      setError((prevError) => ({
        ...prevError,
        searchKw: "요청 중 에러가 발생했습니다. 잠시 후에 시도해주세요",
      }));
    } finally {
      setLoading(false);
    }
  }, [searchKw]);

  useEffect(() => {
    if ((searchKw && searchKw.trim() === "") || searchKw.length < 2) {
      setLoading(false);
      setError(() => ({
        searchKw: "검색어를 2자 이상 입력해주세요",
      }));
    } else if (searchStatId !== "") {
      setLoading(false);
    } else {
      setLoading(true);
      setError(() => ({
        searchKw: "검색 결과를 찾고 있습니다",
      }));
      const timerId = setTimeout(() => {
        fetchChargingStations(searchKw);
      }, 1000); // 유저 타이핑이 멈추고 1.5초 뒤 최종 searchKw 기반으로 호출
      return () => {
        clearTimeout(timerId);
      };
    }
  }, [searchKw]);

  // 신고 생성 / 수정 API 요청
  const handleCreateModifyReport = async () => {
    const isValid = validateInputs();

    if (isValid) {
      try {
        const requestData = {
          title: title,
          content: content,
          reportType: reportType,
          statId: searchStatId,
          statNm: searchKw,
        };

        const response =
          // 수정
          mode === "MODIFY"
            ? await HttpPut(`/api/v1/reports/${propId}`, requestData)
            : // 생성
              await HttpPost("/api/v1/reports", requestData);

        if (response.statusCode === 200) {
          if (mode === "MODIFY") {
            // console.log("신고내역이 성공적으로 수정되었습니다.");
            alert("신고내역이 성공적으로 수정되었습니다.");
            navigate(`/report/${propId}`);
            return;
          } else if (mode === "CREATE") {
            alert("신고내역이 성공적으로 등록되었습니다.");
            navigate(`/report/${response.data.id}`);
            return;
          } else {
            // console.log("신고 저장 실패");
          }
        }
      } catch (error) {
        console.error(
          mode === "MODIFY" ? "신고 수정 중 오류:" : "신고 등록 중 오류:",
          error
        );
      }
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
    setError((prevError) => ({ ...prevError, content: "." }));
  };

  const handleSearchChange = (event) => {
    const inputValue = event.target.value;
    setSearchKw(inputValue);
    setChargingStations([]); // 검색어 변경 시 충전소 검색창 초기화
    setSearchStatId(""); // 검색어 변경 시 충전소 ID 초기화
    setError((prevError) => ({ ...prevError, searchKw: "." }));
  };

  const handleReportTypeChange = (event) => {
    const inputValue = event.target.value;
    setReportType(inputValue);
    setError((prevError) => ({ ...prevError, reportType: "" }));
  };

  const handleChargingStationSelect = (station) => {
    setSearchKw(station.statNm);
    setSearchStatId(station.statId);
    setError((prevError) => ({
      ...prevError,
      searchKw: ".",
      searchStatId: "",
    }));
  };

  // 입력값 검증
  const validateInputs = () => {
    let isValid = true;
    const newError = {
      title: "",
      content: "",
      reportType: "",
      searchKw: "",
      searchStatId: "",
    };

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

    if (content.length > 200) {
      newError.content = "내용을 200자 이내로 입력하세요.";
      isValid = false;
    }

    if (reportType === "") {
      newError.reportType = "신고유형을 선택하세요.";
      isValid = false;
    }

    if (searchStatId === "") {
      newError.searchStatId = "충전소를 선택하세요.";
      isValid = false;
    }

    setError(newError);

    if (!isValid) {
      alert("입력값을 확인하세요.");
    }

    return isValid;
  };

  return (
    <Box mt={4} mb={4}>
      <RedirectIfNotLoggedIn />

      {/* 헤더 */}
      <ReportHeader
        headerTitle={mode === "MODIFY" ? "신고내역 수정" : "신고내역 등록"}
        headerDescription={"등록 내용을 유지보수자가 확인합니다."}
        actorCanCreate={false}
        actorCanManagerSearch={false}
        isEditPage={true}
      />
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
              {/* 추가적인 신고유형 항목들을 필요에 따라 추가, TODO enum으로 교체*/}
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
              placeholder="충전소명 / 주소명을 입력하세요."
              helperText={error.searchKw}
              onChange={handleSearchChange}
              style={{
                width: "400px",
                marginLeft: "10px",
              }}
            />
            {/* 로딩 표시 */}
            {loading && (
              <CircularProgress
                size={24}
                style={{ marginLeft: "10px", marginTop: "20px" }}
              />
            )}
            {/* 드롭다운에 표시할 충전소 목록 */}
            {chargingStations &&
              chargingStations.length > 0 &&
              !searchStatId && (
                <Box
                  position="absolute"
                  zIndex="1"
                  bgcolor="rgb(211, 211, 211, 0.95)"
                  width="390px"
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
          placeholder="내용을 입력하세요(200자 이내)"
          helperText={`${content.length} / 200`}
          inputProps={{ maxLength: 200 }}
          rowsMin={10}
          multiline
          rows={10}
          value={content}
          onChange={handleContentChange}
          style={{ width: "100%", marginBottom: "10px" }}
        />
        {error.content && (
          <Typography variant="caption" color="error">
            {error.content}
          </Typography>
        )}

        {/* 저장 버튼 */}
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
            variant="outlined"
            color="primary"
            onClick={handleCreateModifyReport}
            style={{ marginTop: "10px" }}
          >
            {mode === "MODIFY" ? "수정하기" : "등록하기"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ReportForm;
