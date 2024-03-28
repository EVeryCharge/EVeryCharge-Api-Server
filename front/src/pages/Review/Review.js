import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Button,
  Card
} from "@material-ui/core";
import Rating from "@mui/material/Rating";
import { useAuth } from "../../utils/AuthContext";
import {
  HttpGet,
  HttpPost,
  HttpDelete,
  HttpPut,
  HttpPostWithFile
} from "../../services/HttpService";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

const Review = ({ chargingStationId }) => {
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  //접속자 userName
  const { getUserName } = useAuth();
  //리뷰 가져오기
  const [review, setReview] = useState({ data: { items: [] } });
  const [activeReview, setActiveReview] = useState({ photoIndex: 0, isOpen: false, images: [] });

  const fetchData = async () => {
    try {
      const response = await HttpGet(`api/v1/review/${chargingStationId}`);
      setReview(response || { data: { items: [] } });
      console.log("어떤데이터들이 들어왔는지 볼래", response.data);
    } catch (error) {
      console.error("데이터를 불러오는 중 오류 발생:", error);
    }
  };

  const handleFileChange = (e) => {

    const newSelectedFiles = Array.from(e.target.files); // 새롭게 선택된 파일들을 배열로 변환
    const selectedFiles = [...files, ...newSelectedFiles]; // 기존 파일들과 새로운 파일들을 합친 배열

    if ((files.length + newSelectedFiles.length) > 3) {
      alert(`최대 3개의 파일만 업로드할 수 있습니다. 다시 선택해 주세요`);
      return;
    }

    setFiles(selectedFiles);

    Promise.all(newSelectedFiles.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = event => {
          resolve({ url: event.target.result });
        };
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
      });
    })).then(results => {
      // 모든 파일이 로드되었을 때 실행
      const urls = results.map(result => result.url);

      setPreviewUrls(prevUrls => [...prevUrls, ...urls]);

    }).catch(error => {
      console.error("파일 로드 중 오류가 발생했습니다.", error);
    });

  };

  const handleDeleteImage = (event, indexToDelete) => {
    event.preventDefault();
    event.stopPropagation();
    setPreviewUrls(prevUrls => prevUrls.filter((_, index) => index !== indexToDelete));
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToDelete)); // 파일 목록에서도 삭제
  };


  const [isEditing, setIsEditing] = useState(false);
  const [editReviewId, setEditReviewId] = useState(null);
  const handleUpdate = async (reviewId) => {
    if (!editedReviewContent || !editedReviewContent.trim()) {
      alert("후기 내용을 입력해주세요.");
      return;
    }

    try {
      await HttpPut(`api/v1/review/${chargingStationId}/${reviewId}`, {
        content: editedReviewContent,
        rating: editedReviewRating,
      });

      console.log("후기 수정 성공");
      fetchData();
      setIsEditing(false);
      setEditReviewId(null);
      setEditedReviewContent("");
    } catch (error) {
      console.error("후기를 수정하는 중 오류 발생:", error);
    }
  };
  const handleDelete = async (reviewId, loginUserName, reviewUserName) => {
    if (!window.confirm("삭제하시겠습니까?")) {
      return;
    }
    if (loginUserName == reviewUserName) {
      const response = await HttpDelete(`api/v1/review/${chargingStationId}/${reviewId}`);
      console.log("삭제" + response);

      fetchData();
    }
  };
  const [editedReviewContent, setEditedReviewContent] = useState("");
  const [editedReviewRating, setEditedReviewRating] = useState("");
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditReviewId(null);
    setEditedReviewContent("");
  };
  const handleEdit = (reviewId, content) => {
    setIsEditing(true);
    setEditReviewId(reviewId);
    setEditedReviewContent(content);
  };
  const [newReviewContent, setNewReviewContent] = useState("");
  const { isLogin } = useAuth();
  const handleSubmit = async () => {
    if (!newReviewContent.trim()) {
      alert("후기 내용을 입력해주세요.");
      return;
    }

    if (!isLogin()) {
      alert("로그인 해주세요.");
      return;
    }

    const data = {
      content: newReviewContent,
      rating: newReviewRating,
    };

    const responseData = await HttpPostWithFile(`api/v1/review/${chargingStationId}`, data, files);
    console.log("서버 응답 데이터:", responseData);

    try {
      // await HttpPost(`api/v1/review/${chargingStationId}`, {
      //   content: newReviewContent,
      //   rating: newReviewRating,
      // });

      fetchData();
      setNewReviewContent("");
      setFiles([]);
      setPreviewUrls([]);
    } catch (error) {
      console.error("후기를 작성하는 중 오류 발생:", error);
    }
  };

  const [newReviewRating, setNewReviewRating] = React.useState(3); // 평점 state 추가

  useEffect(() => {
    fetchData();
  }, [chargingStationId]);

  return (
    <div style={{
      marginBottom: "20px",
      marginLeft: "-21.5px",
      marginRight: "10px",
      width: "102%"
    }}>
      <Typography
        variant="subtitle1"
        style={{
          marginTop: "5px",
          padding: "3px",
          display: "flex",
          alignItems: "center",
          fontWeight: "bold",
          backgroundColor: "whitesmoke",
        }}
      >
        이용후기
      </Typography>

      {Array.isArray(review.data.items) && review.data.items.length > 0
        ? review.data.items
          .slice(0, review.data.items.length)
          .map((reviewItem) => (
            <React.Fragment>



              <Card style={{ borderBottom: "1px solid lightGray" }}>
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableRow style={{ borderBottom: "none" }}>
                        <TableCell
                          style={{
                            width: "100px",
                            padding: "10px",
                            textAlign: "center",
                            borderBottom: "none"
                          }}
                        >
                          <div>{reviewItem.userName}</div>
                          {isEditing && editReviewId === reviewItem.id ? (
                            <Rating
                              name="size-small"
                              value={reviewItem.rating}
                              size="small"
                              onChange={(event, newValue) => {
                                setEditedReviewRating(newValue);
                                reviewItem.rating = newValue;
                              }}
                            />
                          ) : (
                            <Rating
                              name="read-only"
                              value={reviewItem.rating}
                              readOnly
                              size="small"
                            />
                          )}
                        </TableCell>
                        <TableCell
                          style={{
                            width: "100%", wordWrap: "break-word", padding: "4px", borderBottom: "none"
                          }}
                        >
                          <div style={{ display: "block", marginTop: "30px" }}> {/* 후기 내용 컨테이너 */}
                            {isEditing && editReviewId === reviewItem.id ? (
                              <TextField
                                label="후기 수정"
                                variant="outlined"
                                multiline
                                minRows={1}
                                value={editedReviewContent}
                                onChange={(e) =>
                                  setEditedReviewContent(e.target.value)
                                }
                                fullWidth
                                size="small"
                              />
                            ) : (
                              <div style={{ wordBreak: "break-all", padding: "4px", marginTop: "-15px", fontSize: "18px", maxWidth: "320px" }}>
                                {reviewItem.content || "내용이 없습니다."}
                              </div>
                            )}
                          </div>

                        </TableCell>
                        <TableCell style={{
                          width: "50px", borderBottom: "none"
                        }}>
                          <div style={{ fontSize: "11px" }}>
                            {new Date(reviewItem.createDate).toLocaleString(undefined, {
                              year: 'numeric', month: 'numeric', day: 'numeric',
                              hour: 'numeric', minute: 'numeric'
                            })}
                          </div>
                          {getUserName() == reviewItem.userName && (
                            <div>
                              {isEditing && editReviewId === reviewItem.id ? (
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column", // 세로로 나열
                                    alignItems: "center", // 가운데 정렬
                                    marginBottom: "1px",
                                  }}
                                >
                                  {/* 수정 완료 버튼 */}
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleUpdate(editReviewId)}
                                    style={{ fontSize: "12px", marginBottom: "4px" }} // 버튼 간격 조절을 위한 marginBottom 추가
                                  >
                                    완료
                                  </Button>
                                  {/* 취소 버튼 */}
                                  <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleCancelEdit}
                                    style={{ fontSize: "12px" }}
                                  >
                                    취소
                                  </Button>
                                </div>
                              ) : (
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column", // 세로로 나열
                                    alignItems: "center", // 가운데 정렬
                                    marginBottom: "1px",
                                  }}
                                >
                                  {/* 수정 버튼 */}
                                  <Button
                                    variant="contained"
                                    onClick={() =>
                                      handleEdit(
                                        reviewItem.id,
                                        reviewItem.content
                                      )
                                    }
                                    style={{ fontSize: "12px", marginBottom: "4px" }} // 버튼 간격 조절을 위한 marginBottom 추가
                                  >
                                    수정
                                  </Button>
                                  {/* 삭제 버튼 */}
                                  <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() =>
                                      handleDelete(
                                        reviewItem.id,
                                        getUserName(),
                                        reviewItem.userName
                                      )
                                    }
                                    style={{ fontSize: "12px" }}
                                  >
                                    삭제
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>


                {reviewItem.s3fileUrl && reviewItem.s3fileUrl.length > 0 && (
                  <div colSpan={3} style={{ display: "block", display: "flex", marginBottom: "20px", marginLeft: "10%" }}>
                    <div style={{ display: "flex" }}>
                      {reviewItem.s3fileUrl.map((imageUrl, index) => (
                        <img
                          key={index}
                          src={imageUrl}
                          alt={`리뷰 이미지 ${index + 1}`}
                          style={{ width: "100px", height: "100px", objectFit: "cover", marginRight: "10px", borderRadius: "10%", }}
                          onClick={() => {
                            setActiveReview({ photoIndex: index, isOpen: true, images: reviewItem.s3fileUrl });
                          }}
                        />
                      ))}
                    </div>
                    {activeReview.isOpen && (
                      <Lightbox
                        mainSrc={activeReview.images[activeReview.photoIndex]}
                        nextSrc={activeReview.images[(activeReview.photoIndex + 1) % activeReview.images.length]}
                        prevSrc={activeReview.images[(activeReview.photoIndex + activeReview.images.length - 1) % activeReview.images.length]}
                        onCloseRequest={() => setActiveReview(prev => ({ ...prev, isOpen: false }))}
                        onMovePrevRequest={() =>
                          setActiveReview(prev => ({ ...prev, photoIndex: (prev.photoIndex + prev.images.length - 1) % prev.images.length }))
                        }
                        onMoveNextRequest={() =>
                          setActiveReview(prev => ({ ...prev, photoIndex: (prev.photoIndex + 1) % prev.images.length }))
                        }
                      />
                    )}
                  </div>
                )}

              </Card>

            </React.Fragment>

          ))
        : null}
      <div style={{ height: "10px" }}></div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          marginBottom: "1px",
        }}
      >
        <TextField
          label={
            Array.isArray(review.data.items) && review.data.items.length === 0
              ? "첫 후기를 작성해 보세요."
              : "후기 작성"
          }
          variant="outlined"
          multiline
          minRows={1}
          value={newReviewContent}
          onChange={(e) => setNewReviewContent(e.target.value)}
          fullWidth
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            alignContent: "center",
            width: "160px",
          }}
        >
          <div>
            <Rating
              name="size-small"
              defaultValue={3}
              size="small"
              onChange={(event, newValue) => {
                setNewReviewRating(newValue);
              }}
            />
          </div>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            size="small"
          >
            작성
          </Button>
        </div>
      </div>
      <input type="file" onChange={handleFileChange} multiple />
      <div>
        총 {previewUrls.length}개의 파일이 선택되었습니다.
      </div>
      <div>
        {previewUrls.map((url, index) => (
          <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
            <img src={url} alt={`이미지 프리뷰 ${index}`} style={{ width: "100px", height: "100px" }} />
            <button type="button"
              style={{ position: 'absolute', top: 0, right: 0, cursor: 'pointer' }}
              onClick={(event) => handleDeleteImage(event, index)}>
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Review;
