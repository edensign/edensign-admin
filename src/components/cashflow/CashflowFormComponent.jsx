/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use, reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    Box, Button, TextField, Typography, useTheme,
    FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

import API from "../../apis";
import Loader from "../common/Loader";
import Toast from "../common/Toast";

import { setMenuItem } from "../../redux/actions/NavigationAction";
import { tokens, themeSettings } from "../../theme";
import { Utility } from "../utility";

const CashflowFormComponent = () => {
    const [loading, setLoading] = useState(false);

    // Form Fields
    const [type, setType] = useState("credit");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [category, setCategory] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [description, setDescription] = useState("");
    const [salonId, setSalonId] = useState("");

    // Salon list for admin dropdown
    const [salonList, setSalonList] = useState([]);

    const navigateTo = useNavigate();
    const userParams = useParams();
    const dispatch = useDispatch();

    const toastInfo = useSelector(state => state.toastInfo);

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { typography } = themeSettings(theme.palette.mode);
    const { toastAndNavigate, getLocalStorage, getRole } = Utility();

    const id = userParams?.id;
    const role = getRole();
    const isSalonUser = role === "salon";

    // Categories based on Type
    const incomeCategories = ["Service Revenue", "Product Sale", "Membership", "Gift Card", "Other"];
    const expenseCategories = ["Inventory Purchase", "Rent", "Utility", "Salary", "Maintenance", "Marketing", "Other"];
    const paymentMethods = ["Cash", "Card", "UPI", "Bank Transfer", "Cheque", "Other"];

    useEffect(() => {
        const selectedMenu = getLocalStorage("menu");
        dispatch(setMenuItem(selectedMenu?.selected || "Salon Cashflow"));

        if (isSalonUser) {
            // Salon user - auto-select their salon
            const storedSalonId = getLocalStorage("salon")?.id;
            if (storedSalonId) {
                setSalonId(storedSalonId);
            }
        } else {
            // Admin user - fetch salon list for dropdown
            fetchSalonList();
        }

        if (id) {
            fetchTransaction(id);
        }
    }, [id]);

    const fetchTransaction = async (id) => {
        setLoading(true);
        try {
            const response = await API.CashflowAPI.getById(id);
            const data = response.data;
            if (data) {
                setAmount(data.amount);
                setType(data.type);
                setCategory(data.category);
                setPaymentMethod(data.payment_method);
                setDescription(data.description);
                setDate(new Date(data.transaction_date).toISOString().split('T')[0]);
                setSalonId(data.salon_id);
            }
        } catch (err) {
            console.error(err);
            toastAndNavigate(dispatch, true, "error", "Failed to fetch transaction details", navigateTo, "/salon/cashflow");
        } finally {
            setLoading(false);
        }
    };

    const fetchSalonList = async () => {
        try {
            const response = await API.SalonAPI.getAll(false, 0, 1000, false);
            if (response?.data?.rows) {
                setSalonList(response.data.rows);
            }
        } catch (err) {
            console.error("Failed to fetch salon list", err);
        }
    };

    const handleSubmit = async () => {
        if (!salonId) {
            toastAndNavigate(dispatch, true, "warning", "Please select a salon");
            return;
        }
        if (!amount || !category || !paymentMethod || !description) {
            toastAndNavigate(dispatch, true, "warning", "Please fill all required fields");
            return;
        }

        setLoading(true);
        try {
            const data = {
                salon_id: salonId,
                amount: parseFloat(amount),
                type,
                category,
                payment_method: paymentMethod,
                description,
                transaction_date: date
            };

            if (id) {
                await API.CashflowAPI.update({ ...data, id: parseInt(id) });
                toastAndNavigate(dispatch, true, "success", "Transaction Updated Successfully", navigateTo, "/salon/cashflow");
            } else {
                await API.CashflowAPI.create(data);
                toastAndNavigate(dispatch, true, "success", "Transaction Added Successfully", navigateTo, "/salon/cashflow");
            }
        } catch (err) {
            toastAndNavigate(dispatch, true, "error", err?.response?.data?.msg || "Failed to save transaction");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box m="20px">
            <Box display="flex" alignItems="center" gap={1} mb={3}>
                <ReceiptLongIcon sx={{ color: colors.greenAccent[500], fontSize: 32 }} />
                <Typography
                    fontFamily={typography.fontFamily}
                    fontSize={typography.h2.fontSize}
                    color={colors.grey[100]}
                    fontWeight="bold"
                >
                    {id ? "Edit Transaction" : "New Transaction"}
                </Typography>
            </Box>

            <Box
                component="form"
                sx={{
                    backgroundColor: colors.primary[400],
                    p: 3,
                    borderRadius: 2
                }}
            >
                {/* Salon Selection Section */}
                <Typography variant="h5" color={colors.greenAccent[400]} mb={2} fontWeight="bold">
                    Salon
                </Typography>

                <Box display="grid" gap={2} gridTemplateColumns="repeat(12, 1fr)" mb={3}>
                    <Box sx={{ gridColumn: "span 6" }}>
                        {isSalonUser ? (
                            <TextField
                                fullWidth
                                variant="filled"
                                label="Salon"
                                value={getLocalStorage("salon")?.name || "My Salon"}
                                disabled
                            />
                        ) : (
                            <FormControl fullWidth variant="filled" required>
                                <InputLabel>Select Salon *</InputLabel>
                                <Select
                                    value={salonId}
                                    onChange={(e) => setSalonId(e.target.value)}
                                >
                                    {salonList.map(salon => (
                                        <MenuItem key={salon.id} value={salon.id}>
                                            {salon.name} {salon.area ? `(${salon.area})` : ''}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    </Box>
                </Box>

                {/* Transaction Type Section */}
                <Typography variant="h5" color={colors.greenAccent[400]} mb={2} fontWeight="bold">
                    Transaction Type
                </Typography>

                <Box display="grid" gap={2} gridTemplateColumns="repeat(12, 1fr)" mb={3}>
                    <Box sx={{ gridColumn: "span 6" }}>
                        <Button
                            fullWidth
                            variant={type === 'credit' ? "contained" : "outlined"}
                            color="success"
                            onClick={() => { setType('credit'); setCategory(''); }}
                            sx={{ py: 1.5, fontSize: '1rem' }}
                        >
                            Income (Credit)
                        </Button>
                    </Box>
                    <Box sx={{ gridColumn: "span 6" }}>
                        <Button
                            fullWidth
                            variant={type === 'debit' ? "contained" : "outlined"}
                            color="error"
                            onClick={() => { setType('debit'); setCategory(''); }}
                            sx={{ py: 1.5, fontSize: '1rem' }}
                        >
                            Expense (Debit)
                        </Button>
                    </Box>
                </Box>

                {/* Transaction Details Section */}
                <Typography variant="h5" color={colors.greenAccent[400]} mb={2} fontWeight="bold">
                    Transaction Details
                </Typography>

                <Box display="grid" gap={2} gridTemplateColumns="repeat(12, 1fr)">
                    <Box sx={{ gridColumn: "span 6" }}>
                        <TextField
                            fullWidth
                            variant="filled"
                            type="number"
                            label="Amount *"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            InputProps={{ inputProps: { min: 0 } }}
                        />
                    </Box>
                    <Box sx={{ gridColumn: "span 6" }}>
                        <TextField
                            fullWidth
                            variant="filled"
                            type="date"
                            label="Transaction Date *"
                            InputLabelProps={{ shrink: true }}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </Box>
                    <Box sx={{ gridColumn: "span 6" }}>
                        <FormControl fullWidth variant="filled" required>
                            <InputLabel>Category *</InputLabel>
                            <Select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {(type === 'credit' ? incomeCategories : expenseCategories).map(cat => (
                                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ gridColumn: "span 6" }}>
                        <FormControl fullWidth variant="filled" required>
                            <InputLabel>Payment Method *</InputLabel>
                            <Select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                {paymentMethods.map(method => (
                                    <MenuItem key={method} value={method}>{method}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ gridColumn: "span 12" }}>
                        <TextField
                            fullWidth
                            variant="filled"
                            label="Description *"
                            multiline
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </Box>
                </Box>

                <Box display="flex" justifyContent="end" mt={4} gap={2}>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={() => navigateTo("/salon/cashflow")}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        color="success"
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {id ? "Update Transaction" : "Save Transaction"}
                    </Button>
                </Box>
            </Box>

            <Toast
                alerting={toastInfo.toastAlert}
                severity={toastInfo.toastSeverity}
                message={toastInfo.toastMessage}
            />
            {loading && <Loader />}
        </Box>
    );
};

export default CashflowFormComponent;
