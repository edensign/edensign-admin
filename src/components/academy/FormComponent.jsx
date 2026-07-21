/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use, reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import { Box, Button, TextField, useMediaQuery, MenuItem, Typography, useTheme } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import API from "../../apis";
import { setMenuItem } from "../../redux/actions/NavigationAction";
import { tokens } from "../../theme";
import { Utility } from "../utility";
import Toast from "../common/Toast";

const categories = ["Salon Growth", "Technical Skills", "Product Guides", "Marketing"];

const checkoutSchema = yup.object().shape({
    title: yup.string().required("Required"),
    youtube_link: yup.string().required("Required"),
    category: yup.string().required("Required"),
    description: yup.string(),
    duration: yup.string(),
    status: yup.string().required("Required"),
});

const initialValues = {
    title: "",
    youtube_link: "",
    category: "Technical Skills",
    description: "",
    duration: "",
    status: "active",
};

const FormComponent = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { id } = useParams();
    const navigateTo = useNavigate();
    const dispatch = useDispatch();
    const [initialFormValues, setInitialFormValues] = useState(initialValues);
    const selected = useSelector(state => state.menuItems.selected);
    const toastInfo = useSelector(state => state.toastInfo);
    const { getLocalStorage, toastAndNavigate } = Utility();

    useEffect(() => {
        const selectedMenu = getLocalStorage("menu");
        dispatch(setMenuItem(selectedMenu.selected));

        if (id) {
            fetchCourse();
        }
    }, [id]);

    const fetchCourse = async () => {
        try {
            const response = await API.CommonAPI.getByPk(id, "academy");
            // Response payload uses { status: "Success", data: {...} }
            if (response && (response.status === "Success" || response.status === 200) && response.data) {
                setInitialFormValues(response.data);
            } else {
                toastAndNavigate(dispatch, true, "error", "Failed to load course details");
            }
        } catch (error) {
            console.error("Error fetching course:", error);
            toastAndNavigate(dispatch, true, "error", "Failed to load course details");
        }
    };

    const handleFormSubmit = async (values) => {
        try {
            let response;
            if (id) {
                response = await API.AcademyAPI.update({ ...values, id });
            } else {
                response = await API.AcademyAPI.create(values);
            }

            // Axios returns the HTTP response — check response.data for payload
            const payload = response?.data || response;
            if (response?.status === 200 || payload?.status === "Success") {
                toastAndNavigate(
                    dispatch, true, "success",
                    id ? "Course updated successfully!" : "Course created successfully!",
                    navigateTo, "/academy/listing"
                );
            } else {
                toastAndNavigate(dispatch, true, "error", payload?.msg || "Failed to save course");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            toastAndNavigate(dispatch, true, "error", error?.response?.data?.msg || "Error saving course");
        }
    };

    return (
        <Box m="20px">
            <Box
                height="10vh"
                borderRadius="4px"
                padding="2vh"
                backgroundColor={colors.blueAccent[700]}
                mb="20px"
            >
                <Typography component="h2" variant="h2" color={colors.grey[100]} fontWeight="bold">
                    {id ? "Update" : "Create"} {selected}
                </Typography>
            </Box>

            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialFormValues}
                validationSchema={checkoutSchema}
                enableReinitialize={true}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                }) => (
                    <form onSubmit={handleSubmit}>
                        <Box
                            display="grid"
                            gap="30px"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            sx={{
                                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                            }}
                        >
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Title"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.title}
                                name="title"
                                error={!!touched.title && !!errors.title}
                                helperText={touched.title && errors.title}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                select
                                label="Category"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.category}
                                name="category"
                                error={!!touched.category && !!errors.category}
                                helperText={touched.category && errors.category}
                                sx={{ gridColumn: "span 2" }}
                            >
                                {categories.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="YouTube Link"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.youtube_link}
                                name="youtube_link"
                                error={!!touched.youtube_link && !!errors.youtube_link}
                                helperText={touched.youtube_link && errors.youtube_link}
                                sx={{ gridColumn: "span 4" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Duration (e.g. 10:45)"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.duration}
                                name="duration"
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                select
                                label="Status"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.status}
                                name="status"
                                sx={{ gridColumn: "span 2" }}
                            >
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="inactive">Inactive</MenuItem>
                            </TextField>
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Description"
                                multiline
                                rows={4}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.description}
                                name="description"
                                sx={{ gridColumn: "span 4" }}
                            />
                        </Box>
                        <Box display="flex" justifyContent="end" mt="20px">
                            <Button type="submit" color="secondary" variant="contained">
                                {id ? "Update" : "Create"} Course
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>

            <Toast
                alerting={toastInfo.toastAlert}
                severity={toastInfo.toastSeverity}
                message={toastInfo.toastMessage}
            />
        </Box>
    );
};

export default FormComponent;
