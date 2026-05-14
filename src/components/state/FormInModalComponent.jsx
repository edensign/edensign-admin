/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 */

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Formik } from "formik";
import {
    Box, Button, Dialog, Divider, FormControl, InputLabel,
    MenuItem, Select, TextField, Typography, useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import * as yup from "yup";

import API from "../../apis";
import Loader from "../common/Loader";
import Toast from "../common/Toast";
import { setMenuItem } from "../../redux/actions/NavigationAction";
import { tokens, themeSettings } from "../../theme";
import { Utility } from "../utility";

const validationSchema = yup.object().shape({
    name: yup.string().required("State name is required"),
    country_id: yup.number().required("Country is required"),
});

const initialValues = { name: "", country_id: "" };

const StateFormComponent = ({ openDialog, setOpenDialog }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { typography } = themeSettings(theme.palette.mode);
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
    const isMobile = useMediaQuery("(max-width:480px)");
    const isTab = useMediaQuery("(max-width:920px)");

    const [title, setTitle] = useState("Create");
    const [loading, setLoading] = useState(false);
    const [initialState, setInitialState] = useState(initialValues);
    const [countries, setCountries] = useState([]);

    const navigateTo = useNavigate();
    const dispatch = useDispatch();
    const selected = useSelector(state => state.menuItems.selected);
    const toastInfo = useSelector(state => state.toastInfo);
    const { state } = useLocation();
    const { toastAndNavigate, getLocalStorage } = Utility();
    let id = state?.id;

    useEffect(() => {
        const selectedMenu = getLocalStorage("menu");
        dispatch(setMenuItem(selectedMenu.selected));
        API.CountryAPI.getCountries().then(res => {
            if (res?.status === "Success") setCountries(res.data.list);
        });
        if (id) {
            setTitle("Update");
            setLoading(true);
            API.CommonAPI.multipleAPICall("GET", [`/get-by-pk/state/${id}`])
                .then(res => {
                    if (res[0].data.status === "Success") setInitialState(res[0].data.data);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        } else {
            setTitle("Create");
            setInitialState(initialValues);
        }
    }, [id]);

    const handleClose = () => setOpenDialog(false);

    const handleSubmit = (values) => {
        setLoading(true);
        const action = values.id
            ? API.StateAPI.updateState(values)
            : API.StateAPI.createState(values);

        action.then(({ data }) => {
            setLoading(false);
            if (data?.status === "Success") {
                toastAndNavigate(dispatch, true, values.id ? "info" : "success",
                    values.id ? "Successfully Updated" : "Successfully Created");
                setTimeout(() => {
                    handleClose();
                    location.href = "/state/listing";
                }, 1500);
            }
        }).catch(err => {
            setLoading(false);
            toastAndNavigate(dispatch, true, "error", err?.response?.data?.msg || "An Error Occurred");
        });
    };

    return (
        <div>
            <Dialog
                fullScreen={fullScreen}
                open={openDialog}
                onClose={handleClose}
                sx={{
                    top: isMobile ? "30%" : isTab ? "20%" : "15%",
                    height: isMobile ? "55%" : isTab ? "50%" : "70%",
                    "& .MuiPaper-root": { width: "100%" }
                }}
            >
                <Typography
                    fontFamily={typography.fontFamily}
                    fontSize={typography.h2.fontSize}
                    color={colors.grey[100]}
                    fontWeight="600"
                    textAlign="center"
                    mt="10px"
                >
                    {`${title} State`}
                </Typography>
                <Formik
                    initialValues={initialState}
                    enableReinitialize
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, dirty, isSubmitting, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm }) => (
                        <form onSubmit={handleSubmit}>
                            <Box display="grid" gap="30px" gridTemplateColumns="repeat(2, minmax(0, 1fr))" padding="20px">
                                <TextField
                                    variant="filled"
                                    type="text"
                                    name="name"
                                    label="State Name*"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.name}
                                    error={!!touched.name && !!errors.name}
                                    helperText={touched.name && errors.name}
                                />
                                <FormControl variant="filled">
                                    <InputLabel>Country*</InputLabel>
                                    <Select
                                        name="country_id"
                                        value={values.country_id}
                                        onChange={e => setFieldValue("country_id", e.target.value)}
                                        error={!!touched.country_id && !!errors.country_id}
                                    >
                                        <MenuItem value=""><em>None</em></MenuItem>
                                        {countries.map(c => (
                                            <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                            </Box>
                            <Divider />
                            <Box display="flex" justifyContent="end" p="20px" gap="10px">
                                {title === "Create" && (
                                    <Button type="reset" color="warning" variant="contained"
                                        disabled={!dirty || isSubmitting}
                                        onClick={() => { if (window.confirm("Reset form?")) resetForm(); }}
                                    >Reset</Button>
                                )}
                                <Button color="error" variant="contained" onClick={handleClose}>Cancel</Button>
                                <Button type="submit" disabled={!dirty || isSubmitting}
                                    color={title === "Update" ? "info" : "success"} variant="contained"
                                >Submit</Button>
                                <Toast alerting={toastInfo.toastAlert} severity={toastInfo.toastSeverity} message={toastInfo.toastMessage} />
                            </Box>
                        </form>
                    )}
                </Formik>
                {loading && <Loader />}
            </Dialog>
        </div>
    );
};

export default StateFormComponent;
