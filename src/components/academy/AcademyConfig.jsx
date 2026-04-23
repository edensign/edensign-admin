/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 */

import { Box, Button, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { tokens } from "../../theme";
import API from "../../apis";

export const datagridColumns = (handleDelete) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigateTo = useNavigate();

    return [
        {
            field: "title",
            headerName: "Title",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "category",
            headerName: "Category",
            flex: 0.5,
        },
        {
            field: "youtube_link",
            headerName: "YouTube Link",
            flex: 1,
            renderCell: ({ row: { youtube_link } }) => (
                <a href={youtube_link} target="_blank" rel="noreferrer" style={{ color: colors.blueAccent[500] }}>
                    {youtube_link}
                </a>
            )
        },
        {
            field: "status",
            headerName: "Status",
            flex: 0.5,
            renderCell: ({ row: { status } }) => {
                return (
                    <Box
                        width="60%"
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
            field: "actions",
            headerName: "Actions",
            flex: 0.8,
            renderCell: ({ row }) => {
                return (
                    <Box display="flex" gap="10px">
                        <Button
                            variant="contained"
                            color="info"
                            size="small"
                            onClick={() => navigateTo(`/academy/update/${row.id}`)}
                            startIcon={<EditIcon />}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleDelete(row.id)}
                            startIcon={<DeleteIcon />}
                        >
                            Delete
                        </Button>
                    </Box>
                );
            },
        },
    ];
};
