/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 */

import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, useTheme } from '@mui/material';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import { tokens } from "../../theme";

export const datagridColumns = (handleDialogOpen) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigateTo = useNavigate();

    const handleActionEdit = (id) => {
        handleDialogOpen(true);
        navigateTo("#", { state: { id } });
    };

    return [
        {
            field: "name",
            headerName: "CITY NAME",
            headerAlign: "center",
            align: "center",
            flex: 1,
            minWidth: 160
        },
        {
            field: "state_id",
            headerName: "STATE ID",
            headerAlign: "center",
            align: "center",
            flex: 1,
            minWidth: 100
        },
        {
            field: "updated_at",
            headerName: "UPDATED AT",
            headerAlign: "center",
            align: "center",
            flex: 1,
            minWidth: 110,
            valueFormatter: params => params?.value ? params.value.substring(0, 10) : ''
        },
        {
            field: "action",
            headerName: "ACTION",
            headerAlign: "center",
            align: "center",
            flex: 1,
            minWidth: 75,
            renderCell: ({ row: { id } }) => (
                <Box width="30%" m="0 auto" p="5px" display="flex" justifyContent="center">
                    <Button color="info" variant="contained" onClick={() => handleActionEdit(id)} sx={{ minWidth: "50px" }}>
                        <DriveFileRenameOutlineOutlinedIcon />
                    </Button>
                </Box>
            )
        }
    ];
};
