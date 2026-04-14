/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use, reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
    const [name, setName] = useState("");
    const [brand, setBrand] = useState("");
    const [stockQuantity, setStockQuantity] = useState(0);
    const [lowStockThreshold, setLowStockThreshold] = useState(10);
    const [usagePerClient, setUsagePerClient] = useState(0);
    const [sku, setSku] = useState("");
    const [status, setStatus] = useState("active");

    const [dirty, setDirty] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigateTo = useNavigate();
    const userParams = useParams();
    const location = useLocation();
    const dispatch = useDispatch();

    const selected = useSelector(state => state.menuItems.selected);
    const toastInfo = useSelector(state => state.toastInfo);

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { typography } = themeSettings(theme.palette.mode);
    const { toastAndNavigate, getLocalStorage } = Utility();

    const id = userParams?.id;
    const isEdit = !!id;

    const salonIdFromState = location.state?.salonId;
    const queryParams = new URLSearchParams(location.search);
    const salonIdFromQuery = queryParams.get("salon_id");

    // Determine the target salon ID:
    // 1. Passed in state (from "Create Product" button in filtered list)
    // 2. Passed in query (if manually added)
    // 3. From Local Storage (if user is a Salon user)
    // Note: If Admin is creating for a salon, state/query is required given the current backend logic (which defaults to req.userId otherwise)
    const storedSalon = getLocalStorage("salon");
    const targetSalonId = salonIdFromState || salonIdFromQuery || storedSalon?.id;


    useEffect(() => {
        const selectedMenu = getLocalStorage("menu");
        dispatch(setMenuItem(selectedMenu?.selected || "Salon Inventory"));

        if (isEdit) {
            fetchProductData(id);
        }
    }, [id]);

    const fetchProductData = async (productId) => {
        setLoading(true);
        try {
            // Fetching from new table. Assuming getByPk works or we need a specific endpoint. 
            // Since we didn't add a specific "getOne" to SalonInventoryController, let's use the generic getByPk if available 
            // OR we can rely on the data passed via navigation state? No, better fetch.
            // Let's try CommonAPI.getByPk assuming the backend supports 'salon_inventory_product' table name lookup.
            const response = await API.CommonAPI.getByPk(productId, "salon_inventory_product");
            if (response.data) {
                const data = response.data;
                setName(data.name || "");
                setBrand(data.brand || "");
                setStockQuantity(data.stock_quantity ?? 0);
                setLowStockThreshold(data.low_stock_threshold ?? 10);
                setUsagePerClient(data.usage_per_client ?? 0);
                setSku(data.sku ?? "");
                setStatus(data.status || "active");
            }
        } catch (err) {
            toastAndNavigate(dispatch, true, "error", err?.response?.data?.msg || "Failed to load product data");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const productData = {
                name,
                brand,
                stock_quantity: stockQuantity,
                low_stock_threshold: lowStockThreshold,
                usage_per_client: usagePerClient,
                sku: sku || null,
                status,
                salonId: targetSalonId // Pass the resolved salonId
            };

            if (isEdit) {
                await API.SalonInventoryAPI.updateProduct({ ...productData, id: parseInt(id) });
                // Return to listing. If we have a targetSalonId, maybe we should return to the filtered list?
                const returnUrl = targetSalonId && !storedSalon?.id ? `/salon-inventory/listing?salon_id=${targetSalonId}` : "/salon-inventory/listing";
                toastAndNavigate(dispatch, true, "success", "Product Updated Successfully", navigateTo, returnUrl);
            } else {
                await API.SalonInventoryAPI.createProduct(productData);
                const returnUrl = targetSalonId && !storedSalon?.id ? `/salon-inventory/listing?salon_id=${targetSalonId}` : "/salon-inventory/listing";
                toastAndNavigate(dispatch, true, "success", "Product Created Successfully", navigateTo, returnUrl);
            }
            setDirty(false);
        } catch (err) {
            toastAndNavigate(dispatch, true, "error", err?.response?.data?.msg || "Failed to save product");
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
                    {isEdit ? "Edit Product" : "Create Product"}
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
                {/* Product Details Section */}
                <Typography variant="h5" color={colors.greenAccent[400]} mb={2} fontWeight="bold">
                    Product Details
                </Typography>

                <Box display="grid" gap={2} gridTemplateColumns="repeat(12, 1fr)" mb={3}>
                    <Box sx={{ gridColumn: "span 6" }}>
                        <TextField
                            fullWidth
                            variant="filled"
                            label="Product Name"
                            value={name}
                            onChange={handleFieldChange(setName)}
                            required
                        />
                    </Box>
                    <Box sx={{ gridColumn: "span 6" }}>
                        <TextField
                            fullWidth
                            variant="filled"
                            label="Brand"
                            value={brand}
                            onChange={handleFieldChange(setBrand)}
                            required
                        />
                    </Box>
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
                            label="Low Weight Alert Threshold (g/ml)"
                            value={lowStockThreshold}
                            onChange={(e) => { setLowStockThreshold(parseFloat(e.target.value) || 0); setDirty(true); }}
                            InputProps={{ inputProps: { min: 0, step: "any" } }}
                        />
                    </Box>
                    <Box sx={{ gridColumn: "span 6" }}>
                        <TextField
                            fullWidth
                            variant="filled"
                            type="number"
                            label="Avg. Usage per Client (g/ml)"
                            value={usagePerClient}
                            onChange={(e) => { setUsagePerClient(parseFloat(e.target.value) || 0); setDirty(true); }}
                            InputProps={{ inputProps: { min: 0, step: "any" } }}
                            helperText="Used to calculate how many clients can be served"
                        />
                    </Box>
                </Box>

                <Divider sx={{ my: 3, borderColor: colors.grey[700] }} />

                {/* Inventory Section */}
                <Typography variant="h5" color={colors.greenAccent[400]} mb={2} fontWeight="bold">
                    Weight Management
                </Typography>

                <Box display="grid" gap={2} gridTemplateColumns="repeat(12, 1fr)">
                    <Box sx={{ gridColumn: "span 12" }}>
                        <Typography variant="h6" color={colors.grey[100]} mb={2}>
                            Current Weight (g/ml)
                        </Typography>

                        <Box display="flex" alignItems="center" gap={2}>
                            <IconButton
                                onClick={() => handleQuickAdjust(-100)}
                                sx={{
                                    backgroundColor: colors.redAccent[700],
                                    '&:hover': { backgroundColor: colors.redAccent[600] }
                                }}
                            >
                                <Typography color={colors.grey[100]}>-100</Typography>
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
                                onChange={(e) => { setStockQuantity(parseFloat(e.target.value) || 0); setDirty(true); }}
                                InputProps={{
                                    inputProps: { min: 0, step: "any", style: { textAlign: 'center', fontSize: '1.5rem' } }
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
                                onClick={() => handleQuickAdjust(100)}
                                sx={{
                                    backgroundColor: colors.greenAccent[700],
                                    '&:hover': { backgroundColor: colors.greenAccent[600] }
                                }}
                            >
                                <Typography color={colors.grey[100]}>+100</Typography>
                            </IconButton>
                        </Box>

                        {stockQuantity <= lowStockThreshold && stockQuantity > 0 && (
                            <Typography color="#FFD700" mt={1}>
                                ⚠️ Weight is below alert threshold!
                            </Typography>
                        )}
                        {stockQuantity === 0 && (
                            <Typography color={colors.redAccent[400]} mt={1}>
                                ⚠️ Empty / Out of stock!
                            </Typography>
                        )}
                    </Box>
                </Box>

                <Box display="flex" justifyContent="end" mt={4} gap={2}>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={() => navigateTo(targetSalonId && !storedSalon?.id ? `/salon-inventory/listing?salon_id=${targetSalonId}` : "/salon-inventory/listing")}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        color="success"
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={!dirty || loading || !name || !brand}
                    >
                        {isEdit ? "Update Product" : "Create Product"}
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
