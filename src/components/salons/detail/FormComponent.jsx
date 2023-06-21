/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import React, { useCallback, useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Box, Button, Typography, useTheme } from "@mui/material";

import API from "../../../apis";
import AddressFormComponent from "../../address/AddressFormComponent";
import ImagePicker from "../../image/ImagePicker";
import Loader from "../../common/Loader";
import SalonFormComponent from "./SalonFormComponent";
import Toast from "../../common/Toast";

import { setMenuItem } from "../../../redux/actions/NavigationAction";
import { Utility } from "../../utility";
import { uploadImageToAzure, deleteFileFromAzure } from "../../image/AzureStorageConnection";
import { tokens, themeSettings } from "../../../theme";

const FormComponent = () => {
    const [title, setTitle] = useState("Create");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        salonData: { values: null, validated: false },
        addressData: { values: null, validated: false },
        imageData: { values: null, validated: true }
    });
    const [updatedValues, setUpdatedValues] = useState(null);
    const [deletedImage, setDeletedImage] = useState([]);
    const [dirty, setDirty] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [reset, setReset] = useState(false);

    const salonFormRef = useRef();
    const addressFormRef = useRef();
    const imageFormRef = useRef();

    const navigateTo = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { typography } = themeSettings(theme.palette.mode);

    const selected = useSelector(state => state.menuItems.selected);
    const toastInfo = useSelector(state => state.toastInfo);
    const { state } = useLocation();

    const { toastModal, getLocalStorage } = Utility();
    let id = state?.id;

    useEffect(() => {
        const selectedMenu = getLocalStorage("menu");
        dispatch(setMenuItem(selectedMenu.selected));
    }, []);

    const updateSalonAndAddress = useCallback((formData) => {
        const dataFields = [
            { ...formData.salonData.values },
            { ...formData.addressData.values },
            { ...formData.imageData.values }
        ];
        const paths = ["/update-salon", "/update-address"];
        setLoading(true);

        if (deletedImage.length) {
            deletedImage.forEach(image => {
                deleteFileFromAzure("salon", image);
            })
        }

        API.CommonAPI.multipleAPICall("PATCH", paths, dataFields)
            .then(responses => {
                let status = true;
                if (responses) {
                    API.ImageAPI.deleteImage({
                        parent: dataFields[2][0].parent,
                        parent_id: dataFields[2][0].parent_id
                    })
                        .then(deleted => {
                            formData.imageData?.values.map(image => {
                                API.ImageAPI.createImage({
                                    image_src: image.image_src,
                                    parent: image.parent,
                                    parent_id: image.parent_id
                                })
                            });
                        })
                        .catch(err => {
                            setLoading(false);
                            throw err;
                        })
                    if (formData.imageData.values.file) {
                        Array.from(formData.imageData.values.file).map(async (image) => {
                            let name = await uploadImageToAzure("salon", image);
                            API.ImageAPI.createImage({
                                image_src: name,
                                parent: 'salon',
                                parent_id: formData.salonData.values.id
                            });
                        });
                    }
                } else {
                    status = false;
                }
                if (status) {
                    setLoading(false);
                    toastModal(dispatch, true, "info", "Updated", navigateTo, "/salon/listing");
                };
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                toastModal(dispatch, true, "error", err?.response?.data?.msg);
                throw err;
            });
    }, [formData]);

    const populateSalonData = (id) => {
        setLoading(true);
        const paths = [`/get-by-pk/salon/${id}`, `/get-address/salon/${id}`, `/get-image/salon/${id}`];
        API.CommonAPI.multipleAPICall("GET", paths)
            .then(responses => {
                const dataObj = {
                    userData: responses[0].data.data,
                    addressData: responses[1]?.data?.data,
                    imageData: responses[2]?.data?.data
                };
                setUpdatedValues(dataObj);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                toastModal(dispatch, true, "error", err?.response?.data?.msg);
                throw err;
            });
    };

    const createSalon = () => {
        let promises;
        setLoading(true);
        API.SalonAPI.createSalon({ ...formData.salonData.values })
            .then(({ data: salon }) => {
                if (salon?.status === 'Success') {
                    API.AddressAPI.createAddress({
                        ...formData.addressData.values,
                        parent_id: salon.data.id,
                        parent: 'salon',
                    })
                        .then(async (address) => {
                            promises = Array.from(formData.imageData.values.file).map(async (image) => {
                                let name = await uploadImageToAzure("salon", image);
                                API.ImageAPI.createImage({
                                    image_src: name,
                                    parent_id: salon.data.id,
                                    parent: 'salon',
                                })
                            });
                            return Promise.all(promises)
                                .then(image => {
                                    setLoading(false);
                                    toastModal(dispatch, true, "success", "Success", navigateTo, "/salon/listing");
                                })
                                .catch(err => {
                                    setLoading(false);
                                    toastModal(dispatch, true, "error", err ? err?.response?.data?.msg : "An Error Occurred");
                                    throw err;
                                });
                        })
                        .catch(err => {
                            setLoading(false);
                            toastModal(dispatch, true, "error", err ? err?.response?.data?.msg : "An Error Occurred");
                            throw err;
                        });
                };
            })
            .catch(err => {
                setLoading(false);
                toastModal(dispatch, true, "error", err?.response?.data?.msg);
                throw err;
            });
    };

    //Create/Update/Populate salon
    useEffect(() => {
        if (id && !submitted) {
            setTitle("Update");
            populateSalonData(id);
        }
        if (formData.salonData.validated && formData.addressData.validated) {
            formData.salonData.values?.id ? updateSalonAndAddress(formData) : createSalon();
        }
    }, [id, submitted]);

    const handleSubmit = async () => {
        await salonFormRef.current.Submit();
        await addressFormRef.current.Submit();
        await imageFormRef.current.Submit();
        setSubmitted(true);
    };

    const handleFormChange = (data, form) => {
        if (form === 'salon') {
            setFormData({ ...formData, salonData: data });
        } else if (form === 'address') {
            setFormData({ ...formData, addressData: data });
        } else {
            setFormData({ ...formData, imageData: data })
        };
    };

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
            <SalonFormComponent
                onChange={(data) => {
                    handleFormChange(data, 'salon');
                }}
                refId={salonFormRef}
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
            <ImagePicker
                onChange={(data) => {
                    handleFormChange(data, 'image');
                }}
                refId={imageFormRef}
                dirty={dirty}
                setDirty={setDirty}
                reset={reset}
                setReset={setReset}
                // userId={id}
                updatedValues={updatedValues?.imageData}
                deletedImage={deletedImage}
                setDeletedImage={setDeletedImage}
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
                    onClick={() => navigateTo('/salon/listing')}>
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
