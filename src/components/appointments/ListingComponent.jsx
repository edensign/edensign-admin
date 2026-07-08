/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use, reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
*/

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Box, Typography, Button, useMediaQuery, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CalendarViewWeekIcon from "@mui/icons-material/CalendarViewWeek";
import EmptyOverlayGrid from "../common/EmptyOverlayGrid";

import API from "../../apis";
import { datagridColumns } from "./AppointmentConfig";
import { setMenuItem } from "../../redux/actions/NavigationAction";
import { tokens } from "../../theme";
import { Utility } from "../utility";

const ListingComponent = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width:480px)");

    const selected = useSelector(state => state.menuItems.selected);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const { getLocalStorage, getRole } = Utility();
    const role = getRole();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        const selectedMenu = getLocalStorage("menu");
        dispatch(setMenuItem(selectedMenu?.selected || "Appointments"));
    }, []);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const salonId = getLocalStorage("salon")?.id;
            const response = await API.AppointmentAPI.getAppointments(salonId);
            if (response.data?.status === "Success") {
                setAppointments(response.data.data.rows || []);
            } else {
                setAppointments([]);
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
            setAppointments([]);
        } finally {
            setLoading(false);
        }
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
                    <Typography
                        component="h2"
                        variant="h3"
                        color={theme.palette.mode === 'dark' ? '#f1f5f9' : '#1e293b'}
                        fontWeight="800"
                        sx={{ letterSpacing: "-0.01em" }}
                    >
                        {selected || "Appointments"}
                    </Typography>

                    <Box display="flex" gap="10px">
                        <Button
                            type="button"
                            variant="outlined"
                            startIcon={<CalendarViewWeekIcon />}
                            onClick={() => navigate("/appointment/slots/kanban")}
                            sx={{
                                color: theme.palette.mode === 'dark' ? '#cbd5e1' : '#475569',
                                borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)',
                                fontWeight: "600",
                                borderRadius: "8px",
                                textTransform: "none",
                                "&:hover": {
                                    borderColor: "#5c6bc0",
                                    color: "#5c6bc0",
                                    backgroundColor: "rgba(92, 107, 192, 0.04)",
                                },
                            }}
                        >
                            Kanban View
                        </Button>
                        <Button
                            type="button"
                            variant="contained"
                            onClick={() => navigate("/appointment/create")}
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
                            Create Appointment
                        </Button>
                    </Box>
                </Box>
            </Box>
            <Box
                m="24px 0 0 0"
                height="75vh"
                sx={{
                    boxShadow: theme.palette.mode === "dark" ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(92,107,192,0.06)",
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"}`,
                    "& .MuiDataGrid-root": {
                        border: "none",
                        fontSize: "0.875rem",
                        fontFamily: "'Inter', sans-serif"
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
                        color: theme.palette.mode === "dark" ? "#cbd5e1" : "#475569",
                        padding: "12px 16px",
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: theme.palette.mode === "dark" ? "#1e293b" : "#f8fafc",
                        borderBottom: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                        color: theme.palette.mode === "dark" ? "#cbd5e1" : "#1e293b",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em"
                    },
                    "& .MuiDataGrid-columnHeaderTitle": {
                        fontWeight: "bold",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: theme.palette.mode === "dark" ? "#0f172a" : "#ffffff",
                        overflowX: "hidden",
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                        backgroundColor: theme.palette.mode === "dark" ? "#1e293b" : "#f8fafc",
                        color: theme.palette.mode === "dark" ? "#cbd5e1" : "#475569"
                    },
                    "& .MuiDataGrid-row": {
                        backgroundColor: theme.palette.mode === "dark" ? "#0f172a" : "#ffffff",
                        "&:hover": {
                            backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.03) !important" : "rgba(92,107,192,0.04) !important"
                        }
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[500]} !important`,
                    },
                    "& .MuiDataGrid-scrollbar--horizontal": {
                        display: "none",
                    },
                }}
            >
                <DataGrid
                    rows={appointments}
                    columns={datagridColumns(role)}
                    loading={loading}
                    pageSizeOptions={[10, 25, 50]}
                    rowHeight={60}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } }
                    }}
                    disableColumnMenu
                    components={{
                        noRowsOverlay: EmptyOverlayGrid
                    }}
                    componentsProps={{
                        noRowsOverlay: {
                            label: "No Appointments Found",
                            onAction: () => navigate("/appointment/create"),
                            actionLabel: "Create Appointment"
                        }
                    }}
                />
            </Box>
        </Box>
    );
};

export default ListingComponent;
