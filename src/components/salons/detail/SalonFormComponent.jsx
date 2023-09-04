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
import { InputLabel, MenuItem, FormControl, FormControlLabel } from "@mui/material";

import dayjs from "dayjs";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from "@mui/x-date-pickers";

import salonValidation from "./Validation";


const SalonFormComponent = ({ onChange, refId, setDirty, reset, setReset,
    showSalonFields, services, amenities, updatedValues = null }) => {

    const checkboxLabel = { inputProps: { 'aria-label': 'Checkboxes' } };
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const isMobile = useMediaQuery("(max-width:480px)");

    const initialValues = {
        name: "",
        email: "",
        contact_no: "",
        area: "",
        description: "",
        services: [],
        policies: "",
        cancellation_policy: "",
        safety_measures: "",
        amenities: [],
        near_by: "",
        priority: 0,
        occupancy: 0,
        staff_count: 0,
        is_home: false,
        is_featured: false,
        is_franchise: false,
        is_selfowned: false,
        is_subscribed: false,
        type: "",
        category: "",
        status: "inactive",
        closed_on: "",
        opening_time: null,
        closing_time: dayjs(updatedValues?.closing_time) || null,
        estd_on: dayjs(updatedValues?.estd_on) || null
    };

    const [initialState, setInitialState] = useState(initialValues);

    const formik = useFormik({
        initialValues: initialState,
        validationSchema: salonValidation,
        enableReinitialize: true,
        onSubmit: () => watchForm()
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
                    : false,
            });
        };
    }
    // console.log("formik=>", formik.values);
    // console.log("backend formik=>", updatedValues?.opening_time);
    // console.log("frontend formik=>", dayjs(updatedValues?.opening_time));

    // console.log("backend formik=>", updatedValues?.estd_on);
    // console.log("frontend formik=>", dayjs(updatedValues?.estd_on));
    // const datevar = dayjs(Date.now())
    // const arr = Object.entries(datevar)
    // console.log((arr[2][1]))

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
                        label="Email*"
                        name="email"
                        autoComplete="new-email"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        error={!!formik.touched.email && !!formik.errors.email}
                        helperText={formik.touched.email && formik.errors.email}
                        sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Contact Number*"
                        name="contact_no"
                        autoComplete="new-contact"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.contact_no}
                        error={!!formik.touched.contact_no && !!formik.errors.contact_no}
                        helperText={formik.touched.contact_no && formik.errors.contact_no}
                        sx={{ gridColumn: "span 2" }}
                    />
                    {showSalonFields && <>
                        <FormControl variant="filled" sx={{ minWidth: 120 }}>
                            <InputLabel id="categoryField">Category</InputLabel>
                            <Select
                                variant="filled"
                                labelId="categoryField"
                                label="Category"
                                name="category"
                                autoComplete="new-category"
                                onChange={formik.handleChange}
                                value={formik.values.category}
                                error={!!formik.touched.category && !!formik.errors.category}
                            >
                                <MenuItem value="A">A</MenuItem>
                                <MenuItem value="B">B</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl variant="filled" sx={{ minWidth: 120 }}>
                            <InputLabel id="statusField">Status</InputLabel>
                            <Select
                                variant="filled"
                                labelId="statusField"
                                label="Status"
                                name="status"
                                autoComplete="new-status"
                                onChange={formik.handleChange}
                                value={formik.values.status}
                                error={!!formik.touched.status && !!formik.errors.status}
                            >
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="inactive">Inactive</MenuItem>
                            </Select>
                        </FormControl>
                    </>}

                    <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        name="area"
                        label="Area"
                        autoComplete="new-area"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.area}
                        error={!!formik.touched.area && !!formik.errors.area}
                        helperText={formik.touched.area && formik.errors.area}
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
                                label="Services"
                                error={!!formik.touched.services && !!formik.errors.services}
                                helperText={formik.touched.services && formik.errors.services}
                            />
                        )}
                    />
                    <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        name="policies"
                        label="Policies"
                        autoComplete="new-policies"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.policies}
                        error={!!formik.touched.policies && !!formik.errors.policies}
                        helperText={formik.touched.policies && formik.errors.policies}
                        sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        name="cancellation_policy"
                        label="Cancellation Policy"
                        autoComplete="new-cancellation_policy"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.cancellation_policy}
                        error={!!formik.touched.cancellation_policy && !!formik.errors.cancellation_policy}
                        helperText={formik.touched.cancellation_policy && formik.errors.cancellation_policy}
                        sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        name="safety_measures"
                        label="Safety Measures"
                        autoComplete="new-safety_measures"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.safety_measures}
                        error={!!formik.touched.safety_measures && !!formik.errors.safety_measures}
                        helperText={formik.touched.safety_measures && formik.errors.safety_measures}
                        sx={{ gridColumn: "span 2" }}
                    />
                    {/* <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        name="amenities"
                        label="Amenities"
                        autoComplete="new-amenities"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.amenities}
                        error={!!formik.touched.amenities && !!formik.errors.amenities}
                        helperText={formik.touched.amenities && formik.errors.amenities}
                        sx={{ gridColumn: "span 2" }}
                    /> */}

                    {/* <FormControl variant="filled" sx={{ minWidth: 120 }}
                        error={!!formik.touched.amenities && !!formik.errors.amenities}
                    >
                        <InputLabel id="amenitiesField">--Select Amenities--</InputLabel>
                        <Select
                            autoComplete="new-amenities"
                            defaultValue=""
                            name="amenities"
                            variant="filled"
                            value={formik.values.amenities}
                            onChange={event => formik.setFieldValue("amenities", event.target.value)}
                        >
                            {amenities.map(item => (
                                <MenuItem value={item.id} name={item.name} key={item.name}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{formik.touched.amenities && formik.errors.amenities}</FormHelperText>
                    </FormControl> */}

                    <Autocomplete
                        sx={{ gridColumn: "span 2" }}
                        multiple
                        options={amenities}
                        getOptionLabel={option => option.name}
                        disableCloseOnSelect
                        value={formik.values.amenities}
                        onChange={(event, value) => formik.setFieldValue("amenities", value)}
                        renderInput={params => (
                            <TextField
                                {...params}
                                variant="filled"
                                type="text"
                                name="amenities"
                                label="Amenities"
                                error={!!formik.touched.amenities && !!formik.errors.amenities}
                                helperText={formik.touched.amenities && formik.errors.amenities}
                            />
                        )}
                    />

                    <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        name="near_by"
                        label="Near By"
                        autoComplete="new-near_by"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.near_by}
                        error={!!formik.touched.near_by && !!formik.errors.near_by}
                        helperText={formik.touched.near_by && formik.errors.near_by}
                        sx={{ gridColumn: "span 2" }}
                    />
                    <FormControl variant="filled" sx={{ minWidth: 120 }}>
                        <InputLabel id="typeField">Type</InputLabel>
                        <Select
                            variant="filled"
                            labelId="typeField"
                            label="Type"
                            name="type"
                            autoComplete="new-type"
                            onChange={formik.handleChange}
                            value={formik.values.type}
                            error={!!formik.touched.type && !!formik.errors.type}
                            sx={{ gridColumn: "span 2" }}
                        >
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="unisex">Unisex</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl variant="filled" sx={{ minWidth: 120 }}>
                        <InputLabel id="closedOnField">Closed On</InputLabel>
                        <Select
                            variant="filled"
                            labelId="closedOnField"
                            label="Closed On"
                            name="closed_on"
                            autoComplete="new-closed_on"
                            onChange={formik.handleChange}
                            value={formik.values.closed_on}
                            error={!!formik.touched.closed_on && !!formik.errors.closed_on}
                        >
                            <MenuItem value="sunday">Sunday</MenuItem>
                            <MenuItem value="monday">Monday</MenuItem>
                            <MenuItem value="tuesday">Tuesday</MenuItem>
                            <MenuItem value="wednesday">Wednesday</MenuItem>
                            <MenuItem value="thursday">Thursday</MenuItem>
                            <MenuItem value="friday">Friday</MenuItem>
                            <MenuItem value="saturday">Saturday</MenuItem>
                        </Select>
                    </FormControl>

                    {showSalonFields && <>
                        <FormControlLabel label="Is Home" sx={{ gridColumn: isMobile ? "span 2" : "" }}
                            control={
                                <Checkbox {...checkboxLabel} color="default"
                                    checked={formik.values.is_home ? true : false}
                                    name="is_home"
                                    onChange={(event, value) => formik.setFieldValue("is_home", value)}
                                    value={formik.values.is_home}
                                />
                            } />
                        <FormControlLabel label="Is Featured" sx={{ gridColumn: isMobile ? "span 2" : "" }}
                            control={
                                <Checkbox {...checkboxLabel} color="default"
                                    checked={formik.values?.is_featured}
                                    name="is_featured"
                                    onChange={(event, value) => formik.setFieldValue("is_featured", value)}
                                    value={formik.values.is_featured}
                                />
                            } />
                        <FormControlLabel label="Is Subscribed" sx={{ gridColumn: isMobile ? "span 2" : "" }}
                            control={
                                <Checkbox {...checkboxLabel} color="default"
                                    checked={formik.values?.is_subscribed}
                                    name="is_subscribed"
                                    onChange={(event, value) => formik.setFieldValue("is_subscribed", value)}
                                    value={formik.values.is_subscribed}
                                />
                            } />
                    </>}
                    <FormControlLabel label="Is Franchise" sx={{ gridColumn: isMobile ? "span 2" : "" }}
                        control={
                            <Checkbox {...checkboxLabel} color="default"
                                checked={formik.values?.is_franchise}
                                name="is_franchise"
                                onChange={(event, value) => formik.setFieldValue("is_franchise", value)}
                                value={formik.values.is_franchise}
                            />
                        } />
                    <FormControlLabel label="Is Self Owned" sx={{ gridColumn: isMobile ? "span 2" : "" }}
                        control={
                            <Checkbox {...checkboxLabel} color="default"
                                checked={formik.values?.is_selfowned}
                                name="is_selfowned"
                                onChange={(event, value) => formik.setFieldValue("is_selfowned", value)}
                                value={formik.values.is_selfowned}
                            />
                        } />

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                            onChange={newOpeningTime => {
                                console.log(newOpeningTime)
                                formik.setFieldValue("opening_time", newOpeningTime);
                            }}
                            value={dayjs(initialState.opening_time)}
                            format="h:mm A"
                            views={['hours', "minutes"]}
                            label="Opening Time"
                            name="opening_time"
                        // InputProps={{
                        //         variant: "outlined",
                        //     placeholder: dayjs().format("h:mm"),
                        //         error: formik.touched.opening_time && Boolean(formik.errors.opening_time),
                        //         helperText: formik.touched.opening_time && formik.errors.opening_time
                        // }}
                        />
                        <TimePicker
                            format="h:mm A"
                            views={['hours', "minutes"]}
                            label="Closing Time"
                            name="closing_time"
                            value={dayjs(initialState.closing_time)}
                            onChange={newClosingTime => formik.setFieldValue("closing_time", newClosingTime)}
                        />
                        <DatePicker
                            format="DD MMMM YYYY"            //ex - 25 July 2023
                            views={['day', "month", "year"]}
                            label="Established On.."
                            name="estd_on"
                            value={initialState.estd_on}
                            onChange={newEstdOn => {
                                console.log("Date=>", newEstdOn)
                                formik.setFieldValue("estd_on", newEstdOn)
                            }}
                        />
                    </LocalizationProvider>
                    <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        name="occupancy"
                        label="Occupancy"
                        autoComplete="new-occupancy"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.occupancy}
                        error={!!formik.touched.occupancy && !!formik.errors.occupancy}
                        helperText={formik.touched.occupancy && formik.errors.occupancy}
                        sx={{ gridColumn: "span 1" }}
                    />
                    <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        name="staff_count"
                        label="Staff Count"
                        autoComplete="new-staff_count"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.staff_count}
                        error={!!formik.touched.staff_count && !!formik.errors.staff_count}
                        helperText={formik.touched.staff_count && formik.errors.staff_count}
                    />
                    {showSalonFields && <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        name="priority"
                        label="Priority"
                        autoComplete="new-priority"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.priority}
                        error={!!formik.touched.priority && !!formik.errors.priority}
                        helperText={formik.touched.priority && formik.errors.priority}
                        sx={{ gridColumn: "span 2" }}
                    />}
                </Box>
            </form >
        </Box >
    );
}

export default SalonFormComponent;
