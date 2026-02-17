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
    Card, CardContent, Divider, IconButton, FormControl,
    InputLabel, Select, MenuItem, Switch, FormControlLabel
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import InventoryIcon from '@mui/icons-material/Inventory';

import API from "../../apis";
import Loader from "../common/Loader";
import Toast from "../common/Toast";

import { setMenuItem } from "../../redux/actions/NavigationAction";
import { tokens, themeSettings } from "../../theme";
import { Utility } from "../utility";

const InventoryFormComponent = () => {
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    // Product fields
    const [name, setName] = useState("");
    const [brand, setBrand] = useState("");
    const [price, setPrice] = useState("");
    const [color, setColor] = useState("");
    const [capacity, setCapacity] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("active");
    const [isHome, setIsHome] = useState(false);
    const [isBestseller, setIsBestseller] = useState(false);
    const [discountedPrice, setDiscountedPrice] = useState("");
    const [discountPercent, setDiscountPercent] = useState("");

    // Inventory fields
    const [stockQuantity, setStockQuantity] = useState(0);
    const [lowStockThreshold, setLowStockThreshold] = useState(10);
    const [sku, setSku] = useState("");

    const [dirty, setDirty] = useState(false);

    const navigateTo = useNavigate();
    const userParams = useParams();
    const { pathname } = useLocation();
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
        dispatch(setMenuItem(selectedMenu?.selected || "Product Inventory"));

        if (id) {
            setIsEditMode(true);
            fetchProductData(id);
        } else {
            setIsEditMode(false);
        }
    }, [id]);

    const fetchProductData = async (productId) => {
        setLoading(true);
        try {
            const response = await API.CommonAPI.getByPk(productId, "product");
            if (response.data) {
                const data = response.data;
                setName(data.name || "");
                setBrand(data.brand || "");
                setPrice(data.price || "");
                setColor(data.color || "");
                setCapacity(data.capacity || "");
                setDescription(data.description || "");
                setStatus(data.status || "active");
                setIsHome(data.is_home || false);
                setIsBestseller(data.is_bestseller || false);
                setDiscountedPrice(data.discounted_price || "");
                setDiscountPercent(data.discount_percent || "");
                setStockQuantity(data.stock_quantity ?? 0);
                setLowStockThreshold(data.low_stock_threshold ?? 10);
                setSku(data.sku ?? "");
            }
        } catch (err) {
            toastAndNavigate(dispatch, true, "error", err?.response?.data?.msg || "Failed to load product");
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

            await API.InventoryAPI.updateInventory(inventoryData);
            toastAndNavigate(dispatch, true, "success", "Inventory Updated Successfully");
            setDirty(false); // Reset dirty state since we saved
        } catch (err) {
            toastAndNavigate(dispatch, true, "error", err?.response?.data?.msg || "Failed to update inventory");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        // Validation
        if (!name.trim()) {
            toastAndNavigate(dispatch, true, "error", "Product name is required");
            return;
        }
        if (!brand.trim()) {
            toastAndNavigate(dispatch, true, "error", "Brand is required");
            return;
        }

        setLoading(true);
        try {
            const productData = {
                name,
                brand,
                price,
                color,
                capacity,
                description,
                status,
                is_home: isHome,
                is_bestseller: isBestseller,
                discounted_price: discountedPrice ? parseFloat(discountedPrice) : null,
                discount_percent: discountPercent ? parseFloat(discountPercent) : null,
                stock_quantity: stockQuantity,
                low_stock_threshold: lowStockThreshold,
                sku: sku || null
            };

            if (isEditMode) {
                await API.ProductAPI.updateProduct({ id: parseInt(id), ...productData });
                toastAndNavigate(dispatch, true, "success", "Product Updated Successfully", navigateTo, "/inventory/listing");
            } else {
                await API.ProductAPI.createProduct(productData);
                toastAndNavigate(dispatch, true, "success", "Product Created Successfully", navigateTo, "/inventory/listing");
            }
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
                <InventoryIcon sx={{ color: colors.greenAccent[500], fontSize: 32 }} />
                <Typography
                    fontFamily={typography.fontFamily}
                    fontSize={typography.h2.fontSize}
                    color={colors.grey[100]}
                    fontWeight="bold"
                >
                    {isEditMode ? "Edit Product Inventory" : "Create New Product"}
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
                            label="Product Name *"
                            value={name}
                            onChange={handleFieldChange(setName)}
                            required
                        />
                    </Box>
                    <Box sx={{ gridColumn: "span 6" }}>
                        <TextField
                            fullWidth
                            variant="filled"
                            label="Brand *"
                            value={brand}
                            onChange={handleFieldChange(setBrand)}
                            required
                        />
                    </Box>
                    <Box sx={{ gridColumn: "span 4" }}>
                        <TextField
                            fullWidth
                            variant="filled"
                            label="Price"
                            value={price}
                            onChange={handleFieldChange(setPrice)}
                        />
                    </Box>
                    <Box sx={{ gridColumn: "span 4" }}>
                        <TextField
                            fullWidth
                            variant="filled"
                            label="Discounted Price"
                            type="number"
                            value={discountedPrice}
                            onChange={handleFieldChange(setDiscountedPrice)}
                        />
                    </Box>
                    <Box sx={{ gridColumn: "span 4" }}>
                        <TextField
                            fullWidth
                            variant="filled"
                            label="Discount %"
                            type="number"
                            value={discountPercent}
                            onChange={handleFieldChange(setDiscountPercent)}
                        />
                    </Box>
                    <Box sx={{ gridColumn: "span 4" }}>
                        <TextField
                            fullWidth
                            variant="filled"
                            label="Color"
                            value={color}
                            onChange={handleFieldChange(setColor)}
                        />
                    </Box>
                    <Box sx={{ gridColumn: "span 4" }}>
                        <TextField
                            fullWidth
                            variant="filled"
                            label="Capacity"
                            value={capacity}
                            onChange={handleFieldChange(setCapacity)}
                        />
                    </Box>
                    <Box sx={{ gridColumn: "span 4" }}>
                        <FormControl fullWidth variant="filled">
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={status}
                                onChange={(e) => { setStatus(e.target.value); setDirty(true); }}
                            >
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="inactive">Inactive</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ gridColumn: "span 12" }}>
                        <TextField
                            fullWidth
                            variant="filled"
                            label="Description"
                            value={description}
                            onChange={handleFieldChange(setDescription)}
                            multiline
                            rows={3}
                        />
                    </Box>
                    <Box sx={{ gridColumn: "span 6" }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isHome}
                                    onChange={(e) => { setIsHome(e.target.checked); setDirty(true); }}
                                    color="success"
                                />
                            }
                            label="Show on Home Page"
                        />
                    </Box>
                    <Box sx={{ gridColumn: "span 6" }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isBestseller}
                                    onChange={(e) => { setIsBestseller(e.target.checked); setDirty(true); }}
                                    color="success"
                                />
                            }
                            label="Mark as Bestseller"
                        />
                    </Box>
                </Box>

                <Divider sx={{ my: 3, borderColor: colors.grey[700] }} />

                {/* Inventory Section */}
                <Typography variant="h5" color={colors.greenAccent[400]} mb={2} fontWeight="bold">
                    Inventory Details
                </Typography>

                <Box display="grid" gap={2} gridTemplateColumns="repeat(12, 1fr)">
                    <Box sx={{ gridColumn: "span 4" }}>
                        <TextField
                            fullWidth
                            variant="filled"
                            label="SKU (Stock Keeping Unit)"
                            value={sku}
                            onChange={handleFieldChange(setSku)}
                            placeholder="e.g., PROD-001"
                        />
                    </Box>
                    <Box sx={{ gridColumn: "span 4" }}>
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
                    <Box sx={{ gridColumn: "span 4" }} />

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

                            {isEditMode && (
                                <Button
                                    sx={{ ml: 2 }}
                                    color="secondary"
                                    variant="contained"
                                    onClick={handleUpdateStock}
                                    disabled={loading}
                                >
                                    Update Stock Only
                                </Button>
                            )}
                        </Box>

                        {stockQuantity <= lowStockThreshold && stockQuantity > 0 && (
                            <Typography color="#FFD700" mt={1}>
                                ⚠️ Stock is below threshold!
                            </Typography>
                        )}
                        {stockQuantity === 0 && (
                            <Typography color={colors.redAccent[400]} mt={1}>
                                ⚠️ Product is out of stock!
                            </Typography>
                        )}
                    </Box>
                </Box>

                <Box display="flex" justifyContent="end" mt={4} gap={2}>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={() => navigateTo("/inventory/listing")}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        color="success"
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={!dirty || loading}
                    >
                        {isEditMode ? "Update All Details" : "Create Product"}
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

export default InventoryFormComponent;
