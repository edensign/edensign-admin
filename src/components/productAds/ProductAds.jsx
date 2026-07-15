import React, { useEffect, useState } from "react";
import { Box, Button, Typography, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem as SelectItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import API from "../../apis";
import { tokens } from "../../theme";
import { Utility } from "../utility";
import { useDispatch } from "react-redux";
import { setMenuItem } from "../../redux/actions/NavigationAction";

const ProductAds = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { getLocalStorage, toastAndNavigate } = Utility();
    const dispatch = useDispatch();

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        id: "", product_id: "", title: "", subtitle: "", ad_budget: 0, start_date: "", end_date: "", status: "active"
    });

    useEffect(() => {
        dispatch(setMenuItem("Product Ads"));
        fetchAds();
        fetchProducts();
    }, []);

    const fetchAds = async () => {
        setLoading(true);
        try {
            const res = await API.ProductAdAPI.getAll(false, 0, 100); // 0-indexed page for first page
            setRows(res.data?.rows || []);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const fetchProducts = async () => {
        try {
             const res = await API.ProductAPI.getAll(); 
             setProducts(res.data?.rows || []);
        } catch (e) { console.error(e); }
    };

    const handleOpen = (row = null) => {
        if (row) setFormData(row);
        else setFormData({ id: "", product_id: "", title: "", subtitle: "", ad_budget: 0, start_date: "", end_date: "", status: "active" });
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleSave = async () => {
        const payload = { ...formData };
        try {
            if (payload.id) {
                await API.ProductAdAPI.update(payload);
                toastAndNavigate(dispatch, true, "success", "Ad updated", () => {}, null);
            } else {
                delete payload.id;
                await API.ProductAdAPI.create(payload);
                toastAndNavigate(dispatch, true, "success", "Ad created", () => {}, null);
            }
            handleClose();
            fetchAds();
        } catch (error) {
            toastAndNavigate(dispatch, true, "error", "Failed to save ad", () => {}, null);
        }
    };

    const columns = [
        { field: "id", headerName: "ID", width: 50 },
        { field: "title", headerName: "Title", flex: 1 },
        { field: "ad_budget", headerName: "Budget", width: 100 },
        { field: "status", headerName: "Status", width: 100 },
        { field: "click_count", headerName: "Clicks", width: 100 },
        { field: "start_date", headerName: "Start Date", flex: 1 },
        { field: "end_date", headerName: "End Date", flex: 1 },
        {
            field: "actions",
            headerName: "Actions",
            width: 150,
            renderCell: (params) => (
                <Button variant="contained" color="secondary" size="small" onClick={() => handleOpen(params.row)}>
                    Edit
                </Button>
            )
        }
    ];

    return (
        <Box p="10px" sx={{ width: "100%", overflowX: "hidden" }}>
            <Box display="flex" justifyContent="space-between" mb={2} p={2}>
                <Typography variant="h3" color={colors.grey[100]}>Product Ads / Sponsored Campaigns</Typography>
                <Button variant="contained" color="success" onClick={() => handleOpen()}>Create Ad Campaign</Button>
            </Box>
            <Box sx={{ 
                height: "calc(100vh - 200px)", 
                width: "100%",
                "& .MuiDataGrid-root": { fontSize: "1rem" }, 
                "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700] },
                overflowX: "auto"
            }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    loading={loading}
                    getRowId={(row) => row.id}
                />
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{formData.id ? "Edit Ad Campaign" : "Create Ad Campaign"}</DialogTitle>
                <DialogContent>
                    <TextField select margin="dense" fullWidth label="Product" 
                        value={formData.product_id} onChange={(e) => setFormData({...formData, product_id: e.target.value})}>
                        {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                    </TextField>
                    <TextField margin="dense" fullWidth label="Ad Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                    <TextField margin="dense" fullWidth label="Subtitle" value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} />
                    <TextField margin="dense" fullWidth type="number" label="Budget" value={formData.ad_budget} onChange={(e) => setFormData({...formData, ad_budget: e.target.value})} />
                    <TextField margin="dense" fullWidth type="date" label="Start Date" InputLabelProps={{ shrink: true }} value={formData.start_date} onChange={(e) => setFormData({...formData, start_date: e.target.value})} />
                    <TextField margin="dense" fullWidth type="date" label="End Date" InputLabelProps={{ shrink: true }} value={formData.end_date} onChange={(e) => setFormData({...formData, end_date: e.target.value})} />
                    <TextField select margin="dense" fullWidth label="Status" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="error">Cancel</Button>
                    <Button onClick={handleSave} color="success" variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProductAds;
