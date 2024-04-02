import React, { useState } from "react";
import { HttpPut } from "../../services/HttpService";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

function InquiryModifyform() {
  const location = useLocation();
  const { title, content, inquiryType, isPublished } = location.state;
  const navigate = useNavigate();

  // 이제 title, content, inquiryType, isPublished 변수를 사용하여 수정 폼을 구성하면 됩니다.
  // 예를 들어, useState 훅을 사용하여 각 필드의 상태를 관리할 수 있습니다.
  const [inputTitle, setInputTitle] = useState(title);
  const [inputContent, setInputContent] = useState(content);
  const [inputInquiryType, setInputInquiryType] = useState(inquiryType);
  const [inputIsPublished, setInputIsPublished] = useState(isPublished);
  const { id } = useParams();

  const handleSubmit = async () => {
    try {
      const response = await HttpPut(`/api/v1/inquiry/${id}`, {
        title: inputTitle,
        content: inputContent,
        inquiryType: inputInquiryType,
        isPublished: inputIsPublished,
      });

      // console.log('수정 완료' ,response);
      alert("수정 완료");
      navigate(`/inquiry/${id}`);
    } catch (error) {
      if (title === null) {
        alert("제목은 필수 입력 항목입니다.");
      } else if (content == null) {
        alert("내용은 필수 입력 항목입니다.");
      } else if (inquiryType === null) {
        alert("문의 유형을 선택해주세요.");
      }
      console.error("수정 실패", error.response.data);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: "95%", margin: "auto", display: "block" }}
    >
      <FormControl fullWidth margin="normal">
        <InputLabel id="inquiry-type-label">문의 유형</InputLabel>
        <Select
          labelId="inquiry-type-label"
          value={inputInquiryType}
          label="문의 유형"
          onChange={(e) => setInputInquiryType(e.target.value)}
        >
          <MenuItem value="홈페이지 오류">홈페이지 오류</MenuItem>
          <MenuItem value="회원가입 및 로그인">
            회원가입 및 로그인 문의
          </MenuItem>
          <MenuItem value="전기충전소 문의">전기충전소 문의</MenuItem>
          <MenuItem value="전기충전기 문의">전기충전기 문의</MenuItem>
          <MenuItem value="기타 문의">기타 문의</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        margin="normal"
        label="제목"
        value={inputTitle}
        onChange={(e) => setInputTitle(e.target.value)}
      />
      <TextField
        fullWidth
        margin="normal"
        label="내용"
        multiline
        rows={4}
        value={inputContent}
        onChange={(e) => setInputContent(e.target.value)}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={inputIsPublished}
            onChange={(e) => setInputIsPublished(e.target.checked)}
          />
        }
        label="공개"
      />
      <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
        수정
      </Button>
    </form>
  );
}

export default InquiryModifyform;
