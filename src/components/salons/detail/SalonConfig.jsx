/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { Box, Button, Typography, useTheme } from '@mui/material';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';

import { tokens } from "../../../theme";

export const datagridColumns = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigateTo = useNavigate();
    const { listData } = useSelector(state => state.allSalons);

    const handleActionEdit = (id) => {
        navigateTo("/salon/update", { state: { id: id } });
    };

    const columns = [
        {
            field: "name",
            headerName: "NAME",
            headerAlign: "center",
            align: "center",
            flex: 1,
            cellClassName: "name-column--cell"
        },
        {
            field: "contact_no",
            headerName: "CONTACT NUMBER",
            headerAlign: "center",
            align: "center",
            flex: 1,
            cellClassName: "contact-column--cell"
        },
        {
            field: "email",
            headerName: "EMAIL",
            headerAlign: "center",
            align: "center",
            flex: 1,
            cellClassName: "email-column--cell"
        },
        {
            field: "updated_at",
            headerName: "UPDATED AT",
            headerAlign: "center",
            align: "center",
            flex: 1,
            // cellClassName: "created-column--cell",
            // renderCell: ({ row: { updated_at } }) => {
            //    const salonData = listData?.rows;
            //     let formattedDate = [];
            //     if (salonData.length) {
            //         salonData.map((item) => {
            //             let date = new Date(item.created_at);
            //             formattedDate.push(date.toLocaleDateString());
            //             // console.log(formattedDate)
            //         });
            //     }
            //     return;
            // }
        },
        {
            field: "status",
            headerName: "STATUS",
            headerAlign: "center",
            align: "center",
            flex: 1,
            cellClassName: "status-column--cell",
            renderCell: ({ row: { status } }) => {
                return (
                    <Box
                        width="55%"
                        m="0 auto"
                        p="5px"
                        display="flex"
                        justifyContent="center"
                        backgroundColor={
                            status === "active"
                                ? colors.greenAccent[600]
                                : status === "inactive"
                                    ? colors.redAccent[700]
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
            headerName: "ACTION",
            headerAlign: "center",
            align: "center",
            flex: 1,
            cellClassName: "action-column--cell",
            renderCell: ({ row: { id } }) => {
                return (
                    <Box width="40%"
                        m="0 auto"
                        p="5px"
                        display="flex"
                        justifyContent="center">
                        <Button color="info" variant="contained" onClick={() => handleActionEdit(id)} >
                            <DriveFileRenameOutlineOutlinedIcon />
                        </Button>
                    </Box>
                );
            },
        }
    ];
    return columns;
}
