/**
 * Copyright © 2026, Eden Sign Inc. ALL RIGHTS RESERVED.
 */

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Box, Typography, useMediaQuery, useTheme, Card, CardContent, Grid, Button } from "@mui/material";
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningIcon from '@mui/icons-material/Warning';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import ReplayIcon from '@mui/icons-material/Replay';

import API from "../../apis";
import ServerPaginationGrid from '../common/Datagrid';
import { setMenuItem } from "../../redux/actions/NavigationAction";
import { tokens } from "../../theme";
import { Utility } from "../utility";
import { datagridColumns } from "./SalonProductInventoryConfig";
import { setSalonInventory } from "../../redux/actions/SalonInventoryAction";

const pageSizeOptions = [10, 20, 50];

const ListingComponent = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigateTo = useNavigate();
    const isMobile = useMediaQuery("(max-width:480px)");

    const selected = useSelector(state => state.menuItems.selected);
    const { listData } = useSelector(state => state.allSalonInventory);

    const [stats, setStats] = useState({ totalProducts: 0, totalStock: 0, lowStock: 0 });
    const [loading, setLoading] = useState(false);
    const [searchFlag, setSearchFlag] = useState({ search: false, searching: false });
    const [oldPagination, setOldPagination] = useState();

    const { getLocalStorage } = Utility();
    const colors = tokens(theme.palette.mode);
    const salonId = getLocalStorage("salon")?.id;

    const handleEdit = (row) => {
        navigateTo(`/salon-inventory/update/${row.id}`);
    };

    const columns = datagridColumns(handleEdit);

    useEffect(() => {
        const selectedMenu = getLocalStorage("menu");
        dispatch(setMenuItem(selectedMenu?.selected || "Salon Inventory"));
    }, []);

    // Custom fetch for DataGrid that also updates stats
    const getInventoryData = (page, size, action, api, condition) => {
        setLoading(true);
        api.getAll(condition, page, size, false)
            .then(response => {
                if (response.data) {
                    dispatch(action({ listData: response.data.list, loading: false }));
                    setStats(response.data.stats);
                }
            })
            .catch(err => {
                console.error("SalonInventoryAPI error", err);
                dispatch(action({ listData: [], loading: false }));
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Box m="20px">
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexDirection={isMobile ? "column" : "row"} gap={2}>
                <Box display="flex" alignItems="center" gap={1}>
                    <InventoryIcon sx={{ color: colors.greenAccent[500], fontSize: 32 }} />
                    <Typography variant="h2" color={colors.grey[100]} fontWeight="bold">
                        {selected || "Salon Inventory"}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => navigateTo("/salon-inventory/create")} // Corrected route for salon
                >
                    Create Product
                </Button>
            </Box>

            {/* Dashboard Stats */}
            <Grid container spacing={2} mb={3}>
                <Grid item xs={12} sm={4}>
                    <Card sx={{ backgroundColor: colors.primary[400], height: '100%' }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography color={colors.greenAccent[500]} variant="h5" fontWeight="bold">
                                        Total Products
                                    </Typography>
                                    <Typography color={colors.grey[100]} variant="h3" fontWeight="bold">
                                        {stats.totalProducts}
                                    </Typography>
                                </Box>
                                <InventoryIcon sx={{ color: colors.greenAccent[500], fontSize: 40 }} />
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
                                        Total Stock
                                    </Typography>
                                    <Typography color={colors.grey[100]} variant="h3" fontWeight="bold">
                                        {stats.totalStock}
                                    </Typography>
                                </Box>
                                <ProductionQuantityLimitsIcon sx={{ color: colors.blueAccent[500], fontSize: 40 }} />
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
                                        Low Stock
                                    </Typography>
                                    <Typography color={colors.grey[100]} variant="h3" fontWeight="bold">
                                        {stats.lowStock}
                                    </Typography>
                                </Box>
                                <WarningIcon sx={{ color: colors.redAccent[500], fontSize: 40 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Product List */}
            <ServerPaginationGrid
                action={setSalonInventory}

                api={API.SalonInventoryAPI} // Using new API
                getQuery={getInventoryData} // Custom fetcher to handle stats return
                columns={columns}
                rows={listData?.rows || []}
                count={listData?.count || 0}
                pageSizeOptions={pageSizeOptions}
                setOldPagination={setOldPagination}
                searchFlag={searchFlag}
                setSearchFlag={setSearchFlag}
            />
        </Box >
    );
};

export default ListingComponent;
