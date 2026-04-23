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

import API from "../../../apis";
import AddressFormComponent from "../../address/AddressFormComponent";
// import ParentEmployeeFormComponent from "../employee/ParentEmployeeForm";
import ParentEmployeeFormComponent from "../employee/ParentAnotherLogic";
import ImagePicker from "../../image/ImagePicker";
import Loader from "../../common/Loader";
import ResponsiveDialog from "../../common/Dialog";
import SalonFormComponent from "./SalonFormComponent";
import Toast from "../../common/Toast";

import { setMenuItem } from "../../../redux/actions/NavigationAction";
import { Utility } from "../../utility";
import { deleteFileFromAzure, uploadDocumentToAzure } from "../../azure/AzureStorageConnection";
import { tokens, themeSettings } from "../../../theme";

const ENV = import.meta.env;

const FormComponent = () => {
    const [title, setTitle] = useState("Create");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        salonData: { values: null, validated: false },
        addressData: { values: null, validated: false },
        employeeData: { values: null, validated: true },
        imageData: { values: null, validated: true },
        bannerImageData: { values: null, validated: true }
    });
    const [salonEmployeeData, setSalonEmployeeData] = useState();   //this will get all salon employee data

    const [updatedValues, setUpdatedValues] = useState(null);
    const [deletedImage, setDeletedImage] = useState([]);
    const [preview, setPreview] = useState([]);
    const [deletedBannerImage, setDeletedBannerImage] = useState([]);
    const [previewBanner, setPreviewBanner] = useState([]);

    const [dirty, setDirty] = useState(false);
    const [reset, setReset] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [showTextfields, setShowTextfields] = useState(false);
    const [showSalonFields, setShowSalonFields] = useState(false);
    const [services, setServices] = useState([]);       //for service table in salon form component
    const [amenities, setAmenities] = useState([]);     //for amenities table in salon form component

    const salonFormRef = useRef();
    const addressFormRef = useRef();
    // const employeeFormRef = useRef();
    const imageFormRef = useRef();
    const bannerImageFormRef = useRef();
    const [salesExecutives, setSalesExecutives] = useState([]);

    // let employeeFormRef;
    // for (let i = 1; i < 4; i++) {
    //     window['employeeFormRef' + i] = useRef();
    //     window['employeeValues_' + i] = `employeeValues_${i}`;
    // }
    // console.log(employeeValues_1);
    // console.log(employeeFormRef1);


    const navigateTo = useNavigate();
    const userParams = useParams();
    const { pathname } = useLocation();
    const dispatch = useDispatch();

    const { agreementSigned } = useSelector(state => state.agreementSigned);
    const selected = useSelector(state => state.menuItems.selected);
    const toastInfo = useSelector(state => state.toastInfo);

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { typography } = themeSettings(theme.palette.mode);
    const { toastAndNavigate, getLocalStorage, getRole, formatImageName, createSalonCode } = Utility();

    let id = userParams?.id || getLocalStorage("salon")?.id;
    const auth = getLocalStorage("auth");
    const role = getRole();

    useEffect(() => {
        const selectedMenu = getLocalStorage("menu");
        dispatch(setMenuItem(selectedMenu.selected));

        role === "admin" ? setShowSalonFields(true) : setShowSalonFields(false);

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
    const updateSalonAndAddress = useCallback(async (formData) => {
        setLoading(true);

        const paths = ["/update-salon", "/update-address"];
        const dataFields = [
            {
                ...formData.salonData.values,
                services: getSelectedServices(formData.salonData.values.services),
                amenities: getSelectedAmenities(formData.salonData.values.amenities),
                referral_by: formData.salonData.values.referral_by || null,
                created_by: formData.salonData.values.created_by || formData.salonData.values.userId // Preserve or set
            },
            { 
                ...formData.addressData.values,
                parent: 'salon',
                parent_id: id
            },
            { ...formData.employeeData.values },
            { ...formData.imageData.values },
            { ...formData.bannerImageData.values }
        ];

        try {
            // delete all images from db on every update and later insert new and old again
            await API.ImageAPI.deleteImage({
                parent: "salon",
                parent_id: id
            });
            console.log(`Deleted all images of id ${id} from db`)

            const responses = await API.CommonAPI.multipleAPICall("PATCH", paths, dataFields);
            let formattedName;
            
            // 1. Update Salon Employees
            if (formData.employeeData.values && Object.keys(formData.employeeData.values).length > 0) {
                const employeePromises = Object.values(formData.employeeData.values).map(async employee => {
                    employee.services = getSelectedServices(employee.services);
                    return API.SalonEmployeeAPI.updateSalonEmployee({ ...employee });
                });
                await Promise.all(employeePromises);
                console.log("Updated salon employees");
            }

            // 2. Handle Normal Images
            if (formData.imageData.values?.Normal) {
                const images = Array.from(formData.imageData.values.Normal);
                
                // Upload NEW normal images
                const newImagePromises = images
                    .filter(image => image instanceof File)
                    .map(async image => {
                        formattedName = formatImageName(image.name);
                        await API.ImageAPI.uploadImage({ folder: `eden-sign/salon/normal/${formattedName}`, document: image });
                        return API.ImageAPI.createImage({
                            image_src: formattedName,
                            parent_id: id,
                            parent: 'salon',
                            type: 'normal'
                        });
                    });

                // Re-insert OLD normal images
                const oldImagePromises = images
                    .filter(image => !(image instanceof File) && image.image_src)
                    .map(async image => {
                        return API.ImageAPI.createImage({
                            image_src: image.image_src,
                            parent_id: id,
                            parent: 'salon',
                            type: 'normal'
                        });
                    });

                await Promise.all([...newImagePromises, ...oldImagePromises]);
                console.log("Processed all normal images");
            }

            // 3. Handle Banner Images
            if (formData.bannerImageData.values?.Banner) {
                const bannerImages = Array.from(formData.bannerImageData.values.Banner);
                
                // Upload new banner images
                const newBannerPromises = bannerImages
                    .filter(image => image instanceof File)
                    .map(async image => {
                        formattedName = formatImageName(image.name);
                        await API.ImageAPI.uploadImage({ folder: `eden-sign/salon/banner/${formattedName}`, document: image });
                        return API.ImageAPI.createImage({
                            image_src: formattedName,
                            parent_id: id,
                            parent: 'salon',
                            type: 'banner'
                        });
                    });

                // Re-insert old banner images
                const oldBannerPromises = bannerImages
                    .filter(image => !(image instanceof File) && image.image_src)
                    .map(async image => {
                        return API.ImageAPI.createImage({
                            image_src: image.image_src,
                            parent_id: id,
                            parent: 'salon',
                            type: 'banner'
                        });
                    });

                await Promise.all([...newBannerPromises, ...oldBannerPromises]);
                console.log("Processed all banner images");
            }

            setLoading(false);
            if (role === "admin") {
                toastAndNavigate(dispatch, true, "info", "Successfully Updated", navigateTo, "/salon/detail/listing");
            } else {
                toastAndNavigate(dispatch, true, "info", "Successfully Updated", navigateTo, 0);
            }
        } catch (err) {
            setLoading(false);
            toastAndNavigate(dispatch, true, "error", err?.response?.data?.msg || "An Error Occurred", navigateTo, 0);
            throw err;
        }
    }, [id, role, dispatch, navigateTo, toastAndNavigate, formatImageName]);

    const getSelectedAmenitiesByName = (dataObj) => {
        const objId = dataObj?.split(",");
        if (objId) {
            return amenities.filter(amenity => objId.includes(amenity.id.toString()));
        }
    };

    const getSelectedServicesByName = (dataObj) => {
        const objId = dataObj?.split(",");
        if (objId) {
            return services.filter(service => objId.includes(service.id.toString()));
        }
    };

    const populateSalonData = (id) => {                                                                 //we are finding salon employee by salon_id
        const paths = [`/get-by-pk/salon/${id}`, `/get-address/salon/${id}`, `/get-image/salon/${id}`, `/get-by-id/${id}`];
        setLoading(true);
        API.CommonAPI.multipleAPICall("GET", paths)
            .then(responses => {
                console.log("responses=>", responses);
                if (responses[0].data.data) {
                    responses[0].data.data.amenities = getSelectedAmenitiesByName(responses[0].data.data?.amenities);
                    responses[0].data.data.services = getSelectedServicesByName(responses[0].data.data?.services);
                }
                if (responses[3].data.data) {
                    responses[3].data.data.forEach(response => {
                        response.services = getSelectedServicesByName(response.services);
                    })
                }

                const dataObj = {
                    salonData: responses[0].data.data,
                    addressData: responses[1]?.data?.data,
                    imageData: responses[2]?.data?.data,
                    employeeData: responses[3]?.data?.data
                };
                setLoading(false);
                setUpdatedValues(dataObj);
                console.log("dataObj=>", dataObj);
            })
            .catch(err => {
                setLoading(false);
                toastAndNavigate(dispatch, true, "error", err?.response?.data?.msg);
                throw err;
            });
    };

    //taking out only the id from services object from formData.salonData.values.services
    function getSelectedServices(services) {
        let serviceId = [];          //using traditional function statement for hoisting
        services?.forEach(service => {
            serviceId.push(service.id);
        });
        return serviceId.toString();
    };

    //taking out only the id from amenities object from formData.salonData.values.amenities
    function getSelectedAmenities(amenities) {
        let amenityId = [];         //using traditional function statement for hoisting
        amenities?.forEach(amenity => {
            amenityId.push(amenity.id);
        });
        return amenityId.toString();
    };

    const createSalon = async (formData) => {
        setLoading(true);

        const salonValues = {
            ...formData.salonData.values,
            user_id: getLocalStorage("auth").id,
            salon_code: createSalonCode(formData.salonData.values.name),
            services: getSelectedServices(formData.salonData.values?.services),
            amenities: getSelectedAmenities(formData.salonData.values?.amenities),
            referral_by: formData.salonData.values?.referral_by || null,
            // If admin, they might have selected a creator. If Sales Executive, it's auto-handled by backend but good to be explicit.
            created_by: role === 'sales_executive' ? id : (formData.salonData.values?.created_by || id)
        };

        try {
            const { data: salon } = await API.SalonAPI.createSalon({ ...salonValues });
            if (salon?.status === 'Success') {
                await API.AddressAPI.createAddress({
                    ...formData.addressData.values,
                    parent_id: salon.data.id,
                    parent: 'salon',
                });

                console.log("Salon employee data=>", formData);

                const employeePromises = Object.values(formData.employeeData.values).map(async employee => {
                    employee.services = getSelectedServices(employee.services);
                    return API.SalonEmployeeAPI.createSalonEmployee({
                        ...employee,
                        salon_id: salon.data.id
                    });
                });

                let imagePromises = [];
                if (formData.imageData.values.Normal) {
                    imagePromises = Array.from(formData.imageData.values.Normal)
                        .filter(image => image instanceof File)
                        .map(async (image) => {
                            let formattedName = formatImageName(image.name);
                            await API.ImageAPI.uploadImage({ folder: `eden-sign/salon/normal/${formattedName}`, document: image });
                            return API.ImageAPI.createImage({
                                image_src: formattedName,
                                parent_id: salon.data.id,
                                parent: 'salon',
                                type: 'normal'
                            });
                        });
                }

                let bannerPromises = [];
                if (formData.bannerImageData.values.Banner) {
                    bannerPromises = Array.from(formData.bannerImageData.values.Banner)
                        .filter(image => image instanceof File)
                        .map(async (image) => {
                            let formattedName = formatImageName(image.name);
                            await API.ImageAPI.uploadImage({ folder: `eden-sign/salon/banner/${formattedName}`, document: image });
                            return API.ImageAPI.createImage({
                                image_src: formattedName,
                                parent_id: salon.data.id,
                                parent: 'salon',
                                type: 'banner'
                            });
                        });
                }

                await Promise.all([...employeePromises, ...imagePromises, ...bannerPromises]);

                setLoading(false);
                if (role === 'admin') {
                    toastAndNavigate(dispatch, true, "success", "Successfully Created", navigateTo, "/salon/detail/listing");
                } else {
                    toastAndNavigate(dispatch, true, "success", "Successfully Created", navigateTo, 0);
                }
            }
        } catch (err) {
            setLoading(false);
            toastAndNavigate(dispatch, true, "error", err?.response?.data?.msg || "An Error Occurred", navigateTo, 0);
            throw err;
        }
    };

    //get all services from service table stored in db before populating data
    useEffect(() => {
        const getServices = () => {
            API.ServiceAPI.getAll(false, 0, 30)
                .then(services => {
                    if (services.status === 'Success') {
                        setServices(services.data.rows);
                    } else {
                        console.log("Error, Please Try Again");
                    }
                })
                .catch(err => {
                    throw err;
                });
        };
        getServices();
    }, []);

    //get all amenities from amenity table stored in the db before populating data
    useEffect(() => {
        const getAmenities = () => {
            API.AmenityAPI.getAll(false, 0, 30)
                .then(amenities => {
                    if (amenities.status === 'Success') {
                        setAmenities(amenities.data.rows);
                    } else {
                        console.log("Error, Please Try Again");
                    }
                })
                .catch(err => {
                    throw err;
                });
        };
        getAmenities();
    }, []);

    // Get all sales executives for the dropdown
    useEffect(() => {
        const getSalesExecutives = () => {
            API.UserAPI.getAll({ key: 'type', value: 'sales_executive' }, 0, 100)
                .then(res => {
                    if (res.status === 'Success') {
                        setSalesExecutives(res.data.rows);
                    }
                })
                .catch(err => {
                    console.error("Error fetching sales executives:", err);
                });
        };
        getSalesExecutives();
    }, []);


    //Initialize/Populate salon
    useEffect(() => {
        if (id && services && amenities) {
            setTitle("Update");
            populateSalonData(id);
        }
    }, [id, services, amenities]);

    const handleSubmit = async () => {
        const salonRes = await salonFormRef.current.Submit();
        const addressRes = await addressFormRef.current.Submit();
        const imageRes = await imageFormRef.current.Submit();
        const bannerRes = await bannerImageFormRef.current.Submit();

        const gatheredData = {
            salonData: salonRes,
            addressData: addressRes,
            imageData: imageRes,
            bannerImageData: bannerRes,
            employeeData: { values: salonEmployeeData }
        };

        if (salonRes.validated && addressRes.validated) {
            id ? updateSalonAndAddress(gatheredData) : createSalon(gatheredData);
            setDirty(false);
        }
    };

    const handleFormChange = (data, form) => {
        setFormData(prev => {
            if (form === 'salon') {
                return { ...prev, salonData: data };
            } else if (form === 'address') {
                return { ...prev, addressData: data };
            } else if (form === 'employee') {
                console.log("Employee details....)");
                return prev; // keep existing logic
            } else if (form === 'image') {
                return { ...prev, imageData: data };
            } else if (form === 'banner') {
                return { ...prev, bannerImageData: data };
            }
            return prev;
        });
    };

    const handleSubmitDialog = (folderName, fileName, blobName) => {
        API.UserAPI.update({ id: auth.id, agreement: 1 });
        // uploadDocumentToAzure(folderName, fileName, blobName);
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
                onChange={data => {
                    handleFormChange(data, 'salon');
                }}
                refId={salonFormRef}
                setDirty={setDirty}
                reset={reset}
                setReset={setReset}
                showSalonFields={showSalonFields}
                updatedValues={updatedValues?.salonData}
                amenities={amenities}
                services={services}
                salesExecutives={salesExecutives}
                role={role}
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


            <Divider variant="fullWidth">
                <Chip color="info" label={id ? `Here is a list of salon employees` : `Add Salon Employee Details Here`}
                    sx={{
                        fontSize: "13px", fontWeight: "600", letterSpacing: "0.2em", padding: "12px", textTransform: "capitalize"
                    }}
                />
            </Divider>
            <ParentEmployeeFormComponent
                // onChange1={data => {
                //     handleFormChange(data, `employee`, 1);
                // }}
                // onChange2={data => {
                //     handleFormChange(data, `employee`, 2);
                // }}
                // onChange3={data => {
                //     handleFormChange(data, `employee`, 3);
                // }}
                // refId1={employeeFormRef1}
                // refId2={employeeFormRef2}
                // refId3={employeeFormRef3}
                // setDirty={setDirty}
                // reset={reset}
                // setReset={setReset}
                masterValues={salonEmployeeData}
                setMasterValues={setSalonEmployeeData}
                updatedValues={updatedValues?.employeeData}
                services={services}
            // setEmployeeFormCount={setEmployeeFormCount}
            />


            <ImagePicker
                key="image"
                onChange={data => handleFormChange(data, 'image')}
                refId={imageFormRef}
                reset={reset}
                setReset={setReset}
                setDirty={setDirty}
                preview={preview}
                setPreview={setPreview}
                updatedValues={updatedValues?.imageData.filter(img => img.type === "normal")}
                deletedImage={deletedImage}
                setDeletedImage={setDeletedImage}
                imageType="Normal"
                azurePath={`https://oaqyonnkveufkkamswzv.supabase.co/storage/v1/object/public/photos/${ENV.VITE_PARENT_SALON}/normal`}
                ENV={ENV}
            />
            <ImagePicker
                key="banner"
                onChange={data => handleFormChange(data, 'banner')}
                refId={bannerImageFormRef}
                reset={reset}
                setReset={setReset}
                setDirty={setDirty}
                preview={previewBanner}
                setPreview={setPreviewBanner}
                updatedValues={updatedValues?.imageData.filter(img => img.type === "banner")}
                deletedImage={deletedBannerImage}
                setDeletedImage={setDeletedBannerImage}
                imageType="Banner"
                azurePath={`https://oaqyonnkveufkkamswzv.supabase.co/storage/v1/object/public/photos/${ENV.VITE_PARENT_SALON}/banner`}
                ENV={ENV}
            />

            <Box display="flex" justifyContent="end" m="20px">
                {   //hide reset button on user update
                    title === "Update" ? null :
                        <Button type="reset" color="warning" variant="contained" sx={{ mr: 3 }}
                            disabled={!dirty}
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
                            navigateTo("/salon/detail/listing");
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
