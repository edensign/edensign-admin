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
import API from "../../apis";

const initialValues = {
    name: "",
    email: "",
    contact_no: "",
    age: 0,
    gender: "",
    qualification: "",
    status: "inactive",
    paid: "no",
    hired_in: "",
    designation: "",
    description: "",
    previous_employer: "",
    skills: [],
    hobbies: "",
    seeker_type: "fresher",
    experienceYears: "",
    trainingTime: "",
    experience: "",
    resume: [],
    job_location_preference: "anywhere",
    pref_state_id: 0,
    pref_city_id: 0
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
    const [countries, setCountries] = useState([]);
    const [countryId, setCountryId] = useState(null);
    const [statesList, setStatesList] = useState([]);
    const [stateId, setStateId] = useState(null);
    const [citiesList, setCitiesList] = useState([]);

    useEffect(() => {
        const getCountry = () => {
            API.CountryAPI.getCountries()
                .then(country => {
                    if (country?.status === 'Success') {
                        setCountries(country.data.list);
                    }
                })
                .catch(err => { console.error(err); });
        };
        getCountry();
    }, []);

    useEffect(() => {
        const getStates = () => {
            const cid = countryId || 1; // Default to India (ID 1)
            API.StateAPI.getStates(cid)
                .then(data => {
                    if (data?.status === 'Success') {
                        setStatesList(data.data.list);
                        setCitiesList([]);
                    } else {
                        setStatesList([]);
                        setCitiesList([]);
                    }
                })
                .catch(err => { console.error(err); });
        };
        getStates();
    }, [countryId]);

    const isNonMobile = useMediaQuery("(min-width:600px)");
    const isMobile = useMediaQuery("(max-width:480px)");

    const formik = useFormik({
        initialValues: initialState,
        validationSchema: jobSeekerValidation,
        enableReinitialize: true,
        onSubmit: () => watchForm()
    });

    // Load cities whenever the selected state changes (stateId driven)
    useEffect(() => {
        const getCities = () => {
            if (stateId) {
                API.CityAPI.getCities(stateId)
                    .then(res => {
                        if (res?.status === 'Success') {
                            setCitiesList(res.data.list);
                        } else {
                            setCitiesList([]);
                        }
                    })
                    .catch(err => { console.error(err); setCitiesList([]); });
            } else {
                setCitiesList([]);
            }
        };
        getCities();
    }, [stateId]);

    React.useImperativeHandle(refId, () => ({
        Submit: async () => {
            await formik.submitForm();
        }
    }));

    const watchForm = () => {
        if (onChange) {
            let expValue = "fresher";
            if (formik.values.seeker_type === "experience") {
                expValue = formik.values.experienceYears ? formik.values.experienceYears.toString() : "0";
            } else if (formik.values.seeker_type === "trainer") {
                expValue = `trainer:${formik.values.trainingTime || ''}`;
            }

            const formattedValues = {
                ...formik.values,
                experience: expValue
            };
            delete formattedValues.seeker_type;
            delete formattedValues.experienceYears;
            delete formattedValues.trainingTime;

            onChange({
                values: formattedValues,
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
            const exp = (updatedValues.experience || '').trim();
            let seeker_type = "fresher";
            let experienceYears = "";
            let trainingTime = "";

            if (exp === "fresher" || exp === "0" || exp === "") {
                seeker_type = "fresher";
            } else if (exp.startsWith("trainer:")) {
                seeker_type = "trainer";
                trainingTime = exp.substring(8);
            } else {
                seeker_type = "experience";
                experienceYears = exp;
            }

            setInitialState({
                ...updatedValues,
                seeker_type,
                experienceYears,
                trainingTime,
                age: updatedValues.age || 0,
                job_location_preference: updatedValues.job_location_preference || "anywhere",
                pref_state_id: updatedValues.pref_state_id || 0,
                pref_city_id: updatedValues.pref_city_id || 0
            });

            if (updatedValues.pref_state_id) {
                setStateId(updatedValues.pref_state_id);
            }

            //we are modifying our formatted resume name to only contain the filename
            if (updatedValues.resume && updatedValues.resume.startsWith(updatedValues.name.replace(/\s+/g, "_").toLowerCase(), 2)) {
                setFilename(updatedValues.resume.split("").splice(2).join(""));
            }
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
                    />
                    <FormControl variant="filled"
                        error={!!formik.touched.designation && !!formik.errors.designation}
                    >
                        <InputLabel id="designationField">Designation</InputLabel>
                        <Select
                            variant="filled"
                            labelId="designationField"
                            label="Designation"
                            name="designation"
                            autoComplete="new-designation"
                            value={formik.values.designation}
                            onChange={formik.handleChange}
                        >
                            <MenuItem value="Hair Stylist">Hair Stylist</MenuItem>
                            <MenuItem value="Makeup Artist">Makeup Artist</MenuItem>
                            <MenuItem value="Nail Tech">Nail Tech</MenuItem>
                            <MenuItem value="Receptionist">Receptionist</MenuItem>
                            <MenuItem value="Bridal Artist">Bridal Artist</MenuItem>
                        </Select>
                        <FormHelperText>{formik.touched.designation && formik.errors.designation}</FormHelperText>
                    </FormControl>
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
                        name="hobbies"
                        label="Hobbies"
                        autoComplete="new-hobbies"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.hobbies}
                        error={!!formik.touched.hobbies && !!formik.errors.hobbies}
                        helperText={formik.touched.hobbies && formik.errors.hobbies}
                    />
                    <FormControl variant="filled" sx={{ minWidth: 120 }}
                        error={!!formik.touched.seeker_type && !!formik.errors.seeker_type}
                    >
                        <InputLabel id="seekerTypeField">Profile Type*</InputLabel>
                        <Select
                            variant="filled"
                            labelId="seekerTypeField"
                            label="Profile Type*"
                            name="seeker_type"
                            value={formik.values.seeker_type || "fresher"}
                            onChange={(e) => {
                                formik.handleChange(e);
                                formik.setFieldValue("experienceYears", "");
                                formik.setFieldValue("trainingTime", "");
                            }}
                        >
                            <MenuItem value="fresher">Fresher</MenuItem>
                            <MenuItem value="experience">Experienced</MenuItem>
                            <MenuItem value="trainer">Trainer</MenuItem>
                        </Select>
                        <FormHelperText>{formik.touched.seeker_type && formik.errors.seeker_type}</FormHelperText>
                    </FormControl>

                    {formik.values.seeker_type === "experience" && (
                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            name="experienceYears"
                            label="Experience (Years)*"
                            autoComplete="new-experienceYears"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.experienceYears}
                            error={!!formik.touched.experienceYears && !!formik.errors.experienceYears}
                            helperText={formik.touched.experienceYears && formik.errors.experienceYears}
                        />
                    )}

                    {formik.values.seeker_type === "trainer" && (
                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            name="trainingTime"
                            label="Time to Train (e.g. 2 Years)*"
                            autoComplete="new-trainingTime"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.trainingTime}
                            error={!!formik.touched.trainingTime && !!formik.errors.trainingTime}
                            helperText={formik.touched.trainingTime && formik.errors.trainingTime}
                        />
                    )}

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

                    <FormControl variant="filled" sx={{ gridColumn: "span 2" }}
                        error={!!formik.touched.job_location_preference && !!formik.errors.job_location_preference}
                    >
                        <InputLabel id="jobLocationPrefField">Job Location Preference*</InputLabel>
                        <Select
                            variant="filled"
                            labelId="jobLocationPrefField"
                            name="job_location_preference"
                            value={formik.values.job_location_preference || "anywhere"}
                            onChange={(e) => {
                                formik.handleChange(e);
                                formik.setFieldValue("pref_state_id", 0);
                                formik.setFieldValue("pref_city_id", 0);
                                setStateId(null);
                            }}
                        >
                            <MenuItem value="anywhere">Anywhere</MenuItem>
                            <MenuItem value="his_city">Only His City</MenuItem>
                            <MenuItem value="specific_state">Specific State</MenuItem>
                            <MenuItem value="specific_city">Specific City</MenuItem>
                        </Select>
                        <FormHelperText>{formik.touched.job_location_preference && formik.errors.job_location_preference}</FormHelperText>
                    </FormControl>

                    {(formik.values.job_location_preference === "specific_state" || formik.values.job_location_preference === "specific_city") && (
                        <FormControl variant="filled"
                            error={!!formik.touched.pref_state_id && !!formik.errors.pref_state_id}
                        >
                            <InputLabel id="prefStateField">Preferred State*</InputLabel>
                            <Select
                                labelId="prefStateField"
                                name="pref_state_id"
                                value={formik.values.pref_state_id || 0}
                                onChange={(e) => {
                                    formik.handleChange(e);
                                    formik.setFieldValue("pref_city_id", 0);
                                    setStateId(e.target.value);
                                }}
                            >
                                <MenuItem value={0}><em>None</em></MenuItem>
                                {statesList.map(item => (
                                    <MenuItem value={item.id} key={item.id}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>{formik.touched.pref_state_id && formik.errors.pref_state_id}</FormHelperText>
                        </FormControl>
                    )}

                    {formik.values.job_location_preference === "specific_city" && (
                        <FormControl variant="filled"
                            error={!!formik.touched.pref_city_id && !!formik.errors.pref_city_id}
                        >
                            <InputLabel id="prefCityField">Preferred City*</InputLabel>
                            <Select
                                labelId="prefCityField"
                                name="pref_city_id"
                                value={formik.values.pref_city_id || 0}
                                onChange={formik.handleChange}
                            >
                                <MenuItem value={0}><em>None</em></MenuItem>
                                {citiesList.map(item => (
                                    <MenuItem value={item.id} key={item.id}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>{formik.touched.pref_city_id && formik.errors.pref_city_id}</FormHelperText>
                        </FormControl>
                    )}

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
                                            console.log('resume', file)
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
