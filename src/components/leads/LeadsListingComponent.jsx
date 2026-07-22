/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 * Admin Leads & Partner Requests Management Page
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box, Typography, useTheme, Chip, IconButton, Tooltip,
  Select, MenuItem, FormControl, InputLabel, CircularProgress,
  Collapse, Table, TableBody, TableCell, TableHead, TableRow,
  Paper, TableContainer, TextField, InputAdornment, Skeleton, Alert,
  Grid, Button
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

import { tokens } from "../../theme";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const LEAD_STATUSES = [
  { value: "new",       label: "New Lead",   color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
  { value: "contacted", label: "Contacted",  color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  { value: "converted", label: "Converted",  color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  { value: "rejected",  label: "Rejected",   color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
];

function LeadStatusChip({ status }) {
  const found = LEAD_STATUSES.find((s) => s.value === status) || {
    label: status || "New Lead", color: "#3b82f6", bg: "rgba(59,130,246,0.12)",
  };
  return (
    <Chip
      label={found.label}
      size="small"
      sx={{
        fontWeight: 700, fontSize: "11px",
        color: found.color, backgroundColor: found.bg,
        border: `1px solid ${found.color}33`,
        borderRadius: "6px", minWidth: 90,
      }}
    />
  );
}

/* ─── Stat Card ───────────────────────────────────────────────────────────── */
function StatCard({ title, value, subtext, icon, gradient, isDark, borderColor }) {
  return (
    <Box sx={{
      p: 2.5, borderRadius: "16px",
      background: isDark ? "rgba(255,255,255,0.03)" : "#ffffff",
      border: `1px solid ${borderColor}`,
      boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(92,107,192,0.06)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      transition: "transform 0.25s ease",
      "&:hover": { transform: "translateY(-3px)" },
    }}>
      <Box>
        <Typography sx={{ fontSize: "12px", fontWeight: 700, color: isDark ? "#94a3b8" : "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", mb: 0.5 }}>
          {title}
        </Typography>
        <Typography sx={{ fontSize: "24px", fontWeight: 800, color: isDark ? "#f1f5f9" : "#0f172a" }}>
          {value}
        </Typography>
        <Typography sx={{ fontSize: "11px", color: isDark ? "#64748b" : "#94a3b8", mt: 0.5 }}>
          {subtext}
        </Typography>
      </Box>
      <Box sx={{ width: 48, height: 48, borderRadius: "14px", background: gradient, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
        {icon}
      </Box>
    </Box>
  );
}

/* ─── Single Lead Row ─────────────────────────────────────────────────────── */
function LeadRow({ lead, token, onStatusUpdated }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDark = theme.palette.mode === "dark";

  const [open, setOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(lead.status || "new");

  // Parse structured message details if present
  const parsedMsg = useMemo(() => {
    const raw = lead.message || "";
    let extractedMeta = "";
    let cleanMessage = raw;
    if (raw.startsWith("[Partner Lead:")) {
      const parts = raw.split("]\n\n");
      extractedMeta = parts[0].replace("[Partner Lead: ", "");
      cleanMessage = parts[1] || raw;
    }
    return { extractedMeta, cleanMessage };
  }, [lead.message]);

  const handleStatusChange = async (newStatus) => {
    setSelectedStatus(newStatus);
    setUpdatingStatus(true);
    try {
      const res = await fetch(`${BASE_URL}/update-contact/${lead.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.status === "Success") onStatusUpdated(lead.id, newStatus);
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const borderColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  return (
    <>
      <TableRow sx={{
        cursor: "pointer",
        "&:hover": { background: isDark ? "rgba(255,255,255,0.03)" : "rgba(92,107,192,0.04)" },
        borderBottom: `1px solid ${borderColor}`,
      }}>
        <TableCell sx={{ width: 48, borderBottom: "none", py: 1 }}>
          <IconButton size="small" onClick={() => setOpen(!open)} sx={{ color: colors.grey[400] }}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ borderBottom: "none", py: 1.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: "13px", color: isDark ? "#f1f5f9" : "#0f172a" }}>
            #{lead.id}
          </Typography>
          <Typography sx={{ fontSize: "11px", color: colors.grey[400], mt: 0.3 }}>
            {new Date(lead.created_at || Date.now()).toLocaleString("en-IN")}
          </Typography>
        </TableCell>
        <TableCell sx={{ borderBottom: "none", py: 1.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: "13px", color: isDark ? "#f1f5f9" : "#0f172a" }}>
            {lead.name}
          </Typography>
          <Typography sx={{ fontSize: "11px", color: colors.grey[400], display: "flex", alignItems: "center", gap: 0.5, mt: 0.3 }}>
            <EmailIcon sx={{ fontSize: 12 }} /> {lead.email}
          </Typography>
        </TableCell>
        <TableCell sx={{ borderBottom: "none", py: 1.5 }}>
          <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#5c6bc0" }}>
            {lead.company || lead.business_name || "—"}
          </Typography>
          {lead.city && (
            <Typography sx={{ fontSize: "11px", color: colors.grey[400] }}>📍 {lead.city}</Typography>
          )}
        </TableCell>
        <TableCell sx={{ borderBottom: "none", py: 1.5 }}>
          <Chip
            label={lead.type || "Partner Request"}
            size="small"
            sx={{ fontWeight: 600, fontSize: "11px", background: "rgba(15,93,78,0.08)", color: "var(--es-emerald)" }}
          />
        </TableCell>
        <TableCell sx={{ borderBottom: "none", py: 1.5 }}>
          <LeadStatusChip status={selectedStatus} />
        </TableCell>
        <TableCell sx={{ borderBottom: "none", py: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <Select
                value={selectedStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updatingStatus}
                sx={{ fontSize: "12px", borderRadius: "8px", height: 34, "& .MuiSelect-select": { py: "6px" } }}
              >
                {LEAD_STATUSES.map((s) => (
                  <MenuItem key={s.value} value={s.value} sx={{ fontSize: "12px" }}>{s.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {updatingStatus && <CircularProgress size={16} sx={{ color: "#5c6bc0" }} />}
          </Box>
        </TableCell>
      </TableRow>

      {/* Expanded detail */}
      <TableRow>
        <TableCell colSpan={7} sx={{ p: 0, borderBottom: `1px solid ${borderColor}` }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{
              p: 3,
              background: isDark ? "rgba(255,255,255,0.02)" : "rgba(92,107,192,0.02)",
              borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
            }}>
              <Typography sx={{ fontSize: "11px", fontWeight: 700, color: colors.grey[400], mb: 1, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Lead Details & Message
              </Typography>

              {parsedMsg.extractedMeta && (
                <Box sx={{ p: 1.5, mb: 2, borderRadius: "8px", background: "rgba(15,93,78,0.06)", border: "1px solid rgba(15,93,78,0.12)" }}>
                  <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "var(--es-emerald)" }}>
                    📋 {parsedMsg.extractedMeta}
                  </Typography>
                </Box>
              )}

              <Paper sx={{ p: 2, borderRadius: "10px", border: `1px solid ${borderColor}`, boxShadow: "none" }}>
                <Typography sx={{ fontSize: "13px", color: isDark ? "#e2e8f0" : "#334155", lineHeight: 1.7, whitespace: "pre-wrap" }}>
                  {parsedMsg.cleanMessage}
                </Typography>
              </Paper>

              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<EmailIcon />}
                  component="a"
                  href={`mailto:${lead.email}`}
                  sx={{ borderRadius: "8px", textTransform: "none", fontSize: "12px", color: "#5c6bc0" }}
                >
                  Send Email ({lead.email})
                </Button>
                {lead.phone && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<PhoneIcon />}
                    component="a"
                    href={`tel:${lead.phone}`}
                    sx={{ borderRadius: "8px", textTransform: "none", fontSize: "12px", color: "#10b981" }}
                  >
                    Call ({lead.phone})
                  </Button>
                )}
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

/* ─── Main Component ──────────────────────────────────────────────────────── */
export default function LeadsListingComponent() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDark = theme.palette.mode === "dark";

  const [leads, setLeads]             = useState([]);
  const [count, setCount]             = useState(0);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchText, setSearchText]   = useState("");

  const auth  = (() => { try { return JSON.parse(localStorage.getItem("auth") || "{}"); } catch { return {}; } })();
  const token = auth?.token || "";

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(`${BASE_URL}/get-contacts`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      const data = await res.json();
      if (data.status === "Success") {
        setLeads(data.data?.rows || []);
        setCount(data.data?.count || 0);
      } else {
        throw new Error(data.message || "Failed to load leads");
      }
    } catch (err) {
      if (err.name === "AbortError") {
        setError("Request timed out — make sure server is running.");
      } else {
        setError(err.message || "Could not connect to server.");
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handleStatusUpdated = (leadId, newStatus) => {
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));
  };

  /* Stats */
  const stats = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter((l) => !l.status || l.status === "new").length;
    const contactedCount = leads.filter((l) => l.status === "contacted").length;
    const convertedCount = leads.filter((l) => l.status === "converted").length;
    return { total, newCount, contactedCount, convertedCount };
  }, [leads]);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (statusFilter && (l.status || "new") !== statusFilter) return false;
      if (searchText) {
        const q = searchText.toLowerCase();
        const matchName = (l.name || "").toLowerCase().includes(q);
        const matchEmail = (l.email || "").toLowerCase().includes(q);
        const matchCity = (l.city || "").toLowerCase().includes(q);
        const matchCompany = (l.company || l.business_name || "").toLowerCase().includes(q);
        const matchMsg = (l.message || "").toLowerCase().includes(q);
        return matchName || matchEmail || matchCity || matchCompany || matchMsg;
      }
      return true;
    });
  }, [leads, statusFilter, searchText]);

  const bg          = isDark ? colors.primary[400] : "#ffffff";
  const borderColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: "100%" }}>
      {/* Top Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: isDark ? "#f1f5f9" : "#0f172a", letterSpacing: "-0.02em" }}>
            <GroupAddIcon sx={{ mr: 1, mb: "-4px", color: "#5c6bc0" }} />
            Partner Requests & Leads
          </Typography>
          <Typography sx={{ fontSize: "13px", color: colors.grey[400], mt: 0.5 }}>
            {count} total applications · Manage "Become a Part of Eden Sign" partner submissions
          </Typography>
        </Box>
        <Tooltip title="Refresh">
          <IconButton onClick={fetchLeads} disabled={loading} sx={{ color: "#5c6bc0", border: `1px solid ${borderColor}`, borderRadius: "8px", background: bg }}>
            <RefreshIcon sx={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton variant="rounded" height={85} sx={{ borderRadius: "16px" }} />
            </Grid>
          ))
        ) : (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Total Leads" value={stats.total} subtext="Partner applications" icon={<AssignmentIndIcon sx={{ fontSize: 26 }} />} gradient="linear-gradient(135deg, #3b82f6, #6366f1)" isDark={isDark} borderColor={borderColor} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="New Leads" value={stats.newCount} subtext="Awaiting response" icon={<GroupAddIcon sx={{ fontSize: 26 }} />} gradient="linear-gradient(135deg, #f59e0b, #d97706)" isDark={isDark} borderColor={borderColor} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Contacted" value={stats.contactedCount} subtext="In discussion" icon={<PhoneIcon sx={{ fontSize: 26 }} />} gradient="linear-gradient(135deg, #8b5cf6, #6d28d9)" isDark={isDark} borderColor={borderColor} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Converted" value={stats.convertedCount} subtext="Successfully onboarded" icon={<CheckCircleIcon sx={{ fontSize: 26 }} />} gradient="linear-gradient(135deg, #10b981, #059669)" isDark={isDark} borderColor={borderColor} />
            </Grid>
          </>
        )}
      </Grid>

      {/* Filters */}
      <Box sx={{
        display: "flex", gap: 2, mb: 3, flexWrap: "wrap",
        p: 2, borderRadius: "12px", background: bg,
        border: `1px solid ${borderColor}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}>
        <TextField
          placeholder="Search by name, email, city or company…"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          size="small"
          sx={{ flex: 1, minWidth: 220 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: colors.grey[400] }} />
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel><FilterListIcon sx={{ fontSize: 14, mr: 0.5, mb: "-2px" }} /> Status</InputLabel>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
            <MenuItem value="">All Statuses</MenuItem>
            {LEAD_STATUSES.map((s) => (
              <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
      {loading ? (
        <Box sx={{ p: 4, textAlign: "center", background: bg, borderRadius: "14px", border: `1px solid ${borderColor}` }}>
          <CircularProgress sx={{ color: "#5c6bc0" }} />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ borderRadius: "12px" }}>{error}</Alert>
      ) : filtered.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 10, background: bg, borderRadius: "14px", border: `1px solid ${borderColor}` }}>
          <GroupAddIcon sx={{ fontSize: 64, color: colors.grey[600], opacity: 0.2, mb: 2 }} />
          <Typography sx={{ fontWeight: 700, color: colors.grey[400] }}>No leads found</Typography>
        </Box>
      ) : (
        <Box sx={{ borderRadius: "14px", overflow: "hidden", border: `1px solid ${borderColor}`, background: bg }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(92,107,192,0.04)" }}>
                  <TableCell sx={{ width: 48, borderBottom: `1px solid ${borderColor}` }} />
                  {["ID / Date", "Applicant", "Business / City", "Type", "Status", "Update Status"].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: "11px", color: colors.grey[400], textTransform: "uppercase", borderBottom: `1px solid ${borderColor}`, py: 1.5 }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((lead) => (
                  <LeadRow key={lead.id} lead={lead} token={token} onStatusUpdated={handleStatusUpdated} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
}
