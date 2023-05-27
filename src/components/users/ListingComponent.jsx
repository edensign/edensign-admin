/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
*/

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { Box, Typography, Button, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';

import { useUtility } from "../hooks";
import Header from "../Header.jsx";
import { multipleSkeletons } from "../common/LoadingSkeleton.jsx"
import EmptyOverlayGrid from "../common/EmptyOverlayGrid.jsx";
import { CustomPagination } from "../common/Pagination.jsx";
import { tokens } from "../../theme.jsx";
import { UserAPI } from "../../apis/UserAPI.jsx";
import { setUsers } from "../../redux/actions/UserActions.jsx";

const UserListingComponent = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigateTo = useNavigate();

    const [loading, setLoading] = useState(true);
    const { getQuery } = useUtility();
    const dispatch = useDispatch();
    const selected = useSelector(state => state.menuItems.selected);
    const { users } = useSelector(state => state.allUsers);

    useEffect(() => {
        UserAPI.getAll({
            key: 'type',
            value: getQuery()
        })
            .then(res => {
                setLoading(false);
                if (res.status === 'Success') {
                    dispatch(setUsers(res.data));
                }
            })
            .catch(err => {
                setLoading(false);
                dispatch(setUsers([]));
                console.log(err);
            });
    }, [selected]);

    const handleActionEdit = (id) => {
        navigateTo("/user-form", { state: { id: id } });
    };

    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        {
            field: "username",
            headerName: "Username",
            headerAlign: "center",
            align: "center",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "contact_no",
            headerName: "Contact Number",
            headerAlign: "center",
            align: "center",
            flex: 1,
        },
        {
            field: "email",
            headerName: "Email",
            headerAlign: "center",
            align: "center",
            flex: 1,
        },
        {
            field: "status",
            headerName: "Status",
            headerAlign: "center",
            align: "center",
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
        {
            field: "actions",
            headerName: "Actions",
            headerAlign: "center",
            align: "center",
            flex: 1,
            renderCell: ({ row: { id } }) => {
                return (
                    <Box width="60%"
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

    return (
        <Box m="20px">
            <Header title={selected} />
            <Button
                type="submit"
                color="success"
                variant="contained"
                sx={{ position: "absolute", right: "20px", top: "90px" }}
                onClick={() => { navigateTo("/user-form") }}
            >
                Create New {selected}
            </Button>
            <Box
                m="30px 0 0 0"
                height="70vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                        fontSize: "1rem"
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none"
                    },
                    "& .MuiDataGrid-cell:focus-within": {
                        outline: `1px solid ${colors.greenAccent[600]}`,
                    },
                    "& .MuiDataGrid-cell:hover": {
                        color: colors.greenAccent[300]
                    },
                    "& .name-column--cell": {
                        color: colors.greenAccent[300]
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: "none"
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        minHeight: 320
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.blueAccent[700]
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`
                    },
                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        color: `${colors.grey[100]} !important`
                    },
                }}
            >
                <DataGrid
                    rows={users}
                    columns={columns}
                    checkboxSelection
                    disableRowSelectionOnClick
                    autoHeight
                    sx={{
                        minHeight: 440,
                        boxShadow: 2,
                        border: 2,
                        borderColor: 'primary.light',
                    }}
                    pagination
                    components={{
                        Toolbar: GridToolbar,
                        LoadingOverlay: multipleSkeletons,
                        pagination: CustomPagination,
                        noRowsOverlay: EmptyOverlayGrid
                    }}
                    loading={loading}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 25 } }
                    }}
                />
            </Box>
        </Box>
    );
};

export default UserListingComponent;
