/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */




import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, useTheme, Chip } from '@mui/material';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import WarningIcon from '@mui/icons-material/Warning';

import { tokens } from "../../theme";

export const datagridColumns = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigateTo = useNavigate();

    const handleActionEdit = (id) => {
        navigateTo(`/inventory/update/${id}`, { state: { id: id } });
    };

    const getStockStatus = (stockQuantity, lowStockThreshold) => {
        if (stockQuantity === 0) {
            return { label: "Out of Stock", color: colors.redAccent[500], bgColor: colors.redAccent[700] };
        } else if (stockQuantity <= lowStockThreshold) {
            return { label: "Low Stock", color: colors.yellowAccent?.[500] || "#FFD700", bgColor: colors.yellowAccent?.[700] || "#B8860B" };
        }
        return { label: "In Stock", color: colors.greenAccent[500], bgColor: colors.greenAccent[700] };
    };

    const columns = [
        {
            field: "sku",
            headerName: "SKU",
            headerAlign: "center",
            align: "center",
            flex: 0.7,
            minWidth: 100,
            renderCell: ({ row: { sku } }) => (
                <Typography color={colors.grey[100]} fontFamily="monospace">
                    {sku || "-"}
                </Typography>
            )
        },
        {
            field: "name",
            headerName: "PRODUCT NAME",
            headerAlign: "center",
            align: "center",
            flex: 1.2,
            minWidth: 150
        },
        {
            field: "brand",
            headerName: "BRAND",
            headerAlign: "center",
            align: "center",
            flex: 0.8,
            minWidth: 100
        },
        {
            field: "stock_quantity",
            headerName: "STOCK",
            headerAlign: "center",
            align: "center",
            flex: 0.6,
            minWidth: 80,
            renderCell: ({ row: { stock_quantity, low_stock_threshold } }) => {
                const isLow = stock_quantity <= low_stock_threshold;
                return (
                    <Box display="flex" alignItems="center" gap={1}>
                        <Typography
                            fontWeight="bold"
                            color={stock_quantity === 0 ? colors.redAccent[400] : isLow ? "#FFD700" : colors.greenAccent[400]}
                        >
                            {stock_quantity ?? 0}
                        </Typography>
                        {isLow && stock_quantity > 0 && <WarningIcon sx={{ color: "#FFD700", fontSize: 16 }} />}
                    </Box>
                );
            }
        },
        {
            field: "low_stock_threshold",
            headerName: "THRESHOLD",
            headerAlign: "center",
            align: "center",
            flex: 0.6,
            minWidth: 90
        },
        {
            field: "stockStatus",
            headerName: "STATUS",
            headerAlign: "center",
            align: "center",
            flex: 0.8,
            minWidth: 120,
            renderCell: ({ row: { stock_quantity, low_stock_threshold } }) => {
                const status = getStockStatus(stock_quantity ?? 0, low_stock_threshold ?? 10);
                return (
                    <Box
                        width="80%"
                        m="0 auto"
                        p="5px"
                        display="flex"
                        justifyContent="center"
                        backgroundColor={status.bgColor}
                        borderRadius="4px"
                    >
                        <Typography color={colors.grey[100]} sx={{ fontSize: "12px" }}>
                            {status.label}
                        </Typography>
                    </Box>
                );
            }
        },
        {
            field: "updated_at",
            headerName: "UPDATED",
            headerAlign: "center",
            align: "center",
            flex: 0.7,
            minWidth: 100,
            valueFormatter: params => params?.value?.substring(0, 10)
        },
        {
            field: "action",
            headerName: "ACTION",
            headerAlign: "center",
            align: "center",
            flex: 1,
            minWidth: 75,
            sortable: false,
            filterable: false,
            renderCell: ({ row: { id } }) => {
                return (
                    <Box width="30%"
                        m="0 auto"
                        p="5px"
                        display="flex"
                        justifyContent="center">
                        <Button color="info" variant="contained"
                            onClick={() => handleActionEdit(id)}
                            sx={{ minWidth: "50px" }}
                        >
                            <DriveFileRenameOutlineOutlinedIcon />
                        </Button>
                    </Box>
                );
            },
        }
    ];
    return columns;
}
