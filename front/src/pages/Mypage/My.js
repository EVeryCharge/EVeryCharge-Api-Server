import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { makeStyles } from "@material-ui/core/styles";
import { Help, Info } from "@material-ui/icons";
import { Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Button,
} from "@material-ui/core";
const My = () => {
    const classes = useStyles();
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className={classes.root}>
            <h1>마이페이지</h1>
            <Button variant="outlined" color="secondary" component={Link}
                to="/carInit" >
                내 차 등록
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
    callout: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "20px 0",
        padding: "10px",
        backgroundColor: "#f2f2f2",
        borderRadius: "5px",
    },
    disclaimer: {
        textAlign: "right",
        fontSize: "0.8rem",
        color: "#666",
        marginTop: "5px",
    },
    tabContainer: {
        marginTop: "20px",
        flexGrow: 1,
        width: "70%",
    },
}));

export default My;
