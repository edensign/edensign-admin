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
import KanbanViewDialog from "./KanbanViewDialog";

const ListingComponent = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width:480px)");

    const selected = useSelector(state => state.menuItems.selected);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [kanbanOpen, setKanbanOpen] = useState(false);

    const { getLocalStorage, getRole } = Utility();
    const role = getRole();
    const colors = tokens(theme.palette.mode);

    // Resolve salonId for the kanban dialog
    const salonId = getLocalStorage("salon")?.id || null;

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
                    alignItems={isMobile ? "center" : "center"}
                >
                    <Typography
                        component="h2"
                        variant="h2"
                        color={colors.grey[100]}
                        fontWeight="bold"
                    >
                        {selected || "Appointments"}
                    </Typography>

                    <Box display="flex" gap="10px">
                        <Button
                            type="button"
                            variant="outlined"
                            startIcon={<CalendarViewWeekIcon />}
                            onClick={() => setKanbanOpen(true)}
                            sx={{
                                color: colors.grey[100],
                                borderColor: "rgba(255,255,255,0.4)",
                                "&:hover": {
                                    borderColor: colors.grey[100],
                                    backgroundColor: "rgba(255,255,255,0.08)",
                                },
                            }}
                        >
                            Kanban View
                        </Button>
                        <Button
                            type="button"
                            color="secondary"
                            variant="contained"
                            onClick={() => navigate("/appointment/create")}
                        >
                            Create Appointment
                        </Button>
                    </Box>
                </Box>
            </Box>
            <Box
                m="20px 0 0 0"
                height="75vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                        fontSize: "14px",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                        fontSize: "14px",
                        padding: "12px 16px",
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",
                        fontSize: "15px",
                        fontWeight: "bold",
                    },
                    "& .MuiDataGrid-columnHeaderTitle": {
                        fontWeight: "bold",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                        overflowX: "hidden",
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.blueAccent[700],
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`,
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

            {/* ── Kanban View Dialog ── */}
            <KanbanViewDialog
                open={kanbanOpen}
                onClose={() => setKanbanOpen(false)}
                salonId={salonId}
            />
        </Box>
    );
};

export default ListingComponent;
