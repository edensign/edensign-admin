/**
 * Copyright © 2026, Eden Sign Inc. ALL RIGHTS RESERVED.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Box, Typography, Button, useMediaQuery, useTheme } from "@mui/material";
import ReplayIcon from '@mui/icons-material/Replay';

import API from "../../apis";
import Search from "../common/Search";
import ServerPaginationGrid from '../common/Datagrid';

import { datagridColumns } from "./DistributorConfig";
import { setMenuItem } from "../../redux/actions/NavigationAction";
import { setDistributors } from "../../redux/actions/DistributorAction";
import { tokens } from "../../theme";
import { useCommon } from "../hooks/common";
import { Utility } from "../utility";

const pageSizeOptions = [5, 10, 20];

const DistributorListingComponent = () => {
    const theme = useTheme();
    const navigateTo = useNavigate();
    const dispatch = useDispatch();
    const isMobile = useMediaQuery("(max-width:480px)");
    const isTab = useMediaQuery("(max-width:920px)");

    const selected = useSelector(state => state.menuItems.selected);
    const { listData, loading: distributorLoading } = useSelector(state => state.allDistributors);

    const [searchFlag, setSearchFlag] = useState({ search: false, searching: false });
    const [oldPagination, setOldPagination] = useState();

    const { getPaginatedData } = useCommon();
    const { getLocalStorage } = Utility();
    const colors = tokens(theme.palette.mode);
    const reloadBtn = document.getElementById("reload-btn");

    useEffect(() => {
        const selectedMenu = getLocalStorage("menu");
        dispatch(setMenuItem(selectedMenu?.selected || "Distributors"));
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
                borderRadius="12px"
                padding="16px 24px"
                backgroundColor={theme.palette.mode === 'dark' ? colors.primary[400] : '#ffffff'}
                border={`1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(92,107,192,0.08)'}`}
                boxShadow={theme.palette.mode === 'dark' ? 'none' : '0 4px 12px rgba(92,107,192,0.03)'}
            >
                <Box
                    display="flex"
                    flexDirection={isMobile ? "column" : "row"}
                    justifyContent="space-between"
                    alignItems="center"
                    gap={2}
                >
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <Typography
                            component="h2"
                            variant="h3"
                            color={theme.palette.mode === 'dark' ? '#f1f5f9' : '#1e293b'}
                            fontWeight="800"
                            sx={{ letterSpacing: "-0.01em" }}
                        >
                            Distributors
                        </Typography>
                    </Box>
                    <Box
                        display="flex"
                        flexDirection={isMobile ? "column" : "row"}
                        alignItems="center"
                        gap={2}
                        width={isMobile ? "100%" : "auto"}
                    >
                        <Search
                            action={setDistributors}
                            api={API.DistributorAPI}
                            getSearchData={getPaginatedData}
                            oldPagination={oldPagination}
                            reloadBtn={reloadBtn}
                            setSearchFlag={setSearchFlag}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            onClick={() => navigateTo("/distributor/create")}
                            sx={{
                                backgroundColor: colors.blueAccent[500],
                                color: "#ffffff",
                                fontWeight: "600",
                                borderRadius: "8px",
                                padding: "8px 16px",
                                whiteSpace: "nowrap",
                                textTransform: "none",
                                "&:hover": {
                                    backgroundColor: colors.blueAccent[600]
                                }
                            }}
                        >
                            Create New Distributor
                        </Button>
                    </Box>
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
                action={setDistributors}
                api={API.DistributorAPI}
                getQuery={getPaginatedData}
                columns={datagridColumns(navigateTo)}
                rows={listData.rows || []}
                count={listData.count || 0}
                selected="Distributors"
                loading={distributorLoading}
                pageSizeOptions={pageSizeOptions}
                setOldPagination={setOldPagination}
                searchFlag={searchFlag}
                setSearchFlag={setSearchFlag}
            />
        </Box>
    );
};

export default DistributorListingComponent;
