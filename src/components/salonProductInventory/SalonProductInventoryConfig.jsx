/**
 * Copyright © 2026, Eden Sign Inc. ALL RIGHTS RESERVED.
 */

import { Box, Typography, Tooltip, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

export const datagridColumns = (handleEdit) => [
    {
        field: "name",
        headerName: "Product Name",
        flex: 1.5,
        renderCell: ({ row: { name } }) => (
            <Typography variant="body1">{name}</Typography>
        )
    },
    {
        field: "brand",
        headerName: "Brand",
        flex: 1,
        renderCell: ({ row: { brand } }) => (
            <Typography variant="body1">{brand}</Typography>
        )
    },
    {
        field: "sku",
        headerName: "SKU",
        flex: 1,
        renderCell: ({ row: { sku } }) => (
            <Typography variant="body1">{sku || '-'}</Typography>
        )
    },
    {
        field: "stock_quantity",
        headerName: "Stock",
        flex: 0.8,
        renderCell: ({ row: { stock_quantity, low_stock_threshold } }) => (
            <Typography
                variant="body1"
                color={stock_quantity <= low_stock_threshold ? "error" : "inherit"}
                fontWeight={stock_quantity <= low_stock_threshold ? "bold" : "normal"}
            >
                {stock_quantity}
            </Typography>
        )
    },
    {
        field: "low_stock_threshold",
        headerName: "Low Stock Limit",
        flex: 0.8,
        renderCell: ({ row: { low_stock_threshold } }) => (
            <Typography variant="body1">{low_stock_threshold}</Typography>
        )
    },
    {
        field: "status",
        headerName: "Status",
        flex: 0.8,
        renderCell: ({ row: { status } }) => (
            <Typography
                variant="body1"
                textTransform="capitalize"
                color={status === 'active' ? "success.main" : "error.main"}
            >
                {status}
            </Typography>
        )
    },
    {
        field: "action",
        headerName: "Action",
        flex: 0.5,
        renderCell: ({ row }) => (
            <Box display="flex" justifyContent="center">
                <Tooltip title="Edit Stock">
                    <IconButton onClick={() => handleEdit(row)}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        )
    }
];
