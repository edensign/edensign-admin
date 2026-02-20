/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 */

import { useEffect, useState, useCallback } from "react";
import dayjs from "dayjs";
import {
    Box,
    Typography,
    CircularProgress,
    useTheme,
    Avatar,
    Tooltip,
    Paper,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import PersonIcon from "@mui/icons-material/Person";
import BlockIcon from "@mui/icons-material/Block";

import API from "../../apis";
import { tokens } from "../../theme";
import { Utility } from "../utility";

// ─── helpers ────────────────────────────────────────────────────────────────

const generateSlots = (salonHours) => {
    let startHour = 10;
    let endHour = 20;

    if (salonHours?.opening_time && salonHours?.closing_time) {
        const openDt = new Date(salonHours.opening_time);
        const closeDt = new Date(salonHours.closing_time);
        if (!isNaN(openDt.getTime()) && !isNaN(closeDt.getTime())) {
            startHour = openDt.getUTCHours();
            endHour = closeDt.getUTCHours();
        }
    }

    const slots = [];
    for (let hour = startHour; hour <= endHour; hour++) {
        for (const min of [0, 30]) {
            if (hour === endHour && min === 30) break;
            const h = hour % 12 === 0 ? 12 : hour % 12;
            const modifier = hour < 12 ? "AM" : "PM";
            const label = `${String(h).padStart(2, "0")}:${min === 0 ? "00" : "30"} ${modifier}`;
            slots.push(label);
        }
    }
    return slots;
};

// ─── SlotCard ───────────────────────────────────────────────────────────────

const SlotCard = ({ slot, appointment, colors }) => {
    const isBooked = !!appointment;

    if (isBooked) {
        return (
            <Tooltip
                title={
                    <Box sx={{ p: "4px" }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {appointment.customer_name || "Guest"}
                        </Typography>
                        <Typography variant="caption" display="block">
                            {appointment.services || "Service"}
                        </Typography>
                    </Box>
                }
                arrow
                placement="top"
            >
                <Paper
                    elevation={4}
                    sx={{
                        mb: 1,
                        p: 1.5,
                        borderRadius: "8px",
                        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)", // Deep Royal Blue Gradient
                        color: "#fff",
                        cursor: "pointer",
                        borderLeft: `4px solid #64b5f6`, // Light Blue accent
                        transition: "all 0.2s",
                        "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 4px 12px rgba(30, 60, 114, 0.5)",
                        }
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                        <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.9 }}>
                            {slot}
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={0.5} mb={0.5} overflow="hidden">
                        <PersonIcon sx={{ fontSize: 15, opacity: 0.9 }} />
                        <Typography variant="body2" noWrap sx={{ fontWeight: 600, fontSize: "0.85rem" }}>
                            {appointment.customer_name || "Guest"}
                        </Typography>
                    </Box>
                    {appointment.services && (
                        <Typography variant="caption" sx={{ opacity: 0.85, display: "block", lineHeight: 1.2, fontSize: "0.75rem" }} noWrap>
                            {appointment.services}
                        </Typography>
                    )}
                </Paper>
            </Tooltip>
        );
    }

    // Available Slot - Ensure text is visible on dark bg
    return (
        <Paper
            elevation={0}
            sx={{
                mb: 1,
                p: 1.5,
                borderRadius: "8px",
                bgcolor: "transparent",
                color: "rgba(255,255,255,0.7)", // light gray text
                border: `1px dashed rgba(255,255,255,0.3)`,
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: "50px",
                opacity: 0.8,
                "&:hover": {
                    opacity: 1,
                    borderColor: colors.greenAccent[500],
                    bgcolor: "rgba(76, 206, 172, 0.08)",
                    cursor: "default",
                    color: "#fff"
                }
            }}
        >
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {slot}
            </Typography>
            <Typography variant="caption" sx={{ color: colors.greenAccent[500], fontWeight: 600, fontSize: "0.65rem", letterSpacing: 0.5 }}>
                FREE
            </Typography>
        </Paper>
    );
};

// ─── StylistColumn ──────────────────────────────────────────────────────────

const StylistColumn = ({ stylist, slots, appointments, colors }) => {
    const stylistAppointments = appointments.filter(
        (a) => String(a.salon_employee) === String(stylist.id)
    );

    const bookedCount = stylistAppointments.length;
    const totalSlots = slots.length;

    const bookedSlotMap = {};
    stylistAppointments.forEach((a) => {
        bookedSlotMap[a.time_slot] = a;
    });

    return (
        <Paper
            elevation={0}
            sx={{
                minWidth: "260px",
                maxWidth: "280px",
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                bgcolor: "#1f2a40", // Dark Navy
                borderRadius: "12px",
                overflow: "hidden",
                border: `1px solid rgba(255,255,255,0.08)`
            }}
        >
            {/* ── Column Header ── */}
            <Box
                sx={{
                    p: 2,
                    borderBottom: `1px solid rgba(255,255,255,0.08)`,
                    bgcolor: "rgba(255,255,255,0.03)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1
                }}
            >
                <Avatar
                    sx={{
                        width: 48,
                        height: 48,
                        bgcolor: "transparent",
                        border: `2px solid ${colors.greenAccent[500]}`,
                        color: colors.greenAccent[500],
                        fontWeight: "bold",
                        fontSize: "1.1rem"
                    }}
                >
                    {stylist.name?.charAt(0)?.toUpperCase()}
                </Avatar>
                <Box textAlign="center">
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#fff" }}>
                        {stylist.name}
                    </Typography>
                    <Typography variant="caption" sx={{ display: "block", mt: -0.5, color: "rgba(255,255,255,0.6)" }}>
                        {bookedCount} / {totalSlots} Booked
                    </Typography>
                </Box>

                {/* Occupancy Indicator */}
                <Box
                    sx={{
                        width: "100%",
                        height: "4px",
                        bgcolor: "rgba(255,255,255,0.1)",
                        borderRadius: "2px",
                        mt: 0.5,
                        overflow: "hidden"
                    }}
                >
                    <Box
                        sx={{
                            width: `${totalSlots > 0 ? (bookedCount / totalSlots) * 100 : 0}%`,
                            height: "100%",
                            background: `linear-gradient(90deg, ${colors.greenAccent[500]} 0%, ${colors.greenAccent[400]} 100%)`,
                            transition: "width 0.5s ease"
                        }}
                    />
                </Box>
            </Box>

            {/* ── Slot cards ── */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    p: 1.5,
                    "&::-webkit-scrollbar": { width: "4px" },
                    "&::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,0.1)", borderRadius: "4px" },
                }}
            >
                {slots.length === 0 ? (
                    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="120px" opacity={0.5}>
                        <BlockIcon sx={{ mb: 1, color: "rgba(255,255,255,0.5)" }} />
                        <Typography variant="body2" color="rgba(255,255,255,0.5)">Salon Closed</Typography>
                    </Box>
                ) : (
                    slots.map((slot) => (
                        <SlotCard
                            key={slot}
                            slot={slot}
                            appointment={bookedSlotMap[slot] || null}
                            colors={colors}
                        />
                    ))
                )}
            </Box>
        </Paper>
    );
};

// ─── KanbanCalendarView ─────────────────────────────────────────────────────

const KanbanCalendarView = ({ salonId: propSalonId }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { getLocalStorage, getRole } = Utility();

    const salon = getLocalStorage("salon");
    const resolvedSalonId = propSalonId || salon?.id;

    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [loading, setLoading] = useState(false);
    const [stylists, setStylists] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [salonHours, setSalonHours] = useState(null);
    const [error, setError] = useState(null);

    const fetchKanbanData = useCallback(async () => {
        if (!resolvedSalonId || !selectedDate) return;
        setLoading(true);
        setError(null);
        try {
            const response = await API.AppointmentAPI.getKanbanSlots({
                date: selectedDate.format("YYYY-MM-DD"),
                salonId: resolvedSalonId,
            });
            if (response.data?.status === "Success") {
                const { stylists: s, appointments: a, salonHours: h } = response.data.data;
                setStylists(s || []);
                setAppointments(a || []);
                setSalonHours(h || null);
            } else {
                setError("Failed to load kanban data.");
            }
        } catch (err) {
            console.error("Error fetching kanban data:", err);
            setError("Error fetching kanban data.");
        } finally {
            setLoading(false);
        }
    }, [resolvedSalonId, selectedDate]);

    useEffect(() => {
        fetchKanbanData();
    }, [fetchKanbanData]);

    const slots = generateSlots(salonHours);

    const isClosed = salonHours?.closed_on &&
        selectedDate.format("dddd").toLowerCase() === salonHours.closed_on.toLowerCase();

    // Use a fixed dark background for the board view to ensure contrast
    const BOARD_BG = "#141b2d";

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", bgcolor: BOARD_BG }}>

            {/* ── Toolbar ── */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 3,
                    py: 2,
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    mb: 2
                }}
            >
                {/* Available / Booked Legend */}
                <Box display="flex" gap={3}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Box sx={{ width: 8, height: 8, borderRadius: "50%", border: `1px solid ${colors.greenAccent[500]}` }} />
                        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>Available</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)" }} />
                        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>Booked</Typography>
                    </Box>
                </Box>

                {/* Date Picker */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        value={selectedDate}
                        onChange={(val) => val && setSelectedDate(val)}
                        slotProps={{
                            textField: {
                                size: "small",
                                sx: {
                                    bgcolor: "rgba(255,255,255,0.05)",
                                    borderRadius: "8px",
                                    width: "200px",
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                                        "&:hover fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                                        "&.Mui-focused fieldset": { borderColor: colors.greenAccent[500] },
                                    },
                                    "& .MuiInputBase-input": { color: "#fff", fontWeight: 500 },
                                    "& .MuiSvgIcon-root": { color: "rgba(255,255,255,0.6)" },
                                    "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" }, // Label color
                                },
                            },
                        }}
                    />
                </LocalizationProvider>
            </Box>

            {/* ── Closed Banner ── */}
            {isClosed && !loading && (
                <Box sx={{ px: 3, mb: 2 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: "8px",
                            bgcolor: "rgba(244, 67, 54, 0.08)",
                            border: "1px solid rgba(244, 67, 54, 0.2)",
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                        }}
                    >
                        <BlockIcon color="error" />
                        <Typography color="error" fontWeight="600">
                            Salon is closed on {selectedDate.format("dddd")}s.
                        </Typography>
                    </Paper>
                </Box>
            )}

            {/* ── Board Area ── */}
            <Box sx={{ flex: 1, minHeight: 0, px: 3, pb: 2, position: "relative" }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <CircularProgress sx={{ color: colors.greenAccent[500] }} />
                    </Box>
                ) : error ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <Typography color="error" variant="h6">{error}</Typography>
                    </Box>
                ) : !resolvedSalonId ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <Typography sx={{ color: "rgba(255,255,255,0.5)" }}>Select a salon to view schedule</Typography>
                    </Box>
                ) : stylists.length === 0 ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <Typography sx={{ color: "rgba(255,255,255,0.5)" }}>No stylists found for {selectedDate.format("DD MMM YYYY")}</Typography>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            overflowX: "auto",
                            height: "100%",
                            // Custom Scrollbar
                            "&::-webkit-scrollbar": { height: "10px" },
                            "&::-webkit-scrollbar-track": { bgcolor: "rgba(255,255,255,0.02)", borderRadius: "5px" },
                            "&::-webkit-scrollbar-thumb": {
                                bgcolor: "rgba(255,255,255,0.15)",
                                borderRadius: "5px",
                                border: "2px solid #141b2d", // match bg for nice effect
                                "&:hover": { bgcolor: "rgba(255,255,255,0.25)" }
                            },
                        }}
                    >
                        {stylists.map((stylist) => (
                            <StylistColumn
                                key={stylist.id}
                                stylist={stylist}
                                slots={isClosed ? [] : slots}
                                appointments={appointments}
                                colors={colors}
                            />
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default KanbanCalendarView;
