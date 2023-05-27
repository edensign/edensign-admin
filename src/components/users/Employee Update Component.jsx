import { Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import EmployeeValidation from "./Employee Validation.jsx";
import useMediaQuery from "@mui/material/useMediaQuery";

import Header from "../Header.jsx";
import Toast from "../common/Toast.jsx";
import { UserAPI } from "../../apis/UserAPI.jsx";

const EmployeeUpdateComponent = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const navigateTo = useNavigate();

    const [userData, setUserData] = useState(null);
    const [toastAlert, setToastAlert] = useState(false);
    const [toastSeverity, setToastSeverity] = useState("");
    const [toastMessage, setToastMessage] = useState("");

    const handleFormSubmit = values => {
        setUserData(values);
        setToastAlert(true);
        setToastSeverity("success");
        setToastMessage("Success");

        setTimeout(() => {
            setToastAlert(false);
        }, 2000);
    };

    const handleFormReset = values => {
        if (window.confirm("Do You Want To Reset?")) {
            values = {};
        };
        setToastAlert(true);
        setToastSeverity("warning");
        setToastMessage("Resetted");

        setTimeout(() => {
            setToastAlert(false);
        }, 2000);
    };

    const handleFormCancel = () => {
        setToastAlert(true);
        setToastSeverity("error");
        setToastMessage("Cancelled");

        setTimeout(() => {
            setToastAlert(false);
            navigateTo("/employee-listing");
        }, 2000);
    };

    useEffect(() => {
        if (userData) {
            console.log("Inside useEffect");
            UserAPI.register(userData)
                .then(user => {
                    navigateTo("/employee-listing");
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }, [userData]);

    return (
        <Box m="20px">
            <Header title="CREATE USER" />

            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={EmployeeValidation}
                onReset={handleFormReset}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    handleReset
                }) => (
                    <form onSubmit={handleSubmit} onReset={handleReset}>
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
                                label="Username"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.username}
                                name="username"
                                error={!!touched.username && !!errors.username}
                                helperText={touched.username && errors.username}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.password}
                                name="password"
                                error={!!touched.password && !!errors.password}
                                helperText={touched.password && errors.password}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.email}
                                name="email"
                                error={!!touched.email && !!errors.email}
                                helperText={touched.email && errors.email}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Contact Number"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.contact_no}
                                name="contact_no"
                                error={!!touched.contact_no && !!errors.contact_no}
                                helperText={touched.contact_no && errors.contact_no}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Type"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.type}
                                name="type"
                                error={!!touched.type && !!errors.type}
                                helperText={touched.type && errors.type}
                                sx={{ gridColumn: "span 2" }}
                            />
                            {/* <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Address 2"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.address2}
                                name="address2"
                                error={!!touched.address2 && !!errors.address2}
                                helperText={touched.address2 && errors.address2}
                                sx={{ gridColumn: "span 4" }}
                            /> */}
                        </Box>
                        <Box display="flex" justifyContent="end" mt="20px">
                            <Button type="reset" color="warning" variant="contained" sx={{ mr: 3 }}>
                                Reset
                            </Button>
                            <Button color="error" variant="contained" sx={{ mr: 3 }} onClick={handleFormCancel} >
                                Cancel
                            </Button>
                            <Button type="submit" color="success" variant="contained">
                                Create New User
                            </Button>
                            <Toast alerting={toastAlert} severity={toastSeverity} message={toastMessage} />
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
};

// const phoneRegExp = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

// const checkoutSchema = yup.object().shape({
//     username: yup.string().required("required"),
//     password: yup.string().required("required"),
//     email: yup.string().email("invalid email").required("required"),
//     contact_no: yup
//         .string()
//         .matches(phoneRegExp, "Phone number is not valid")
//         .required("required"),
//     type: yup.string().required("required"),
//     //   address2: yup.string().required("required"),
// });

const initialValues = {
    username: "",
    password: "",
    email: "",
    contact_no: "",
    type: "",
    //   address2: "",
};

export default EmployeeUpdateComponent;
