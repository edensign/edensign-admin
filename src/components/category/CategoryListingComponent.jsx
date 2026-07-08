/**
 * Copyright © 2026, Eden Sign Inc. ALL RIGHTS RESERVED.
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Card, CardContent, Grid, useTheme, Fade, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert, CircularProgress } from "@mui/material";
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import CategoryIcon from '@mui/icons-material/Category';

import API from "../../apis";
import { tokens } from "../../theme";
import Loader from "../common/Loader";

const CategoryListingComponent = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigateTo = useNavigate();
    const isMobile = useMediaQuery("(max-width:600px)");

    const [categories, setCategories] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    const [openDialog, setOpenDialog] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryDesc, setNewCategoryDesc] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState({ open: false, severity: "success", message: "" });

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;

        setSubmitting(true);
        try {
            const res = await API.CategoryAPI.create({
                name: newCategoryName.trim(),
                description: newCategoryDesc.trim()
            });

            if (res && res.status === "Success") {
                setToast({
                    open: true,
                    severity: "success",
                    message: "Category created successfully!"
                });
                setOpenDialog(false);
                setNewCategoryName("");
                setNewCategoryDesc("");
                
                // Refresh categories list dynamically
                const catRes = await API.CategoryAPI.getAll();
                if (catRes && catRes.status === "Success") {
                    setCategories(catRes.data);
                }
            } else {
                setToast({
                    open: true,
                    severity: "error",
                    message: res.message || "Failed to create category."
                });
            }
        } catch (err) {
            console.error("Error creating category:", err);
            setToast({
                open: true,
                severity: "error",
                message: err.response?.data?.msg || err.message || "An error occurred."
            });
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const catRes = await API.CategoryAPI.getAll();
                const compRes = await API.CompanyAPI.getAll(false, 0, 100); // load up to 100 companies

                if (catRes && catRes.status === "Success") {
                    setCategories(catRes.data);
                }
                if (compRes && compRes.status === "Success") {
                    setCompanies(compRes.data.rows || []);
                }
            } catch (err) {
                console.error("Failed to load category/company details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Get count of companies in a category
    const getCompanyCount = (categoryId) => {
        return companies.filter(c => Number(c.category_id) === Number(categoryId)).length;
    };

    // Category background gradients based on theme and category name
    const getGradient = (index) => {
        const gradients = [
            "linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)",   // Skin Care
            "linear-gradient(135deg, #4E65FF 0%, #92EFFD 100%)",   // Skin Treatment
            "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",   // Hair Care
            "linear-gradient(135deg, #FC466B 0%, #3F5EFB 100%)",   // Hair Treatment
            "linear-gradient(135deg, #7F00FF 0%, #E100FF 100%)",   // Furniture
            "linear-gradient(135deg, #F9D423 0%, #FF4E50 100%)"    // machine
        ];
        return gradients[index % gradients.length];
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <Box m="20px">
            {/* Header section */}
            <Box
                borderRadius="12px"
                padding="16px 24px"
                backgroundColor={theme.palette.mode === 'dark' ? colors.primary[400] : '#ffffff'}
                border={`1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(92,107,192,0.08)'}`}
                boxShadow={theme.palette.mode === 'dark' ? 'none' : '0 4px 12px rgba(92,107,192,0.03)'}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexDirection={isMobile ? "column" : "row"}
                gap="15px"
                mb="30px"
            >
                <Box>
                    <Typography
                        variant="h2"
                        fontWeight="800"
                        color={theme.palette.mode === 'dark' ? '#f1f5f9' : '#1e293b'}
                        sx={{ letterSpacing: "-0.01em" }}
                    >
                        Product Categories
                    </Typography>
                    <Typography
                        variant="body2"
                        color={theme.palette.mode === "dark" ? colors.greenAccent[400] : "#64748b"}
                        mt="5px"
                    >
                        Explore categories, manage affiliated companies, and expand distributor chains.
                    </Typography>
                </Box>
                <Box display="flex" gap="10px" width={isMobile ? "100%" : "auto"} flexDirection={isMobile ? "column" : "row"}>
                    <Button
                        fullWidth={isMobile}
                        variant="contained"
                        onClick={() => setOpenDialog(true)}
                        startIcon={<CategoryIcon />}
                        sx={{
                            borderRadius: "8px",
                            fontWeight: "bold",
                            textTransform: "none",
                            padding: "8px 16px",
                            background: "linear-gradient(90deg, #852df2 0%, #b23af7 100%)",
                            color: "#ffffff",
                            whiteSpace: "nowrap",
                            "&:hover": { opacity: 0.9 }
                        }}
                    >
                        Create Category
                    </Button>
                    <Button
                        fullWidth={isMobile}
                        variant="contained"
                        startIcon={<AddBusinessIcon />}
                        onClick={() => navigateTo("/company/create")}
                        sx={{
                            borderRadius: "8px",
                            fontWeight: "bold",
                            textTransform: "none",
                            padding: "8px 16px",
                            backgroundColor: colors.blueAccent[500],
                            color: "#ffffff",
                            whiteSpace: "nowrap",
                            "&:hover": { backgroundColor: colors.blueAccent[600] }
                        }}
                    >
                        Create Company
                    </Button>
                    <Button
                        fullWidth={isMobile}
                        variant="outlined"
                        onClick={() => navigateTo("/company/listing")}
                        sx={{
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: "bold",
                            padding: "8px 16px",
                            whiteSpace: "nowrap",
                            borderColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)",
                            color: theme.palette.mode === "dark" ? "#cbd5e1" : "#475569",
                            "&:hover": { borderColor: "#5c6bc0", color: "#5c6bc0", backgroundColor: "rgba(92, 107, 192, 0.04)" }
                        }}
                    >
                        View Companies
                    </Button>
                </Box>
            </Box>

            {/* Fallback info when categories are empty/not loaded */}
            {categories.length === 0 ? (
                <Box 
                    display="flex" 
                    flexDirection="column" 
                    alignItems="center" 
                    justifyContent="center" 
                    p="40px" 
                    mt="40px"
                    borderRadius="12px"
                    bgcolor={colors.primary[400]}
                    border="1px dashed rgba(255,255,255,0.1)"
                    sx={{ boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
                >
                    <Typography variant="h3" color={colors.grey[100]} mb="15px" fontWeight="bold" textAlign="center">
                        No Categories Loaded
                    </Typography>
                    <Typography variant="h5" color={colors.grey[200]} mb="25px" textAlign="center" maxWidth="600px">
                        This usually occurs because the database schema migrations have not been run. Please verify that the SQL script <strong>company_distributor_setup.sql</strong> has been run in your Supabase SQL Editor.
                    </Typography>
                    <Button 
                        variant="contained" 
                        color="secondary"
                        onClick={() => window.location.reload()}
                        sx={{ textTransform: "none", borderRadius: "6px", fontWeight: "bold", px: 4 }}
                    >
                        Reload Page
                    </Button>
                </Box>
            ) : (
                /* Categories Grid */
                <Grid container spacing={3}>
                    {categories.map((category, index) => {
                        const count = getCompanyCount(category.id);
                        return (
                            <Grid item xs={12} sm={6} md={4} key={category.id}>
                                <Fade in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                                    <Card
                                        sx={{
                                            background: colors.primary[400],
                                            borderRadius: "16px",
                                            boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                                            border: "1px solid rgba(255, 255, 255, 0.05)",
                                            overflow: "hidden",
                                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                            "&:hover": {
                                                transform: "translateY(-6px)",
                                                boxShadow: "0 12px 40px rgba(0,0,0,0.25)"
                                            }
                                        }}
                                    >
                                        {/* Category Gradient Top Bar */}
                                        <Box
                                            height="120px"
                                            display="flex"
                                            flexDirection="column"
                                            justifyContent="center"
                                            padding="20px"
                                            sx={{ background: getGradient(index) }}
                                        >
                                            <Typography variant="h3" fontWeight="bold" color="#ffffff">
                                                {category.name}
                                            </Typography>
                                            <Typography variant="body2" color="rgba(255,255,255,0.8)" mt="5px">
                                                {category.description || "Deals with standard category products"}
                                            </Typography>
                                        </Box>

                                        <CardContent sx={{ p: "20px" }}>
                                            {/* Status */}
                                            <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
                                                <Typography variant="h5" color={colors.grey[100]} display="flex" alignItems="center">
                                                    <CorporateFareIcon sx={{ mr: 1, color: colors.greenAccent[400] }} />
                                                    Affiliated Companies:
                                                </Typography>
                                                <Typography variant="h3" fontWeight="bold" color={colors.greenAccent[500]}>
                                                    {count}
                                                </Typography>
                                            </Box>

                                            {/* Company Names Mini List */}
                                            {count > 0 ? (
                                                <Box mb="20px" sx={{ maxHeight: "80px", overflowY: "auto" }}>
                                                    {companies
                                                        .filter(c => Number(c.category_id) === Number(category.id))
                                                        .map(c => (
                                                            <Typography key={c.id} variant="body2" color={colors.grey[200]} sx={{ mb: 0.5, borderLeft: `2px solid ${colors.greenAccent[500]}`, pl: 1 }}>
                                                                {c.name}
                                                            </Typography>
                                                        ))
                                                    }
                                                </Box>
                                            ) : (
                                                <Typography variant="body2" color={colors.grey[300]} italic sx={{ mb: "20px" }}>
                                                    No companies associated yet.
                                                </Typography>
                                            )}

                                            {/* Actions */}
                                            <Box display="flex" gap="10px">
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    color="success"
                                                    startIcon={<AddBusinessIcon />}
                                                    onClick={() => navigateTo("/company/create", { state: { categoryId: category.id } })}
                                                    sx={{
                                                        borderRadius: "8px",
                                                        fontWeight: "bold",
                                                        textTransform: "none",
                                                        background: "linear-gradient(90deg, #11998e 0%, #38ef7d 100%)",
                                                        "&:hover": {
                                                            opacity: 0.9
                                                        }
                                                    }}
                                                >
                                                    Add Company
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="info"
                                                    onClick={() => navigateTo("/company/listing", { state: { categoryId: category.id } })}
                                                    sx={{
                                                        borderRadius: "8px",
                                                        textTransform: "none",
                                                        fontWeight: "bold",
                                                        borderColor: colors.blueAccent[500],
                                                        color: colors.grey[100]
                                                    }}
                                                >
                                                    View
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Fade>
                        </Grid>
                    );
                })}
            </Grid>
            )}

            {/* Create Category Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                aria-labelledby="category-dialog-title"
                fullWidth
                maxWidth="sm"
                sx={{
                    "& .MuiPaper-root": {
                        background: colors.primary[400],
                        borderRadius: "16px",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                        boxShadow: "0 12px 40px rgba(0,0,0,0.25)"
                    }
                }}
            >
                <DialogTitle id="category-dialog-title" sx={{ p: "24px 24px 8px 24px" }}>
                    <Typography variant="h2" fontWeight="bold" color={colors.grey[100]}>
                        Create New Category
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ p: "8px 24px 24px 24px" }}>
                    <Box display="flex" flexDirection="column" gap="20px" mt="10px">
                        <TextField
                            label="Category Name *"
                            variant="filled"
                            fullWidth
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            sx={{
                                "& .MuiFilledInput-root": {
                                    backgroundColor: "rgba(255,255,255,0.05)",
                                    "&:hover": { backgroundColor: "rgba(255,255,255,0.08)" }
                                }
                            }}
                        />
                        <TextField
                            label="Description"
                            variant="filled"
                            fullWidth
                            multiline
                            rows={3}
                            value={newCategoryDesc}
                            onChange={(e) => setNewCategoryDesc(e.target.value)}
                            sx={{
                                "& .MuiFilledInput-root": {
                                    backgroundColor: "rgba(255,255,255,0.05)",
                                    "&:hover": { backgroundColor: "rgba(255,255,255,0.08)" }
                                }
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: "16px 24px 24px 24px" }}>
                    <Button
                        onClick={() => {
                            setOpenDialog(false);
                            setNewCategoryName("");
                            setNewCategoryDesc("");
                        }}
                        variant="outlined"
                        disabled={submitting}
                        sx={{
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: "bold",
                            borderColor: colors.grey[300],
                            color: colors.grey[100]
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreateCategory}
                        variant="contained"
                        disabled={submitting || !newCategoryName.trim()}
                        sx={{
                            borderRadius: "8px",
                            fontWeight: "bold",
                            textTransform: "none",
                            background: "linear-gradient(90deg, #11998e 0%, #38ef7d 100%)",
                            "&:hover": { opacity: 0.9 }
                        }}
                    >
                        {submitting ? <CircularProgress size={20} color="inherit" /> : "Create Category"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Notification Toast */}
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={toast.open}
                autoHideDuration={4000}
                onClose={() => setToast({ ...toast, open: false })}
            >
                <Alert
                    severity={toast.severity}
                    variant="filled"
                    onClose={() => setToast({ ...toast, open: false })}
                    sx={{ width: "100%" }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CategoryListingComponent;
