/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 */

import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    useTheme,
    Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalendarViewWeekIcon from "@mui/icons-material/CalendarViewWeek";

import { tokens } from "../../theme";
import KanbanCalendarView from "./KanbanCalendarView";

/**
 * KanbanViewDialog
 * A fullscreen-ish MUI Dialog that wraps the KanbanCalendarView component.
 *
 * Props:
 *   open     {boolean}  – whether dialog is open
 *   onClose  {function} – called when the dialog should close
 *   salonId  {string|number} – the salon_id to show kanban for
 */
const KanbanViewDialog = ({ open, onClose, salonId }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xl"
            PaperProps={{
                sx: {
                    backgroundColor: colors.primary[500],
                    backgroundImage: "none",
                    borderRadius: "12px",
                    height: "90vh",
                    maxHeight: "90vh",
                    display: "flex",
                    flexDirection: "column",
                },
            }}
        >
            {/* ── Dialog Header ── */}
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    backgroundColor: "#141b2d", // consistent dark header for board view
                    py: "10px",
                    px: "20px",
                    flexShrink: 0,
                    borderBottom: "1px solid rgba(255,255,255,0.1)"
                }}
            >
                <CalendarViewWeekIcon sx={{ color: colors.greenAccent[400], fontSize: "22px" }} />
                <Box component="span" sx={{ fontWeight: 700, color: "#fff", fontSize: "17px", flex: 1 }}>
                    Kanban Calendar View
                </Box>
                <IconButton
                    onClick={onClose}
                    size="small"
                    sx={{
                        color: "rgba(255,255,255,0.7)",
                        "&:hover": { color: "#fff", backgroundColor: "rgba(255,255,255,0.08)" },
                    }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            {/* ── Dialog Body ── */}
            <DialogContent
                sx={{
                    flex: 1,
                    minHeight: 0,
                    display: "flex",
                    flexDirection: "column",
                    p: "16px",
                    "&::-webkit-scrollbar": { width: "0px" },
                }}
            >
                <KanbanCalendarView salonId={salonId} />
            </DialogContent>
        </Dialog>
    );
};

export default KanbanViewDialog;
