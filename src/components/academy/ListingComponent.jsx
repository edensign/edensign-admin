/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use, reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import {
    Box, Typography, Button, useMediaQuery, useTheme,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from "@mui/material";
import ReplayIcon from '@mui/icons-material/Replay';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

import API from "../../apis";
import Search from "../common/Search";
import ServerPaginationGrid from '../common/Datagrid';
import Toast from "../common/Toast";

import { datagridColumns } from "./AcademyConfig";
import { setMenuItem } from "../../redux/actions/NavigationAction";
import { tokens } from "../../theme";
import { useCommon } from "../hooks/common";
import { Utility } from "../utility";

const pageSizeOptions = [5, 10, 20];

const ListingComponent = () => {
    const theme = useTheme();
    const navigateTo = useNavigate();
    const dispatch = useDispatch();
    const isMobile = useMediaQuery("(max-width:480px)");
    const isTab = useMediaQuery("(max-width:920px)");

    const selected = useSelector(state => state.menuItems.selected);
    const toastInfo = useSelector(state => state.toastInfo);
    const [listData, setListData] = useState({ count: 0, rows: [] });
    const [loading, setLoading] = useState(true);

    const [searchFlag, setSearchFlag] = useState({ search: false, searching: false });
    const [oldPagination, setOldPagination] = useState();

    // Confirmation dialog state
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    const { getPaginatedData } = useCommon();
    const { getLocalStorage, toastAndNavigate } = Utility();

    const colors = tokens(theme.palette.mode);
    const reloadBtn = document.getElementById("reload-btn");

    useEffect(() => {
        const selectedMenu = getLocalStorage("menu");
        dispatch(setMenuItem(selectedMenu.selected));
    }, []);

    const fetchAcademyData = async (page = 0, size = 5, search = false) => {
        try {
            setLoading(true);
            const response = await API.AcademyAPI.getAll(page, size, search);
            if (response && (response.status === 200 || response.status === 'Success') && response.data) {
                setListData(response.data);
            } else {
                setListData({ count: 0, rows: [] });
            }
        } catch (error) {
            console.error("Error fetching academy data:", error);
            setListData({ count: 0, rows: [] });
        } finally {
            setLoading(false);
        }
    };

    // Opens the confirmation dialog — no delete yet
    const handleDeleteClick = (id) => {
        setPendingDeleteId(id);
        setConfirmOpen(true);
    };

    // Confirmed — execute the delete
    const handleDeleteConfirm = async () => {
        setConfirmOpen(false);
        try {
            const response = await API.AcademyAPI.delete(pendingDeleteId);
            const payload = response?.data || response;
            if (response?.status === 200 || payload?.status === "Success") {
                toastAndNavigate(dispatch, true, "success", "Course deleted successfully!");
                fetchAcademyData();
            } else {
                toastAndNavigate(dispatch, true, "error", payload?.msg || "Failed to delete course");
            }
        } catch (error) {
            console.error("Error deleting course:", error);
            toastAndNavigate(dispatch, true, "error", error?.response?.data?.msg || "Error deleting course");
        } finally {
            setPendingDeleteId(null);
        }
    };

    const handleDeleteCancel = () => {
        setConfirmOpen(false);
        setPendingDeleteId(null);
    };

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
                            {selected}
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
                            customFetch={fetchAcademyData}
                            api={API.AcademyAPI}
                            getSearchData={fetchAcademyData}
                            setSearchFlag={setSearchFlag}
                            oldPagination={oldPagination}
                            reloadBtn={reloadBtn}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            onClick={() => { navigateTo("/academy/create") }}
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
                customFetch={fetchAcademyData}
                api={API.AcademyAPI}
                getQuery={fetchAcademyData}
                columns={datagridColumns(handleDeleteClick)}
                rows={listData.rows}
                count={listData.count}
                pageSizeOptions={pageSizeOptions}
                setOldPagination={setOldPagination}
                searchFlag={searchFlag}
                setSearchFlag={setSearchFlag}
                loading={loading}
            />

            {/* ── Delete Confirmation Dialog ── */}
            <Dialog
                open={confirmOpen}
                onClose={handleDeleteCancel}
                PaperProps={{
                    sx: {
                        borderRadius: "16px",
                        padding: "8px",
                        minWidth: "360px",
                        boxShadow: "0 24px 48px rgba(0,0,0,0.18)"
                    }
                }}
            >
                <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1 }}>
                    <WarningAmberRoundedIcon sx={{ color: "#f59e0b", fontSize: 28 }} />
                    <Typography fontWeight="700" fontSize="18px">Delete Course</Typography>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: "text.secondary", fontSize: "14px" }}>
                        Are you sure you want to delete this course? This action&nbsp;
                        <strong>cannot be undone</strong>.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                    <Button
                        onClick={handleDeleteCancel}
                        variant="outlined"
                        sx={{
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: 600,
                            borderColor: "rgba(0,0,0,0.15)"
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        variant="contained"
                        startIcon={<DeleteOutlineIcon />}
                        sx={{
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: 600,
                            backgroundColor: "#ef4444",
                            "&:hover": { backgroundColor: "#dc2626" }
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Toast Notification ── */}
            <Toast
                alerting={toastInfo.toastAlert}
                severity={toastInfo.toastSeverity}
                message={toastInfo.toastMessage}
            />
        </Box>
    );
};

export default ListingComponent;
