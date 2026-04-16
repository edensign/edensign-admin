/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import { Chip, IconButton, useTheme, Typography } from "@mui/material";
import DeleteIcons from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { tokens } from "../../theme";

export const datagridColumns = (handleDelete, handleEdit) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const columns = [
        {
            field: "transaction_date",
            headerName: "DATE",
            flex: 1,
            renderCell: ({ row: { transaction_date } }) => {
                return (
                    <Typography>
                        {transaction_date ? new Date(transaction_date).toLocaleDateString('en-IN') : '-'}
                    </Typography>
                );
            }
        },
        {
            field: "description",
            headerName: "DESCRIPTION",
            flex: 2,
        },
        {
            field: "category",
            headerName: "CATEGORY",
            flex: 1,
            renderCell: ({ row: { category } }) => {
                return (
                    <Chip
                        label={category}
                        variant="outlined"
                        style={{
                            borderColor: colors.blueAccent[300],
                            color: colors.blueAccent[300]
                        }}
                    />
                );
            }
        },
        {
            field: "type",
            headerName: "TYPE",
            flex: 1,
            renderCell: ({ row: { type } }) => {
                return (
                    <Chip
                        label={type?.toUpperCase()}
                        style={{
                            backgroundColor: type === 'credit' ? colors.greenAccent[600] : colors.redAccent[600],
                            color: colors.grey[100]
                        }}
                    />
                );
            }
        },
        {
            field: "amount",
            headerName: "AMOUNT",
            flex: 1,
            renderCell: ({ row: { amount, type } }) => {
                return (
                    <Typography
                        color={type === 'credit' ? colors.greenAccent[500] : colors.redAccent[500]}
                        fontWeight="bold"
                    >
                        {type === 'credit' ? '+' : '-'} ₹{parseFloat(amount).toFixed(2)}
                    </Typography>
                );
            }
        },
        {
            field: "payment_method",
            headerName: "METHOD",
            flex: 1,
        },
        {
            field: "action",
            headerName: "ACTION",
            flex: 1,
            renderCell: ({ row }) => {
                return (
                    <>
                        <IconButton onClick={() => handleEdit(row)} color="secondary">
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(row.id)} color="error">
                            <DeleteIcons />
                        </IconButton>
                    </>
                );
            }
        }
    ];

    return columns;
};
