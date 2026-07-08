/**
 * Copyright © 2026, Eden Sign Inc. ALL RIGHTS RESERVED.
 */

import React, { useEffect, useState } from "react";
import { Box, Button, Typography, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, CircularProgress, InputAdornment } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import API from "../../apis";
import { tokens } from "../../theme";
import { Utility } from "../utility";
import { useDispatch, useSelector } from "react-redux";
import { setMenuItem } from "../../redux/actions/NavigationAction";
import Toast from "../common/Toast";

const CategoryManageComponent = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { getLocalStorage, toastAndNavigate } = Utility();
    const dispatch = useDispatch();
    const toastInfo = useSelector(state => state.toastInfo);

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteCategoryId, setDeleteCategoryId] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [formData, setFormData] = useState({ id: "", name: "", description: "" });

    useEffect(() => {
        dispatch(setMenuItem("Manage Categories"));
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await API.CategoryAPI.getAll();
            if (res && res.status === "Success") {
                setRows(res.data || []);
            }
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const handleOpen = (row = null) => {
        if (row) {
            setFormData({ id: row.id, name: row.name, description: row.description || "" });
        } else {
            setFormData({ id: "", name: "", description: "" });
        }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleSave = async () => {
        if (!formData.name.trim()) {
            toastAndNavigate(dispatch, true, "error", "Category name is required", () => {}, null);
            return;
        }

        setSubmitting(true);
        try {
            if (formData.id) {
                const res = await API.CategoryAPI.update(formData.id, {
                    name: formData.name.trim(),
                    description: formData.description.trim()
                });
                if (res && res.status === "Success") {
                    toastAndNavigate(dispatch, true, "success", "Category updated successfully", () => {}, null);
                    handleClose();
                    fetchCategories();
                } else {
                    throw new Error(res.message || "Failed to update category");
                }
            } else {
                const res = await API.CategoryAPI.create({
                    name: formData.name.trim(),
                    description: formData.description.trim()
                });
                if (res && res.status === "Success") {
                    toastAndNavigate(dispatch, true, "success", "Category created successfully", () => {}, null);
                    handleClose();
                    fetchCategories();
                } else {
                    throw new Error(res.message || "Failed to create category");
                }
            }
        } catch (error) {
            console.error("Save category error:", error);
            toastAndNavigate(dispatch, true, "error", error.message || "Failed to save category", () => {}, null);
        } finally {
            setSubmitting(false);
        }
    };

    const confirmDelete = (id) => {
        setDeleteCategoryId(id);
        setOpenDeleteDialog(true);
    };

    const handleDelete = async () => {
        if (!deleteCategoryId) return;
        setDeleting(true);
        try {
            const res = await API.CategoryAPI.delete(deleteCategoryId);
            if (res && res.status === "Success") {
                toastAndNavigate(dispatch, true, "success", "Category deleted successfully", () => {}, null);
                setOpenDeleteDialog(false);
                setDeleteCategoryId(null);
                fetchCategories();
            } else {
                throw new Error(res.message || "Failed to delete category");
            }
        } catch (error) {
            console.error("Delete category error:", error);
            toastAndNavigate(dispatch, true, "error", error.message || "Failed to delete category", () => {}, null);
        } finally {
            setDeleting(false);
        }
    };

    const filteredRows = rows.filter(row => 
        (row.name && row.name.toLowerCase().includes(searchText.toLowerCase())) || 
        (row.description && row.description.toLowerCase().includes(searchText.toLowerCase()))
    );

    const columns = [
        { field: "id", headerName: "ID", width: 80 },
        { field: "name", headerName: "Category Name", flex: 1, minWidth: 200 },
        { field: "description", headerName: "Description", flex: 2, minWidth: 300 },
        {
            field: "actions",
            headerName: "Actions",
            width: 150,
            sortable: false,
            renderCell: (params) => (
                <Box display="flex" gap="10px">
                    <IconButton color="info" onClick={() => handleOpen(params.row)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => confirmDelete(params.row.id)}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            )
        }
    ];

    return (
        <Box p="20px" sx={{ width: "100%", overflowX: "hidden" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} p={2}
                sx={{
                    background: colors.blueAccent[800],
                    borderRadius: "8px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
                }}
            >
                <Box>
                    <Typography variant="h2" fontWeight="bold" color={colors.grey[100]}>Manage Categories</Typography>
                    <Typography variant="h5" color={colors.greenAccent[400]} mt="5px">Create, update, and delete product categories.</Typography>
                </Box>
                <Box display="flex" gap="15px" alignItems="center">
                    <TextField
                        placeholder="Search categories..."
                        variant="outlined"
                        size="small"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: colors.grey[100] }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            backgroundColor: colors.primary[400],
                            borderRadius: "8px",
                            width: "250px",
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "transparent" },
                                "&:hover fieldset": { borderColor: colors.greenAccent[500] },
                                "&.Mui-focused fieldset": { borderColor: colors.greenAccent[500] }
                            }
                        }}
                    />
                    <Button 
                        variant="contained" 
                        color="success" 
                        startIcon={<AddIcon />}
                        onClick={() => handleOpen()}
                        sx={{
                            borderRadius: "8px",
                            fontWeight: "bold",
                            textTransform: "none",
                            padding: "8px 16px",
                            background: "linear-gradient(90deg, #11998e 0%, #38ef7d 100%)",
                            "&:hover": { opacity: 0.9 }
                        }}
                    >
                        Create Category
                    </Button>
                </Box>
            </Box>

            <Box sx={{ 
                height: "calc(100vh - 220px)", 
                width: "100%",
                "& .MuiDataGrid-root": { 
                    fontSize: "1rem",
                    border: "none",
                    background: colors.primary[400],
                    borderRadius: "8px"
                }, 
                "& .MuiDataGrid-columnHeaders": { 
                    backgroundColor: colors.blueAccent[700],
                    color: colors.grey[100],
                    fontWeight: "bold"
                },
                "& .MuiDataGrid-cell": {
                    borderBottom: `1px solid ${theme.palette.divider}`
                },
                "& .MuiDataGrid-footerContainer": {
                    backgroundColor: colors.blueAccent[700]
                },
                overflowX: "auto"
            }}>
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    loading={loading}
                    getRowId={(row) => row.id}
                />
            </Box>

            <Dialog 
                open={open} 
                onClose={handleClose}
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
                <DialogTitle sx={{ p: "24px 24px 8px 24px" }}>
                    <Typography variant="h3" fontWeight="bold" color={colors.grey[100]}>
                        {formData.id ? "Edit Category" : "Create Category"}
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ p: "8px 24px 24px 24px" }}>
                    <Box display="flex" flexDirection="column" gap="20px" mt="10px">
                        <TextField 
                            margin="dense" 
                            fullWidth 
                            label="Category Name *" 
                            variant="filled"
                            value={formData.name} 
                            onChange={(e) => setFormData({...formData, name: e.target.value})} 
                            sx={{
                                "& .MuiFilledInput-root": {
                                    backgroundColor: "rgba(255,255,255,0.05)",
                                    "&:hover": { backgroundColor: "rgba(255,255,255,0.08)" }
                                }
                            }}
                        />
                        <TextField 
                            margin="dense" 
                            fullWidth 
                            multiline 
                            rows={3} 
                            label="Description" 
                            variant="filled"
                            value={formData.description} 
                            onChange={(e) => setFormData({...formData, description: e.target.value})} 
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
                    <Button onClick={handleClose} variant="outlined" disabled={submitting}
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
                    <Button onClick={handleSave} variant="contained" disabled={submitting || !formData.name.trim()}
                        sx={{
                            borderRadius: "8px",
                            fontWeight: "bold",
                            textTransform: "none",
                            background: "linear-gradient(90deg, #11998e 0%, #38ef7d 100%)",
                            "&:hover": { opacity: 0.9 }
                        }}
                    >
                        {submitting ? <CircularProgress size={20} color="inherit" /> : "Save"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDeleteDialog}
                onClose={() => !deleting && setOpenDeleteDialog(false)}
                aria-labelledby="delete-dialog-title"
                fullWidth
                maxWidth="xs"
                sx={{
                    "& .MuiPaper-root": {
                        background: colors.primary[400],
                        borderRadius: "16px",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                        boxShadow: "0 12px 40px rgba(0,0,0,0.25)"
                    }
                }}
            >
                <DialogTitle id="delete-dialog-title" sx={{ p: "24px 24px 8px 24px" }}>
                    <Typography variant="h3" fontWeight="bold" color={colors.grey[100]}>
                        Confirm Delete
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ p: "8px 24px 24px 24px" }}>
                    <Typography variant="h5" color={colors.grey[200]}>
                        Are you sure you want to delete this category? All associated companies and products may be affected. This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: "16px 24px 24px 24px" }}>
                    <Button 
                        onClick={() => setOpenDeleteDialog(false)} 
                        variant="outlined" 
                        disabled={deleting}
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
                        onClick={handleDelete} 
                        variant="contained" 
                        color="error"
                        disabled={deleting}
                        sx={{
                            borderRadius: "8px",
                            fontWeight: "bold",
                            textTransform: "none",
                            padding: "8px 16px",
                            background: "linear-gradient(90deg, #d32f2f 0%, #ef5350 100%)",
                            "&:hover": { opacity: 0.9 }
                        }}
                    >
                        {deleting ? <CircularProgress size={20} color="inherit" /> : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Toast 
                alerting={toastInfo.toastAlert}
                severity={toastInfo.toastSeverity}
                message={toastInfo.toastMessage}
            />
        </Box>
    );
};

export default CategoryManageComponent;
