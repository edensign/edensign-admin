/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * stricted rights software. The use, reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
*/

import React, { useState, useEffect } from "react";
import { useFormik } from "formik";

import { Autocomplete, Box, Checkbox, Select, TextField, useMediaQuery } from "@mui/material";
import { InputLabel, MenuItem, FormControl, FormHelperText, FormControlLabel } from "@mui/material";

// import salonValidation from "./Validation";

const ProductFormComponent = ({
    onChange,
    refId,
    setDirty,
    reset,
    setReset,
    updatedValues = null
}) => {

    const checkboxLabel = { inputProps: { 'aria-label': 'Checkboxes' } };
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const isMobile = useMediaQuery("(max-width:480px)");

    const initialValues = {
        name: "",
        brand: "",
        price: "",
        color: "",
        capacity: "",
        description: "",
        is_home: false,
        is_bestseller: false,
        discounted_price: "",
        discount_percent: '',
        status: "inactive"
    };

    const [initialState, setInitialState] = useState(initialValues);

    const formik = useFormik({
        initialValues: initialState,
        // validationSchema: salonValidation,
        enableReinitialize: true,
        onSubmit: () => watchForm()
    });

    React.useImperativeHandle(refId, () => ({
        Submit: async () => {
            await formik.submitForm();
            return {
                values: formik.values,
                validated: Object.keys(formik.errors).length === 0
            };
        }
    }));

    const watchForm = () => {
        if (onChange) {
            onChange({
                values: formik.values,
                validated: formik.isSubmitting
                    ? Object.keys(formik.errors).length === 0
                    : false,
            });
        };
    }

    useEffect(() => {
        if (reset) {
            formik.resetForm();
            setReset(false);
        }
    }, [reset]);

    useEffect(() => {
        if (formik.dirty) {
            setDirty(true);
        }
    }, [formik.dirty]);

    useEffect(() => {
        if (updatedValues) {
            setInitialState(updatedValues);
        }
    }, [updatedValues]);


    const calculatediscountPercent = () => {
        const price = parseFloat(formik.values.price);
        const discountedPrice = parseFloat(formik.values.discounted_price);
        if (!isNaN(price) && !isNaN(discountedPrice) && price > 0 && discountedPrice >= 0) {
            const discountPercent = ((price - discountedPrice) / price) * 100;
            formik.setFieldValue('discount_percent', discountPercent.toFixed(2));
        } else {
            formik.setFieldValue('discount_percent', '');
        }
    };

    useEffect(() => {
        calculatediscountPercent();
    }, [formik.values.price, formik.values.discounted_price]);


    return (
        <Box m="20px">
            <form ref={refId}>
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
                        name="name"
                        label="Name*"
                        autoComplete="new-name"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.name}
                        error={!!formik.touched.name && !!formik.errors.name}
                        helperText={formik.touched.name && formik.errors.name}
                        sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Brand*"
                        name="brand"
                        autoComplete="new-brand"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.brand}
                        error={!!formik.touched.brand && !!formik.errors.brand}
                        helperText={formik.touched.brand && formik.errors.brand}
                        sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Price*"
                        name="price"
                        autoComplete="new-contact"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.price}
                        error={!!formik.touched.price && !!formik.errors.price}
                        helperText={formik.touched.price && formik.errors.price}
                        sx={{ gridColumn: "span 2" }}
                    />

                    <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        name="discounted_price"
                        label="discounted Price"
                        autoComplete=""
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.discounted_price}
                        error={!!formik.touched.discounted_price && !!formik.errors.discounted_price}
                        helperText={formik.touched.discounted_price && formik.errors.discounted_price}
                    // sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        name="discount_percent"
                        label="Discount Percent"
                        autoComplete=""
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.discount_percent}
                        error={!!formik.touched.discount_percent && !!formik.errors.discount_percent}
                        helperText={formik.touched.discount_percent && formik.errors.discount_percent}
                    // sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        name="color"
                        label="Color"
                        autoComplete="new-color"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.color}
                        error={!!formik.touched.color && !!formik.errors.color}
                        helperText={formik.touched.color && formik.errors.color}
                        sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        name="capacity"
                        label="Capacity"
                        autoComplete="new-capacity"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.capacity}
                        error={!!formik.touched.capacity && !!formik.errors.capacity}
                        helperText={formik.touched.capacity && formik.errors.capacity}
                        sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        name="description"
                        label="Description"
                        autoComplete="new-description"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.description}
                        error={!!formik.touched.description && !!formik.errors.description}
                        helperText={formik.touched.description && formik.errors.description}
                        sx={{ gridColumn: "span 4" }}
                    />
                    <FormControlLabel label="Is Home" sx={{ gridColumn: isMobile ? "span 2" : "" }}
                        control={
                            <Checkbox {...checkboxLabel} color="default"
                                checked={formik.values.is_home ? true : false}
                                name="is_home"
                                onChange={(event, value) => formik.setFieldValue("is_home", value)}
                                value={formik.values.is_home}
                            />
                        } />
                    <FormControlLabel label="Is BestSeller" sx={{ gridColumn: isMobile ? "span 2" : "" }}
                        control={
                            <Checkbox {...checkboxLabel} color="default"
                                checked={formik.values.is_bestseller ? true : false}
                                name="is_bestseller"
                                onChange={(event, value) => formik.setFieldValue("is_bestseller", value)}
                                value={formik.values.is_bestseller}
                            />
                        } />
                    <FormControl variant="filled" sx={{ minWidth: 120 }}
                        error={!!formik.touched.status && !!formik.errors.status}
                    >
                        <InputLabel id="statusField">Status</InputLabel>
                        <Select
                            variant="filled"
                            labelId="statusField"
                            label="Status"
                            name="status"
                            autoComplete="new-status"
                            onChange={formik.handleChange}
                            value={formik.values.status}
                        >
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="inactive">Inactive</MenuItem>
                        </Select>
                        <FormHelperText>{formik.touched.status && formik.errors.status}</FormHelperText>
                    </FormControl>
                </Box>
            </form >
        </Box >
    );
}

export default ProductFormComponent;
