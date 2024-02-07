import React, { useState } from 'react';
import { HttpPost } from '../../services/HttpService';
import { useNavigate } from 'react-router-dom';

function InquiryForm() {
  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const [inquiryType, setInquiryType] = useState(null); // 문의 유형 상태 추가
  const navigate = useNavigate();


  const handleSubmit = async () => {
    try {
      const response = await HttpPost(
        '/api/v1/inquiry/create',
        {
          title: title,
          content: content,
          inquiryType : inquiryType,
          isPublished: isPublished
        }
      );

      console.log('문의 등록 완료' ,{ title, content, isPublished, inquiryType});
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
      console.error('글쓰기 실패', error.response.data);      
    }
    
  };


  return (
    <form onSubmit={handleSubmit}>
      <label>
        문의 유형: {/* 콤보박스 추가 */}
        <select value={inquiryType} onChange={e => setInquiryType(e.target.value)}>
          <option value ="null">선택하세요</option>
          <option value="홈페이지 오류">홈페이지 오류</option>
          <option value="전기충전소 문의">전기충전소 문의</option>
          <option value="전기충전기 문의">전기충전기 문의</option>
          <option value="나문희">나문희</option>
        </select>
      </label>
      <br />
      <label>
        제목:
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
      </label>
      <br />
      <label>
        내용:
        <textarea value={content} onChange={e => setContent(e.target.value)} />
      </label>
      <br />
      <label>
        공개:
        <input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} />
      </label>
      <br />
      <button type="button" onClick={handleSubmit}>
          등록
      </button>
    </form>
  );
}

export default InquiryForm;