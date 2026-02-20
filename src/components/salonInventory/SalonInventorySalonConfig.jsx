/**
 * Copyright © 2026, Eden Sign Inc. ALL RIGHTS RESERVED.
 */

import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, useTheme } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import { tokens } from "../../theme";

export const datagridColumns = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigateTo = useNavigate();

    const handleViewInventory = (id) => {
        navigateTo(`/salon-inventory/listing?salon_id=${id}`);
    };

    const columns = [
        {
            field: "name",
            headerName: "SALON NAME",
            headerAlign: "center",
            align: "center",
            flex: 1,
            minWidth: 120
        },
        {
            field: "contact_no",
            headerName: "CONTACT",
            headerAlign: "center",
            align: "center",
            flex: 1,
            minWidth: 100
        },
        {
            field: "email",
            headerName: "EMAIL",
            headerAlign: "center",
            align: "center",
            flex: 1,
            minWidth: 200
        },
        {
            field: "status",
            headerName: "STATUS",
            headerAlign: "center",
            align: "center",
            flex: 1,
            minWidth: 100,
            renderCell: ({ row: { status } }) => {
                return (
                    <Box
                        width="80%"
                        m="0 auto"
                        p="5px"
                        display="flex"
                        justifyContent="center"
                        backgroundColor={
                            status === "active"
                                ? colors.greenAccent[600]
                                : colors.redAccent[700]
                        }
                        borderRadius="4px"
                    >
                        <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
                            {status}
                        </Typography>
                    </Box>
                );
            },
        },
        {
            field: "action",
            headerName: "INVENTORY",
            headerAlign: "center",
            align: "center",
            flex: 1,
            minWidth: 150,
            renderCell: ({ row: { id } }) => {
                return (
                    <Button
                        color="secondary"
                        variant="contained"
                        onClick={() => handleViewInventory(id)}
                        startIcon={<InventoryIcon />}
                    >
                        View Products
                    </Button>
                );
            },
        }
    ];
    return columns;
}
