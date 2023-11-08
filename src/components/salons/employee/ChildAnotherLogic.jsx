/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use, reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
*/

import React, { useState, useEffect } from "react";

import { Autocomplete, Box, FormControl, InputLabel } from "@mui/material";
import { MenuItem, Select, TextField, useMediaQuery } from "@mui/material";


const initialValues = {
    name: "",
    email: "",
    contact_no: "",
    services: [],
    gender: "",
    age: ""
};

const ChildAnotherLogic = ({ index, services, masterValues, setMasterValues, updatedValues = [] }) => {

    const [initialState, setInitialState] = useState(initialValues);
    const isNonMobile = useMediaQuery("(min-width:600px)");


    const handleChange = (event, value = null) => {
        let obj = { ...initialState, [event.target.name]: event.target.value };
        // this check is for AutoComplete component, otherwise it is not giving updated values nor changing
        if (event._reactName === "onClick") {

            obj = { ...initialState, services: value };
        }
        console.log("Child Handle Change=>", event, event.target.name, { obj });
        setInitialState(obj);
    }

    const handleBlur = () => {     //onKeyUp event can also be used here
        setMasterValues({ ...masterValues, [index]: initialState });
    }

    useEffect(() => {
        if (updatedValues[index - 1]) {
            setInitialState(updatedValues[index - 1]);
            console.log("Childupdatev values=>", updatedValues[index - 1]);
        }
    }, [updatedValues?.length, updatedValues[index - 1]]);


    return (
        <Box margin="30px 5px" width="99%">
            <form>
                <Box
                    display="grid"
                    gap="30px"
                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
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
                        onBlur={handleBlur}
                        onChange={event => handleChange(event)}
                        value={initialState.name}
                    // error={!!formik.touched.name && !!formik.errors.name}
                    // helperText={formik.touched.name && formik.errors.name}
                    />
                    <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Salon Employee Email"
                        name="email"
                        autoComplete="new-email"
                        onBlur={handleBlur}
                        onChange={event => handleChange(event)}
                        value={initialState.email}
                    // error={!!formik.touched.email && !!formik.errors.email}
                    // helperText={formik.touched.email && formik.errors.email}
                    />
                    <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Salon Employee Contact Number*"
                        name="contact_no"
                        autoComplete="new-contact"
                        onBlur={handleBlur}
                        onChange={event => handleChange(event)}
                        value={initialState.contact_no}
                        // error={!!formik.touched.contact_no && !!formik.errors.contact_no}
                        // helperText={formik.touched.contact_no && formik.errors.contact_no}
                        sx={{ gridColumn: "span 2" }}
                    />

                    <Autocomplete
                        multiple
                        options={services}
                        getOptionLabel={option => option.name}
                        disableCloseOnSelect    //updatedValues && updatedValues[index - 1] ? updatedValues[index - 1].services
                        value={initialState.services}
                        onBlur={handleBlur}
                        // onChange={(event, value) => handleChange(event, value)}
                        onChange={(event, value) => {
                            console.log("Changed service=>", value);
                            setInitialState({ ...initialState, services: value });
                        }}
                        sx={{ gridColumn: "span 2" }}
                        renderInput={params => (
                            <TextField
                                {...params}
                                variant="filled"
                                type="text"
                                name="services"
                                label="Salon Employee Services"
                            // error={!!formik.touched.services && !!formik.errors.services}
                            // helperText={formik.touched.services && formik.errors.services}
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
                            value={initialState.gender}
                            onBlur={handleBlur}
                            onChange={event => handleChange(event)}
                        // error={!!formik.touched.gender && !!formik.errors.gender}
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
                        onBlur={handleBlur}
                        onChange={event => handleChange(event)}
                        value={initialState.age}
                    // error={!!formik.touched.age && !!formik.errors.age}
                    // helperText={formik.touched.age && formik.errors.age}
                    />

                </Box>
            </form>
        </Box>
    );
}

export default ChildAnotherLogic;
