/**
 * Copyright © 2026, Eden Sign Inc. ALL RIGHTS RESERVED.
 */

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Box, Typography, Button, useMediaQuery, useTheme } from "@mui/material";
import ReplayIcon from '@mui/icons-material/Replay';

import API from "../../apis";
import Search from "../common/Search";
import ServerPaginationGrid from '../common/Datagrid';

import { datagridColumns } from "./CompanyConfig";
import { setMenuItem } from "../../redux/actions/NavigationAction";
import { setCompanies } from "../../redux/actions/CompanyAction";
import { tokens } from "../../theme";
import { useCommon } from "../hooks/common";
import { Utility } from "../utility";

const pageSizeOptions = [5, 10, 20];

const CompanyListingComponent = () => {
    const theme = useTheme();
    const navigateTo = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const isMobile = useMediaQuery("(max-width:480px)");
    const isTab = useMediaQuery("(max-width:920px)");

    const selected = useSelector(state => state.menuItems.selected);
    const { listData, loading: companyLoading } = useSelector(state => state.allCompanies);

    const [searchFlag, setSearchFlag] = useState({ search: false, searching: false });
    const [oldPagination, setOldPagination] = useState();

    const { getPaginatedData } = useCommon();
    const { getLocalStorage } = Utility();
    const colors = tokens(theme.palette.mode);
    const reloadBtn = document.getElementById("reload-btn");

    // Check if category filter was passed via router state
    const categoryIdFilter = location.state?.categoryId;
    let condition = categoryIdFilter ? {
        key: 'category_id',
        value: categoryIdFilter
    } : false;

    useEffect(() => {
        const selectedMenu = getLocalStorage("menu");
        dispatch(setMenuItem(selectedMenu?.selected || "Company Profile"));
    }, []);

    const handleReload = () => {
        if (reloadBtn) reloadBtn.style.display = "none";
        setSearchFlag({
            search: false,
            searching: false,
            oldPagination
        });
    };

    return (
        <Box m="10px" position="relative">
            <Box
                height={isMobile ? "19vh" : isTab ? "8vh" : "11vh"}
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
                    <Typography
                        component="h2"
                        variant="h2"
                        color={colors.grey[100]}
                        fontWeight="bold"
                    >
                        Company Profiles
                    </Typography>
                    <Search
                        action={setCompanies}
                        api={API.CompanyAPI}
                        condition={condition}
                        getSearchData={getPaginatedData}
                        oldPagination={oldPagination}
                        reloadBtn={reloadBtn}
                        setSearchFlag={setSearchFlag}
                    />
                    <Button
                        type="submit"
                        color="success"
                        variant="contained"
                        onClick={() => navigateTo("/company/create")}
                        sx={{ height: isTab ? "4vh" : "auto" }}
                    >
                        Create New Company
                    </Button>
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
                type="button"
                onClick={handleReload}
            >
                <span style={{ display: "inherit", marginRight: "5px", marginLeft: "-2px" }}>
                    <ReplayIcon />
                </span>
                Back
            </Button>
            <ServerPaginationGrid
                action={setCompanies}
                api={API.CompanyAPI}
                condition={condition}
                getQuery={getPaginatedData}
                columns={datagridColumns(navigateTo)}
                rows={listData.rows || []}
                count={listData.count || 0}
                selected="Company Profile"
                loading={companyLoading}
                pageSizeOptions={pageSizeOptions}
                setOldPagination={setOldPagination}
                searchFlag={searchFlag}
                setSearchFlag={setSearchFlag}
            />
        </Box>
    );
};

export default CompanyListingComponent;
