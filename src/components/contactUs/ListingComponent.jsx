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
                height={isMobile ? "19vh" : "11vh"}
                borderRadius="4px"
                padding={isMobile ? "1vh" : "2vh"}
                backgroundColor={colors.blueAccent[700]}
            >
                <Box
                    display="flex"
                    height={isMobile ? "16vh" : "7vh"}
                    flexDirection={isMobile ? "column" : "row"}
                    justifyContent={"space-between"}
                    alignItems={isMobile ? "center" : "normal"}
                >
                    <Typography
                        component="h2"
                        variant="h2"
                        color={colors.grey[100]}
                        fontWeight="bold"
                    >
                        {selected || "Contact Enquiries"}
                    </Typography>
                </Box>
            </Box>
            <Box
                m="20px 0 0 0"
                height="75vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
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
