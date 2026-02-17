/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use, reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
*/

import React, { useState, useEffect } from "react";

import { useFormik } from "formik";
import { Autocomplete, Box, Divider, FormControl, InputLabel, TextField, useMediaQuery } from "@mui/material";
import { Chip, MenuItem, Select } from "@mui/material";

import employeeValidation from "./Validation";

const initialValues = {
    name: "",
    email: "",
    contact_no: "",
    services: [],
    gender: "",
    age: "",
    slots: ""
};

const ChildEmployeeFormComponent = ({
    index,
    refId,
    onChange,
    employeeValues,
    setEmployeeValues,
    reset,
    setReset,
    setDirty,
    services,
    updatedValues = null
}) => {

    const [initialState, setInitialState] = useState(initialValues);
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const formik = useFormik({
        initialValues: initialState,
        validationSchema: employeeValidation,
        enableReinitialize: true,
        onSubmit: () => watchForm()
    });


    React.useImperativeHandle(refId, () => ({
        Submit: async () => {
            await formik.submitForm();
            // setEmployeeValues({ ...formik.values })
        }
    }));

    const watchForm = async () => {
        if (onChange) {
            onChange({
                values: formik.values,
                validated: formik.isSubmitting
                    ? Object.keys(formik.errors).length === 0
                    : false
            });
            await setEmployeeValues(prevState => ({
                ...prevState,
                name: formik.values.name,
                email: formik.values.email,
                contact_no: formik.values.contact_no,
                services: formik.values.services,
                gender: formik.values.gender,
                gender: formik.values.gender,
                age: formik.values.age,
                slots: formik.values.slots ? formik.values.slots.split(',').map(s => s.trim()) : []
            }))
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
    console.log("Child values=>", formik.values);

    return (
        <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            width="99%"
            sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" }
            }}
        >
            <TextField
                fullWidth
                variant="filled"
                type="text"
                name="name"
                label="Salon Employee Name*"
                autoComplete="new-name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.name}
                error={!!formik.touched.name && !!formik.errors.name}
                helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Salon Employee Email"
                name="email"
                autoComplete="new-email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.email}
                error={!!formik.touched.email && !!formik.errors.email}
                helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Salon Employee Contact Number*"
                name="contact_no"
                autoComplete="new-contact"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.contact_no}
                error={!!formik.touched.contact_no && !!formik.errors.contact_no}
                helperText={formik.touched.contact_no && formik.errors.contact_no}
                sx={{ gridColumn: "span 2" }}
            />

            <Autocomplete
                multiple
                options={services}
                getOptionLabel={option => option.name}
                disableCloseOnSelect
                value={formik.values.services}
                onChange={(event, value) => formik.setFieldValue("services", value)}
                sx={{ gridColumn: "span 2" }}
                renderInput={params => (
                    <TextField
                        {...params}
                        variant="filled"
                        type="text"
                        name="services"
                        label="Salon Employee Services"
                        error={!!formik.touched.services && !!formik.errors.services}
                        helperText={formik.touched.services && formik.errors.services}
                    />
                )}
            />
            <FormControl variant="filled" sx={{ minWidth: 120 }}>
                <InputLabel id="genderField">Gender</InputLabel>
                <Select
                    variant="filled"
                    labelId="genderField"
                    label="Gender"
                    name="gender"
                    autoComplete="new-gender"
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                    error={!!formik.touched.gender && !!formik.errors.gender}
                >
                    <MenuItem value={"male"}>Male</MenuItem>
                    <MenuItem value={"female"}>Female</MenuItem>
                    <MenuItem value={"other"}>Other</MenuItem>
                </Select>
            </FormControl>
            <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Salon Employee Age"
                name="age"
                autoComplete="new-age"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.age}
                error={!!formik.touched.age && !!formik.errors.age}
                helperText={formik.touched.age && formik.errors.age}
            />
            <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Slots (comma separated)"
                name="slots"
                placeholder="e.g. 10:00-11:00, 12:00-1:00"
                autoComplete="new-slots"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.slots}
                error={!!formik.touched.slots && !!formik.errors.slots}
                helperText={formik.touched.slots && formik.errors.slots}
                sx={{ gridColumn: "span 4" }}
            />
            <Divider variant="fullWidth" sx={{ gridColumn: "span 4" }}>
                <Chip color="info" label={`${index} Employee Detail`}
                    sx={{
                        fontSize: "13px", fontWeight: "600", letterSpacing: "0.2em", padding: "12px", textTransform: "capitalize"
                    }}
                />
            </Divider>
        </Box>
    );
}

export default ChildEmployeeFormComponent;
