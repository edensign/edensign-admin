//all user configurations like the columns of datagrid to be added here 

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { Box, Button, Typography, useTheme } from '@mui/material';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';

import { tokens } from "../../theme";

export const datagridColumns = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigateTo = useNavigate();
    const { users } = useSelector(state => state.allUsers);

    const handleActionEdit = (id) => {
        navigateTo("/user/update", { state: { id: id } });
    };

    const columns = [
        {
            field: "username",
            headerName: "USERNAME",
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
            field: "created_at",
            headerName: "CREATED AT",
            headerAlign: "center",
            align: "center",
            flex: 1,
            cellClassName: "created-column--cell",
            renderCell: ({ row: { created_at } }) => {
                const userData = users?.rows;
                let formattedDate = [];
                if (userData.length) {
                    userData.map((item) => {
                        let date = new Date(item.created_at);
                        formattedDate.push(date.toLocaleDateString());
                        // console.log(formattedDate)
                    });
                }
                return;
            }
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
