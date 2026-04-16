/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    Box, Typography, useMediaQuery, useTheme, Button,
    Card, CardContent, Grid, TextField
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import ReplayIcon from '@mui/icons-material/Replay';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import API from "../../apis";
import ServerPaginationGrid from '../common/Datagrid';
import Loader from "../common/Loader";
import Toast from "../common/Toast";

import { datagridColumns } from "./CashflowConfig";
import { setMenuItem } from "../../redux/actions/NavigationAction";
import { setCashflowList, setCashflowSummary } from "../../redux/actions/CashflowAction";
import { tokens } from "../../theme";
import { Utility } from "../utility";

const pageSizeOptions = [10, 20, 50];

const CashflowListingComponent = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigateTo = useNavigate();
    const isMobile = useMediaQuery("(max-width:480px)");
    const isTab = useMediaQuery("(max-width:920px)");

    const selected = useSelector(state => state.menuItems.selected);
    const { listData, summaryData } = useSelector(state => state.allCashflow);
    const toastInfo = useSelector(state => state.toastInfo);

    const [searchFlag, setSearchFlag] = useState({ search: false, searching: false });
    const [oldPagination, setOldPagination] = useState();
    const [loading, setLoading] = useState(false);

    // Filters
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const { getLocalStorage, toastAndNavigate } = Utility();

    const colors = tokens(theme.palette.mode);
    const salonId = getLocalStorage("salon")?.id;

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this transaction?")) {
            setLoading(true);
            try {
                await API.CashflowAPI.delete(id);
                toastAndNavigate(dispatch, true, "success", "Transaction Deleted Successfully");
                // Refresh data
                fetchData();
            } catch (err) {
                toastAndNavigate(dispatch, true, "error", err?.response?.data?.msg || "Failed to delete transaction");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleEdit = (row) => {
        navigateTo(`/salon/cashflow/update/${row.id}`);
    };

    const columns = datagridColumns(handleDelete, handleEdit);

    useEffect(() => {
        const selectedMenu = getLocalStorage("menu");
        dispatch(setMenuItem(selectedMenu?.selected || "Salon Cashflow"));
        fetchSummary();
    }, [startDate, endDate]);

    const fetchData = () => {
        // Trigger generic data fetch (handled by ServerPaginationGrid via getPaginatedData)
        // We need to pass custom params for date range and salonId
        // But getPaginatedData is generic. 
        // We might need to rely on the generic fetch but pass extra params via 'condition' prop if supported?
        // Or update getPaginatedData to support extra params.
        // For simplicity, let's just make sure getPaginatedData supports basic search.
        // For advanced filters like Date, we might need to handle it or update state that triggers fetch.

        // Actually ServerPaginationGrid calls 'getQuery' prop.
        // 'getPaginatedData' uses action and api props.

        // If we want to filter by date/salonId, we need to pass those.
        // Currently getPaginatedData doesn't seem to support arbitrary params well without looking at its impl.
        // Let's reload summary at least.
        fetchSummary();
    };

    const fetchSummary = async () => {
        try {
            const response = await API.CashflowAPI.getSummary(startDate, endDate, salonId);
            if (response.data) {
                dispatch(setCashflowSummary(response.data));
            }
        } catch (err) {
            console.error("Failed to fetch summary", err);
        }
    };

    // Wrapper for getPaginatedData to inject salonId and dates
    const getCashflowData = (page, size, action, api, condition) => {
        setLoading(true);
        API.CashflowAPI.getAll(condition, page, size, false, startDate, endDate, salonId)
            .then(response => {
                dispatch(action({ listData: response.data, loading: false }));
            })
            .catch(err => {
                console.error("CashflowAPI error", err);
                dispatch(action({ listData: [], loading: false }));
            })
            .finally(() => {
                setLoading(false);
            });
    };


    return (
        <Box m="20px">
            {/* Header & Actions */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexDirection={isMobile ? "column" : "row"} gap={2}>
                <Box display="flex" alignItems="center" gap={1}>
                    <ReceiptLongIcon sx={{ color: colors.greenAccent[500], fontSize: 32 }} />
                    <Typography variant="h2" color={colors.grey[100]} fontWeight="bold">
                        {selected || "Salon Cashflow"}
                    </Typography>
                </Box>

                <Box display="flex" gap={2} flexDirection={isMobile ? "column" : "row"}>
                    <TextField
                        type="date"
                        label="Start Date"
                        InputLabelProps={{ shrink: true }}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        size="small"
                    />
                    <TextField
                        type="date"
                        label="End Date"
                        InputLabelProps={{ shrink: true }}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        size="small"
                    />
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<AddIcon />}
                        onClick={() => navigateTo("/salon/cashflow/create")}
                    >
                        Add Transaction
                    </Button>
                </Box>
            </Box>

            {/* Summary Cards */}
            <Grid container spacing={2} mb={3}>
                <Grid item xs={12} sm={4}>
                    <Card sx={{ backgroundColor: colors.primary[400], height: '100%' }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography color={colors.greenAccent[500]} variant="h5" fontWeight="bold">
                                        Income
                                    </Typography>
                                    <Typography color={colors.grey[100]} variant="h3" fontWeight="bold">
                                        ₹{parseFloat(summaryData?.income || 0).toFixed(2)}
                                    </Typography>
                                </Box>
                                <TrendingUpIcon sx={{ color: colors.greenAccent[500], fontSize: 40 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card sx={{ backgroundColor: colors.primary[400], height: '100%' }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography color={colors.redAccent[500]} variant="h5" fontWeight="bold">
                                        Expense
                                    </Typography>
                                    <Typography color={colors.grey[100]} variant="h3" fontWeight="bold">
                                        ₹{parseFloat(summaryData?.expense || 0).toFixed(2)}
                                    </Typography>
                                </Box>
                                <TrendingDownIcon sx={{ color: colors.redAccent[500], fontSize: 40 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card sx={{ backgroundColor: colors.primary[400], height: '100%' }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography color={colors.blueAccent[500]} variant="h5" fontWeight="bold">
                                        Balance
                                    </Typography>
                                    <Typography color={summaryData?.balance >= 0 ? colors.greenAccent[500] : colors.redAccent[500]} variant="h3" fontWeight="bold">
                                        ₹{parseFloat(summaryData?.balance || 0).toFixed(2)}
                                    </Typography>
                                </Box>
                                <AccountBalanceWalletIcon sx={{ color: colors.blueAccent[500], fontSize: 40 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Data Grid */}
            <ServerPaginationGrid
                action={setCashflowList}
                api={API.CashflowAPI}
                getQuery={getCashflowData} // Custom getQuery to handle extra params
                columns={columns}
                rows={listData?.rows || []}
                count={listData?.count || 0}
                pageSizeOptions={pageSizeOptions}
                setOldPagination={setOldPagination}
                searchFlag={searchFlag}
                setSearchFlag={setSearchFlag}
            />

            <Toast
                alerting={toastInfo.toastAlert}
                severity={toastInfo.toastSeverity}
                message={toastInfo.toastMessage}
            />
            {loading && <Loader />}
        </Box>
    );
};

export default CashflowListingComponent;
