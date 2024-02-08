import React, { useState } from 'react';
import { HttpPut } from '../../services/HttpService';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

function InquiryModifyform() {
    const location = useLocation();
    const {title, content, inquiryType, isPublished } = location.state;
    const navigate = useNavigate();

    // 이제 title, content, inquiryType, isPublished 변수를 사용하여 수정 폼을 구성하면 됩니다.
    // 예를 들어, useState 훅을 사용하여 각 필드의 상태를 관리할 수 있습니다.
    const [inputTitle, setInputTitle] = useState(title);
    const [inputContent, setInputContent] = useState(content);
    const [inputInquiryType, setInputInquiryType] = useState(inquiryType);
    const [inputIsPublished, setInputIsPublished] = useState(isPublished);
    const {id} = useParams();

    const handleSubmit = async () => {
        try {
        const response = await HttpPut(
            `/api/v1/inquiry/${id}`,
            {
            title: inputTitle,
            content: inputContent,
            inquiryType : inputInquiryType,
            isPublished: inputIsPublished
            }
        );


        console.log('수정 완료' ,response);
        alert("수정 완료");
        navigate(`/inquiry/${id}`);
        } catch (error) {
        
        if(title === null){
            alert("제목은 필수 입력 항목입니다.")
        }else if(content == null){
            alert("내용은 필수 입력 항목입니다.")
        }else if(inquiryType === null){
            alert("문의 유형을 선택해주세요.")
        }
        console.error('수정 실패', error.response.data);      
        }
        
    };


    return (
    <form onSubmit={handleSubmit}>
      <label>
        문의 유형: {/* 콤보박스 추가 */}
        <select value={inputInquiryType} onChange={e => setInputInquiryType(e.target.value)}>
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
        <input type="text" value={inputTitle} onChange={e => setInputTitle(e.target.value)} />
      </label>
      <br />
      <label>
        내용:
        <textarea value={inputContent} onChange={e => setInputContent(e.target.value)} />
      </label>
      <br />
      <label>
        공개:
        <input type="checkbox" checked={inputIsPublished} onChange={e => setInputIsPublished(e.target.checked)} />
      </label>
      <br />
      <button type="button" onClick={handleSubmit}>
          수정
      </button>
    </form>
  );
}

export default InquiryModifyform;