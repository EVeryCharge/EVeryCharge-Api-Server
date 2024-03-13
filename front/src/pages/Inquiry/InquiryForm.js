import React, { useState, useEffect } from 'react';
import { HttpPost } from '../../services/HttpService';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox } from '@mui/material';

function InquiryForm() {
  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const [inquiryType, setInquiryType] = useState(null); 
  const navigate = useNavigate();
  const formData = new FormData();
  const [files, setFiles] = useState([]); 
  const [previewUrls, setPreviewUrls] = useState([]); 
  const [filenames, setFileNames] = useState([]); 
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  useEffect(() => {
    console.log("등록된 파일 이름은: " + filenames);
  }, [filenames]);  

  const handleFileChange = (e) => {

    if (e.target.files.length > 10) {
      alert(`최대 10 개의 파일만 업로드할 수 있습니다. 다시 선택해 주세요`);
      e.target.value = '';
      setFiles([]);
      setPreviewUrls([]);
      return; 
    }

    const selectedFiles = Array.from(e.target.files); // 선택된 파일들을 배열로 변환
    setFiles(selectedFiles); 

    const fileReaders = [];
    const urls = [];
    const filenames = [];

    selectedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        urls.push(event.target.result);
        filenames.push(file.name);

        if (urls.length === selectedFiles.length) {
          setPreviewUrls(urls); 
          setFileNames(filenames);
        }
      };
      reader.readAsDataURL(file);
    });

  };


  const handleSubmit = async () => {
    try {
      if(files){ 
        // files 배열에 있는 모든 파일을 FormData에 추가
        files.forEach((file, index) => {
          formData.append(`files`, file); // 서버에서 배열 형태로 파일을 받을 수 있도록 이름을 설정
        });

        formData.append('type', 'inquiry'); // 'type' 파라미터 추가

        fetch(`${BACKEND_URL}/api/v1/inquiry/fileupload`, {
          method: 'POST',
          body: formData,
        }).then(
            resp => resp.json()
          ).then(
            data => console.log(data)
          ).catch( err => console.log)
          console.log(`전송된 파일 목록 = ${filenames}`)
      }

      const request1 = await HttpPost(
        '/api/v1/inquiry/create',
        {
          title: title,
          content: content,
          inquiryType : inquiryType,
          isPublished: isPublished,
          s3fileNames : files.map(file => file.name), // 업로드된 파일 이름들
        }
      );

      console.log('문의 등록 완료' ,{ title, content, isPublished, inquiryType, filenames: files.map(file => file.name)});
      alert("문의 등록 완료");
      navigate('/inquiry');
    } catch (error) {
      
      if(title === null){
        alert("제목은 필수 입력 항목입니다.")
      }else if(content == null){
        alert("내용은 필수 입력 항목입니다.")
      }else if(inquiryType === null){
        alert("문의 유형을 선택해주세요.")
      }
      console.error('글쓰기 실패', error);              
    }
  };


  return (
    <form onSubmit={handleSubmit} style={{maxWidth: '95%', margin: 'auto', display: 'block'}}>
      <FormControl fullWidth margin="normal">
        <InputLabel>문의 유형</InputLabel>
        <Select
          value={inquiryType}
          label="문의 유형"
          onChange={e => setInquiryType(e.target.value)}
        >
          <MenuItem value="홈페이지 오류">홈페이지 오류</MenuItem>
          <MenuItem value="회원가입 및 로그인">회원가입 및 로그인 문의</MenuItem>
          <MenuItem value="전기충전소 문의">전기충전소 문의</MenuItem>
          <MenuItem value="전기충전기 문의">전기충전기 문의</MenuItem>            
          <MenuItem value="기타 문의">기타 문의</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        margin="normal"
        label="제목"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <TextField
        fullWidth
        margin="normal"
        label="내용"
        multiline
        rows={4}
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <input type="file" onChange={handleFileChange} multiple />
      <div>
        {previewUrls.map((url, index) => (
          <img key={index} src={url} alt={`이미지 프리뷰 ${index}`} style={{ width: "100px", height: "100px" }} />
        ))}
      </div>
     
      <FormControlLabel
        control={<Checkbox checked={isPublished} onChange={e => setIsPublished(e.target.checked)} />}
        label="공개"
      />
      <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
        등록
      </Button>
    </form>
  );
}

export default InquiryForm;