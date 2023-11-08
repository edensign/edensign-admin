/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
*/

import React, { useState, useEffect } from "react";
import { useFormik } from "formik";

import { Box, InputLabel, IconButton, MenuItem, FormControl, FormHelperText } from "@mui/material";
import { Autocomplete, Select, TextField, useMediaQuery } from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';
// import AttachFileIcon from '@mui/icons-material/AttachFile';

import jobSeekerValidation from "./Validation";

const initialValues = {
    name: "",
    email: "",
    contact_no: "",
    age: 0,
    gender: "",
    qualification: "",
    status: "inactive",
    skills: [],
    hobbies: "",
    experience: "",
    resume: []
};

const JobSeekerFormComponent = ({
    onChange,
    refId,
    filename,
    setFilename,
    setDirty,
    skills,
    reset,
    setReset,
    updatedValues = null }) => {

    const [initialState, setInitialState] = useState(initialValues);

    const isNonMobile = useMediaQuery("(min-width:600px)");
    const isMobile = useMediaQuery("(max-width:480px)");

    const formik = useFormik({
        initialValues: initialState,
        validationSchema: jobSeekerValidation,
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
                    : false
            });
        }
    };

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

            //we are modifying our formatted resume name to only contain the filename
            if (updatedValues.resume.startsWith(updatedValues.name.toLowerCase(), 2)) {
                const modifiedName = updatedValues.resume.replace(updatedValues.name.toLowerCase(), "");
                setFilename(modifiedName.split("").splice(3).join(""));
            }
        }
    }, [updatedValues]);
    console.log(filename)

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
                    />
                    <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        name="designation"
                        label="Designation"
                        autoComplete="new-designation"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.designation}
                        error={!!formik.touched.designation && !!formik.errors.designation}
                        helperText={formik.touched.designation && formik.errors.designation}
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
                    <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        name="age"
                        label="Age"
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
                        name="skills"
                        label="Skills"
                        autoComplete="new-skills"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.skills}
                        error={!!formik.touched.skills && !!formik.errors.skills}
                        helperText={formik.touched.skills && formik.errors.skills}
                    />
                    <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        name="hobbies"
                        label="Hobbies"
                        autoComplete="new-hobbies"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.hobbies}
                        error={!!formik.touched.hobbies && !!formik.errors.hobbies}
                        helperText={formik.touched.hobbies && formik.errors.hobbies}
                    />
                    <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        name="experience"
                        label="Experience"
                        autoComplete="new-experience"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.experience}
                        error={!!formik.touched.experience && !!formik.errors.experience}
                        helperText={formik.touched.experience && formik.errors.experience}
                    />

                    <Autocomplete
                        multiple
                        options={skills}
                        getOptionLabel={option => option.name}
                        disableCloseOnSelect
                        value={formik.values.skills}
                        onChange={(event, value) => formik.setFieldValue("skills", value)}
                        sx={{ gridColumn: "span 2" }}
                        renderInput={params => (
                            <TextField
                                {...params}
                                variant="filled"
                                type="text"
                                name="skills"
                                label="Skills"
                                error={!!formik.touched.skills && !!formik.errors.skills}
                                helperText={formik.touched.skills && formik.errors.skills}
                            />
                        )}
                    />

                    <FormControl variant="filled" sx={{ minWidth: 120 }}
                        error={!!formik.touched.gender && !!formik.errors.gender}
                    >
                        <InputLabel id="genderField">Gender</InputLabel>
                        <Select
                            variant="filled"
                            labelId="genderField"
                            label="Gender"
                            name="gender"
                            autoComplete="new-gender"
                            value={formik.values.gender}
                            onChange={formik.handleChange}
                        >
                            <MenuItem value={"male"}>Male</MenuItem>
                            <MenuItem value={"female"}>Female</MenuItem>
                            <MenuItem value={"other"}>Other</MenuItem>
                        </Select>
                        <FormHelperText>{formik.touched.gender && formik.errors.gender}</FormHelperText>
                    </FormControl>

                    <FormControl variant="filled" sx={{ minWidth: 120 }}
                        error={!!formik.touched.qualification && !!formik.errors.qualification}
                    >
                        <InputLabel id="qualificationField">Qualification</InputLabel>
                        <Select
                            variant="filled"
                            labelId="qualificationField"
                            label="Choose Your Qualification"
                            name="qualification"
                            autoComplete="new-qualification"
                            value={formik.values.qualification}
                            onChange={formik.handleChange}
                        >
                            <MenuItem value={"10th"}>High School</MenuItem>
                            <MenuItem value={"12th"}>Intermediate</MenuItem>
                            <MenuItem value={"graduate"}>Graduate</MenuItem>
                        </Select>
                        <FormHelperText>{formik.touched.qualification && formik.errors.qualification}</FormHelperText>
                    </FormControl>

                    <FormControl variant="filled" sx={{ minWidth: 120 }}
                        error={!!formik.touched.paid && !!formik.errors.paid}
                    >
                        <InputLabel id="paidField">Paid</InputLabel>
                        <Select
                            variant="filled"
                            labelId="paidField"
                            name="paid"
                            autoComplete="new-paid"
                            value={formik.values.paid}
                            onChange={formik.handleChange}
                        >
                            <MenuItem value={"yes"}>Yes</MenuItem>
                            <MenuItem value={"no"}>No</MenuItem>
                        </Select>
                        <FormHelperText>{formik.touched.paid && formik.errors.paid}</FormHelperText>
                    </FormControl>

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
                            value={formik.values.status}
                            onChange={formik.handleChange}
                        >
                            <MenuItem value={"active"}>Active</MenuItem>
                            <MenuItem value={"inactive"}>Inactive</MenuItem>
                        </Select>
                        <FormHelperText>{formik.touched.status && formik.errors.status}</FormHelperText>
                    </FormControl>

                    <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        name="previous_employer"
                        label="Previous Employer"
                        autoComplete="new-previous_employer"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.previous_employer}
                        error={!!formik.touched.previous_employer && !!formik.errors.previous_employer}
                        helperText={formik.touched.previous_employer && formik.errors.previous_employer}
                    />
                    <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        name="hired_in"
                        label="Hired In"
                        autoComplete="new-hired_in"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.hired_in}
                        error={!!formik.touched.hired_in && !!formik.errors.hired_in}
                        helperText={formik.touched.hired_in && formik.errors.hired_in}
                    />

                    <TextField
                        name="resume"
                        label="Upload Your Resume Here"
                        value={undefined}
                        size="medium"
                        onBlur={formik.handleBlur}
                        InputProps={{
                            startAdornment: (
                                <IconButton component="label" sx={{ width: "88%" }}>
                                    <UploadFileIcon />
                                    <input
                                        hidden
                                        type="file"
                                        name="resume"
                                        onChange={event => {
                                            const file = event.target.files[0];
                                            formik.setFieldValue("resume", file);
                                            setFilename(file.name);
                                            setDirty(true);
                                        }}
                                    />
                                </IconButton>
                            )
                        }}
                        error={formik.touched.resume && Boolean(formik.errors.resume)}
                        helperText={formik.touched.resume && formik.errors.resume}
                        sx={{ m: "8px auto", outline: "none", width: "60%" }}
                    />
                    <div style={{ lineHeight: "65px", gridColumn: "span 2" }}>Your Selected File: {filename}</div>
                </Box>
            </form>
        </Box>
    );
}

export default JobSeekerFormComponent;
