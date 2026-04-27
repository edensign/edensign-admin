/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 */

import { Box, Button, Chip } from "@mui/material";

export const datagridColumns = (handleDelete, navigateTo) => [
    { field: "id", headerName: "ID", width: 60 },
    { field: "title", headerName: "Title", flex: 1 },
    {
        field: "salon",
        headerName: "Salon",
        flex: 1,
        renderCell: ({ row }) => row.salon?.name || "—",
    },
    {
        field: "price",
        headerName: "Price",
        width: 120,
        renderCell: ({ row }) => row.price ? `Rs. ${row.price}` : "—",
    },
    {
        field: "validity_type",
        headerName: "Validity",
        width: 140,
        renderCell: ({ row }) => {
            if (row.validity_type === "duration") {
                return `${row.duration_days} Days`;
            }
            return row.expiry_date ? new Date(row.expiry_date).toLocaleDateString() : "—";
        },
    },
    {
        field: "is_active",
        headerName: "Status",
        width: 110,
        renderCell: ({ row }) => (
            <Chip
                label={row.is_active ? "Active" : "Inactive"}
                color={row.is_active ? "success" : "default"}
                size="small"
            />
        ),
    },
    {
        field: "created_at",
        headerName: "Created",
        width: 130,
        renderCell: ({ row }) => new Date(row.created_at).toLocaleDateString(),
    },
    {
        field: "actions",
        headerName: "Actions",
        width: 180,
        renderCell: ({ row }) => (
            <Box display="flex" gap={1}>
                <Button
                    size="small"
                    variant="contained"
                    color="warning"
                    onClick={() => navigateTo(`/offer-cards/update/${row.id}`)}
                >
                    Edit
                </Button>
                <Button
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(row.id)}
                >
                    Delete
                </Button>
            </Box>
        ),
    },
];
