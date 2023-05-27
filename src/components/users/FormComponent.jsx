/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
*/

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import { Box, Button, InputLabel, TextField, Select, MenuItem, InputAdornment, IconButton, FormControl } from "@mui/material";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";

import UserValidation from "./UserValidation.jsx";
import Header from "../Header.jsx";
import Toast from "../common/Toast.jsx";
import Loader from "../common/Loader.jsx";
import { UserAPI } from "../../apis/UserAPI.jsx";
import { CommonAPI } from "../../apis/CommonAPI.jsx";

const UserFormComponent = () => {
    const navigateTo = useNavigate();
    const { state } = useLocation();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const selected = useSelector(state => state.menuItems.selected);

    let initialValues = {};
    let styleObj = {};
    if (selected === "Employee") {
        initialValues = {
            username: "",
            password: "",
            email: "",
            contact_no: "",
            status: "inactive"
        };
        styleObj = {
            display: "none",
            gridColumn: "span 2"
        }
    } else {
        initialValues = {
            username: "",
            password: "",
            email: "",
            contact_no: "",
            status: "inactive",
            type: ""
        };
        styleObj = {
            display: "block",
            gridColumn: "span 2"
        }
    };

    // const [focusOn, setFocusOn] = useState(false);
    const [initialState, setInitialState] = useState(initialValues);
    const [showPassword, setShowPassword] = useState(false);
    const [title, setTitle] = useState("Create");
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [toastAlert, setToastAlert] = useState(false);
    const [toastSeverity, setToastSeverity] = useState("");
    const [toastMessage, setToastMessage] = useState("");


    const pwField = document.getElementById("pwField");

    //Create/Update user
    useEffect(() => {
        console.log("inside create/update useEffect", userData)

        if (userData && userData.id) {
            console.log("Inside update")
            setLoading(true);
            if (pwField.disabled || !userData.password) {
                delete userData.password;
            }
            console.log("delete password", userData)
            UserAPI.update(userData)
                .then(user => {
                    setLoading(false);
                    setToastAlert(true);
                    setToastSeverity("info");
                    setToastMessage("Updated");

                    setTimeout(() => {
                        setToastAlert(false);
                        navigateTo("/user-listing");
                    }, 2000);
                })
                .catch(err => {
                    setLoading(false);
                    setToastAlert(true);
                    setToastSeverity("error");
                    setToastMessage(err.response.data.msg);

                    setTimeout(() => {
                        setToastAlert(false);
                        navigateTo("/user-listing");
                    }, 2000);
                });
        } else if (userData && !userData.id) {
            console.log("Inside Create User");
            setLoading(true);
            UserAPI.register(userData)
                .then(user => {
                    setLoading(false);
                    setToastAlert(true);
                    setToastSeverity("success");
                    setToastMessage("Success");

                    setTimeout(() => {
                        setToastAlert(false);
                        navigateTo("/user-listing");
                    }, 2000);
                })
                .catch(err => {
                    setLoading(false);
                    setToastAlert(true);
                    setToastSeverity("error");
                    setToastMessage(err.response.data.msg);

                    setTimeout(() => {
                        setToastAlert(false);
                        navigateTo("/user-listing");
                    }, 2000);
                });
        }
    }, [userData]);

    //populate data in form when update button is clicked from listing component
    useEffect(() => {
        if (state) {
            const { id } = state;
            const pwField = document.getElementById("pwField");
            setTitle("Update");

            CommonAPI.getByPk(id, "users")
                .then(({ data: response }) => {
                    setInitialState({ ...response });
                    pwField.setAttribute("disabled", true);
                    pwField.style.backgroundColor = "#777";
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, []);

    // const handleFormSubmit = values => {
    //     console.log("Inside Form submit", values);
    //     setUserData(values);
    // };

    const handleUpdatePassword = () => {
        pwField.removeAttribute("disabled");
        pwField.style.backgroundColor = "rgba(255, 255, 255, 0.09)";
        pwField.focus();
        // pwField.setAttribute("onfocus", "this.value=''");
    };

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    // const handleFormReset = (resetForm) => {
    //     const confirmation = window.confirm("Do You Want To Reset?");
    //     console.log("Outside reset=>", confirmation);
    //     console.log(userData);
    //     if (confirmation == true) {
    //         resetForm();
    //         setToastAlert(true);
    //         setToastSeverity("warning");
    //         setToastMessage("Resetted");

    //         setTimeout(() => {
    //             setToastAlert(false);
    //         }, 2000);
    //     };
    // };

    const handleFormCancel = () => {
        setToastAlert(true);
        setToastSeverity("error");
        setToastMessage("Cancelled");

        setTimeout(() => {
            setToastAlert(false);
            navigateTo("/user-listing");
        }, 2000);
    };

    return (
        <Box m="20px">
            <Header title={`${title} ${selected}`} />

            <Formik
                onSubmit={values => {
                    setUserData(values);
                }}
                initialValues={initialState}
                validationSchema={UserValidation}
                enableReinitialize={true}
            >
                {({
                    values,
                    errors,
                    touched,
                    dirty,
                    resetForm,
                    handleBlur,
                    handleChange,
                    handleSubmit
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
                                name="username"
                                label="Username"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.username}
                                error={!!touched.username && !!errors.username}
                                helperText={touched.username && errors.username}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                id="pwField"
                                label="Password"
                                name="password"
                                type={showPassword ? "text" : "password"} // <-- This is where the pw toggle happens
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.password}
                                error={!!touched.password && !!errors.password}
                                helperText={touched.password && errors.password}
                                sx={{ gridColumn: "span 2" }}
                                InputProps={{ // <-- This is where the toggle button is added.
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                            >
                                                {showPassword ? <VisibilityOutlinedIcon /> :
                                                    <VisibilityOffOutlinedIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Email"
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.email}
                                error={!!touched.email && !!errors.email}
                                helperText={touched.email && errors.email}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Contact Number"
                                name="contact_no"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.contact_no}
                                error={!!touched.contact_no && !!errors.contact_no}
                                helperText={touched.contact_no && errors.contact_no}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Type"
                                name="type"
                                id="typeField"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.type}
                                error={!!touched.type && !!errors.type}
                                sx={styleObj}
                            />
                            <FormControl variant="filled" sx={{ minWidth: 120 }}>
                                <InputLabel id="statusField">Status</InputLabel>
                                <Select
                                    variant="filled"
                                    labelId="statusField"
                                    label="Status"
                                    name="status"
                                    value={values.status}
                                    onChange={handleChange}
                                    error={!!touched.status && !!errors.status}
                                >
                                    <MenuItem value={"active"}>Active</MenuItem>
                                    <MenuItem value={"inactive"}>Inactive</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box display="flex" justifyContent="end" mt="20px">
                            {   //hide reset button on update
                                title === "Update" ? null :
                                    <Button type="reset" color="warning" variant="contained" sx={{ mr: 3 }} disabled={!dirty}
                                        onClick={() => {
                                            if (window.confirm("Do You Really Want To Reset?")) {
                                                resetForm();
                                                setToastAlert(true);
                                                setToastSeverity("warning");
                                                setToastMessage("Resetted");

                                                setTimeout(() => {
                                                    setToastAlert(false);
                                                }, 2000);
                                            }
                                        }}
                                    >
                                        Reset
                                    </Button>
                            }
                            <Button color="error" variant="contained" sx={{ mr: 3 }} onClick={handleFormCancel} >
                                Cancel
                            </Button>
                            <Button type="submit" color={title === "Update" ? "info" : "success"} variant="contained" disabled={!dirty} >
                                Submit
                            </Button>
                            <Toast alerting={toastAlert} severity={toastSeverity} message={toastMessage} />
                        </Box>
                    </form>
                )}
            </Formik>
            {loading === true ? <Loader /> : null}
            {title === "Update" ? <Button type="button" color="primary" variant="contained"
                sx={{
                    position: "absolute",
                    right: 20,
                    top: 120
                }}
                onClick={handleUpdatePassword}
            > Update Password </Button> : null}
        </Box>
    );
};

export default UserFormComponent;
