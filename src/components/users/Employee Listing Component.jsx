import { useEffect } from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Header from "../Header.jsx";
import { UserAPI } from "../../apis/UserAPI.jsx";
import { tokens } from "../../theme.jsx";
import { getUsers } from "../../redux/actions/UserActions.jsx";

const EmployeeListingComponent = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        UserAPI.getAll()
            .then(users => {
                dispatch(getUsers(users));
            })
            .catch(err => {
                console.log(err);
            });
    }, [])

    const users = useSelector(state => state);

    const navigateTo = useNavigate();

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "created_by", headerName: "Created By" },
        {
            field: "username",
            headerName: "Username",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "contact_no",
            headerName: "Contact Number",
            flex: 1,
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1,
        },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
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
    ];

    return (
        <Box m="20px">
            <Header title="USERS" />
            <Button
                type="submit"
                color="success"
                variant="contained"
                sx={{ position: "absolute", right: "15px", top: "90px" }}
                onClick={() => { navigateTo("/employee-update") }}
            >
                Create New User
            </Button>
            <Box
                m="40px 0 0 0"
                height="75vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                    },
                    "& .name-column--cell": {
                        color: colors.greenAccent[300],
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.blueAccent[700],
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`,
                    },
                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        color: `${colors.grey[100]} !important`,
                    }
                }}
            >
                <DataGrid
                    checkboxSelection
                    rows={users.allUsers.users}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                />
            </Box>
        </Box>
    );
};

export default EmployeeListingComponent;
