import React, { useState, useEffect } from "react";
import { Button, TextField } from "@material-ui/core";
import { HttpGet, HttpPut } from "../../services/HttpService";

const InquiryCommentForm = ({ onCancel, commentId }) => {
  console.log(commentId);

  const [content, setContent] = useState("");
  const [writer, setWriter] = useState("");

  useEffect(() => {
    HttpGet("/api/v1/inquiry/comment/find", {
      commentId: Number(commentId),
    }).then((response) => {
      // console.log(response);
      setContent(response.content);
      setWriter(response.writer);
    });
  }, [commentId]);

  //수정
  const handleModifyComment = () => {
    HttpPut("/api/v1/inquiry/comment/modify", {
      content: content,
      commentId: Number(commentId),
      writer: writer,
    }).then((response) => {
      onCancel();
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "100%",
      }}
    >
      <TextField
        variant="outlined"
        fullWidth
        label="Edit Comment"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
          width: "100%",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleModifyComment}
        >
          수정
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          취소
        </Button>
      </div>
    </div>
  );
};
export default InquiryCommentForm;
