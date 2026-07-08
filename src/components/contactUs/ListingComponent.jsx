/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use, reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
*/

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import API from "../../apis";
import { datagridColumns } from "./ContactConfig";
import { setMenuItem } from "../../redux/actions/NavigationAction";
import { tokens } from "../../theme";
import { Utility } from "../utility";

const ListingComponent = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const isMobile = useMediaQuery("(max-width:480px)");

    const selected = useSelector(state => state.menuItems.selected);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    const { getLocalStorage } = Utility();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        const selectedMenu = getLocalStorage("menu");
        dispatch(setMenuItem(selectedMenu?.selected || "Contact Enquiries"));
    }, []);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const response = await API.ContactAPI.getContacts();
            if (response.data?.status === "Success") {
                setContacts(response.data.data.rows || []);
            } else {
                setContacts([]);
            }
        } catch (error) {
            console.error("Error fetching contacts:", error);
            setContacts([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box m="10px">
            <Box
                borderRadius="12px"
                padding="16px 24px"
                backgroundColor={theme.palette.mode === 'dark' ? colors.primary[400] : '#ffffff'}
                border={`1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(92,107,192,0.08)'}`}
                boxShadow={theme.palette.mode === 'dark' ? 'none' : '0 4px 12px rgba(92,107,192,0.03)'}
            >
                <Box
                    display="flex"
                    flexDirection={isMobile ? "column" : "row"}
                    justifyContent="space-between"
                    alignItems="center"
                    gap={2}
                >
                    <Typography
                        component="h2"
                        variant="h3"
                        color={theme.palette.mode === 'dark' ? '#f1f5f9' : '#1e293b'}
                        fontWeight="800"
                        sx={{ letterSpacing: "-0.01em" }}
                    >
                        {selected || "Contact Enquiries"}
                    </Typography>
                </Box>
            </Box>
            <Box
                m="24px 0 0 0"
                height="75vh"
                sx={{
                    boxShadow: theme.palette.mode === "dark" ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(92,107,192,0.06)",
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)"}`,
                    "& .MuiDataGrid-root": {
                        border: "none",
                        fontSize: "0.875rem",
                        fontFamily: "'Inter', sans-serif"
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
                        color: theme.palette.mode === "dark" ? "#cbd5e1" : "#475569"
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: theme.palette.mode === "dark" ? "#1e293b" : "#f8fafc",
                        borderBottom: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                        color: theme.palette.mode === "dark" ? "#cbd5e1" : "#1e293b",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em"
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: theme.palette.mode === "dark" ? "#0f172a" : "#ffffff",
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                        backgroundColor: theme.palette.mode === "dark" ? "#1e293b" : "#f8fafc",
                        color: theme.palette.mode === "dark" ? "#cbd5e1" : "#475569"
                    },
                    "& .MuiDataGrid-row": {
                        backgroundColor: theme.palette.mode === "dark" ? "#0f172a" : "#ffffff",
                        "&:hover": {
                            backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.03) !important" : "rgba(92,107,192,0.04) !important"
                        }
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[500]} !important`,
                    },
                }}
            >
                <DataGrid
                    rows={contacts}
                    columns={datagridColumns()}
                    loading={loading}
                    pageSizeOptions={[10, 25, 50]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } }
                    }}
                    getRowHeight={() => 'auto'}
                />
            </Box>
        </Box>
    );
};

export default ListingComponent;
