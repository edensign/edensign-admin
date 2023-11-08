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
    const [salonEmployeeData, setSalonEmployeeData] = useState({});   //this will get all salon employee data

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

    const updateSalonAndAddress = useCallback(formData => {
        setLoading(true);

        const paths = ["/update-salon", "/update-address"];
        const dataFields = [
            {
                ...formData.salonData.values,
                services: getSelectedServices(formData.salonData.values.services),
                amenities: getSelectedAmenities(formData.salonData.values.amenities)
            },
            { ...formData.addressData.values },
            { ...formData.employeeData.values },
            { ...formData.imageData.values },
            { ...formData.bannerImageData.values }
        ];
        console.log("Datafields in update=>", dataFields)
        console.log("formdatas in update=>", formData)

        // delete the selected (removed) images from Azure which are in deletedImage state
        if (deletedImage.length) {
            deletedImage.forEach(image => {
                deleteFileFromAzure("salon", image);
                console.log("Deleted normal image from azure");
            });
        }
        // delete the selected (removed) images from Azure which are in deletedBannerImage state
        if (deletedBannerImage.length) {
            deletedBannerImage.forEach(image => {
                deleteFileFromAzure("salon/banner", image);
                console.log("Deleted  banner image from azure");
            });
        }

        // delete all images from db on every update and later insert new and old again
        API.ImageAPI.deleteImage({
            parent: "salon",
            parent_id: id
        });
        console.log(`Deleted all images of id ${id} from db`)

        API.CommonAPI.multipleAPICall("PATCH", paths, dataFields)
            .then(responses => {
                let status = null;
                let formattedName;
                if (responses) {
                    if (!isEmpty(dataFields[2])) {
                        console.log("Inside datafields[2]")
                        Object.values(formData.employeeData.values).forEach(employee => {
                            // Array from creates an array from an iterable, which does not work on plain objects, using Object.values()
                            employee.services = getSelectedServices(employee.services);
                            console.log("Update loop=>", employee)
                            API.SalonEmployeeAPI.updateSalonEmployee({
                                ...employee
                            })
                        });
                        console.log("Updated salon employee")
                        status = true;
                    }
                    if (!isEmpty(dataFields[3])) {
                        // upload new images normal to azure and insert in db
                        if (formData.imageData.values?.Normal) {
                            //to do, it is a quick fix to remove deleted images from formData.imageData
                            const newFilteredImageData = Array.from(formData.imageData.values.Normal).filter(val => !deletedImage.includes(val.image_src));

                            console.log("Formdata.imagedata.normal new=>", Array.from(formData.imageData.values?.Normal))
                            console.log("new Filtered imagedata=>", newFilteredImageData)

                            newFilteredImageData.map(image => {
                                formattedName = formatImageName(image.name);
                                API.ImageAPI.uploadImage({ folder: 'salon', file: image, name: formattedName });
                                API.ImageAPI.createImage({
                                    image_src: formattedName,
                                    parent_id: formData.salonData.values.id,
                                    parent: 'salon',
                                    type: 'normal'
                                })
                            });
                            console.log("Created new normal image")
                            status = true;
                        }
                        // insert old images normal only in db & not on azure
                        if (formData.imageData?.values) {
                            //to do, it is a quick fix to remove deleted images from formData.imageData
                            const oldFilteredImageData = formData.imageData.values.filter(val => !deletedImage.includes(val.image_src));

                            console.log("Formdata.imagedata.old=>", formData.imageData?.values)
                            console.log("old Filtered imagedata=>", oldFilteredImageData)

                            oldFilteredImageData.map(image => {
                                API.ImageAPI.createImage({
                                    image_src: image.image_src,
                                    parent_id: image.parent_id,
                                    parent: image.parent,
                                    type: image.type
                                })
                            });
                            console.log("Created old normal image only in db")
                            status = true;
                        }
                    }
                    if (!isEmpty(dataFields[4])) {
                        // upload new banner images to azure and insert in db
                        if (formData.bannerImageData.values?.Banner) {
                            //to do, it is a quick fix to remove deleted images from formData.imageData
                            const newFilteredBannerImageData = Array.from(formData.bannerImageData.values?.Banner).filter(val => !deletedBannerImage.includes(val.image_src));

                            console.log("Formdata.bannerImagedata=>", Array.from(formData.bannerImageData.values?.Banner))
                            console.log("new Filtered imagedata=>", newFilteredBannerImageData)

                            newFilteredBannerImageData.map(async (image) => {
                                let formattedName = formatImageName(image.name);
                                API.ImageAPI.uploadImage({ folder: 'salon/banner', file: image, name: formattedName });
                                API.ImageAPI.createImage({
                                    image_src: formattedName,
                                    parent_id: formData.salonData.values.id,
                                    parent: 'salon',
                                    type: 'banner'
                                })
                            });
                            console.log("Created new banner image")
                            status = true;
                        }
                        // insert old images banner only in db & not on azure
                        if (formData.bannerImageData?.values) {
                            //to do, it is a quick fix to remove deleted images from formData.bannerImageData
                            const oldFilteredBannerImageData = formData.bannerImageData.values.filter(val => !deletedBannerImage.includes(val.image_src));

                            console.log("Formdata.bannerImagedata=>", formData.bannerImageData?.values)
                            console.log("old Filtered bannerimage=>", oldFilteredBannerImageData)
                            oldFilteredBannerImageData.map(image => {
                                API.ImageAPI.createImage({
                                    image_src: image.image_src,
                                    parent_id: image.parent_id,
                                    parent: image.parent,
                                    type: image.type
                                })
                            });
                            console.log("Created old banner image only in db")
                            status = true;
                        }
                    } else {
                        status = true;      //ye hai isempty datafields[3]
                    }
                    if (status) {
                        setLoading(false);
                        if (role === "admin") {
                            console.log("I have ended updating all fields")
                            toastAndNavigate(dispatch, true, "info", "Successfully Updated", navigateTo, "/salon/detail/listing");
                            // if (pathname === `/salon/detail/update/${id}`) navigateTo("/salon/detail/listing");    //to hide Autocomplete error
                        } else {
                            toastAndNavigate(dispatch, true, "info", "Successfully Updated", navigateTo, 0);
                        }
                    }
                }
            })
            .catch(err => {
                setLoading(false);
                toastAndNavigate(dispatch, true, "error", err?.response?.data?.msg, navigateTo, 0);
                throw err;
            });
    }, [formData]);

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

    const createSalon = () => {
        let promises;       //multiple images so multiple async operations will run, we get them in promises
        let bannerPromises;
        let employeePromises;
        setLoading(true);

        formData.salonData.values = {
            ...formData.salonData.values,
            user_id: getLocalStorage("auth").id,
            salon_code: createSalonCode(formData.salonData.values.name),
            services: getSelectedServices(formData.salonData.values?.services),
            amenities: getSelectedAmenities(formData.salonData.values?.amenities)
        };

        API.SalonAPI.createSalon({ ...formData.salonData.values })
            .then(({ data: salon }) => {
                if (salon?.status === 'Success') {
                    API.AddressAPI.createAddress({
                        ...formData.addressData.values,
                        parent_id: salon.data.id,
                        parent: 'salon',
                    })
                        .then(address => {

                            console.log("Salon employee data=>", formData);

                            employeePromises = Object.values(formData.employeeData.values).map(employee => {
                                // Array from creates an array from an iterable, which does not work on plain objects, using Object.values()
                                employee.services = getSelectedServices(employee.services);
                                API.SalonEmployeeAPI.createSalonEmployee({
                                    ...employee,
                                    salon_id: salon.data.id
                                })
                            });

                            if (formData.imageData.values.Normal?.length) {
                                promises = Array.from(formData.imageData.values.Normal).map(async (image) => {
                                    let formattedName = formatImageName(image.name);
                                    API.ImageAPI.uploadImage({ folder: 'salon', file: image, name: formattedName });
                                    API.ImageAPI.createImage({
                                        image_src: formattedName,
                                        parent_id: salon.data.id,
                                        parent: 'salon',
                                        type: 'normal'
                                    })
                                });

                                if (formData.bannerImageData.values.Banner?.length) {
                                    bannerPromises = Array.from(formData.bannerImageData.values.Banner).map(async (image) => {
                                        let formattedName = formatImageName(image.name);
                                        API.ImageAPI.uploadImage({ folder: 'salon/banner', file: image, name: formattedName });
                                        API.ImageAPI.createImage({
                                            image_src: formattedName,
                                            parent_id: salon.data.id,
                                            parent: 'salon',
                                            type: 'banner'
                                        })
                                    });

                                    return Promise.all([employeePromises, promises, bannerPromises])
                                        .then(data => {
                                            setLoading(false);
                                            if (role === 'admin') {
                                                toastAndNavigate(dispatch, true, "success", "Successfully Created", navigateTo, "/salon/detail/listing");
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
                            }       //run when there are no images submitted
                            else {
                                setLoading(false);
                                if (role === 'admin') {
                                    console.log("Form submitted without images")
                                    toastAndNavigate(dispatch, true, "success", "Successfully Created", navigateTo, "/salon/detail/listing");
                                } else {
                                    console.log("Form submitted without images")
                                    toastAndNavigate(dispatch, true, "success", "Successfully Created", navigateTo, 0);
                                }
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
                toastAndNavigate(dispatch, true, "error", err?.response?.data?.msg, navigateTo, 0);
                throw err;
            });
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


    //Create/Update/Populate salon
    useEffect(() => {
        if (id && !submitted && services && amenities) {
            setTitle("Update");
            populateSalonData(id);
        }
        if (formData.salonData.validated && formData.addressData.validated) {
            //fill salonEmployee state values into formData
            formData ? formData.employeeData.values = salonEmployeeData : null;
            formData.salonData.values?.id ? updateSalonAndAddress(formData) : createSalon();
        } else {
            setSubmitted(false);
        }
    }, [id, submitted, services, amenities]);

    const handleSubmit = async () => {
        await salonFormRef.current.Submit();
        await addressFormRef.current.Submit();
        await imageFormRef.current.Submit();
        await bannerImageFormRef.current.Submit();
        // await employeeFormRef1.current.Submit();
        // await employeeFormRef2.current.Submit();
        // await employeeFormRef3.current.Submit();

        setSubmitted(true);
        setDirty(false);
    };
    // console.log("formData=>", formData)
    // console.log("salonemploData=>", salonEmployeeData)


    const handleEmployeeFormChange = () => {
        // console.log("I is cakked=>", index, data)
        // setEmployeeFormData({
        //     ...employeeFormData, [`employeeValues_${index}`]: data
        // });
    };

    const handleFormChange = (data, form) => {
        if (form === 'salon') {
            setFormData({ ...formData, salonData: data });
        } else if (form === 'address') {
            setFormData({ ...formData, addressData: data });
        } else if (form === `employee`) {
            console.log("Employee details....)")
            // handleEmployeeFormChange(data, index);
            // setFormCount(prevCount => prevCount + 1);
        } else if (form === 'image') {
            setFormData({ ...formData, imageData: data })
        } else if (form === 'banner') {
            setFormData({ ...formData, bannerImageData: data })
        }
    };

    const handleSubmitDialog = (folderName, fileName, blobName) => {
        API.UserAPI.update({ id: auth.id, agreement: 1 });
        uploadDocumentToAzure(folderName, fileName, blobName);
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
                azurePath={`${ENV.VITE_SAS_URL}/${ENV.VITE_PARENT_SALON}`}
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
                azurePath={`${ENV.VITE_SAS_URL}/${ENV.VITE_PARENT_SALON}/banner`}
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
