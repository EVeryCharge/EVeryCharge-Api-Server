import React, { useEffect, useState } from "react";
import { HttpDelete, HttpGet, HttpPost, HttpPut } from "../../services/HttpService";
import { TextField, Button, List, ListItem, ListItemText, Paper, Typography } from '@material-ui/core';
import { useAuth } from "../../utils/AuthContext";
import { useNavigate } from "react-router-dom";

const InqueryComment = ({inquiryId}) => {

    const {getUserId} = useAuth();        
    const [comments, setComments] = useState([]);
    const [commentInput, setCommentInput] = useState('');
    const navigate = useNavigate();

    //작성 버튼 (완료)

    //처음 렌더링시 댓글 데이터 받아오기 (완료)
    /**
     * useEffect를 사용해서 랜더링시 GET요청
     */
    useEffect(() => {
        HttpGet('/api/v1/comment/all',
        {
            inquiryId: Number(inquiryId)
        })
        .then((response) => {
            setComments(response);
        })
        .catch((e) => {
            console.log('---------------------------- GET ERROR -------------------------');
            console.log(e);
        })
    }, []);
    
    /** 수정 버튼
     *      auth로 검사해서 만약에 로그인을 안했거나, 다른 유저면 안보이게 설정하기
     *      댓글 수정 창으로 이동
     */
    const handleModifyComment = (props) => {

    }

    /** 삭제 버튼
     *      auth로 검사해서 만약에 로그인을 안했거나, 다른 유저면 안보이게 설정하기
     *      다시 한번 묻는 창 띄우기
     *      다시한번 묻는 창에서 한번 더 클릭시 삭제 진행
     */
    //삭제 버튼
    const handleRemoveComment = (commentId) =>{
        const isConfirmed = window.confirm("정말로 댓글을 삭제하시겠습니까? ");
        console.log('---------------------------- isConfirmed -------------------------');
        console.log(isConfirmed);

        if(isConfirmed){
            
            //TODO
            /**
             * 
             */
            console.log('---------------------------- commentId -------------------------');
            console.log(Number(commentId));
            HttpDelete('/api/v1/comment/delete',{
                commentId: Number(commentId),
                inquiryId: Number(inquiryId)
            })
            .then((response) => {
                console.log('---------------------------- delete response -------------------------');
                console.log(response);
                setComments(response);
            })
        
        }
    }

    const handleAddComment = () => {
        console.log('-------------------------------------- handleAddComment ---------------------------------------')
        setCommentInput(''); // 입력 필드 초기화

        HttpPost('/api/v1/comment/create'
        ,{
            inquiryId: Number(inquiryId),
            content: commentInput,
            memberId: Number(getUserId())
        }
        )
        .then((response) => {
            setComments(response);
        })
    };

    return (
        <Paper style={{ padding: '20px', maxWidth: '95%', margin: '20px auto', marginBottom: '100px' }}>
            <Typography variant="h5" style={{ marginBottom: '10px' }} >댓글</Typography>
            <List>
                {comments.map((comment) => (
                    <>
                    <ListItem key={comment.commentId} divider>
                        <ListItemText primary={comment.content}
                            secondary={
                                <>
                                    <Typography component="span" variant="body2" color="textPrimary">
                                        작성자: {comment.writer.startsWith('KAKAO') ? comment.nickname : comment.writer}
                                    </Typography>
                                    {" — "}생성일: {new Date(comment.createDate).toLocaleDateString()}
                                    {", "}수정일: {new Date(comment.modifiedDate).toLocaleDateString()}
                                </>
                            } 
                        />
                        <Button
                            
                        >수정</Button>
                        <Button
                            onClick={() =>{
                                console.log(comment.commentId);
                                handleRemoveComment(comment.commentId);
                            }}
                        >삭제</Button>
                    </ListItem>                 
                    </>
                ))}
            </List>
            <TextField
                label="Write a comment..."
                fullWidth
                variant="outlined"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                style={{ marginBottom: '20px' }}
            />
            <Button variant="contained" color="primary" onClick={handleAddComment}>
                Add Comment
            </Button>
        </Paper>
    );

}
export default InqueryComment;