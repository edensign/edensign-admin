/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
*/

import React, { useState } from "react";

import { useFormik } from "formik";
import { Box, FormControl, InputLabel, MenuItem, Select, TextField, useMediaQuery } from "@mui/material";

import addressValidation from "./Validation";
import { useEffect } from "react";

const initialValues = {
    street: "",
    landmark: "",
    country: "",
    state: "",
    city: ""
};

const AddressFormComponent = ({ onChange, refId, setDirty, reset, setReset, updatedValues = null }) => {
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const [initialState, setInitialState] = useState(initialValues);
    // const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: initialState,
        validationSchema: addressValidation,
        enableReinitialize: true,
        onSubmit: () => watchForm(),
    });

    React.useImperativeHandle(refId, () => ({
        Submit: async () => {
            await formik.submitForm();
        }
    }));

    const watchForm = () => {
        if (onChange) {
            onChange({
                values: formik.values,
                validated: formik.isSubmitting
                    ? Object.keys(formik.errors).length === 0
                    : false
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
                        name="street"
                        label="Street"
                        autoComplete="new-street"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.street}
                        error={!!formik.touched.street && !!formik.errors.street}
                        helperText={formik.touched.street && formik.errors.street}
                        sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        name="landmark"
                        label="Landmark"
                        autoComplete="new-landmark"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.landmark}
                        error={!!formik.touched.landmark && !!formik.errors.landmark}
                        helperText={formik.touched.landmark && formik.errors.landmark}
                        sx={{ gridColumn: "span 2" }}
                    />
                    <FormControl variant="filled" sx={{ minWidth: 120 }}>
                        <InputLabel id="countryField">Country</InputLabel>
                        <Select
                            variant="filled"
                            labelId="countryField"
                            label="Country"
                            name="country"
                            autoComplete="new-country"
                            value={formik.values.country}
                            onChange={formik.handleChange}
                            error={!!formik.touched.country && !!formik.errors.country}
                        >
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="filled" sx={{ minWidth: 120 }}>
                        <InputLabel id="stateField">State</InputLabel>
                        <Select
                            variant="filled"
                            labelId="stateField"
                            label="State"
                            name="state"
                            autoComplete="new-state"
                            value={formik.values.state}
                            onChange={formik.handleChange}
                            error={!!formik.touched.state && !!formik.errors.state}
                        >
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="filled" sx={{ minWidth: 120 }}>
                        <InputLabel id="cityField">City</InputLabel>
                        <Select
                            variant="filled"
                            labelId="cityField"
                            label="City"
                            name="city"
                            autoComplete="new-city"
                            value={formik.values.city}
                            onChange={formik.handleChange}
                            error={!!formik.touched.city && !!formik.errors.city}
                        >
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </form>
        </Box>
    );
}

export default AddressFormComponent;
