/**
 * Copyright © 2026, Eden Sign Inc. ALL RIGHTS RESERVED.
 */

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Button, useMediaQuery, useTheme } from "@mui/material";
import ReplayIcon from '@mui/icons-material/Replay';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import API from "../../apis";
import Search from "../common/Search";
import ServerPaginationGrid from '../common/Datagrid';

import { setMenuItem } from "../../redux/actions/NavigationAction";
import { setDistributors } from "../../redux/actions/DistributorAction";
import { tokens } from "../../theme";
import { useCommon } from "../hooks/common";
import { Utility } from "../utility";
import { useSelector, useDispatch } from "react-redux";

const pageSizeOptions = [5, 10, 20];

const DistributorChainComponent = () => {
    const theme = useTheme();
    const navigateTo = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const isMobile = useMediaQuery("(max-width:480px)");
    const isTab = useMediaQuery("(max-width:920px)");

    const selected = useSelector(state => state.menuItems.selected);
    const { listData, loading: distributorLoading } = useSelector(state => state.allDistributors);

    const [searchFlag, setSearchFlag] = useState({ search: false, searching: false });
    const [oldPagination, setOldPagination] = useState();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);

    const { getPaginatedData } = useCommon();
    const { getLocalStorage, getRole } = Utility();
    const colors = tokens(theme.palette.mode);
    const reloadBtn = document.getElementById("reload-btn");

    const role = getRole();
    const urlCompanyId = params?.companyId;

    // Load company details depending on the role
    useEffect(() => {
        const selectedMenu = getLocalStorage("menu");
        dispatch(setMenuItem(selectedMenu?.selected || "Allotted Distributor Chain"));

        const loadCompanyDetails = async () => {
            try {
                if (role === 'admin' && urlCompanyId) {
                    const res = await API.CommonAPI.getByPk(urlCompanyId, "company");
                    if (res && res.data) {
                        setCompany(res.data);
                    }
                } else if (role === 'company') {
                    const res = await API.CompanyAPI.getProfile();
                    if (res && res.data && res.data.status === "Success") {
                        setCompany(res.data.data);
                    }
                }
            } catch (err) {
                console.error("Failed to load company details:", err);
            } finally {
                setLoading(false);
            }
        };

        loadCompanyDetails();
    }, [urlCompanyId, role]);

    const handleReload = () => {
        if (reloadBtn) reloadBtn.style.display = "none";
        setSearchFlag({
            search: false,
            searching: false,
            oldPagination
        });
    };

    const companyId = company?.id;
    let condition = companyId ? {
        key: 'company_id',
        value: companyId
    } : false;

    // Table columns definition
    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "name", headerName: "Distributor Name", flex: 1, cellClassName: "name-column--cell" },
        { field: "email", headerName: "Email", flex: 1 },
        { field: "contact_no", headerName: "Contact No", flex: 1 },
        { field: "address", headerName: "Address", flex: 1.2 },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (cellParams) => {
                const editPath = (role === 'company') 
                    ? `/company/distributors/update/${cellParams.row.id}`
                    : `/distributor/update/${cellParams.row.id}`;
                return (
                    <Button
                        variant="contained"
                        color="info"
                        size="small"
                        onClick={() => navigateTo(editPath)}
                        sx={{ textTransform: "none", borderRadius: "4px" }}
                    >
                        Edit
                    </Button>
                );
            }
        }
    ];

    if (loading) {
        return (
            <Box m="20px" display="flex" justifyContent="center" alignItems="center" height="70vh">
                <Typography variant="h3" color={colors.grey[100]}>Loading...</Typography>
            </Box>
        );
    }

    const createPath = (role === 'company') 
        ? "/company/distributors/create"
        : `/distributor/create?companyId=${companyId}`;

    return (
        <Box m="10px" position="relative">
            <Box
                height={isMobile ? "19vh" : isTab ? "8vh" : "11vh"}
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
                    <Box display="flex" alignItems="center">
                        {role === 'admin' && (
                            <Button
                                color="info"
                                onClick={() => navigateTo("/company/listing")}
                                sx={{ mr: 2 }}
                                startIcon={<ArrowBackIcon />}
                            >
                                Back
                            </Button>
                        )}
                        <Typography
                            component="h2"
                            variant="h2"
                            color={colors.grey[100]}
                            fontWeight="bold"
                        >
                            {company ? `${company.name} Chain` : "Distributor Chain"}
                        </Typography>
                    </Box>

                    <Search
                        action={setDistributors}
                        api={API.DistributorAPI}
                        condition={condition}
                        getSearchData={getPaginatedData}
                        oldPagination={oldPagination}
                        reloadBtn={reloadBtn}
                        setSearchFlag={setSearchFlag}
                    />

                    {company && (
                        <Button
                            type="submit"
                            color="success"
                            variant="contained"
                            startIcon={<PersonAddIcon />}
                            onClick={() => navigateTo(createPath)}
                            sx={{ height: isTab ? "4vh" : "auto", textTransform: "none" }}
                        >
                            Add Distributor
                        </Button>
                    )}
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
                type="button"
                onClick={handleReload}
            >
                <span style={{ display: "inherit", marginRight: "5px", marginLeft: "-2px" }}>
                    <ReplayIcon />
                </span>
                Back
            </Button>

            <ServerPaginationGrid
                action={setDistributors}
                api={API.DistributorAPI}
                condition={condition}
                getQuery={getPaginatedData}
                columns={columns}
                rows={listData.rows || []}
                count={listData.count || 0}
                noRowsLabel="No distributors allotted yet"
                selected="Allotted Distributor Chain"
                loading={distributorLoading}
                pageSizeOptions={pageSizeOptions}
                setOldPagination={setOldPagination}
                searchFlag={searchFlag}
                setSearchFlag={setSearchFlag}
            />
        </Box>
    );
};

export default DistributorChainComponent;
