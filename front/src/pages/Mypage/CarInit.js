import React, { useEffect, useState } from "react";
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

const CarInit = () => {
    const classes = useStyles();
    const [manuItem, setManuItem] = useState([]);
    const [carItem, setCarItem] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedCar, setSelectedCar] = useState(null);

    const navigate = useNavigate();
    const { getUserName } = useAuth();

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
                navigate("/my");
            } catch (error) {
                console.error("데이터를 가져오는 중 오류가 발생했습니다:", error);
            }
        } else {
            // 사용자가 알림창에서 '취소'를 누르면 아무것도 하지 않음
            console.log("사용자가 작업을 취소했습니다.");
        }
    };


    return (
        <div className={classes.root}>
            <h1>차등록 - 제목</h1>
            <h1>브랜드 선택</h1>
            <Stack spacing={2} alignItems="center">
                {chunkedManuItems(manuItem, 6).map((chunk, index) => (
                    <ToggleButtonGroup
                        key={index}
                        value={selectedBrand}
                        exclusive
                        aria-label="Button group"
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(6, 1fr)',
                            marginBottom: 2, // 각 ToggleButtonGroup 사이의 마진 추가
                        }}
                        onChange={handleBrandChange}
                    >
                        {chunk.map((option) => (
                            <ToggleButton
                                key={option}
                                value={option}
                                sx={{
                                    width: 140,
                                    height: 90,
                                }}
                            >
                                {option}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                ))}
            </Stack>
            <h1>모델 선택</h1>

            <Stack spacing={2} alignItems="center">
                <ToggleButtonGroup
                    orientation="vertical"
                    value={selectedCar}
                    onChange={handleBrandChange2}
                    exclusive  // 한 번에 하나의 버튼만 선택 가능하도록 exclusive 속성 추가
                    aria-label="Button group"
                >
                    {carItem.map(car => (
                        <ToggleButton
                            value={car.carModel}
                            key={car.carModel}
                            sx={{
                                width: 600,
                                height: 80,
                            }}
                        >
                            {car.carModel}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </Stack>

            <br />

            <Button
                variant="outlined"
                color="primary"
                onClick={handleSubmit}
            >
                등록
            </Button>
        </div>
    );
};



const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
    },
}));

export default CarInit;