/**
 * Copyright © 2026, Eden Sign Inc. ALL RIGHTS RESERVED.
 */

import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, Card, CardContent, Grid, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, useTheme } from "@mui/material";
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SaveIcon from '@mui/icons-material/Save';

import API from "../../apis";
import { tokens } from "../../theme";
import Loader from "../common/Loader";
import Toast from "../common/Toast";
import { useDispatch, useSelector } from "react-redux";
import { Utility } from "../utility";

const CompanyProfileComponent = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch();
    const { toastAndNavigate } = Utility();
    const toastInfo = useSelector(state => state.toastInfo);

    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [company, setCompany] = useState(null);
    const [products, setProducts] = useState([]);
    
    // Form States
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [pricingInfo, setPricingInfo] = useState("");
    const [offerInfo, setOfferInfo] = useState("");

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Fetch Company profile
            const profileRes = await API.CompanyAPI.getProfile();
            if (profileRes && profileRes.data && profileRes.data.status === "Success") {
                const compData = profileRes.data.data;
                setCompany(compData);
                setName(compData.name || "");
                setEmail(compData.email || "");
                setContactNo(compData.contact_no || "");
                setAddress(compData.address || "");
                setDescription(compData.description || "");
                setPricingInfo(compData.pricing_info || "");
                setOfferInfo(compData.offer_info || "");

                // 2. Fetch Products associated with this company
                const prodRes = await API.ProductAPI.getAll({ key: "company_id", value: compData.id }, 0, 100);
                if (prodRes && prodRes.status === "Success") {
                    setProducts(prodRes.data.rows || []);
                }
            } else {
                setError(`Profile API returned invalid response: ${JSON.stringify(profileRes)}`);
            }
        } catch (err) {
            console.error("Failed to load company profile or products:", err);
            setError(err.message || String(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                id: company.id,
                name,
                email,
                contact_no: contactNo,
                address,
                description,
                pricing_info: pricingInfo,
                offer_info: offerInfo
            };

            const res = await API.CompanyAPI.updateCompany(payload);
            if (res && res.data.status === "Success") {
                toastAndNavigate(dispatch, true, "success", "Profile updated successfully");
                loadData();
            } else {
                toastAndNavigate(dispatch, true, "error", res?.data?.msg || "Update failed");
            }
        } catch (err) {
            console.error("Profile update error:", err);
            toastAndNavigate(dispatch, true, "error", "An error occurred during save");
        } finally {
            setLoading(false);
        }
    };

    // Handle inline change in product pricing table
    const handleProductChange = (index, field, value) => {
        const updated = [...products];
        updated[index][field] = value;

        // Auto-calculate discount percentages or discounted prices if needed
        if (field === "price" || field === "discount_percent") {
            const price = parseFloat(updated[index].price) || 0;
            const discount = parseFloat(updated[index].discount_percent) || 0;
            updated[index].discounted_price = (price - (price * discount) / 100).toFixed(2);
        } else if (field === "discounted_price") {
            const price = parseFloat(updated[index].price) || 0;
            const discPrice = parseFloat(updated[index].discounted_price) || 0;
            if (price > 0) {
                updated[index].discount_percent = (((price - discPrice) / price) * 100).toFixed(1);
            }
        }

        setProducts(updated);
    };

    const handlePricingSubmit = async () => {
        setLoading(true);
        try {
            const productsPayload = products.map(p => ({
                id: p.id,
                price: p.price,
                discounted_price: p.discounted_price,
                discount_percent: p.discount_percent
            }));

            const res = await API.CompanyAPI.updatePricingOffers(company.id, productsPayload);
            if (res && res.data.status === "Success") {
                toastAndNavigate(dispatch, true, "success", "Pricing and Offers updated successfully");
                loadData();
            } else {
                toastAndNavigate(dispatch, true, "error", res?.data?.msg || "Update failed");
            }
        } catch (err) {
            console.error("Pricing update error:", err);
            toastAndNavigate(dispatch, true, "error", "An error occurred during save");
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return (
            <Box m="20px" p="20px" bgcolor="#ffebee" borderRadius="8px" border="1px solid #f44336">
                <Typography variant="h3" color="#c62828" fontWeight="bold">
                    Error Loading Profile
                </Typography>
                <Typography variant="h5" color="#b71c1c" mt="10px">
                    {error}
                </Typography>
                <Button 
                    variant="contained" 
                    color="error" 
                    onClick={loadData} 
                    sx={{ mt: "20px", textTransform: "none" }}
                >
                    Retry Load
                </Button>
            </Box>
        );
    }

    if (loading && !company) {
        return <Loader />;
    }

    return (
        <Box m="20px">
            <Box mb="20px">
                <Typography variant="h1" fontWeight="bold" color={colors.grey[100]}>
                    Company Profile
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[400]} mt="5px">
                    Manage your company details and update product pricing and offers.
                </Typography>
            </Box>

            <Tabs
                value={activeTab}
                onChange={(e, val) => setActiveTab(val)}
                textColor="secondary"
                indicatorColor="secondary"
                sx={{
                    mb: "20px",
                    borderBottom: `1px solid ${colors.primary[100]}`
                }}
            >
                <Tab label="Company Details" icon={<CorporateFareIcon />} iconPosition="start" sx={{ textTransform: "none", fontSize: "1rem" }} />
                <Tab label="Pricing & Offers" icon={<LocalOfferIcon />} iconPosition="start" sx={{ textTransform: "none", fontSize: "1rem" }} />
            </Tabs>

            {activeTab === 0 && (
                <Card sx={{ bgcolor: colors.primary[400], borderRadius: "10px", boxShadow: 3 }}>
                    <CardContent sx={{ p: "30px" }}>
                        <form onSubmit={handleProfileSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        label="Company Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        label="Category"
                                        value={company?.category?.name || "N/A"}
                                        disabled
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        label="Company Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        label="Contact Number"
                                        value={contactNo}
                                        onChange={(e) => setContactNo(e.target.value)}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        label="Address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        label="Company Description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        multiline
                                        rows={3}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="h4" fontWeight="bold" color={colors.greenAccent[400]} mt={2} mb={1}>
                                        General Pricing & Offers Info
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        label="Pricing Terms / Rules"
                                        value={pricingInfo}
                                        onChange={(e) => setPricingInfo(e.target.value)}
                                        multiline
                                        rows={2}
                                        placeholder="e.g. Standard 10% wholesale markup applies..."
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        label="Seasonal Offers / Discount Details"
                                        value={offerInfo}
                                        onChange={(e) => setOfferInfo(e.target.value)}
                                        multiline
                                        rows={2}
                                        placeholder="e.g. Buy 10 get 1 free on hair treatments..."
                                    />
                                </Grid>
                            </Grid>
                            <Box display="flex" justifyContent="end" mt="30px">
                                <Button
                                    type="submit"
                                    color="secondary"
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    sx={{ fontWeight: "bold", textTransform: "none", borderRadius: "6px" }}
                                >
                                    Save Profile Changes
                                </Button>
                            </Box>
                        </form>
                    </CardContent>
                </Card>
            )}

            {activeTab === 1 && (
                <Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
                        <Typography variant="h4" fontWeight="bold" color={colors.grey[100]}>
                            Affiliated Product Listings
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<SaveIcon />}
                            onClick={handlePricingSubmit}
                            sx={{ fontWeight: "bold", textTransform: "none", borderRadius: "6px" }}
                        >
                            Save Pricing Changes
                        </Button>
                    </Box>

                    {products.length > 0 ? (
                        <TableContainer component={Paper} sx={{ bgcolor: colors.primary[400], borderRadius: "10px" }}>
                            <Table>
                                <TableHead sx={{ bgcolor: colors.blueAccent[700] }}>
                                    <TableRow>
                                        <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Product Name</TableCell>
                                        <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Brand</TableCell>
                                        <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>SKU</TableCell>
                                        <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Original Price</TableCell>
                                        <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Discount (%)</TableCell>
                                        <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Discounted Price</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {products.map((row, index) => (
                                        <TableRow key={row.id}>
                                            <TableCell sx={{ color: colors.grey[100] }}>{row.name}</TableCell>
                                            <TableCell sx={{ color: colors.grey[100] }}>{row.brand}</TableCell>
                                            <TableCell sx={{ color: colors.grey[100] }}>{row.sku || "N/A"}</TableCell>
                                            <TableCell>
                                                <TextField
                                                    size="small"
                                                    value={row.price || ""}
                                                    onChange={(e) => handleProductChange(index, "price", e.target.value)}
                                                    variant="outlined"
                                                    sx={{ maxWidth: "120px" }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    size="small"
                                                    value={row.discount_percent || ""}
                                                    onChange={(e) => handleProductChange(index, "discount_percent", e.target.value)}
                                                    variant="outlined"
                                                    sx={{ maxWidth: "100px" }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    size="small"
                                                    value={row.discounted_price || ""}
                                                    onChange={(e) => handleProductChange(index, "discounted_price", e.target.value)}
                                                    variant="outlined"
                                                    sx={{ maxWidth: "120px" }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Card sx={{ bgcolor: colors.primary[400], p: 3, textAlign: "center" }}>
                            <Typography variant="h5" color={colors.grey[200]}>
                                No products have been created by your distributors yet.
                            </Typography>
                        </Card>
                    )}
                </Box>
            )}

            <Toast
                alerting={toastInfo.toastAlert}
                severity={toastInfo.toastSeverity}
                message={toastInfo.toastMessage}
            />
            {loading && <Loader />}
        </Box>
    );
};

export default CompanyProfileComponent;
