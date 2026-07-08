/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 */

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Box, Typography, Button, useMediaQuery, useTheme } from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";

import API from "../../apis";
import FormComponent from "./FormInModalComponent";
import Search from "../common/Search";
import ServerPaginationGrid from "../common/Datagrid";
import { datagridColumns } from "./StateConfig";
import { setStates } from "../../redux/actions/StateAction";
import { setMenuItem } from "../../redux/actions/NavigationAction";
import { tokens } from "../../theme";
import { useCommon } from "../hooks/common";
import { Utility } from "../utility";

const pageSizeOptions = [5, 10, 20];

const StateListingComponent = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [searchFlag, setSearchFlag] = useState({ search: false, searching: false });
    const [oldPagination, setOldPagination] = useState();

    const navigateTo = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery("(max-width:480px)");
    const isTab = useMediaQuery("(max-width:920px)");
    const selected = useSelector(state => state.menuItems.selected);
    const { listData } = useSelector(state => state.allStates);
    const reloadBtn = document.getElementById("reload-btn");
    const { getPaginatedData } = useCommon();
    const { getLocalStorage, setLocalStorage } = Utility();

    useEffect(() => {
        dispatch(setMenuItem("State"));
        setLocalStorage("menu", { selected: "State" });
    }, []);

    const handleReload = () => {
        reloadBtn.style.display = "none";
        setSearchFlag({ search: false, searching: false, oldPagination });
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
                            State
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
                            action={setStates}
                            api={API.StateAPI}
                            getSearchData={getPaginatedData}
                            oldPagination={oldPagination}
                            reloadBtn={reloadBtn}
                            setSearchFlag={setSearchFlag}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            onClick={() => { navigateTo("#", { state: { id: undefined } }); setOpenDialog(true); }}
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
                            Create New {selected}
                        </Button>
                    </Box>
                </Box>
            </Box>
            <Button sx={{
                display: "none", position: "absolute",
                top: isMobile ? "23vh" : isTab ? "10.5vh" : "16.5vh",
                left: isMobile ? "80vw" : isTab ? "39.5vw" : "26vw",
                zIndex: 1, borderRadius: "20%", color: colors.grey[100]
            }} id="reload-btn" type="button" onClick={handleReload}>
                <span style={{ display: "inherit", marginRight: "5px", marginLeft: "-2px" }}>
                    <ReplayIcon />
                </span>
                Back
            </Button>
            <ServerPaginationGrid
                action={setStates}
                api={API.StateAPI}
                getQuery={getPaginatedData}
                columns={datagridColumns(setOpenDialog)}
                rows={listData.rows}
                count={listData.count}
                selected={selected}
                pageSizeOptions={pageSizeOptions}
                setOldPagination={setOldPagination}
                searchFlag={searchFlag}
                setSearchFlag={setSearchFlag}
            />
            <FormComponent openDialog={openDialog} setOpenDialog={setOpenDialog} />
        </Box>
    );
};

export default StateListingComponent;
