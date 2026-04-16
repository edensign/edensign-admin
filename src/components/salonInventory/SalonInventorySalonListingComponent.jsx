/**
 * Copyright © 2026, Eden Sign Inc. ALL RIGHTS RESERVED.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { Box, Typography, useMediaQuery, useTheme, Button } from "@mui/material";
import ReplayIcon from '@mui/icons-material/Replay';
import StoreIcon from '@mui/icons-material/Store';

import API from "../../apis";
import Search from "../common/Search";
import ServerPaginationGrid from '../common/Datagrid';

import { datagridColumns } from "./SalonInventorySalonConfig";
import { setMenuItem } from "../../redux/actions/NavigationAction";
import { setSalons } from "../../redux/actions/SalonAction";
import { tokens } from "../../theme";
import { useCommon } from "../hooks/common";
import { Utility } from "../utility";

const pageSizeOptions = [5, 10, 20];

const SalonInventorySalonListingComponent = () => {
    const theme = useTheme();
    const navigateTo = useNavigate();
    const dispatch = useDispatch();
    const isMobile = useMediaQuery("(max-width:480px)");
    const isTab = useMediaQuery("(max-width:920px)");

    const selected = useSelector(state => state.menuItems.selected);
    const { listData, loading } = useSelector(state => state.allSalons);

    const [searchFlag, setSearchFlag] = useState({ search: false, searching: false });
    const [oldPagination, setOldPagination] = useState();

    const { getPaginatedData } = useCommon();
    const { getLocalStorage } = Utility();

    const colors = tokens(theme.palette.mode);
    const reloadBtn = document.getElementById("reload-btn");

    useEffect(() => {
        const selectedMenu = getLocalStorage("menu");
        dispatch(setMenuItem("Salon Inventory"));
    }, []);

    const handleReload = () => {
        reloadBtn.style.display = "none";
        setSearchFlag({
            search: false,
            searching: false,
            oldPagination
        });
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
                    justifyContent={"space-between"}
                    alignItems={isMobile ? "center" : "normal"}
                >
                    <Box display="flex" alignItems="center" gap={1}>
                        <StoreIcon sx={{ color: colors.grey[100] }} />
                        <Typography
                            component="h2"
                            variant="h2"
                            color={colors.grey[100]}
                            fontWeight="bold"
                        >
                            {isMobile ? "Select Salon to View Inventory" : "View Inventory"}
                        </Typography>
                    </Box>
                    <Search
                        action={setSalons}
                        api={API.SalonAPI}
                        getSearchData={getPaginatedData}
                        setSearchFlag={setSearchFlag}
                        oldPagination={oldPagination}
                        reloadBtn={reloadBtn}
                    />
                </Box>
            </Box>
            <Button sx={{
                display: "none",
                position: "absolute",
                top: isMobile ? "23vh" : isTab ? "10.5vh" : "16.5vh",
                left: isMobile ? "80vw" : isTab ? "39.5vw" : "26vw",
                zIndex: 1,
                borderRadius: "20%",
                color: colors.grey[100]
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
                loading={loading}
                action={setSalons}
                api={API.SalonAPI}
                getQuery={getPaginatedData}
                columns={datagridColumns()}
                rows={listData?.rows || []}
                count={listData?.count || 0}
                pageSizeOptions={pageSizeOptions}
                setOldPagination={setOldPagination}
                searchFlag={searchFlag}
                setSearchFlag={setSearchFlag}
            />
        </Box>
    );
};

export default SalonInventorySalonListingComponent;
