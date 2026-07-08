/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Box, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import EmptyOverlayGrid from "./EmptyOverlayGrid";
import { multipleSkeletons } from "./LoadingSkeleton";
import { tokens } from "../../theme";

export default function ServerPaginationGrid({
    action,
    api,
    getQuery,
    condition = false,
    createdBy = false,
    columns,
    rows,
    count,
    pageSizeOptions,
    searchFlag,
    setOldPagination,
    setSearchFlag,
    loading = null,
    noRowsLabel,
    onNoRowsAction,
    noRowsActionLabel
}) {
    const initialState = {
        page: 0,
        pageSize: 5 || 10 || 20
    };
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [paginationModel, setPaginationModel] = useState(initialState);
    const amenityLoading = useSelector(state => state.allAmenities.loading);
    const jobSeekerLoading = useSelector(state => state.allJobSeekers.loading);
    const productLoading = useSelector(state => state.allProducts.loading);
    const productInventoryLoading = useSelector(state => state.allInventory.loading);
    const salonLoading = useSelector(state => state.allSalons.loading);
    const salonInventoryLoading = useSelector(state => state.allSalonInventory.loading);
    const cashflowLoading = useSelector(state => state.allCashflow.loading);
    const serviceLoading = useSelector(state => state.allServices.loading);
    const skillLoading = useSelector(state => state.allSkills.loading);
    const stateLoading = useSelector(state => state.allStates?.loading);
    const cityLoading = useSelector(state => state.allCities?.loading);
    const userLoading = useSelector(state => state.allUsers.loading);
    const companyLoading = useSelector(state => state.allCompanies?.loading);
    const distributorLoading = useSelector(state => state.allDistributors?.loading);
    const selected = useSelector(state => state.menuItems.selected);

    useEffect(() => {
        //TO BE REFACTORED
        if (!searchFlag.search && !searchFlag.searching) {
            getQuery(paginationModel.page, paginationModel.pageSize, action, api, condition, false, createdBy);
            setOldPagination(paginationModel);
        } else if (searchFlag.oldPagination && !searchFlag.searching) {
            getQuery(searchFlag.oldPagination.page, searchFlag.oldPagination.pageSize, action, api, condition, false, createdBy);
            setPaginationModel({
                page: searchFlag.oldPagination.page,
                pageSize: searchFlag.oldPagination.pageSize
            });
        }
    }, [selected, paginationModel.page, paginationModel.pageSize, searchFlag.searching]);

    useEffect(() => {
        setPaginationModel(initialState);
    }, [selected]);

    // Some API clients return undefined while loading
    // Following lines are here to prevent `rowCountState` from being undefined during the loading
    const [rowCountState, setRowCountState] = useState(count || 0);

    useEffect(() => {
        setRowCountState(() =>
            count ? count : 0,
        );
    }, [count, setRowCountState]);

    // console.log('pagina=>', paginationModel);

    return (
        <Box
            m="24px 0 0 0"
            sx={{
                backgroundColor: theme.palette.mode === "dark" ? "#0f172a" : "#ffffff",
                boxShadow: theme.palette.mode === "dark" ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(92,107,192,0.06)",
                borderRadius: "12px",
                overflow: "hidden",
                border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"}`,
                "& .MuiDataGrid-root": {
                    backgroundColor: theme.palette.mode === "dark" ? "#0f172a" : "#ffffff",
                    border: "none",
                    fontSize: "0.875rem",
                    fontFamily: "'Inter', sans-serif"
                },
                "& .MuiDataGrid-cell": {
                    borderBottom: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
                    color: theme.palette.mode === "dark" ? "#cbd5e1" : "#475569"
                },
                "& .MuiDataGrid-cellCheckbox": {
                    borderBottom: "none"
                },
                "& .MuiDataGrid-cell:focus-within": {
                    outline: `1px solid rgba(92, 107, 192, 0.3)`
                },
                "& .MuiDataGrid-cell:hover": {
                    color: "#5c6bc0"
                },
                "& .name-column--cell": {
                    color: "#5c6bc0",
                    fontWeight: 600
                },
                "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: theme.palette.mode === "dark" ? "#1e293b" : "#f8fafc",
                    borderBottom: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                    color: theme.palette.mode === "dark" ? "#cbd5e1" : "#1e293b",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                },
                "& .MuiDataGrid-columnHeader": {
                    backgroundColor: theme.palette.mode === "dark" ? "#1e293b" : "#f8fafc",
                },
                "& .MuiDataGrid-virtualScroller": {
                    minHeight: 320,
                    backgroundColor: theme.palette.mode === "dark" ? "#0f172a" : "#ffffff"
                },
                "& .MuiDataGrid-footerContainer": {
                    borderTop: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                    backgroundColor: theme.palette.mode === "dark" ? "#1e293b" : "#f8fafc",
                    color: theme.palette.mode === "dark" ? "#cbd5e1" : "#475569"
                },
                "& .MuiDataGrid-row": {
                    backgroundColor: theme.palette.mode === "dark" ? "#0f172a" : "#ffffff",
                    "&:hover": {
                        backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.03) !important" : "rgba(92,107,192,0.04) !important"
                    }
                },
                "& .MuiCheckbox-root": {
                    color: `${colors.greenAccent[500]} !important`
                },
                "& .MuiDataGrid-toolbarContainer": {
                    backgroundColor: theme.palette.mode === "dark" ? "#0f172a" : "#ffffff",
                    borderBottom: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`
                },
                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                    color: `${theme.palette.mode === "dark" ? "#94a3b8" : "#64748b"} !important`,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    margin: "4px 8px"
                },
            }}
        >
            <DataGrid
                autoHeight
                disableRowSelectionOnClick
                rows={rows || []}
                columns={columns}
                // count={count}
                // page={count + 1}
                loading={loading !== null && loading !== undefined ? loading : (selected === "Amenity" ? amenityLoading : selected === "State" ? stateLoading : selected === "City" ? cityLoading : (selected === 'Salon Detail' || selected === 'My Salons') ? salonLoading :
                    selected === 'Salon Inventory' ? salonInventoryLoading : selected === 'Salon Cashflow' ? cashflowLoading : selected === "Service" ? serviceLoading :
                        selected === 'Job Seeker' ? jobSeekerLoading : selected === 'Product Detail' ? productLoading :
                            selected === 'Product Inventory' ? productInventoryLoading : selected === 'Skill' ? skillLoading : 
                                selected === 'Company Profile' ? companyLoading : selected === 'Distributors' ? distributorLoading :
                                    (selected === 'Employee' || selected === 'Salon' || selected === 'Freelancer' || selected === 'Sales Executive') ? userLoading : userLoading)}
                rowCount={rowCountState}
                components={{
                    Toolbar: GridToolbar,
                    LoadingOverlay: multipleSkeletons,
                    noRowsOverlay: EmptyOverlayGrid
                }}
                componentsProps={{
                    noRowsOverlay: {
                        label: noRowsLabel,
                        onAction: onNoRowsAction,
                        actionLabel: noRowsActionLabel
                    }
                }}
                pagination
                ServerPaginationGrid
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={pageSizeOptions}
                keepNonExistentRowsSelected
            // onRowSelectionModelChange={(newRowSelectionModel) => {
            //     setRowSelectionModel(newRowSelectionModel);
            //   }}
            //   rowSelectionModel={rowSelectionModel}
            />
        </Box>
    );
}
