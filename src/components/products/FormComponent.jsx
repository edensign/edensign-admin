/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use, reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import React, { useCallback, useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Box, Button, Chip, Divider, Typography, useTheme } from "@mui/material";

import API from "../../apis";
import AddressFormComponent from "../address/AddressFormComponent";
import ImagePicker from "../image/ImagePicker";
import Loader from "../common/Loader";
import ProductFormComponent from "./ProductFormComponent";
import Toast from "../common/Toast";

import { setMenuItem } from "../../redux/actions/NavigationAction";
import { deleteFileFromAzure, uploadDocumentToAzure } from "../azure/AzureStorageConnection";
import { tokens, themeSettings } from "../../theme";
import { Utility } from "../utility";

const ENV = import.meta.env;

const FormComponent = () => {
    const [title, setTitle] = useState("Create");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        productData: { values: null, validated: false },
        addressData: { values: null, validated: false },
        imageData: { values: null, validated: true },
    });
    const [updatedValues, setUpdatedValues] = useState(null);
    const [deletedImage, setDeletedImage] = useState([]);
    const [preview, setPreview] = useState([]);
    const [dirty, setDirty] = useState(false);
    const [reset, setReset] = useState(false);
    const [showTextfields, setShowTextfields] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const productFormRef = useRef();
    const addressFormRef = useRef();
    const imageFormRef = useRef();

    const navigateTo = useNavigate();
    const userParams = useParams();
    const { pathname } = useLocation();
    const dispatch = useDispatch();

    const selected = useSelector(state => state.menuItems.selected);
    const toastInfo = useSelector(state => state.toastInfo);

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { typography } = themeSettings(theme.palette.mode);
    const { toastAndNavigate, getLocalStorage, getRole, formatImageName } = Utility();

    let id = userParams?.id;
    const auth = getLocalStorage("auth");
    const role = getRole();

    useEffect(() => {
        const selectedMenu = getLocalStorage("menu");
        dispatch(setMenuItem(selectedMenu.selected));

        //these are latitude & longitude fields which only salon needs to enter
        if (pathname === "/salon/detail/create" || pathname === "/salon/detail/update") {
            setShowTextfields(true);
        } else {
            setShowTextfields(false);
        }
    }, []);

    //function to check whether an object is empty
    const isEmpty = (obj) => {
        for (const prop in obj) {
            if (Object.hasOwn(obj, prop)) {
                return false;
            }
        }
        return true;
    };

    const updateProductAndAddress = useCallback(formData => {
        setLoading(true);
        const paths = ["/update-product", "/update-address"];
        const dataFields = [
            { ...formData.productData.values },
            { ...formData.addressData.values },
            { ...formData.imageData.values }
        ];
        console.log('datafieds', dataFields);
        // delete the selected (removed) images from Azure which are in deletedImage state
        if (deletedImage.length) {
            deletedImage.forEach(image => {
                // deleteFileFromAzure("product", image);
                console.log("Deleted normal image from azure");
            });
        }
        // delete all images from db on every update and later insert new and old again
        API.ProductImageAPI.deleteProductImage({
            parent_id: id
        });

        API.CommonAPI.multipleAPICall("PATCH", paths, dataFields)
            .then(responses => {
                let status = null;
                let formattedName;
                if (!isEmpty(dataFields[2])) {
                    // upload new images normal to azure and insert in db
                    if (formData.imageData.values?.Normal) {
                        Array.from(formData.imageData.values.Normal).map(image => {
                            formattedName = formatImageName(image.name);
                            // API.ProductImageAPI.uploadProductImage({ folder: 'product', file: image, name: formattedName });
                            API.ProductImageAPI.createProductImage({
                                image_src: formattedName,
                                parent_id: formData.productData.values.id,
                                type: 'normal'
                            })
                        });
                        console.log("Created new normal image")
                        status = true;
                    }
                    // insert old images normal only in db & not on azure
                    if (formData.imageData?.values) {
                        formData.imageData.values.map(image => {
                            API.ProductImageAPI.createProductImage({
                                image_src: image.image_src,
                                parent_id: image.parent_id,
                                type: image.type
                            })
                        });
                        console.log("Created old normal image only in db")
                        status = true;
                    }
                } else {
                    status = true;
                }
                if (status) {
                    setLoading(false);
                    if (role === "admin") {
                        console.log("I have ended updating all fields")
                        toastAndNavigate(dispatch, true, "info", "Successfully Updated", navigateTo, "/product/detail/listing");
                        // if (pathname === `/product/detail/update/${id}`) navigateTo("/product/detail/listing");    //to hide Autocomplete error
                    } else {
                        toastAndNavigate(dispatch, true, "info", "Successfully Updated", navigateTo, 0);
                    }
                }
            })
            .catch(err => {
                setLoading(false);
                toastAndNavigate(dispatch, true, "error", err?.response?.data?.msg);
                throw err;
            });
    }, [formData]);

    const populateProductData = (id) => {
        setLoading(true);
        const paths = [`/get-by-pk/product/${id}`, `/get-address/product/${id}`, `/get-product-image/${id}`];
        API.CommonAPI.multipleAPICall("GET", paths)
            .then(responses => {
                console.log("responses=>", responses);
                const dataObj = {
                    productData: responses[0].data.data,
                    addressData: responses[1]?.data?.data,
                    imageData: responses[2]?.data?.data
                };
                setLoading(false);
                setUpdatedValues(dataObj);
            })
            .catch(err => {
                setLoading(false);
                toastAndNavigate(dispatch, true, "error", err?.response?.data?.msg);
                throw err;
            });
    };

    const createProduct = () => {
        let promises;       //multiple images so multiple async operations will run, we get them in promises
        setLoading(true);

        API.ProductAPI.createProduct({ ...formData.productData.values })
            .then(({ data: product }) => {
                if (product?.status === 'Success') {
                    API.AddressAPI.createAddress({
                        ...formData.addressData.values,
                        parent_id: product.data.id,
                        parent: 'product',
                    })
                        .then(address => {
                            if (formData.imageData.values.Normal?.length) {
                                promises = Array.from(formData.imageData.values.Normal).map(async (image) => {
                                    let formattedName = formatImageName(image.name);
                                    // API.ProductImageAPI.uploadProductImage({ folder: 'product', file: image, name: formattedName });
                                    API.ProductImageAPI.createProductImage({
                                        image_src: formattedName,
                                        parent_id: product.data.id,
                                        type: 'normal'
                                    })
                                });
                                return Promise.all(promises)
                                    .then(data => {
                                        setLoading(false);
                                        if (role === 'admin') {
                                            toastAndNavigate(dispatch, true, "success", "Successfully Created", navigateTo, "/product/detail/listing");
                                        } else {
                                            toastAndNavigate(dispatch, true, "success", "Successfully Created", navigateTo, 0);
                                        }
                                    })
                                    .catch(err => {
                                        setLoading(false);
                                        toastAndNavigate(dispatch, true, "error", err ? err?.response?.data?.msg : "An Error Occurred", navigateTo, 0);
                                        throw err;
                                    });
                            }
                        })
                        .catch(err => {
                            setLoading(false);
                            toastAndNavigate(dispatch, true, err ? err : "An Error Occurred. Please Try Again", navigateTo, 0);
                            throw err;
                        });
                }
            })
            .catch(err => {
                setLoading(false);
                toastAndNavigate(dispatch, true, "error", err ? err?.response?.data?.msg : "An Error Occurred", navigateTo, 0);
                throw err;
            });
    };


    //Create/Update/Populate product
    useEffect(() => {
        if (id && !submitted) {
            setTitle("Update");
            populateProductData(id);
        }
        if (formData.productData.validated && formData.addressData.validated) {
            formData.productData.values?.id ? updateProductAndAddress(formData) : createProduct();
        } else {
            setSubmitted(false);
        }
    }, [id, submitted]);

    const handleSubmit = async () => {
        await productFormRef.current.Submit();
        await addressFormRef.current.Submit();
        await imageFormRef.current.Submit();
        setSubmitted(true);
        setDirty(false);
    };

    const handleFormChange = (data, form) => {
        form === 'product' ? setFormData({ ...formData, productData: data }) :
            form === 'image' ? setFormData({ ...formData, imageData: data }) :
                setFormData({ ...formData, addressData: data });
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
            <ProductFormComponent
                onChange={data => {
                    handleFormChange(data, 'product');
                }}
                refId={productFormRef}
                setDirty={setDirty}
                reset={reset}
                setReset={setReset}
                updatedValues={updatedValues?.productData}
            />
            <AddressFormComponent
                onChange={data => {
                    handleFormChange(data, 'address');
                }}
                refId={addressFormRef}
                update={id ? true : false}
                setDirty={setDirty}
                reset={reset}
                setReset={setReset}
                updatedValues={updatedValues?.addressData}
                showTextfields={showTextfields}
            />

            <ImagePicker
                onChange={data => handleFormChange(data, 'image')}
                refId={imageFormRef}
                reset={reset}
                setReset={setReset}
                setDirty={setDirty}
                preview={preview}
                setPreview={setPreview}
                updatedValues={updatedValues?.imageData}
                deletedImage={deletedImage}
                setDeletedImage={setDeletedImage}
                imageType="Normal"
                azurePath={`${ENV.VITE_SAS_URL}/${ENV.VITE_PARENT_PRODUCT}`}
                ENV={ENV}
            />

            <Box display="flex" justifyContent="end" m="20px">
                {   //hide reset button on user update
                    title === "Update" ? null :
                        <Button type="reset" color="warning" variant="contained" sx={{ mr: 3 }}
                            disabled={!dirty || submitted}
                            onClick={() => {
                                if (window.confirm("Do You Really Want To Reset?")) {
                                    setReset(true);
                                    location.reload();
                                }
                            }}
                        >
                            Reset
                        </Button>
                }
                <Button color="error" variant="contained" sx={{ mr: 3 }}
                    onClick={() => {
                        if (role === 'admin') {
                            navigateTo("/product/detail/listing");
                        } else {
                            toastAndNavigate(dispatch, true, "error", "Cancelled");
                            location.reload();
                        }
                    }}>
                    Cancel
                </Button>
                <Button type="submit" id="submit-btn" onClick={() => handleSubmit()} disabled={!dirty}
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
