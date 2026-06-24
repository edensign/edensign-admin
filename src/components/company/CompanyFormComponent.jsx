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
    category_id: "",
    address: "",
    description: "",
    status: "active"
};

const CompanyFormComponent = () => {
    const navigateTo = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const { state } = useLocation();

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { typography } = themeSettings(theme.palette.mode);

    const toastInfo = useSelector(state => state.toastInfo);
    const { toastAndNavigate, getLocalStorage } = Utility();

    const [categories, setCategories] = useState([]);
    const [formValues, setFormValues] = useState(initialValues);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("Create");
    const [showPasswordField, setShowPasswordField] = useState(true);

    const id = params?.id; // Company profile ID

    // Load categories & company details if updating
    useEffect(() => {
        const selectedMenu = getLocalStorage("menu");
        dispatch(setMenuItem(selectedMenu?.selected || "Company Profile"));

        const loadCategories = async () => {
            try {
                const res = await API.CategoryAPI.getAll();
                if (res && res.status === "Success") {
                    setCategories(res.data);
                }
            } catch (err) {
                console.error("Error loading categories:", err);
            }
        };

        const loadCompanyData = async (companyId) => {
            setLoading(true);
            try {
                // Fetch company profile
                const compRes = await API.CommonAPI.getByPk(companyId, "company");
                if (compRes && compRes.data) {
                    const compData = compRes.data;
                    
                    // Fetch user details linked to company
                    const userRes = await API.CommonAPI.getByPk(compData.user_id, "users");
                    const userData = userRes?.data || {};

                    setFormValues({
                        id: compData.id,
                        user_id: compData.user_id,
                        username: userData.username || "",
                        password: "",
                        email: compData.email || "",
                        contact_no: compData.contact_no || "",
                        name: compData.name || "",
                        category_id: compData.category_id || "",
                        address: compData.address || "",
                        description: compData.description || "",
                        status: compData.status || "active"
                    });
                    setTitle("Update");
                    setShowPasswordField(false); // Hide password updating by default
                }
            } catch (err) {
                console.error("Error loading company details:", err);
            } finally {
                setLoading(false);
            }
        };

        loadCategories().then(() => {
            if (id) {
                loadCompanyData(id);
            } else if (state?.categoryId) {
                // If pre-selecting category from Category cards
                setFormValues(prev => ({
                    ...prev,
                    category_id: state.categoryId
                }));
            }
        });
    }, [id]);

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

        try {
            if (id) {
                // Update company
                const payload = { ...formValues };
                if (!payload.password) delete payload.password; // Don't update password if empty

                const res = await API.CompanyAPI.updateCompany(payload);
                if (res && res.data.status === "Success") {
                    toastAndNavigate(dispatch, true, "success", "Company profile updated successfully", navigateTo, "/company/listing");
                } else {
                    toastAndNavigate(dispatch, true, "error", res?.data?.msg || "Update failed");
                }
            } else {
                // Create company
                const res = await API.CompanyAPI.createCompany(formValues);
                if (res && res.data.status === "Success") {
                    toastAndNavigate(dispatch, true, "success", "Company profile created successfully", navigateTo, "/company/listing");
                } else {
                    toastAndNavigate(dispatch, true, "error", res?.data?.msg || "Creation failed");
                }
            }
        } catch (err) {
            console.error("Error saving company profile:", err);
            toastAndNavigate(dispatch, true, "error", err?.response?.data?.msg || "An Error Occurred");
        } finally {
            setLoading(false);
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
                {`${title} Company Profile`}
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
                        Company Details
                    </Typography>

                    <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        name="name"
                        label="Company Name*"
                        value={formValues.name}
                        onChange={handleInputChange}
                        required
                    />

                    <FormControl variant="filled" fullWidth required>
                        <InputLabel id="category-label">Category*</InputLabel>
                        <Select
                            labelId="category-label"
                            name="category_id"
                            value={formValues.category_id}
                            onChange={handleInputChange}
                        >
                            {categories.map(cat => (
                                <MenuItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        variant="filled"
                        type="email"
                        name="email"
                        label="Company Email*"
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

                    <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        name="description"
                        label="Description"
                        multiline
                        rows={3}
                        value={formValues.description}
                        onChange={handleInputChange}
                        sx={{ gridColumn: "span 4" }}
                    />

                    <Typography variant="h4" fontWeight="bold" sx={{ gridColumn: "span 4", mt: 4, mb: 1, color: colors.greenAccent[400] }}>
                        Company User Credentials
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
                        onClick={() => navigateTo("/company/listing")}
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

export default CompanyFormComponent;
