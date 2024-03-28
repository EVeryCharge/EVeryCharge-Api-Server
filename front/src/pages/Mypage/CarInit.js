import React, { useEffect, useState } from "react";
import Modal from "react-modal";

import { HttpGet, HttpPut } from "../../services/HttpService";
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { makeStyles, } from "@material-ui/core/styles";
import {
    Button,
} from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../utils/AuthContext";

const CarInit = ({ isOpen, onRequestClose }) => {
    const classes = useStyles();
    const [manuItem, setManuItem] = useState([]);
    const [carItem, setCarItem] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedCar, setSelectedCar] = useState(null);

    const navigate = useNavigate();
    const { getUserName } = useAuth();

    const closeModal = () => {
        onRequestClose();
    };

    useEffect(() => { }, [isOpen]);

    useEffect(() => {
        const fetchManuItem = async () => {
            try {
                const data = await HttpGet("/api/v1/car/manuAll");
                setManuItem([...data.carManufacturerList]);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchManuItem();
    }, []);

    useEffect(() => {
        const fetchCarManuItem = async () => {
            console.error("Error fetching data:");
            try {
                const data = await HttpGet(`/api/v1/car/findByManu?manu=${selectedBrand}`);
                setCarItem([...data.carDtoList]);
                console.log(data.carDtoList);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchCarManuItem();
    }, [selectedBrand]);

    const handleBrandChange = (event, newBrand) => {
        setSelectedBrand(newBrand);
    };
    const handleBrandChange2 = (event, newBrand) => {
        setSelectedCar(newBrand);
    };

    // manuItem을 6개씩 끊어서 배열로 만드는 함수
    const chunkedManuItems = (items, chunkSize) => {
        const chunks = [];
        for (let i = 0; i < items.length; i += chunkSize) {
            chunks.push(items.slice(i, i + chunkSize));
        }
        return chunks;
    };

    const handleSubmit = async () => {
        // 선택된 차량이 맞는지 확인하는 알림창을 띄움
        const isConfirmed = window.confirm(`${getUserName()} ${selectedCar}로 등록하기`);

        if (isConfirmed) {
            try {
                // 사용자가 '확인'을 누르면 httpPut 요청 실행
                const response = await HttpPut("/api/v1/members/carInit", {
                    username: getUserName(), // 사용자 이름 설정
                    carModel: selectedCar, // 선택된 차 모델 사용

                });

                // httpPut 요청이 성공한 후 /my로 리다이렉트
                onRequestClose();
            } catch (error) {
                console.error("데이터를 가져오는 중 오류가 발생했습니다:", error);
            }
        } else {
            // 사용자가 알림창에서 '취소'를 누르면 아무것도 하지 않음
            console.log("사용자가 작업을 취소했습니다.");
        }
    };


    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Selected Marker"
            style={{
                overlay: {
                    zIndex: 1000, // 모달 배경의 z-index
                    marginLeft: "-71px"
                },
                content: {
                    maxWidth: "500px", // 최대 너비 설정
                    width: "89%", // 모달의 너비를 조절합니다.
                    height: "60%", // 모달의 높이를 조절합니다.
                    display: "flex",
                    justifyContent: "center", // 수평 가운데 정렬
                    margin: "auto",
                    marginTop: "15vh",
                },
            }}
        >
            <div className={classes.root} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 style={{ marginBottom: '20px', color: '#1976d2' }}>브랜드 선택</h1>
                <Stack alignItems="center">
                    {chunkedManuItems(manuItem, 4).map((chunk, index) => (
                        <ToggleButtonGroup
                            key={index}
                            value={selectedBrand}
                            exclusive
                            aria-label="Button group"
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, 1fr)',
                                marginBottom: 2, // 각 ToggleButtonGroup 사이의 마진 추가
                                '& .MuiToggleButton-root': { // 모든 토글 버튼에 적용될 스타일
                                    border: '1px solid ',
                                    '&.Mui-selected': {
                                        backgroundColor: '#1976d2',
                                        color: '#fff',
                                        '&:hover': {
                                            backgroundColor: '#115293',
                                        },
                                    },
                                    '&:hover': {
                                        backgroundColor: '#f0f0f0',
                                    },
                                },
                            }}
                            onChange={handleBrandChange}
                        >
                            {chunk.map((option) => (
                                <ToggleButton
                                    key={option}
                                    value={option}
                                    sx={{
                                        width: 100, // 버튼의 고정된 너비
                                        height: 50, // 버튼의 고정된 높이
                                    }}
                                >
                                    {option}
                                </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                    ))}
                </Stack>
                <h1 style={{ marginTop: '40px', marginBottom: '20px', color: '#1976d2' }}>모델 선택</h1>
                <Stack alignItems="center">
                    <ToggleButtonGroup
                        orientation="vertical"
                        value={selectedCar}
                        onChange={handleBrandChange2}
                        exclusive
                        aria-label="Button group"
                        sx={{
                            '& .MuiToggleButton-root': {
                                maxWidth: '450px',
                                minWidth: '360px',
                                height: 70,
                                justifyContent: 'flex-start',
                                paddingLeft: '20px',
                                border: '1px solid ',
                                '&.Mui-selected': {
                                    backgroundColor: '#1976d2',
                                    color: '#fff',
                                    '&:hover': {
                                        backgroundColor: '#115293',
                                    },
                                },
                                '&:hover': {
                                    backgroundColor: '#f0f0f0',
                                },
                            },
                        }}
                    >
                        {carItem.map(car => (
                            <ToggleButton
                                value={car.carModel}
                                key={car.carModel}
                            >
                                {car.carModel}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Stack>

                <br />

                <Button
                    variant="outlined" // 변경된 variant로 더 돋보이는 버튼 스타일 적용
                    color="primary"
                    onClick={handleSubmit}
                    sx={{
                        marginTop: '30px',
                        padding: '10px 20px',
                        backgroundColor: '#1976d2',
                        '&:hover': {
                            backgroundColor: '#115293',
                        },
                    }}
                >
                    등록
                </Button>
            </div>
        </Modal>
    );
};



const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
}));

export default CarInit;
