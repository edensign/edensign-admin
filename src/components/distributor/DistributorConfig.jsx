/**
 * Copyright © 2026, Eden Sign Inc. ALL RIGHTS RESERVED.
 */

import React from "react";
import { Box, Button, Chip } from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";

export const datagridColumns = (navigateTo) => {
    return [
        {
            field: "id",
            headerName: "ID",
            flex: 0.5
        },
        {
            field: "name",
            headerName: "Distributor Name",
            flex: 1,
            cellClassName: "name-column--cell"
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1
        },
        {
            field: "contact_no",
            headerName: "Contact No",
            flex: 1
        },
        {
            field: "company",
            headerName: "Allotted Company",
            flex: 1,
            valueGetter: (params) => params.row?.company?.name || "N/A"
        },
        {
            field: "status",
            headerName: "Status",
            flex: 0.8,
            renderCell: (params) => {
                const isActive = params.row.status === "active";
                return (
                    <Chip
                        label={isActive ? "Active" : "Inactive"}
                        color={isActive ? "success" : "error"}
                        variant="outlined"
                        size="small"
                    />
                );
            }
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            sortable: false,
            renderCell: (params) => {
                return (
                    <Box display="flex" gap="10px">
                        <Button
                            variant="contained"
                            color="info"
                            size="small"
                            startIcon={<BorderColorIcon />}
                            onClick={() => navigateTo(`/distributor/update/${params.row.id}`)}
                            sx={{ textTransform: "none", borderRadius: "4px" }}
                        >
                            Edit
                        </Button>
                    </Box>
                );
            }
        }
    ];
};
