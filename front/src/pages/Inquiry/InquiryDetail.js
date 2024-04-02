import React, { useEffect, useState } from "react";
import { HttpDelete, HttpGet, HttpPut } from "../../services/HttpService";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  makeStyles,
} from "@material-ui/core";
import InqueryComment from "../Inquiry/InqueryComment";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

const useStyles = makeStyles({
  type: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    fontWeight: "bold",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    whiteSpace: "pre-line",
  },
  writer: {
    fontSize: 14,
    color: "#999",
  },
});

const InquiryDetail = ({}) => {
  const [inquiry, setInquiry] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const sessionUsername = sessionStorage.getItem("username");
  const [activeReview, setActiveReview] = useState({
    photoIndex: 0,
    isOpen: false,
    images: [],
  });

  const handleUpdate = () => {
    navigate(`/modify/${id}`, {
      state: {
        id: inquiry.id,
        title: inquiry.title,
        content: inquiry.content,
        inquiryType: inquiry.inquiryType,
        isPublished: inquiry.isPublished,
      },
    });
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
    if (confirmDelete) {
      try {
        // 삭제 로직
        const response = await HttpDelete(`/api/v1/inquiry/${id}`);
        // console.log('삭제가 성공적으로 이루어졌습니다.', response);
        alert("삭제되었습니다.");
        navigate("/inquiry");
      } catch (error) {
        console.error("삭제 과정에서 에러가 발생했습니다.", error);
      }
    } else {
      return;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await HttpGet(`/api/v1/inquiry/${id}`);
      //   console.log("fetch data 확인", response);
      setInquiry(response);
    } catch (error) {
      console.error("에러: ", error);
    }
  };

  const classes = useStyles();

  return (
    <Card>
      <CardContent>
        <Typography className={classes.type}>
          문의 유형 : {inquiry.inquiryType}
        </Typography>
        <Typography className={classes.title} component="h2">
          제목 : {inquiry.title}
        </Typography>
        <Typography className={classes.content} component="p">
          내용 : {inquiry.content}
        </Typography>
        <Typography className={classes.writer} align="right">
          작성자 : {inquiry.writer}
        </Typography>
        <div style={{ display: "flex", flexWrap: "wrap", marginTop: "20px" }}>
          {inquiry.s3fileUrl &&
            inquiry.s3fileUrl.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Inquiry ${index}`}
                style={{
                  maxWidth: "600px",
                  maxHeight: "500px",
                  width: "350px",
                  height: "250px",
                  marginRight: "10px",
                  marginBottom: "20px",
                }}
                onClick={() => {
                  setActiveReview({
                    photoIndex: index,
                    isOpen: true,
                    images: inquiry.s3fileUrl,
                  });
                }}
              />
            ))}
        </div>
        {activeReview.isOpen && (
          <Lightbox
            mainSrc={activeReview.images[activeReview.photoIndex]}
            nextSrc={
              activeReview.images[
                (activeReview.photoIndex + 1) % activeReview.images.length
              ]
            }
            prevSrc={
              activeReview.images[
                (activeReview.photoIndex + activeReview.images.length - 1) %
                  activeReview.images.length
              ]
            }
            onCloseRequest={() =>
              setActiveReview((prev) => ({ ...prev, isOpen: false }))
            }
            onMovePrevRequest={() =>
              setActiveReview((prev) => ({
                ...prev,
                photoIndex:
                  (prev.photoIndex + prev.images.length - 1) %
                  prev.images.length,
              }))
            }
            onMoveNextRequest={() =>
              setActiveReview((prev) => ({
                ...prev,
                photoIndex: (prev.photoIndex + 1) % prev.images.length,
              }))
            }
          />
        )}
        {sessionUsername === inquiry.writer && (
          <div>
            <Button onClick={handleUpdate}>수정</Button>
            <Button onClick={handleDelete}>삭제</Button>
          </div>
        )}
      </CardContent>
      <InqueryComment inquiryId={id}></InqueryComment>
    </Card>
  );
};

export default InquiryDetail;
