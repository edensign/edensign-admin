/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { Box, Typography, useMediaQuery, useTheme, Button } from "@mui/material";
import ReplayIcon from '@mui/icons-material/Replay';
import StoreIcon from '@mui/icons-material/Store';

import API from "../../apis";
import Search from "../common/Search";
import ServerPaginationGrid from '../common/Datagrid';

import { datagridColumns } from "./SalonInventoryConfig";
import { setMenuItem } from "../../redux/actions/NavigationAction";
import { setSalonInventory } from "../../redux/actions/SalonInventoryAction";
import { tokens } from "../../theme";
import { useCommon } from "../hooks/common";
import { Utility } from "../utility";

const pageSizeOptions = [5, 10, 20];

const SalonInventoryListingComponent = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigateTo = useNavigate();
    const location = useLocation();
    const isMobile = useMediaQuery("(max-width:480px)");
    const isTab = useMediaQuery("(max-width:920px)");

    const selected = useSelector(state => state.menuItems.selected);
    const { listData } = useSelector(state => state.allSalonInventory);

    const [searchFlag, setSearchFlag] = useState({ search: false, searching: false });
    const [oldPagination, setOldPagination] = useState();

    const { getPaginatedData } = useCommon();
    const { getLocalStorage } = Utility();

    const colors = tokens(theme.palette.mode);
    const reloadBtn = document.getElementById("reload-btn");

    const columns = datagridColumns();

    // Parse query parameters
    const queryParams = new URLSearchParams(location.search);
    const salonId = queryParams.get("salon_id");

    const condition = useMemo(() => {
        return salonId ? { key: "salonId", value: salonId } : false;
    }, [salonId]);

    useEffect(() => {
        const selectedMenu = getLocalStorage("menu");
        dispatch(setMenuItem(selectedMenu?.selected || "Salon Inventory"));
    }, []);

    const handleReload = () => {
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
                    <Box display="flex" alignItems="center" gap={1}>
                        <StoreIcon sx={{ color: colors.grey[100] }} />
                        <Typography
                            component="h2"
                            variant="h2"
                            color={colors.grey[100]}
                            fontWeight="bold"
                        >
                            {selected || "Salon Inventory"}
                        </Typography>
                    </Box>
                    <Search
                        action={setSalonInventory}
                        api={API.SalonInventoryAPI}
                        getSearchData={getPaginatedData}
                        setSearchFlag={setSearchFlag}
                        oldPagination={oldPagination}
                        reloadBtn={reloadBtn}
                    />
                    <Button
                        type="submit"
                        color="success"
                        variant="contained"
                        onClick={() => { navigateTo("/salon-inventory/create", { state: { salonId } }) }}
                    >
                        Create Product
                    </Button>
                </Box>
            </Box>
            <Button sx={{
                display: "none",
                position: "absolute",
                top: isMobile ? "23vh" : isTab ? "10.5vh" : "16.5vh",
                left: isMobile ? "80vw" : isTab ? "39.5vw" : "26vw",
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
                action={setSalonInventory}
                api={API.SalonInventoryAPI}
                getQuery={getPaginatedData}
                condition={condition}
                columns={columns}
                rows={listData?.list?.rows || []}
                count={listData?.list?.count || 0}
                pageSizeOptions={pageSizeOptions}
                setOldPagination={setOldPagination}
                searchFlag={searchFlag}
                setSearchFlag={setSearchFlag}
            />
        </Box>
    );
};

export default SalonInventoryListingComponent;
