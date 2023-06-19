import React, { useCallback, useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Box, Button, Typography, useTheme } from "@mui/material";

import AddressFormComponent from "../address/AddressFormComponent";
import Loader from "../common/Loader";
import Toast from "../common/Toast";
import UserFormComponent from "./UserFormComponent";
import API from "../../apis";

import { Utility } from "../utility";
import { useUser } from "../hooks";
import { tokens, themeSettings } from "../../theme";

const FormComponent = () => {
    const [title, setTitle] = useState("Create");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        userData: { values: null, validated: false },
        addressData: { values: null, validated: false },
    });
    const [updatedValues, setUpdatedValues] = useState(null);
    const [dirty, setDirty] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [reset, setReset] = useState(false);

    const userFormRef = useRef();
    const addressFormRef = useRef();

    const navigateTo = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { typography } = themeSettings(theme.palette.mode);

    const selected = useSelector(state => state.menuItems.selected);
    const toastInfo = useSelector(state => state.toastInfo);
    const { state } = useLocation();
    const { getQueryParam } = useUser();

    const { toastModal } = Utility();
    let id = state?.id;

    const updateUserAndAddress = useCallback((formData) => {
        const dataFields = [
            { ...formData.userData.values },
            { ...formData.addressData.values }
        ];
        if (!formData.userData.password) {
            delete formData.userData.password;
        }
        console.log("Inside update user=>", formData)
        const paths = ["/update-user", "/update-address"];
        API.CommonAPI.multipleAPICall("PATCH", paths, dataFields)
            .then(responses => {
                let status = true;
                responses.forEach(response => {
                    if (response.data.status !== "Success") {
                        status = false;
                    }
                });
                if (status) {
                    toastModal(dispatch, true, "info", "Updated", navigateTo, "/user/listing");
                }
            })
            .catch(err => {
                toastModal(dispatch, true, "error", err?.response?.data?.msg);
                throw err
            });
    }, [formData]);

    const populateUserData = (id) => {
        const paths = [`/get-by-pk/users/${id}`, `/get-address/user/${id}`];
        API.CommonAPI.multipleAPICall("GET", paths)
            .then(responses => {
                const dataObj = {
                    userData: responses[0].data.data,
                    addressData: responses[1].data.data
                }
                setUpdatedValues(dataObj);
            })
            .catch(err => { throw err });
    };

    const registerUser = () => {
        setLoading(true);
        const userType = getQueryParam();
        API.UserAPI.register({ ...formData.userData.values, type: userType })
            .then(({ data: user }) => {
                if (user?.status === 'Success') {
                    API.AddressAPI.createAddress({
                        ...formData.addressData.values,
                        parent_id: user.data.id,
                        parent: 'user',
                    })
                        .then(address => {
                            setLoading(false);
                            toastModal(dispatch, true, "success", "Success", navigateTo, "/user/listing");
                        })
                        .catch(err => {
                            setLoading(false);
                            toastModal(dispatch, true, err ? err : "An Error Occurred");
                            throw err;
                        });
                }
            })
            .catch(err => {
                setLoading(false);
                toastModal(dispatch, true, "error", err?.response?.data?.msg);
                throw err;
            });
    }

    //Create/Update/Populate user
    useEffect(() => {
        if (id && !submitted) {
            setTitle("Update");
            populateUserData(id);
        }
        if (formData.userData.validated && formData.addressData.validated) {
            formData.userData.values?.id ? updateUserAndAddress(formData) : registerUser();
        }
    }, [id, submitted]);

    const handleSubmit = async () => {
        await userFormRef.current.Submit();
        await addressFormRef.current.Submit();
        setSubmitted(true);
    };

    const handleFormChange = (data, form) => {
        form === 'user' ? setFormData({ ...formData, userData: data }) :
            setFormData({ ...formData, addressData: data });
    }

    return (
        <Box m="10px">
            <Typography
                fontFamily={typography.fontFamily}
                fontSize={typography.h2.fontSize}
                color={colors.grey[100]}
                fontWeight="bold"
                display="inline-block"
                marginLeft="20px"
            >
                {`${title} ${selected}`}
            </Typography>
            <UserFormComponent
                onChange={(data) => {
                    handleFormChange(data, 'user');
                }}
                refId={userFormRef}
                setDirty={setDirty}
                reset={reset}
                setReset={setReset}
                userId={id}
                updatedValues={updatedValues?.userData}
            />
            <AddressFormComponent
                onChange={(data) => {
                    handleFormChange(data, 'address');
                }}
                refId={addressFormRef}
                dirty={dirty}
                setDirty={setDirty}
                reset={reset}
                setReset={setReset}
                updatedValues={updatedValues?.addressData}
            />

            <Box display="flex" justifyContent="end" mt="20px">
                {   //hide reset button on user update
                    title === "Update" ? null :
                        <Button type="reset" color="warning" variant="contained" sx={{ mr: 3 }}
                            disabled={!dirty}
                            onClick={() => {
                                if (window.confirm("Do You Really Want To Reset?")) {
                                    setReset(true);
                                };
                            }}
                        >
                            Reset
                        </Button>
                }
                <Button color="error" variant="contained" sx={{ mr: 3 }}
                    onClick={() => navigateTo('/user/listing')}>
                    Cancel
                </Button>
                <Button type="submit" onClick={() => handleSubmit()} disabled={!dirty}
                    color={title === "Update" ? "info" : "success"} variant="contained"
                >
                    Submit
                </Button>
                <Toast alerting={toastInfo.toastAlert}
                    severity={toastInfo.toastSeverity}
                    message={toastInfo.toastMessage}
                />
            </Box>
            {loading === true ? <Loader /> : null}
        </Box>
    );
};

export default FormComponent;
