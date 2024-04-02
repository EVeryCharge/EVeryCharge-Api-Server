import React, { useEffect, useState } from "react";
import {
  HttpDelete,
  HttpGet,
  HttpPost,
  HttpPut,
} from "../../services/HttpService";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@material-ui/core";
import { useAuth } from "../../utils/AuthContext";
import InquiryCommentForm from "../Inquiry/InquiryCommentForm";

const InqueryComment = ({ inquiryId }) => {
  const { getUserId, getUserName, isLogin } = useAuth();
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [modifyCommentId, setModifyCommentId] = useState(null);

  const handleCancel = () => {
    setModifyCommentId(null); // "Cancel" 클릭 시 modifyCommentId를 null로 설정
  };

  useEffect(() => {
    HttpGet("/api/v1/inquiry/comment/all", {
      inquiryId: Number(inquiryId),
    })
      .then((response) => {
        setComments(response);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [modifyCommentId]);

  //삭제
  const handleRemoveComment = (commentId) => {
    const isConfirmed = window.confirm("정말로 댓글을 삭제하시겠습니까? ");

    if (isConfirmed) {
      HttpDelete("/api/v1/inquiry/comment/delete", {
        commentId: Number(commentId),
        inquiryId: Number(inquiryId),
      }).then((response) => {
        setComments(response);
      });
    }
  };

  //댓글 작성
  const handleAddComment = () => {
    setCommentInput(""); // 입력 필드 초기화
    HttpPost("/api/v1/inquiry/comment/create", {
      inquiryId: Number(inquiryId),
      content: commentInput,
      memberId: Number(getUserId()),
    }).then((response) => {
      setComments(response);
    });
  };

  return (
    <Paper
      style={{
        padding: "20px",
        maxWidth: "95%",
        margin: "20px auto",
        marginBottom: "100px",
      }}
    >
      <Typography variant="h5" style={{ marginBottom: "10px" }}>
        댓글
      </Typography>
      <List>
        {comments.map((comment) => (
          <>
            <ListItem key={comment.commentId} divider>
              {modifyCommentId === comment.commentId ? (
                // 수정 모드인 경우, 해당 위치에만 수정 폼을 렌더링
                <InquiryCommentForm
                  onCancel={handleCancel}
                  commentId={comment.commentId}
                ></InquiryCommentForm>
              ) : (
                <>
                  <ListItemText
                    primary={comment.content}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="textPrimary"
                        >
                          작성자:{" "}
                          {comment.writer.startsWith("KAKAO")
                            ? comment.nickname
                            : comment.writer}
                        </Typography>
                        {" — "}생성일:{" "}
                        {new Date(comment.createDate).toLocaleDateString()}
                        {", "}수정일:{" "}
                        {new Date(comment.modifiedDate).toLocaleDateString()}
                      </>
                    }
                  />
                  {isLogin() && getUserName() === comment.writer && (
                    <>
                      <Button
                        onClick={() => setModifyCommentId(comment.commentId)}
                      >
                        수정
                      </Button>
                      <Button
                        onClick={() => {
                          // console.log(comment.commentId);
                          handleRemoveComment(comment.commentId);
                        }}
                      >
                        삭제
                      </Button>
                    </>
                  )}
                </>
              )}
            </ListItem>
          </>
        ))}
      </List>
      {getUserName() == "admin" || getUserName() == "system" ? (
        <>
          <TextField
            label="Write a comment..."
            fullWidth
            variant="outlined"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            style={{ marginBottom: "20px" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddComment}
          >
            Add Comment
          </Button>
        </>
      ) : null}
    </Paper>
  );
};
export default InqueryComment;
