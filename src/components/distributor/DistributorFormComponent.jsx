/**
 * Copyright © 2026, Eden Sign Inc. ALL RIGHTS RESERVED.
 */

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Typography, TextField, FormControl, InputLabel, Select, MenuItem, useTheme, InputAdornment, IconButton } from "@mui/material";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

import API from "../../apis";
import Loader from "../common/Loader";
import Toast from "../common/Toast";
import { setMenuItem } from "../../redux/actions/NavigationAction";
import { tokens, themeSettings } from "../../theme";
import { Utility } from "../utility";

const initialValues = {
    username: "",
    password: "",
    email: "",
    contact_no: "",
    name: "",
    company_id: "",
    address: "",
    status: "active"
};

const DistributorFormComponent = () => {
    const navigateTo = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const location = useLocation();

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { typography } = themeSettings(theme.palette.mode);

    const toastInfo = useSelector(state => state.toastInfo);
    const { toastAndNavigate, getLocalStorage, getRole } = Utility();

    const [companies, setCompanies] = useState([]);
    const [formValues, setFormValues] = useState(initialValues);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("Create");
    const [showPasswordField, setShowPasswordField] = useState(true);

    const id = params?.id; // Distributor profile ID
    const role = getRole();

    // Check if companyId was passed via query params (e.g. for admin adding distributor directly from company screen)
    const queryParams = new URLSearchParams(location.search);
    const queryCompanyId = queryParams.get("companyId");

    useEffect(() => {
        const selectedMenu = getLocalStorage("menu");
        dispatch(setMenuItem(selectedMenu?.selected || "Distributors"));

        const loadCompanies = async () => {
            if (role === 'admin') {
                try {
                    const res = await API.CompanyAPI.getAll(false, 0, 100);
                    if (res && res.status === "Success") {
                        setCompanies(res.data.rows || []);
                    }
                } catch (err) {
                    console.error("Error loading companies list:", err);
                }
            } else if (role === 'company') {
                try {
                    const res = await API.CompanyAPI.getProfile();
                    if (res && res.data && res.data.status === "Success") {
                        const compData = res.data.data;
                        setFormValues(prev => ({
                            ...prev,
                            company_id: compData.id
                        }));
                    }
                } catch (err) {
                    console.error("Error loading company profile:", err);
                }
            }
        };

        const loadDistributorData = async (distId) => {
            setLoading(true);
            try {
                const distRes = await API.CommonAPI.getByPk(distId, "distributor");
                if (distRes && distRes.data) {
                    const distData = distRes.data;

                    const userRes = await API.CommonAPI.getByPk(distData.user_id, "users");
                    const userData = userRes?.data || {};

                    setFormValues({
                        id: distData.id,
                        user_id: distData.user_id,
                        username: userData.username || "",
                        password: "",
                        email: distData.email || "",
                        contact_no: distData.contact_no || "",
                        name: distData.name || "",
                        company_id: distData.company_id || "",
                        address: distData.address || "",
                        status: distData.status || "active"
                    });
                    setTitle("Update");
                    setShowPasswordField(false);
                }
            } catch (err) {
                console.error("Error loading distributor data:", err);
            } finally {
                setLoading(false);
            }
        };

        loadCompanies().then(() => {
            if (id) {
                loadDistributorData(id);
            } else if (queryCompanyId) {
                setFormValues(prev => ({
                    ...prev,
                    company_id: queryCompanyId
                }));
            }
        });
    }, [id, role, queryCompanyId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const cancelPath = (role === 'company') 
            ? "/company/distributors/listing" 
            : "/distributor/listing";

        try {
            if (id) {
                // Update distributor
                const payload = { ...formValues };
                if (!payload.password) delete payload.password;

                const res = await API.DistributorAPI.updateDistributor(payload);
                if (res && res.data.status === "Success") {
                    toastAndNavigate(dispatch, true, "success", "Distributor profile updated successfully", navigateTo, cancelPath);
                } else {
                    toastAndNavigate(dispatch, true, "error", res?.data?.msg || "Update failed");
                }
            } else {
                // Create distributor
                const res = await API.DistributorAPI.createDistributor(formValues);
                if (res && res.data.status === "Success") {
                    toastAndNavigate(dispatch, true, "success", "Distributor created successfully", navigateTo, cancelPath);
                } else {
                    toastAndNavigate(dispatch, true, "error", res?.data?.msg || "Creation failed");
                }
            }
        } catch (err) {
            console.error("Error saving distributor:", err);
            toastAndNavigate(dispatch, true, "error", err?.response?.data?.msg || "An Error Occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (role === 'company') {
            navigateTo("/company/distributors/listing");
        } else {
            navigateTo("/distributor/listing");
        }
    };

    return (
        <Box m="20px">
            <Typography
                fontFamily={typography.fontFamily}
                fontSize={typography.h2.fontSize}
                color={colors.grey[100]}
                fontWeight="bold"
                display="inline-block"
                marginLeft="20px"
                marginBottom="20px"
            >
                {`${title} Distributor Profile`}
            </Typography>

            <form onSubmit={handleSubmit}>
                <Box
                    display="grid"
                    gap="30px"
                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                    sx={{
                        "& > div": { gridColumn: "span 4" },
                        "@media (min-width: 600px)": {
                            "& > div": { gridColumn: "span 2" }
                        }
                    }}
                >
                    <Typography variant="h4" fontWeight="bold" sx={{ gridColumn: "span 4", mt: 2, mb: 1, color: colors.greenAccent[400] }}>
                        Distributor Details
                    </Typography>

                    <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        name="name"
                        label="Distributor Name*"
                        value={formValues.name}
                        onChange={handleInputChange}
                        required
                    />

                    {role === 'admin' ? (
                        <FormControl variant="filled" fullWidth required>
                            <InputLabel id="company-label">Allotted Company*</InputLabel>
                            <Select
                                labelId="company-label"
                                name="company_id"
                                value={formValues.company_id}
                                onChange={handleInputChange}
                            >
                                {companies.map(comp => (
                                    <MenuItem key={comp.id} value={comp.id}>
                                        {comp.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    ) : (
                        <TextField
                            fullWidth
                            variant="filled"
                            label="Allotted Company ID"
                            value={formValues.company_id}
                            disabled
                        />
                    )}

                    <TextField
                        fullWidth
                        variant="filled"
                        type="email"
                        name="email"
                        label="Distributor Email*"
                        value={formValues.email}
                        onChange={handleInputChange}
                        required
                    />

                    <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        name="contact_no"
                        label="Contact Number*"
                        value={formValues.contact_no}
                        onChange={handleInputChange}
                        required
                    />

                    <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        name="address"
                        label="Address"
                        value={formValues.address}
                        onChange={handleInputChange}
                        sx={{ gridColumn: "span 4" }}
                    />

                    <Typography variant="h4" fontWeight="bold" sx={{ gridColumn: "span 4", mt: 4, mb: 1, color: colors.greenAccent[400] }}>
                        Distributor User Credentials
                    </Typography>

                    <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        name="username"
                        label="Username*"
                        value={formValues.username}
                        onChange={handleInputChange}
                        required
                    />

                    <FormControl variant="filled" fullWidth>
                        <InputLabel id="status-label">Status</InputLabel>
                        <Select
                            labelId="status-label"
                            name="status"
                            value={formValues.status}
                            onChange={handleInputChange}
                        >
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="inactive">Inactive</MenuItem>
                        </Select>
                    </FormControl>

                    {showPasswordField ? (
                        <TextField
                            fullWidth
                            variant="filled"
                            label="Password*"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formValues.password}
                            onChange={handleInputChange}
                            required={!id}
                            sx={{ gridColumn: "span 2" }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    ) : (
                        <Button
                            variant="outlined"
                            color="info"
                            onClick={() => setShowPasswordField(true)}
                            sx={{ alignSelf: "center", gridColumn: "span 2", height: "55px" }}
                        >
                            Change Password
                        </Button>
                    )}
                </Box>

                {/* Form Buttons */}
                <Box display="flex" justifyContent="end" m="20px">
                    <Button
                        color="error"
                        variant="contained"
                        sx={{ mr: 3 }}
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        color={title === "Update" ? "info" : "success"}
                        variant="contained"
                    >
                        Submit
                    </Button>
                </Box>
            </form>
            <Toast
                alerting={toastInfo.toastAlert}
                severity={toastInfo.toastSeverity}
                message={toastInfo.toastMessage}
            />
            {loading && <Loader />}
        </Box>
    );
};

export default DistributorFormComponent;
