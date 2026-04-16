/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 */

import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import {
    Box,
    Typography,
    CircularProgress,
    useTheme,
    Avatar,
    Tooltip,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarViewWeekIcon from "@mui/icons-material/CalendarViewWeek";
import PersonIcon from "@mui/icons-material/Person";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

import API from "../../apis";
import { tokens } from "../../theme";
import { Utility } from "../utility";

// ─── helpers ────────────────────────────────────────────────────────────────

const generateSlots = () => {
    const slots = [];
    for (let hour = 10; hour <= 22; hour++) {
        const h = hour % 12 === 0 ? 12 : hour % 12;
        const modifier = hour < 12 ? "AM" : "PM";
        const label = `${String(h).padStart(2, "0")}:00 ${modifier}`;
        slots.push(label);
    }
    return slots;
};

// Stylist accent colors — aligned with Salon Inventory palette
const ACCENT_COLORS = [
    "#4cceac", "#6870fa", "#db4f4a", "#3da58a",
    "#868dfb", "#e2726e", "#2e7c67", "#535ac8",
];

// ─── KanbanCalendarView ─────────────────────────────────────────────────────

const KanbanCalendarView = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { getLocalStorage, getRole } = Utility();

    const salon = getLocalStorage("salon");
    const role = getRole();
    const urlSalonId = searchParams.get("salonId");

    const [salons, setSalons] = useState([]);
    const [selectedSalonId, setSelectedSalonId] = useState(urlSalonId || null);
    const resolvedSalonId = role === 'admin' ? selectedSalonId : (urlSalonId || salon?.id);

    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [loading, setLoading] = useState(false);
    const [stylists, setStylists] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [salonHours, setSalonHours] = useState(null);
    const [error, setError] = useState(null);
    const [selectedStylist, setSelectedStylist] = useState(null);

    // Fetch salons for admin
    useEffect(() => {
        if (role === 'admin') {
            API.SalonAPI.getAll(false, 0, 1000)
                .then((res) => {
                    if (res?.status === 'Success') {
                        setSalons(res.data?.rows || []);
                    }
                })
                .catch((err) => console.error('Error fetching salons:', err));
        }
    }, [role]);

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
                // Auto-select first stylist
                if (s?.length > 0) {
                    setSelectedStylist(s[0].id);
                }
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

    const slots = generateSlots();

    const handleFreeSlotClick = useCallback((stylist, slot) => {
        const params = new URLSearchParams({
            salon_employee: stylist.id,
            date: selectedDate.format("YYYY-MM-DD"),
            time_slot: slot,
        });
        navigate(`/appointment/create?${params.toString()}`);
    }, [navigate, selectedDate]);

    // Get appointments for selected stylist
    const activeStylist = stylists.find((s) => String(s.id) === String(selectedStylist));
    const stylistAppointments = appointments.filter(
        (a) => String(a.salon_employee) === String(selectedStylist)
    );
    const bookedSlotMap = {};
    stylistAppointments.forEach((a) => {
        bookedSlotMap[a.time_slot] = a;
    });
    const activeStylistIdx = stylists.findIndex((s) => String(s.id) === String(selectedStylist));

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: colors.primary[400] }}>

            {/* ── Page Header ── */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    bgcolor: colors.blueAccent[700],
                    py: 1.5,
                    px: 2.5,
                    borderBottom: `1px solid ${colors.grey[700]}`,
                }}
            >
                <IconButton
                    onClick={() => navigate("/appointment/listing")}
                    size="small"
                    sx={{ color: colors.grey[100], "&:hover": { bgcolor: colors.primary[400] } }}
                >
                    <ArrowBackIcon fontSize="small" />
                </IconButton>
                <CalendarViewWeekIcon sx={{ color: colors.greenAccent[500], fontSize: 22 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, color: colors.grey[100], flex: 1 }}>
                    Slot Schedule
                </Typography>
            </Box>

            {/* ── Toolbar ── */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                    px: 2.5,
                    py: 1.5,
                    borderBottom: `1px solid ${colors.grey[700]}`,
                    bgcolor: colors.primary[400],
                }}
            >
                {role === 'admin' && (
                    <FormControl
                        size="small"
                        sx={{
                            minWidth: 180,
                            "& .MuiOutlinedInput-root fieldset": { borderColor: colors.grey[600] },
                            "& .MuiOutlinedInput-root:hover fieldset": { borderColor: colors.grey[400] },
                            "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: colors.greenAccent[500] },
                            "& .MuiInputBase-input": { color: colors.grey[100] },
                            "& .MuiInputLabel-root": { color: colors.grey[300] },
                            "& .MuiSvgIcon-root": { color: colors.grey[300] },
                        }}
                    >
                        <InputLabel>Select Salon</InputLabel>
                        <Select
                            value={selectedSalonId || ''}
                            label="Select Salon"
                            onChange={(e) => {
                                setSelectedSalonId(e.target.value);
                                setStylists([]);
                                setAppointments([]);
                                setSalonHours(null);
                                setSelectedStylist(null);
                            }}
                        >
                            {salons.map((s) => (
                                <MenuItem key={s.id} value={s.id}>
                                    {s.salon_name || s.name || `Salon #${s.id}`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        value={selectedDate}
                        onChange={(val) => val && setSelectedDate(val)}
                        slotProps={{
                            textField: {
                                size: "small",
                                sx: {
                                    width: 180,
                                    "& .MuiOutlinedInput-root fieldset": { borderColor: colors.grey[600] },
                                    "& .MuiOutlinedInput-root:hover fieldset": { borderColor: colors.grey[400] },
                                    "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: colors.greenAccent[500] },
                                    "& .MuiInputBase-input": { color: colors.grey[100] },
                                    "& .MuiSvgIcon-root": { color: colors.grey[300] },
                                    "& .MuiInputLabel-root": { color: colors.grey[300] },
                                },
                            },
                        }}
                    />
                </LocalizationProvider>

                <Typography variant="body2" sx={{ color: colors.grey[300], ml: "auto" }}>
                    {selectedDate.format("dddd, DD MMMM YYYY")}
                </Typography>
            </Box>

            {/* ── Main Content ── */}
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
                    <CircularProgress sx={{ color: colors.greenAccent[500] }} />
                </Box>
            ) : error ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
                    <Typography color="error" variant="h6">{error}</Typography>
                </Box>
            ) : !resolvedSalonId ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
                    <Typography sx={{ color: colors.grey[300] }}>Select a salon to view schedule</Typography>
                </Box>
            ) : stylists.length === 0 ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
                    <Typography sx={{ color: colors.grey[300] }}>No stylists found for {selectedDate.format("DD MMM YYYY")}</Typography>
                </Box>
            ) : (
                <Box sx={{ px: 2.5, py: 2 }}>

                    {/* ── Stylist Tabs ── */}
                    <Box
                        sx={{
                            display: "flex",
                            gap: 1,
                            mb: 2.5,
                            overflowX: "auto",
                            pb: 1,
                            "&::-webkit-scrollbar": { height: 4 },
                            "&::-webkit-scrollbar-thumb": { bgcolor: colors.grey[600], borderRadius: 4 },
                        }}
                    >
                        {stylists.map((stylist, idx) => {
                            const isActive = String(selectedStylist) === String(stylist.id);
                            const bookedCount = appointments.filter(
                                (a) => String(a.salon_employee) === String(stylist.id)
                            ).length;
                            const accent = ACCENT_COLORS[idx % ACCENT_COLORS.length];

                            return (
                                <Box
                                    key={stylist.id}
                                    onClick={() => setSelectedStylist(stylist.id)}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        px: 2,
                                        py: 1,
                                        borderRadius: "10px",
                                        cursor: "pointer",
                                        bgcolor: isActive ? colors.greenAccent[700] : colors.primary[400],
                                        border: isActive ? `2px solid ${colors.greenAccent[500]}` : `1px solid ${colors.grey[500]}`,
                                        transition: "all 0.2s",
                                        whiteSpace: "nowrap",
                                        flexShrink: 0,
                                        "&:hover": {
                                            bgcolor: colors.greenAccent[700],
                                            borderColor: colors.greenAccent[500],
                                            "& .stylist-name": { color: "#fff" },
                                            "& .stylist-count": { color: "rgba(255,255,255,0.8)" },
                                        },
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            bgcolor: accent,
                                            fontSize: "0.8rem",
                                            fontWeight: 700,
                                        }}
                                    >
                                        {stylist.name?.charAt(0)?.toUpperCase()}
                                    </Avatar>
                                    <Box>
                                        <Typography className="stylist-name" variant="body2" sx={{ fontWeight: 600, color: isActive ? "#fff" : colors.grey[900], lineHeight: 1.2 }}>
                                            {stylist.name}
                                        </Typography>
                                        <Typography className="stylist-count" variant="caption" sx={{ color: isActive ? "rgba(255,255,255,0.8)" : colors.grey[700], fontSize: "0.65rem" }}>
                                            {bookedCount}/{slots.length} booked
                                        </Typography>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>

                    {/* ── Selected Stylist Slots — 4 Column Grid ── */}
                    {activeStylist && (
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "repeat(4, 1fr)",
                                gap: 1.5,
                            }}
                        >
                            {slots.map((slot) => {
                                const appointment = bookedSlotMap[slot] || null;
                                const isBooked = !!appointment;
                                const accent = ACCENT_COLORS[activeStylistIdx % ACCENT_COLORS.length];

                                return (
                                    <Box
                                        key={slot}
                                        onClick={() => !isBooked && handleFreeSlotClick(activeStylist, slot)}
                                        sx={{
                                            borderRadius: "10px",
                                            p: 1.5,
                                            cursor: isBooked ? "default" : "pointer",
                                            transition: "all 0.2s",
                                            ...(isBooked
                                                ? {
                                                    bgcolor: colors.greenAccent[700],
                                                    borderLeft: `4px solid ${colors.greenAccent[500]}`,
                                                    boxShadow: `0 2px 8px ${colors.greenAccent[500]}30`,
                                                }
                                                : {
                                                    bgcolor: colors.primary[400],
                                                    border: `1px solid ${colors.greenAccent[700]}`,
                                                    "&:hover": {
                                                        borderColor: colors.greenAccent[500],
                                                        bgcolor: `${colors.greenAccent[500]}18`,
                                                        transform: "translateY(-1px)",
                                                        boxShadow: `0 2px 8px ${colors.greenAccent[500]}30`,
                                                    },
                                                }),
                                        }}
                                    >
                                        {/* Time label */}
                                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: isBooked ? "#fff" : colors.grey[100],
                                                    fontSize: "0.8rem",
                                                }}
                                            >
                                                {slot}
                                            </Typography>
                                            {isBooked ? (
                                                <EventBusyIcon sx={{ fontSize: 16, color: "rgba(255,255,255,0.7)" }} />
                                            ) : (
                                                <EventAvailableIcon sx={{ fontSize: 16, color: colors.greenAccent[500] }} />
                                            )}
                                        </Box>

                                        {/* Content */}
                                        {isBooked ? (
                                            <Tooltip
                                                title={`${appointment.customer_name || "Guest"} — ${appointment.services || "Service"}`}
                                                arrow
                                                placement="top"
                                            >
                                                <Box>
                                                    <Box display="flex" alignItems="center" gap={0.5}>
                                                        <PersonIcon sx={{ fontSize: 14, color: "rgba(255,255,255,0.9)" }} />
                                                        <Typography variant="caption" noWrap sx={{ color: "#fff", fontWeight: 600, fontSize: "0.78rem" }}>
                                                            {appointment.customer_name || "Guest"}
                                                        </Typography>
                                                    </Box>
                                                    {appointment.services && (
                                                        <Typography variant="caption" noWrap sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.68rem", display: "block", mt: 0.25 }}>
                                                            {appointment.services}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Tooltip>
                                        ) : (
                                            <Typography variant="caption" sx={{ color: colors.greenAccent[500], fontWeight: 600, fontSize: "0.7rem" }}>
                                                Available — Click to book
                                            </Typography>
                                        )}
                                    </Box>
                                );
                            })}
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default KanbanCalendarView;
