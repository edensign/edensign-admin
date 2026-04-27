/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Box, Typography, Button, useMediaQuery, useTheme } from "@mui/material";
import ReplayIcon from '@mui/icons-material/Replay';

import API from "../../apis";
import ServerPaginationGrid from '../common/Datagrid';
import { datagridColumns } from "./OfferCardConfig";
import { setMenuItem } from "../../redux/actions/NavigationAction";
import { tokens } from "../../theme";
import { Utility } from "../utility";
import Toast from "../common/Toast";

const pageSizeOptions = [5, 10, 20];

const ListingComponent = () => {
    const theme = useTheme();
    const navigateTo = useNavigate();
    const dispatch = useDispatch();
    const isMobile = useMediaQuery("(max-width:480px)");
    const isTab = useMediaQuery("(max-width:920px)");

    const selected = useSelector(state => state.menuItems.selected);
    const [listData, setListData] = useState({ count: 0, rows: [] });
    const [searchFlag, setSearchFlag] = useState({ search: false, searching: false });
    const [oldPagination, setOldPagination] = useState();
    const [toastInfo, setToastInfo] = useState({ toastAlert: false, severity: "", message: "" });
    const [loading, setLoading] = useState(true);

    const { getLocalStorage } = Utility();
    const colors = tokens(theme.palette.mode);
    const reloadBtn = document.getElementById("reload-btn");

    useEffect(() => {
        const selectedMenu = getLocalStorage("menu");
        dispatch(setMenuItem(selectedMenu.selected));
    }, []);

    const fetchData = async (page = 0, size = 5) => {
        setLoading(true);
        try {
            const response = await API.DigitalOfferAPI.getAll(page, size);
            if (response.status === "Success") {
                setListData(response.data);
            } else {
                setListData({ count: 0, rows: [] });
            }
        } catch (error) {
            console.error("Error fetching offer cards:", error);
            setListData({ count: 0, rows: [] });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this offer card?")) {
            try {
                const response = await API.DigitalOfferAPI.delete(id);
                if (response.status === "Success") {
                    setToastInfo({
                        toastAlert: true,
                        severity: "success",
                        message: "Deleted Successfully"
                    });
                    fetchData();
                }
            } catch (error) {
                setToastInfo({
                    toastAlert: true,
                    severity: "error",
                    message: "Error deleting offer card"
                });
            }
        }
    };

    const handleReload = () => {
        reloadBtn.style.display = "none";
        setSearchFlag({ search: false, searching: false, oldPagination });
    };

    return (
        <Box m="10px">
            <Box
                height={isMobile ? "19vh" : "11vh"}
                borderRadius="4px"
                padding={isMobile ? "1vh" : "2vh"}
                backgroundColor={colors.blueAccent[700]}
            >
                <Box
                    display="flex"
                    height={isMobile ? "16vh" : "7vh"}
                    flexDirection={isMobile ? "column" : "row"}
                    justifyContent="space-between"
                    alignItems={isMobile ? "center" : "normal"}
                >
                    <Typography
                        component="h2"
                        variant="h2"
                        color={colors.grey[100]}
                        fontWeight="bold"
                    >
                        {selected}
                    </Typography>
                    <Button
                        type="submit"
                        color="success"
                        variant="contained"
                        onClick={() => navigateTo("/offer-cards/create")}
                    >
                        Create New Offer Card
                    </Button>
                </Box>
            </Box>

            <Button
                sx={{
                    display: "none",
                    position: "absolute",
                    top: isMobile ? "23vh" : isTab ? "10.5vh" : "16.5vh",
                    left: isMobile ? "80vw" : isTab ? "39.5vw" : "26vw",
                    zIndex: 1,
                    borderRadius: "20%",
                    color: colors.grey[100],
                }}
                id="reload-btn"
                type="submit"
                onClick={handleReload}
            >
                <span style={{ display: "inherit", marginRight: "5px", marginLeft: "-2px" }}>
                    <ReplayIcon />
                </span>
                Back
            </Button>

            <ServerPaginationGrid
                customFetch={fetchData}
                api={API.DigitalOfferAPI}
                getQuery={fetchData}
                columns={datagridColumns(handleDelete, navigateTo)}
                rows={listData.rows}
                count={listData.count}
                loading={loading}
                pageSizeOptions={pageSizeOptions}
                setOldPagination={setOldPagination}
                searchFlag={searchFlag}
                setSearchFlag={setSearchFlag}
            />
            <Toast 
                alerting={toastInfo.toastAlert} 
                severity={toastInfo.severity} 
                message={toastInfo.message} 
            />
        </Box>
    );
};

export default ListingComponent;
