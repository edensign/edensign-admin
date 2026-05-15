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
    const updateProductAndAddress = useCallback(async (formData) => {
        setLoading(true);
        const dataFields = [
            { ...formData.productData.values },
            { 
                ...formData.addressData.values,
                parent: 'product',
                parent_id: id
            },
            { ...formData.imageData.values }
        ];
        
        // delete the selected (removed) images from Azure which are in deletedImage state
        if (deletedImage.length) {
            deletedImage.forEach(image => {
                // deleteFileFromAzure("product", image);
                console.log("Deleted normal image from azure");
            });
        }
        
        try {
            // delete all images from db on every update and later insert new and old again
            await API.ProductImageAPI.deleteProductImage({
                parent_id: id
            });
            console.log("Deleted old images from db");

            const paths = ["/update-product", "/update-address"];
            const responses = await API.CommonAPI.multipleAPICall("PATCH", paths, dataFields);
            let formattedName;

            // Handle images
            if (formData.imageData.values?.Normal) {
                const images = Array.from(formData.imageData.values.Normal);
                
                // 1. Upload NEW images and create records
                const newImagePromises = images
                    .filter(image => image instanceof File)
                    .map(async image => {
                        const formattedName = formatImageName(image.name);
                        await API.ProductImageAPI.uploadProductImage({ folder: 'product', file: image, name: formattedName });
                        return API.ProductImageAPI.createProductImage({
                            image_src: formattedName,
                            parent_id: id,
                            type: 'normal'
                        });
                    });

                // 2. Re-insert OLD images (already in Supabase)
                const oldImagePromises = images
                    .filter(image => !(image instanceof File) && image.image_src)
                    .map(async image => {
                        return API.ProductImageAPI.createProductImage({
                            image_src: image.image_src,
                            parent_id: id,
                            type: 'normal'
                        });
                    });

                await Promise.all([...newImagePromises, ...oldImagePromises]);
                console.log("Processed all normal images");
            }

            setLoading(false);
            if (role === "admin") {
                console.log("Successfully updated all fields");
                toastAndNavigate(dispatch, true, "info", "Successfully Updated", navigateTo, "/product/detail/listing");
            } else {
                toastAndNavigate(dispatch, true, "info", "Successfully Updated", navigateTo, 0);
            }
        } catch (err) {
            setLoading(false);
            console.error("updateProductAndAddress error:", err);
            toastAndNavigate(dispatch, true, "error", err?.response?.data?.msg || "An Error Occurred");
            throw err;
        }
    }, [deletedImage, id, role, dispatch, navigateTo, toastAndNavigate, formatImageName]);

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

    const createProduct = (formData) => {
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
                            if (formData.imageData.values.Normal) {
                                promises = Array.from(formData.imageData.values.Normal)
                                    .filter(image => image instanceof File)
                                    .map(async (image) => {
                                        let formattedName = formatImageName(image.name);
                                        await API.ProductImageAPI.uploadProductImage({ folder: 'product', file: image, name: formattedName });
                                        await API.ProductImageAPI.createProductImage({
                                            image_src: formattedName,
                                            parent_id: product.data.id,
                                            type: 'normal'
                                        });
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
                            } else {
                                setLoading(false);
                                if (role === 'admin') {
                                    toastAndNavigate(dispatch, true, "success", "Successfully Created", navigateTo, "/product/detail/listing");
                                } else {
                                    toastAndNavigate(dispatch, true, "success", "Successfully Created", navigateTo, 0);
                                }
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


    //Initialize/Populate product
    useEffect(() => {
        if (id) {
            setTitle("Update");
            populateProductData(id);
        }
    }, [id]);

    const handleSubmit = async () => {
        const productRes = await productFormRef.current.Submit();
        const addressRes = await addressFormRef.current.Submit();
        const imageRes = await imageFormRef.current.Submit();

        const gatheredData = {
            productData: productRes,
            addressData: addressRes,
            imageData: imageRes
        };

        if (productRes.validated && addressRes.validated) {
            id ? updateProductAndAddress(gatheredData) : createProduct(gatheredData);
            setDirty(false);
        }
    };

    const handleFormChange = (data, form) => {
        setFormData(prev =>
            form === 'product' ? { ...prev, productData: data } :
            form === 'image'   ? { ...prev, imageData: data }   :
                                 { ...prev, addressData: data }
        );
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
                azurePath={`https://oaqyonnkveufkkamswzv.supabase.co/storage/v1/object/public/photos/${ENV.VITE_PARENT_PRODUCT}`}
                ENV={ENV}
            />

            <Box display="flex" justifyContent="end" m="20px">
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
