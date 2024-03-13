import React, { useEffect, useState } from "react";
import { HttpGet } from "../../services/HttpService";
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { makeStyles, } from "@material-ui/core/styles";
import {
    Button,
} from "@material-ui/core";


const CarInit = () => {
    const classes = useStyles();
    const [manuItem, setManuItem] = useState([]);
    const [carItem, setCarItem] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedCar, setSelectedCar] = useState(null);

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

    return (
        <div className={classes.root}>
            <h1>차등록 - 제목</h1>
            <h1>브랜드 선택</h1>
            <Stack spacing={2} alignItems="center">
                <ToggleButtonGroup
                    value={selectedCar}
                    onChange={handleBrandChange}
                    exclusive  // 한 번에 하나의 버튼만 선택 가능하도록 exclusive 속성 추가
                    aria-label="Button group"
                >
                    {manuItem.map(option => (
                        <ToggleButton value={option} key={option}>
                            {option}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </Stack>
            <h1>모델 선택</h1>
            {carItem.map(car => (
                <div key={car.carModel}>{car.carModel}</div>
            ))}

            <Button
                variant="outlined"
                color="primary"
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
