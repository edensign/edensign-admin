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
    Divider, IconButton
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import StoreIcon from '@mui/icons-material/Store';

import API from "../../apis";
import Loader from "../common/Loader";
import Toast from "../common/Toast";

import { setMenuItem } from "../../redux/actions/NavigationAction";
import { tokens, themeSettings } from "../../theme";
import { Utility } from "../utility";

const SalonInventoryFormComponent = () => {
    const [loading, setLoading] = useState(false);

    // Salon fields
    const [salonName, setSalonName] = useState("");
    const [salonCode, setSalonCode] = useState("");
    const [type, setType] = useState("");
    const [area, setArea] = useState("");

    // Inventory fields
    const [stockQuantity, setStockQuantity] = useState(0);
    const [lowStockThreshold, setLowStockThreshold] = useState(10);
    const [sku, setSku] = useState("");

    const [dirty, setDirty] = useState(false);

    const navigateTo = useNavigate();
    const userParams = useParams();
    const dispatch = useDispatch();

    const selected = useSelector(state => state.menuItems.selected);
    const toastInfo = useSelector(state => state.toastInfo);

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { typography } = themeSettings(theme.palette.mode);
    const { toastAndNavigate, getLocalStorage } = Utility();

    const id = userParams?.id;

    useEffect(() => {
        const selectedMenu = getLocalStorage("menu");
        dispatch(setMenuItem(selectedMenu?.selected || "Salon Inventory"));

        if (id) {
            fetchSalonData(id);
        }
    }, [id]);

    const fetchSalonData = async (salonId) => {
        setLoading(true);
        try {
            const response = await API.CommonAPI.getByPk(salonId, "salon");
            if (response.data) {
                const data = response.data;
                setSalonName(data.name || "");
                setSalonCode(data.salon_code || "");
                setType(data.type || "");
                setArea(data.area || "");
                setStockQuantity(data.stock_quantity ?? 0);
                setLowStockThreshold(data.low_stock_threshold ?? 10);
                setSku(data.sku ?? "");
            }
        } catch (err) {
            toastAndNavigate(dispatch, true, "error", err?.response?.data?.msg || "Failed to load salon data");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStock = async () => {
        setLoading(true);
        try {
            const inventoryData = {
                id: parseInt(id),
                stock_quantity: stockQuantity,
                low_stock_threshold: lowStockThreshold,
                sku: sku || null
            };

            await API.SalonInventoryAPI.updateSalonInventory(inventoryData);
            toastAndNavigate(dispatch, true, "success", "Salon Inventory Updated Successfully", navigateTo, "/salon-inventory/listing");
            setDirty(false);
        } catch (err) {
            toastAndNavigate(dispatch, true, "error", err?.response?.data?.msg || "Failed to update salon inventory");
        } finally {
            setLoading(false);
        }
    };

    const handleQuickAdjust = (amount) => {
        const newValue = Math.max(0, stockQuantity + amount);
        setStockQuantity(newValue);
        setDirty(true);
    };

    const handleFieldChange = (setter) => (e) => {
        setter(e.target.value);
        setDirty(true);
    };

    return (
        <Box m="20px">
            <Box display="flex" alignItems="center" gap={1} mb={3}>
                <StoreIcon sx={{ color: colors.greenAccent[500], fontSize: 32 }} />
                <Typography
                    fontFamily={typography.fontFamily}
                    fontSize={typography.h2.fontSize}
                    color={colors.grey[100]}
                    fontWeight="bold"
                >
                    Edit Salon Inventory
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
                {/* Salon Details Section (Read-only) */}
                <Typography variant="h5" color={colors.greenAccent[400]} mb={2} fontWeight="bold">
                    Salon Details (Read-only)
                </Typography>

                <Box display="grid" gap={2} gridTemplateColumns="repeat(12, 1fr)" mb={3}>
                    <Box sx={{ gridColumn: "span 6" }}>
                        <TextField
                            fullWidth
                            variant="filled"
                            label="Salon Name"
                            value={salonName}
                            InputProps={{ readOnly: true }}
                        />
                    </Box>
                    <Box sx={{ gridColumn: "span 3" }}>
                        <TextField
                            fullWidth
                            variant="filled"
                            label="Salon Code"
                            value={salonCode}
                            InputProps={{ readOnly: true }}
                        />
                    </Box>
                    <Box sx={{ gridColumn: "span 3" }}>
                        <TextField
                            fullWidth
                            variant="filled"
                            label="Type"
                            value={type}
                            InputProps={{ readOnly: true }}
                        />
                    </Box>
                    <Box sx={{ gridColumn: "span 12" }}>
                        <TextField
                            fullWidth
                            variant="filled"
                            label="Area"
                            value={area}
                            InputProps={{ readOnly: true }}
                        />
                    </Box>
                </Box>

                <Divider sx={{ my: 3, borderColor: colors.grey[700] }} />

                {/* Inventory Section */}
                <Typography variant="h5" color={colors.greenAccent[400]} mb={2} fontWeight="bold">
                    Inventory Details
                </Typography>

                <Box display="grid" gap={2} gridTemplateColumns="repeat(12, 1fr)">
                    <Box sx={{ gridColumn: "span 6" }}>
                        <TextField
                            fullWidth
                            variant="filled"
                            label="SKU (Stock Keeping Unit)"
                            value={sku}
                            onChange={handleFieldChange(setSku)}
                            placeholder="e.g., SALON-001"
                        />
                    </Box>
                    <Box sx={{ gridColumn: "span 6" }}>
                        <TextField
                            fullWidth
                            variant="filled"
                            type="number"
                            label="Low Stock Threshold"
                            value={lowStockThreshold}
                            onChange={(e) => { setLowStockThreshold(parseInt(e.target.value) || 0); setDirty(true); }}
                            InputProps={{ inputProps: { min: 0 } }}
                        />
                    </Box>

                    {/* Stock Quantity with Quick Adjust */}
                    <Box sx={{ gridColumn: "span 12" }}>
                        <Typography variant="h6" color={colors.grey[100]} mb={2}>
                            Stock Quantity
                        </Typography>

                        <Box display="flex" alignItems="center" gap={2}>
                            <IconButton
                                onClick={() => handleQuickAdjust(-10)}
                                sx={{
                                    backgroundColor: colors.redAccent[700],
                                    '&:hover': { backgroundColor: colors.redAccent[600] }
                                }}
                            >
                                <Typography color={colors.grey[100]}>-10</Typography>
                            </IconButton>
                            <IconButton
                                onClick={() => handleQuickAdjust(-1)}
                                sx={{
                                    backgroundColor: colors.redAccent[700],
                                    '&:hover': { backgroundColor: colors.redAccent[600] }
                                }}
                            >
                                <RemoveIcon />
                            </IconButton>

                            <TextField
                                variant="filled"
                                type="number"
                                value={stockQuantity}
                                onChange={(e) => { setStockQuantity(parseInt(e.target.value) || 0); setDirty(true); }}
                                InputProps={{
                                    inputProps: { min: 0, style: { textAlign: 'center', fontSize: '1.5rem' } }
                                }}
                                sx={{ width: 150 }}
                            />

                            <IconButton
                                onClick={() => handleQuickAdjust(1)}
                                sx={{
                                    backgroundColor: colors.greenAccent[700],
                                    '&:hover': { backgroundColor: colors.greenAccent[600] }
                                }}
                            >
                                <AddIcon />
                            </IconButton>
                            <IconButton
                                onClick={() => handleQuickAdjust(10)}
                                sx={{
                                    backgroundColor: colors.greenAccent[700],
                                    '&:hover': { backgroundColor: colors.greenAccent[600] }
                                }}
                            >
                                <Typography color={colors.grey[100]}>+10</Typography>
                            </IconButton>
                        </Box>

                        {stockQuantity <= lowStockThreshold && stockQuantity > 0 && (
                            <Typography color="#FFD700" mt={1}>
                                ⚠️ Stock is below threshold!
                            </Typography>
                        )}
                        {stockQuantity === 0 && (
                            <Typography color={colors.redAccent[400]} mt={1}>
                                ⚠️ Salon is out of stock!
                            </Typography>
                        )}
                    </Box>
                </Box>

                <Box display="flex" justifyContent="end" mt={4} gap={2}>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={() => navigateTo("/salon-inventory/listing")}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        color="success"
                        variant="contained"
                        onClick={handleUpdateStock}
                        disabled={!dirty || loading}
                    >
                        Update Stock
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

export default SalonInventoryFormComponent;
