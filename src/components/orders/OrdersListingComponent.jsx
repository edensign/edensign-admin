/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 * Admin Orders Management Page - Full status pipeline control with live statistics top bar
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box, Typography, useTheme, Chip, IconButton, Tooltip,
  Select, MenuItem, FormControl, InputLabel, CircularProgress,
  Collapse, Table, TableBody, TableCell, TableHead, TableRow,
  Paper, TableContainer, TextField, InputAdornment, Skeleton, Alert,
  Grid
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import { tokens } from "../../theme";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ORDER_STATUSES = [
  { value: "payment_pending", label: "Payment Pending", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  { value: "paid",            label: "Paid",            color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  { value: "processing",     label: "Processing",      color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
  { value: "dispatched",     label: "Dispatched",      color: "#8b5cf6", bg: "rgba(139,92,246,0.12)" },
  { value: "on_the_way",     label: "On The Way",      color: "#f97316", bg: "rgba(249,115,22,0.12)" },
  { value: "delivered",      label: "Delivered",       color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  { value: "cancelled",      label: "Cancelled",       color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
];

const PIPELINE_STEPS = ["paid", "processing", "dispatched", "on_the_way", "delivered"];

/* ─── Stat Card Component ─────────────────────────────────────────────────── */
function StatCard({ title, value, subtext, icon, gradient, isDark, borderColor }) {
  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: "16px",
        background: isDark ? "rgba(255,255,255,0.03)" : "#ffffff",
        border: `1px solid ${borderColor}`,
        boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(92,107,192,0.06)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "transform 0.25s ease, boxShadow 0.25s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: isDark ? "0 8px 28px rgba(0,0,0,0.3)" : "0 8px 28px rgba(92,107,192,0.12)",
        },
      }}
    >
      <Box sx={{ zIndex: 1 }}>
        <Typography sx={{ fontSize: "12px", fontWeight: 700, color: isDark ? "#94a3b8" : "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", mb: 0.5 }}>
          {title}
        </Typography>
        <Typography sx={{ fontSize: "24px", fontWeight: 800, color: isDark ? "#f1f5f9" : "#0f172a", letterSpacing: "-0.02em" }}>
          {value}
        </Typography>
        <Typography sx={{ fontSize: "11px", fontWeight: 500, color: isDark ? "#64748b" : "#94a3b8", mt: 0.5 }}>
          {subtext}
        </Typography>
      </Box>

      {/* Gradient Icon Badge */}
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: "14px",
          background: gradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
    </Box>
  );
}

/* ─── Skeleton Card Component ────────────────────────────────────────────── */
function StatCardSkeleton({ isDark, borderColor }) {
  return (
    <Box sx={{ p: 2.5, borderRadius: "16px", background: isDark ? "rgba(255,255,255,0.03)" : "#ffffff", border: `1px solid ${borderColor}` }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ width: "60%" }}>
          <Skeleton variant="text" width="70%" height={14} sx={{ mb: 0.5 }} />
          <Skeleton variant="text" width="90%" height={32} sx={{ mb: 0.5 }} />
          <Skeleton variant="text" width="60%" height={12} />
        </Box>
        <Skeleton variant="rounded" width={52} height={52} sx={{ borderRadius: "14px" }} />
      </Box>
    </Box>
  );
}

/* ─── Skeleton row shown while loading ─────────────────────────────────── */
function SkeletonRow({ isDark, borderColor }) {
  return (
    <TableRow sx={{ borderBottom: `1px solid ${borderColor}` }}>
      <TableCell sx={{ borderBottom: "none", py: 1.5, width: 48 }}>
        <Skeleton variant="circular" width={28} height={28} />
      </TableCell>
      <TableCell sx={{ borderBottom: "none", py: 1.5 }}>
        <Skeleton variant="text" width={80} height={18} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width={120} height={13} />
      </TableCell>
      <TableCell sx={{ borderBottom: "none", py: 1.5 }}>
        <Skeleton variant="text" width={100} height={18} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width={140} height={13} />
      </TableCell>
      <TableCell sx={{ borderBottom: "none", py: 1.5 }}>
        <Skeleton variant="text" width={70} height={20} sx={{ mb: 0.5 }} />
        <Skeleton variant="text" width={50} height={13} />
      </TableCell>
      <TableCell sx={{ borderBottom: "none", py: 1.5 }}>
        <Skeleton variant="rounded" width={100} height={24} sx={{ borderRadius: "6px" }} />
      </TableCell>
      <TableCell sx={{ borderBottom: "none", py: 1.5 }}>
        <Skeleton variant="rounded" width={150} height={34} sx={{ borderRadius: "8px" }} />
      </TableCell>
    </TableRow>
  );
}

/* ─── Header skeleton shown while loading ──────────────────────────────── */
function SkeletonTable({ isDark, bg, borderColor }) {
  return (
    <Box sx={{ borderRadius: "14px", overflow: "hidden", border: `1px solid ${borderColor}`, boxShadow: "0 4px 20px rgba(0,0,0,0.04)", background: bg }}>
      <Box sx={{ display: "flex", gap: 3, px: 2, py: 1.5, background: isDark ? "rgba(255,255,255,0.03)" : "rgba(92,107,192,0.04)", borderBottom: `1px solid ${borderColor}` }}>
        {[48, 120, 140, 80, 110, 160].map((w, i) => (
          <Skeleton key={i} variant="text" width={w} height={14} />
        ))}
      </Box>
      <Table>
        <TableBody>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonRow key={i} isDark={isDark} borderColor={borderColor} />
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

/* ─── Status chip ───────────────────────────────────────────────────────── */
function StatusChip({ status }) {
  const found = ORDER_STATUSES.find((s) => s.value === status) || {
    label: status, color: "#64748b", bg: "rgba(100,116,139,0.12)",
  };
  return (
    <Chip
      label={found.label}
      size="small"
      sx={{
        fontWeight: 700, fontSize: "11px",
        color: found.color, backgroundColor: found.bg,
        border: `1px solid ${found.color}33`,
        borderRadius: "6px", minWidth: 100,
      }}
    />
  );
}

/* ─── Pipeline bar ──────────────────────────────────────────────────────── */
function PipelineBar({ currentStatus }) {
  const currentIdx = PIPELINE_STEPS.indexOf(currentStatus);
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0, my: 1.5 }}>
      {PIPELINE_STEPS.map((step, idx) => {
        const done = idx <= currentIdx;
        const label = ORDER_STATUSES.find((s) => s.value === step)?.label || step;
        return (
          <Box key={step} sx={{ display: "flex", alignItems: "center", flex: 1 }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 70 }}>
              <Box sx={{
                width: 28, height: 28, borderRadius: "50%",
                background: done ? "#22c55e" : "rgba(148,163,184,0.2)",
                border: done ? "none" : "2px solid rgba(148,163,184,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.3s",
                boxShadow: done ? "0 2px 8px rgba(34,197,94,0.3)" : "none",
              }}>
                {done
                  ? <CheckCircleIcon sx={{ fontSize: 16, color: "#fff" }} />
                  : <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(148,163,184,0.5)" }} />}
              </Box>
              <Typography sx={{
                fontSize: "9px", fontWeight: done ? 700 : 500,
                color: done ? "#22c55e" : "rgba(100,116,139,0.7)",
                mt: 0.5, textAlign: "center", whiteSpace: "nowrap",
              }}>
                {label}
              </Typography>
            </Box>
            {idx < PIPELINE_STEPS.length - 1 && (
              <Box sx={{
                flex: 1, height: 2,
                background: done && idx < currentIdx ? "#22c55e" : "rgba(148,163,184,0.2)",
                mx: 0.5, mb: 2.5, transition: "all 0.3s",
              }} />
            )}
          </Box>
        );
      })}
    </Box>
  );
}

/* ─── Single order row ──────────────────────────────────────────────────── */
function OrderRow({ order, token, onStatusUpdated }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDark = theme.palette.mode === "dark";

  const [open, setOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(order.status);

  const handleStatusChange = async (newStatus) => {
    setSelectedStatus(newStatus);
    setUpdatingStatus(true);
    try {
      const res = await fetch(`${BASE_URL}/orders/${order.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.status === "Success") onStatusUpdated(order.id, newStatus);
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const customer = order.customer || {};
  const items = order.order_item || [];
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
            #{order.id}
          </Typography>
          <Typography sx={{ fontSize: "11px", color: colors.grey[400], mt: 0.3 }}>
            {new Date(order.created_at).toLocaleString("en-IN")}
          </Typography>
        </TableCell>
        <TableCell sx={{ borderBottom: "none", py: 1.5 }}>
          <Typography sx={{ fontWeight: 600, fontSize: "13px", color: isDark ? "#f1f5f9" : "#0f172a" }}>
            {customer.username || "—"}
          </Typography>
          <Typography sx={{ fontSize: "11px", color: colors.grey[400], mt: 0.3 }}>
            {customer.email || customer.contact_no || ""}
          </Typography>
        </TableCell>
        <TableCell sx={{ borderBottom: "none", py: 1.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: "14px", color: "#5c6bc0" }}>
            ₹{Number(order.total_amount || 0).toLocaleString("en-IN")}
          </Typography>
          <Typography sx={{ fontSize: "11px", color: colors.grey[400] }}>{items.length} item(s)</Typography>
        </TableCell>
        <TableCell sx={{ borderBottom: "none", py: 1.5 }}>
          <StatusChip status={order.status} />
        </TableCell>
        <TableCell sx={{ borderBottom: "none", py: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                value={selectedStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updatingStatus}
                sx={{ fontSize: "12px", borderRadius: "8px", height: 34, "& .MuiSelect-select": { py: "6px" } }}
              >
                {ORDER_STATUSES.map((s) => (
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
        <TableCell colSpan={6} sx={{ p: 0, borderBottom: `1px solid ${borderColor}` }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{
              p: 3,
              background: isDark ? "rgba(255,255,255,0.02)" : "rgba(92,107,192,0.02)",
              borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
            }}>
              {PIPELINE_STEPS.includes(selectedStatus) && (
                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ fontSize: "11px", fontWeight: 700, color: colors.grey[400], mb: 1, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Order Progress
                  </Typography>
                  <PipelineBar currentStatus={selectedStatus} />
                </Box>
              )}
              <Typography sx={{ fontSize: "11px", fontWeight: 700, color: colors.grey[400], mb: 1, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Ordered Items
              </Typography>
              <TableContainer component={Paper} sx={{ borderRadius: "10px", boxShadow: "none", border: `1px solid ${borderColor}` }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {["Product", "Brand", "Qty", "Price", "Subtotal"].map((h) => (
                        <TableCell key={h} sx={{ fontWeight: 700, fontSize: "11px", color: colors.grey[400], textTransform: "uppercase" }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell sx={{ fontSize: "12px", fontWeight: 600 }}>{item.product?.name || `Product #${item.product_id}`}</TableCell>
                        <TableCell sx={{ fontSize: "12px", color: colors.grey[400] }}>{item.product?.brand || "—"}</TableCell>
                        <TableCell sx={{ fontSize: "12px" }}>{item.quantity}</TableCell>
                        <TableCell sx={{ fontSize: "12px" }}>₹{Number(item.price || 0).toLocaleString("en-IN")}</TableCell>
                        <TableCell sx={{ fontSize: "12px", fontWeight: 700, color: "#5c6bc0" }}>
                          ₹{Number((item.price || 0) * (item.quantity || 1)).toLocaleString("en-IN")}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={4} sx={{ fontWeight: 700, fontSize: "13px", textAlign: "right", borderBottom: "none" }}>Total</TableCell>
                      <TableCell sx={{ fontWeight: 800, fontSize: "14px", color: "#5c6bc0", borderBottom: "none" }}>
                        ₹{Number(order.total_amount || 0).toLocaleString("en-IN")}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

/* ─── Main orders listing ───────────────────────────────────────────────── */
export default function OrdersListingComponent() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDark = theme.palette.mode === "dark";

  const [orders, setOrders]         = useState([]);
  const [count, setCount]           = useState(0);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchText, setSearchText] = useState("");

  const auth  = (() => { try { return JSON.parse(localStorage.getItem("auth") || "{}"); } catch { return {}; } })();
  const token = auth?.token || "";

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${BASE_URL}/orders/all?page=1&size=100`;
      if (statusFilter) url += `&status=${statusFilter}`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      if (data.status === "Success") {
        setOrders(data.data?.orders || []);
        setCount(data.data?.count || 0);
      } else {
        throw new Error(data.message || "Failed to load orders");
      }
    } catch (err) {
      if (err.name === "AbortError") {
        setError("Request timed out — make sure the server is running.");
      } else {
        setError(err.message || "Could not connect to server.");
      }
    } finally {
      setLoading(false);
    }
  }, [token, statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusUpdated = (orderId, newStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
  };

  /* ── Compute Statistics ────────────────────────────────────────────── */
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const monthName = now.toLocaleString("en-IN", { month: "long" });

    let monthlyOrdersCount = 0;
    let monthlyRevenueSum = 0;
    let totalRevenueSum = 0;

    orders.forEach((o) => {
      const d = new Date(o.created_at || Date.now());
      const isThisMonth = d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      const isNotCancelled = o.status !== "cancelled";
      const amt = Number(o.total_amount || 0);

      if (isThisMonth) {
        monthlyOrdersCount += 1;
        if (isNotCancelled) {
          monthlyRevenueSum += amt;
        }
      }

      if (isNotCancelled) {
        totalRevenueSum += amt;
      }
    });

    return {
      monthlyOrders: monthlyOrdersCount,
      monthlyRevenue: monthlyRevenueSum,
      totalOrders: count || orders.length,
      totalRevenue: totalRevenueSum,
      monthName,
    };
  }, [orders, count]);

  const filtered = searchText
    ? orders.filter((o) =>
        String(o.id).includes(searchText) ||
        (o.customer?.username || "").toLowerCase().includes(searchText.toLowerCase()) ||
        (o.customer?.email || "").toLowerCase().includes(searchText.toLowerCase())
      )
    : orders;

  const bg          = isDark ? colors.primary[400] : "#ffffff";
  const borderColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: "100%" }}>

      {/* ── Top Bar / Header ────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          {loading ? (
            <>
              <Skeleton variant="text" width={240} height={34} sx={{ mb: 0.5 }} />
              <Skeleton variant="text" width={180} height={16} />
            </>
          ) : (
            <>
              <Typography variant="h5" sx={{ fontWeight: 800, color: isDark ? "#f1f5f9" : "#0f172a", letterSpacing: "-0.02em" }}>
                <LocalShippingIcon sx={{ mr: 1, mb: "-4px", color: "#5c6bc0" }} />
                Orders Management
              </Typography>
              <Typography sx={{ fontSize: "13px", color: colors.grey[400], mt: 0.5 }}>
                {count} total orders · View, filter and update order status
              </Typography>
            </>
          )}
        </Box>
        <Tooltip title="Refresh">
          <IconButton
            onClick={fetchOrders}
            disabled={loading}
            sx={{ color: "#5c6bc0", border: `1px solid ${borderColor}`, borderRadius: "8px", background: bg }}
          >
            <RefreshIcon sx={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* ── Statistics Top Bar ────────────────────────────────────────── */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        {loading ? (
          <>
            <Grid item xs={12} sm={6} md={3}><StatCardSkeleton isDark={isDark} borderColor={borderColor} /></Grid>
            <Grid item xs={12} sm={6} md={3}><StatCardSkeleton isDark={isDark} borderColor={borderColor} /></Grid>
            <Grid item xs={12} sm={6} md={3}><StatCardSkeleton isDark={isDark} borderColor={borderColor} /></Grid>
            <Grid item xs={12} sm={6} md={3}><StatCardSkeleton isDark={isDark} borderColor={borderColor} /></Grid>
          </>
        ) : (
          <>
            {/* 1. Monthly Orders */}
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Monthly Orders"
                value={stats.monthlyOrders}
                subtext={`Placed in ${stats.monthName}`}
                icon={<CalendarMonthIcon sx={{ fontSize: 26 }} />}
                gradient="linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)"
                isDark={isDark}
                borderColor={borderColor}
              />
            </Grid>

            {/* 2. Monthly Revenue */}
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Monthly Revenue"
                value={`₹${stats.monthlyRevenue.toLocaleString("en-IN")}`}
                subtext={`Revenue in ${stats.monthName}`}
                icon={<CurrencyRupeeIcon sx={{ fontSize: 26 }} />}
                gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                isDark={isDark}
                borderColor={borderColor}
              />
            </Grid>

            {/* 3. Total Orders */}
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Orders"
                value={stats.totalOrders}
                subtext="All customer orders"
                icon={<ShoppingBagIcon sx={{ fontSize: 26 }} />}
                gradient="linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)"
                isDark={isDark}
                borderColor={borderColor}
              />
            </Grid>

            {/* 4. Total Revenue */}
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Revenue"
                value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`}
                subtext="Lifetime successful sales"
                icon={<TrendingUpIcon sx={{ fontSize: 26 }} />}
                gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                isDark={isDark}
                borderColor={borderColor}
              />
            </Grid>
          </>
        )}
      </Grid>

      {/* ── Filters ───────────────────────────────────────────── */}
      <Box sx={{
        display: "flex", gap: 2, mb: 3, flexWrap: "wrap",
        p: 2, borderRadius: "12px", background: bg,
        border: `1px solid ${borderColor}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}>
        <TextField
          placeholder="Search by order ID, customer name or email…"
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
          <InputLabel>
            <FilterListIcon sx={{ fontSize: 14, mr: 0.5, mb: "-2px" }} />
            Status
          </InputLabel>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
            <MenuItem value="">All Statuses</MenuItem>
            {ORDER_STATUSES.map((s) => (
              <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* ── Status summary chips (hidden while loading) ─────── */}
      {!loading && orders.length > 0 && (
        <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
          {ORDER_STATUSES.map((s) => {
            const cnt = orders.filter((o) => o.status === s.value).length;
            if (cnt === 0) return null;
            return (
              <Chip
                key={s.value}
                label={`${s.label}: ${cnt}`}
                size="small"
                onClick={() => setStatusFilter(s.value === statusFilter ? "" : s.value)}
                sx={{
                  fontWeight: 700, fontSize: "11px", cursor: "pointer",
                  color: s.color,
                  backgroundColor: statusFilter === s.value ? s.bg : "transparent",
                  border: `1px solid ${s.color}44`, borderRadius: "20px",
                  "&:hover": { backgroundColor: s.bg },
                }}
              />
            );
          })}
        </Box>
      )}

      {/* ── Skeleton chips while loading ─────────────────────── */}
      {loading && (
        <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
          {[80, 110, 95, 100].map((w, i) => (
            <Skeleton key={i} variant="rounded" width={w} height={24} sx={{ borderRadius: "20px" }} />
          ))}
        </Box>
      )}

      {/* ── Error banner ─────────────────────────────────────── */}
      {error && !loading && (
        <Alert
          severity="error"
          icon={<ErrorOutlineIcon />}
          action={
            <Chip
              label="Retry"
              size="small"
              onClick={fetchOrders}
              sx={{ cursor: "pointer", fontWeight: 700, color: "#ef4444", border: "1px solid #ef444444" }}
            />
          }
          sx={{ mb: 3, borderRadius: "12px", fontWeight: 500 }}
        >
          {error}
        </Alert>
      )}

      {/* ── Skeleton table OR real table ─────────────────────── */}
      {loading ? (
        <SkeletonTable isDark={isDark} bg={bg} borderColor={borderColor} />
      ) : error ? null : filtered.length === 0 ? (
        <Box sx={{
          borderRadius: "14px", border: `1px solid ${borderColor}`,
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)", background: bg,
          textAlign: "center", py: 10,
        }}>
          <LocalShippingIcon sx={{ fontSize: 64, color: colors.grey[600], opacity: 0.2, mb: 2 }} />
          <Typography sx={{ fontWeight: 700, fontSize: "16px", color: colors.grey[400] }}>
            {searchText || statusFilter ? "No orders match your filter" : "No orders yet"}
          </Typography>
          <Typography sx={{ fontSize: "13px", color: colors.grey[500], mt: 0.5 }}>
            {searchText || statusFilter ? "Try clearing the search or filter." : "Orders placed by customers will appear here."}
          </Typography>
        </Box>
      ) : (
        <Box sx={{
          borderRadius: "14px", overflow: "hidden",
          border: `1px solid ${borderColor}`,
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)", background: bg,
        }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(92,107,192,0.04)" }}>
                  <TableCell sx={{ width: 48, borderBottom: `1px solid ${borderColor}` }} />
                  {["Order ID", "Customer", "Amount", "Status", "Update Status"].map((h) => (
                    <TableCell key={h} sx={{
                      fontWeight: 700, fontSize: "11px", color: colors.grey[400],
                      textTransform: "uppercase", letterSpacing: "0.05em",
                      borderBottom: `1px solid ${borderColor}`, py: 1.5,
                    }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((order) => (
                  <OrderRow key={order.id} order={order} token={token} onStatusUpdated={handleStatusUpdated} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* spin keyframes */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </Box>
  );
}
