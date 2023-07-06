/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use, reproduction, or disclosure of this software is subject to
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
import ResponsiveDialog from "../../common/Dialog";
import SalonFormComponent from "./SalonFormComponent";
import Toast from "../../common/Toast";

import { setMenuItem } from "../../../redux/actions/NavigationAction";
import { uploadDocumentToAzure } from "../../documents/AzureStorageConnection";
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
    const [preview, setPreview] = useState([]);
    const [reset, setReset] = useState(false);
    const [showTextfields, setShowTextfields] = useState(false);

    const salonFormRef = useRef();
    const addressFormRef = useRef();
    const imageFormRef = useRef();

    const navigateTo = useNavigate();
    const dispatch = useDispatch();
    const selected = useSelector(state => state.menuItems.selected);
    const toastInfo = useSelector(state => state.toastInfo);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const { typography } = themeSettings(theme.palette.mode);
    const { pathname, state } = useLocation();
    const { toastAndNavigate, getLocalStorage, getRole, formatImageName } = Utility();

    let id = state?.id || getLocalStorage("salon")?.id;
    const auth = getLocalStorage("auth");
    const role = getRole();
    const { agreementSigned } = useSelector(state => state.agreementSigned);

    useEffect(() => {
        const selectedMenu = getLocalStorage("menu");
        dispatch(setMenuItem(selectedMenu.selected));
        if (pathname === "/salon/create" || pathname === "/salon/update") {
            setShowTextfields(true);
        } else {
            setShowTextfields(false);
        }
    }, []);

    const isEmpty = (obj) => {
        for (const prop in obj) {
            if (Object.hasOwn(obj, prop)) {
                return false;
            }
        }
        return true;
    };

    const updateSalonAndAddress = useCallback(formData => {
        setLoading(true);

        const paths = ["/update-salon", "/update-address"];
        const dataFields = [
            { ...formData.salonData.values },
            { ...formData.addressData.values },
            { ...formData.imageData.values }
        ];

        // delete the selected (removed) images from Azure
        if (deletedImage.length) {
            console.log("DeletedImage =>", deletedImage)
            deletedImage.forEach(image => {
                deleteFileFromAzure("salon", image);
            });
        }
        // delete all images from db on every update and later insert new and old again
        API.ImageAPI.deleteImage({
            parent: "salon",
            parent_id: id
        });

        API.CommonAPI.multipleAPICall("PATCH", paths, dataFields)
            .then(responses => {
                let status = null;
                let formattedName;
                if (responses) {
                    if (!isEmpty(dataFields[2])) {
                        // upload new images to azure and insert in db
                        if (formData.imageData.values?.file) {
                            Array.from(formData.imageData.values.file).map(image => {

                                formattedName = formatImageName(image.name);
                                API.ImageAPI.uploadImage({ file: image, name: formattedName });
                                API.ImageAPI.createImage({
                                    image_src: formattedName,
                                    parent: 'salon',
                                    parent_id: formData.salonData.values.id
                                })
                            });
                            status = true;
                        }
                        // insert old images only in db
                        if (formData.imageData?.values) {
                            formData.imageData.values.map(image => {
                                API.ImageAPI.createImage({
                                    image_src: image.image_src,
                                    parent: image.parent,
                                    parent_id: image.parent_id
                                })
                            });
                            status = true;
                        }
                    } else {
                        status = true;
                    }
                    if (status) {
                        console.log('STATUS AT LAST=>', status);
                        setLoading(false);
                        if (auth.type === "admin") {
                            toastAndNavigate(dispatch, true, "info", "Successfully Updated", navigateTo, "/salon/listing");
                        } else {
                            toastAndNavigate(dispatch, true, "info", "Successfully Updated");
                            setTimeout(() => {
                                location.reload();
                            }, 2500);
                        }
                    }
                }
            })
            .catch(err => {
                setLoading(false);
                toastAndNavigate(dispatch, true, "error", err?.response?.data?.msg);
                throw err;
            });
    }, [formData]);

    const populateSalonData = (id) => {
        const paths = [`/get-by-pk/salon/${id}`, `/get-address/salon/${id}`, `/get-image/salon/${id}`];
        setLoading(true);
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
                toastAndNavigate(dispatch, true, "error", err?.response?.data?.msg);
                throw err;
            });
    };

    const createSalon = () => {
        let promises;
        setLoading(true);
        formData.salonData.values = {
            ...formData.salonData.values,
            user_id: getLocalStorage("auth").id
        }
        API.SalonAPI.createSalon({ ...formData.salonData.values })
            .then(({ data: salon }) => {
                if (salon?.status === 'Success') {
                    API.AddressAPI.createAddress({
                        ...formData.addressData.values,
                        parent_id: salon.data.id,
                        parent: 'salon',
                    })
                        .then(async (address) => {
                            if (formData.imageData.values.file?.length) {
                                promises = Array.from(formData.imageData.values.file).map(async (image) => {
                                    let formattedName = formatImageName(image.name);
                                    uploadImageToAzure("salon", image, formattedName);
                                    API.ImageAPI.createImage({
                                        image_src: formattedName,
                                        parent_id: salon.data.id,
                                        parent: 'salon',
                                    })
                                });
                                return Promise.all(promises)
                                    .then(data => {
                                        setLoading(false);
                                        if (auth.type === 'admin') {
                                            toastAndNavigate(dispatch, true, "success", "Successfully Created", navigateTo, "/salon/listing");
                                        } else {
                                            toastAndNavigate(dispatch, true, "success", "Successfully Created");
                                            location.reload();
                                        }
                                    })
                                    .catch(err => {
                                        setLoading(false);
                                        toastAndNavigate(dispatch, true, "error", err ? err?.response?.data?.msg : "An Error Occurred");
                                        throw err;
                                    });
                            } else {
                                setLoading(false);
                                if (auth.type === 'admin') {
                                    toastAndNavigate(dispatch, true, "success", "Successfully Created", navigateTo, "/salon/listing");
                                } else {
                                    toastAndNavigate(dispatch, true, "success", "Successfully Created");
                                    location.reload();
                                }
                            }
                        })
                        .catch(err => {
                            setLoading(false);
                            toastAndNavigate(dispatch, true, "error", err ? err?.response?.data?.msg : "An Error Occurred");
                            throw err;
                        });
                };
            })
            .catch(err => {
                setLoading(false);
                toastAndNavigate(dispatch, true, "error", err?.response?.data?.msg);
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
        } else {
            setSubmitted(false);
        }
    }, [id, submitted]);

    const handleSubmit = async () => {
        await salonFormRef.current.Submit();
        await addressFormRef.current.Submit();
        await imageFormRef.current.Submit();
        setSubmitted(true);
        setDirty(false);
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

    const handleSubmitDialog = () => {
        API.UserAPI.update({ id: auth.id, agreement: 1 });
        // const uploading = await uploadDocumentToAzure(folder, file);
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
            <ResponsiveDialog agreement={agreementSigned} role={role} handleSubmitDialog={handleSubmitDialog} />
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
                setDirty={setDirty}
                reset={reset}
                setReset={setReset}
                updatedValues={updatedValues?.addressData}
                showTextfields={showTextfields}
            />
            <ImagePicker
                onChange={(data) => {
                    handleFormChange(data, 'image');
                }}
                refId={imageFormRef}
                setDirty={setDirty}
                reset={reset}
                setReset={setReset}
                preview={preview}
                setPreview={setPreview}
                // userId={id}
                updatedValues={updatedValues?.imageData}
                deletedImage={deletedImage}
                setDeletedImage={setDeletedImage}
            />
            <Box display="flex" justifyContent="end" mt="20px" pb="20px">
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
                    onClick={() => {
                        if (auth.type === 'admin') {
                            navigateTo("/salon/listing");
                        } else {
                            toastAndNavigate(dispatch, true, "error", "Cancelled");
                            location.reload();
                        }
                    }}>
                    Cancel
                </Button>
                <Button type="submit" id="submit-btn" onClick={() => handleSubmit()}
                    disabled={!dirty}
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
