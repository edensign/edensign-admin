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
    columns,
    rows,
    count,
    pageSizeOptions,
    searchFlag,
    setOldPagination,
    setSearchFlag
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
    const userLoading = useSelector(state => state.allUsers.loading);
    const selected = useSelector(state => state.menuItems.selected);

    useEffect(() => {
        //TO BE REFACTORED
        if (!searchFlag.search && !searchFlag.searching) {
            getQuery(paginationModel.page, paginationModel.pageSize, action, api, condition);
            setOldPagination(paginationModel);
        } else if (searchFlag.oldPagination && !searchFlag.searching) {
            getQuery(searchFlag.oldPagination.page, searchFlag.oldPagination.pageSize, action, api, condition);
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
            m="30px 0 0 0"
            // width="100vw"
            sx={{
                "& .MuiDataGrid-root": {
                    border: "none",
                    fontSize: "1rem"
                },
                "& .MuiDataGrid-cell": {
                    borderBottom: "none"
                },
                "& .MuiDataGrid-cellCheckbox": {
                    borderBottom: "none"
                },
                "& .MuiDataGrid-cell:focus-within": {
                    outline: `1px solid ${colors.greenAccent[600]}`
                },
                "& .MuiDataGrid-cell:hover": {
                    color: colors.greenAccent[300]
                },
                "& .name-column--cell": {
                    color: colors.greenAccent[300],
                },
                "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: colors.blueAccent[700],
                    borderBottom: "none"
                },
                "& .MuiDataGrid-columnHeader": {
                    backgroundColor: colors.blueAccent[700],
                },
                "& .MuiDataGrid-virtualScroller": {
                    minHeight: 320
                },
                "& .MuiDataGrid-footerContainer": {
                    borderTop: "none",
                    backgroundColor: colors.blueAccent[700]
                },
                "& .MuiCheckbox-root": {
                    color: `${colors.greenAccent[200]} !important`
                },
                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                    color: `${colors.grey[100]} !important`
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
                loading={selected === "Amenity" ? amenityLoading : selected === 'Salon Detail' ? salonLoading :
                    selected === 'Salon Inventory' ? salonInventoryLoading : selected === 'Salon Cashflow' ? cashflowLoading : selected === "Service" ? serviceLoading :
                        selected === 'Job Seeker' ? jobSeekerLoading : selected === 'Product Detail' ? productLoading :
                            selected === 'Product Inventory' ? productInventoryLoading : selected === 'Skill' ? skillLoading : userLoading}
                rowCount={rowCountState}
                components={{
                    Toolbar: GridToolbar,
                    LoadingOverlay: multipleSkeletons,
                    noRowsOverlay: EmptyOverlayGrid
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
