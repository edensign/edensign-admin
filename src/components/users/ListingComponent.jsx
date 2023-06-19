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

import { Box, Typography, Button, useMediaQuery, useTheme } from "@mui/material";
import ReplayIcon from '@mui/icons-material/Replay';

import Search from "../common/Search";
import ServerPaginationGrid from '../common/Datagrid';
import { datagridColumns } from "./UserConfig";
import { useUser } from "../hooks";
import { tokens, themeSettings } from "../../theme";
import { setMenuItem } from "../../redux/actions/NavigationAction";
import { Utility } from "../utility";

const ListingComponent = () => {
    const theme = useTheme();
    const navigateTo = useNavigate();
    const dispatch = useDispatch();
    const selected = useSelector(state => state.menuItems.selected);
    const isNonMobile = useMediaQuery("(min-width:720px)");
    const { getQueryParam, getAllUsers } = useUser();
    const { users } = useSelector(state => state.allUsers);
    const [searchFlag, setSearchFlag] = useState({ search: false, searching: false });
    const [oldPagination, setOldPagination] = useState();

    const colors = tokens(theme.palette.mode);
    const pageSizeOptions = [5, 10, 20];
    const reloadBtn = document.getElementById("reload-btn");
    const { getLocalStorage } = Utility();
    const { typography } = themeSettings(theme.palette.mode);

    let condition = getQueryParam() ? {
        key: 'type',
        value: getQueryParam()
    } : false;

    useEffect(() => {
        const selectedMenu = getLocalStorage("menu");
        dispatch(setMenuItem(selectedMenu.selected));
    }, []);

    const handleReload = () => {
        // getSearchData(oldPagination.page, oldPagination.pageSize, condition);
        reloadBtn.style.display = "none";
        setSearchFlag({
            search: false,
            searching: false,
            oldPagination
        });
    };

    return (
        <Box m="10px">
            <Box
                height={isNonMobile ? "11vh" : "20vh"}
                borderRadius="4px"
                padding={isNonMobile ? "2vh" : "1vh"}
                backgroundColor={colors.blueAccent[700]}
            >
                <Box
                    display="flex"
                    height={isNonMobile ? "6vh" : "17vh"}
                    flexDirection={isNonMobile ? "row" : "column"}
                    justifyContent={"space-between"}
                >
                    <Typography
                        component="h2"
                        variant="h2"
                        color={colors.grey[100]}
                        fontWeight="bold"
                    >
                        {selected}
                    </Typography>
                    <Search
                        getSearchData={getAllUsers}
                        condition={condition}
                        setSearchFlag={setSearchFlag}
                        oldPagination={oldPagination}
                        reloadBtn={reloadBtn}
                    />
                    <Button
                        type="submit"
                        color="success"
                        variant="contained"
                        onClick={() => { navigateTo("/user/create") }}
                    >
                        Create New {selected}
                    </Button>
                </Box>
            </Box>
            <Button sx={{
                display: "none",
                position: "absolute",
                top: isNonMobile ? "29.5vh" : "43vh",
                left: "44.5vw",
                zIndex: 1,
                borderRadius: "20%",
                color: colors.grey[100]
            }}
                id="reload-btn"
                type="submit"
                onClick={handleReload}
            >
                <span style={{ display: "inherit", marginRight: "5px", marginLeft: "-2px" }}>
                    <ReplayIcon />
                </span>
                Back
            </Button>
            <ServerPaginationGrid
                getQuery={getAllUsers}
                condition={getQueryParam() ? {
                    key: 'type',
                    value: getQueryParam()
                } : false}
                columns={datagridColumns()}
                rows={users.rows}
                count={users.count}
                selected={selected}
                pageSizeOptions={pageSizeOptions}
                setOldPagination={setOldPagination}
                searchFlag={searchFlag}
                setSearchFlag={setSearchFlag}
            />
        </Box>
    );
};

export default ListingComponent;
