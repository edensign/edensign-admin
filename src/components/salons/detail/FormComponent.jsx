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
const s3BaseUrl = (ENV.VITE_S3_BASE_URL || "https://salon-s3.s3.us-east-1.amazonaws.com").replace(/"/g, "");

const FormComponent = () => {
    const [title, setTitle] = useState("Create");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        salonData: { values: null, validated: false },
        addressData: { values: null, validated: false },
        employeeData: { values: null, validated: true },
        mediaData: {}
    });
    const [salonEmployeeData, setSalonEmployeeData] = useState();

    const [updatedValues, setUpdatedValues] = useState(null);
    const [mediaPreviews, setMediaPreviews] = useState({});
    const [mediaDeleted, setMediaDeleted] = useState({});

    const [dirty, setDirty] = useState(false);
    const [reset, setReset] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [showTextfields, setShowTextfields] = useState(false);
    const [showSalonFields, setShowSalonFields] = useState(false);
    const [services, setServices] = useState([]);       //for service table in salon form component
    const [amenities, setAmenities] = useState([]);     //for amenities table in salon form component

    const salonFormRef = useRef();
    const addressFormRef = useRef();
    const frontRef = useRef();
    const receptionRef = useRef();
    const serviceChairRef = useRef();
    const shampooChairRef = useRef();
    const pediChairRef = useRef();
    const nailArtRef = useRef();
    const facialBedRef = useRef();
    const selfiePointRef = useRef();
    const productDisplayRef = useRef();
    const lastFullSalonRef = useRef();
    const otherServiceCustomerRef = useRef();
    const videosRef = useRef();

    const [salesExecutives, setSalesExecutives] = useState([]);

    const mediaConfig = [
        { type: 'front', label: 'Front pic', max: 2, accept: 'image/*', ref: frontRef },
        { type: 'reception', label: 'Reception', max: 2, accept: 'image/*', ref: receptionRef },
        { type: 'service_chair', label: 'Service chair', max: 4, accept: 'image/*', ref: serviceChairRef },
        { type: 'shampoo_chair', label: 'Shampoo chair', max: 2, accept: 'image/*', ref: shampooChairRef },
        { type: 'pedi_chair', label: 'Pedi chair', max: 2, accept: 'image/*', ref: pediChairRef },
        { type: 'nail_art', label: 'Nail Art', max: 4, accept: 'image/*', ref: nailArtRef },
        { type: 'facial_bed', label: 'Facial Bed', max: 4, accept: 'image/*', ref: facialBedRef },
        { type: 'product_display', label: 'Product Display', max: 4, accept: 'image/*', ref: productDisplayRef },
        { type: 'selfie_point', label: 'Selfi', max: 4, accept: 'image/*', ref: selfiePointRef },
        { type: 'last_full_salon', label: 'Full Salon Pic', max: 5, accept: 'image/*', ref: lastFullSalonRef },
        { type: 'other_service_customer', label: 'Other Pic', max: 5, accept: 'image/*', ref: otherServiceCustomerRef },
        { type: 'videos', label: 'Videos', max: 2, accept: 'video/*', ref: videosRef }
    ];

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

        let salonFormValues = { ...formData.salonData.values };
        // Only convert specific dropdown fields to null to prevent DB check constraint violations
        // while allowing other fields to remain as empty strings to satisfy NOT NULL constraints.
        const fieldsToNullifyIfEmpty = ['category', 'type', 'status', 'closed_on', 'created_by', 'referral_by'];
        fieldsToNullifyIfEmpty.forEach(key => {
            if (salonFormValues[key] === "") {
                salonFormValues[key] = null;
            }
        });

        const paths = ["/update-salon", "/update-address"];
        const dataFields = [
            {
                ...salonFormValues,
                services: getSelectedServices(salonFormValues.services),
                amenities: getSelectedAmenities(salonFormValues.amenities),
                referral_by: salonFormValues.referral_by || null,
                created_by: salonFormValues.created_by || salonFormValues.userId // Preserve or set
            },
            { 
                ...formData.addressData.values,
                parent: 'salon',
                parent_id: id
            },
            { ...formData.employeeData.values },
            { ...formData.mediaData }
        ];

        // delete the selected (removed) media files from AWS S3 which are in mediaDeleted state
        if (mediaDeleted && Object.keys(mediaDeleted).length > 0) {
            Object.entries(mediaDeleted).forEach(([mediaType, images]) => {
                if (images && images.length > 0) {
                    images.forEach(async (image) => {
                        try {
                            const key = `eden-sign/salon/${mediaType}/${image}`;
                            console.log(`Deleting media key ${key} from S3...`);
                            await API.ImageAPI.deleteS3File(key);
                        } catch (err) {
                            console.error(`Failed to delete S3 file ${key}:`, err);
                        }
                    });
                }
            });
        }

        try {
            const responses = await API.CommonAPI.multipleAPICall("PATCH", paths, dataFields);
            
            // 1. Update Salon Employees
            if (formData.employeeData.values && Object.keys(formData.employeeData.values).length > 0) {
                const employeePromises = Object.values(formData.employeeData.values).map(async employee => {
                    employee.services = getSelectedServices(employee.services);
                    return API.SalonEmployeeAPI.updateSalonEmployee({ ...employee });
                });
                await Promise.all(employeePromises);
                console.log("Updated salon employees");
            }

            // 2. Handle Media Images & Videos — only process types that have actual data
            const processMedia = async (mediaType, filesObj) => {
                // If no data was touched for this type, leave existing images alone
                if (!filesObj || !filesObj.values || !filesObj.values[mediaType]) return;
                const items = Array.from(filesObj.values[mediaType]);

                // Delete only THIS type's images from db before re-inserting
                await API.ImageAPI.deleteImageByType({
                    parent: "salon",
                    parent_id: id,
                    type: mediaType
                });
                console.log(`Deleted existing images of type "${mediaType}" for salon ${id}`);

                // Upload NEW media files
                const newPromises = items
                    .filter(item => item instanceof File)
                    .map(async item => {
                        let formattedName = formatImageName(item.name);
                        await API.ImageAPI.uploadImage({ folder: `eden-sign/salon/${mediaType}/${formattedName}`, document: item });
                        return API.ImageAPI.createImage({
                            image_src: formattedName,
                            parent_id: id,
                            parent: 'salon',
                            type: mediaType
                        });
                    });

                // Re-insert OLD media (existing DB records kept by user)
                const oldPromises = items
                    .filter(item => !(item instanceof File) && item.image_src)
                    .map(async item => {
                        return API.ImageAPI.createImage({
                            image_src: item.image_src,
                            parent_id: id,
                            parent: 'salon',
                            type: mediaType
                        });
                    });

                await Promise.all([...newPromises, ...oldPromises]);
            };

            const mediaPromises = mediaConfig.map(config => processMedia(config.type, formData.mediaData[config.type]));
            await Promise.all(mediaPromises);
            console.log("Processed all media");

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
    }, [id, role, dispatch, navigateTo, toastAndNavigate, formatImageName, mediaDeleted]);

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
                    imageData: responses[2]?.data?.data, // Used to filter below
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

        let salonFormValues = { ...formData.salonData.values };
        // Only convert specific dropdown fields to null to prevent DB check constraint violations
        // while allowing other fields to remain as empty strings to satisfy NOT NULL constraints.
        const fieldsToNullifyIfEmpty = ['category', 'type', 'status', 'closed_on', 'created_by', 'referral_by'];
        fieldsToNullifyIfEmpty.forEach(key => {
            if (salonFormValues[key] === "") {
                salonFormValues[key] = null;
            }
        });

        const salonValues = {
            ...salonFormValues,
            user_id: getLocalStorage("auth").id,
            salon_code: createSalonCode(salonFormValues.name),
            services: getSelectedServices(salonFormValues.services),
            amenities: getSelectedAmenities(salonFormValues.amenities),
            referral_by: salonFormValues.referral_by || null,
            // If admin, they might have selected a creator. If Sales Executive, it's auto-handled by backend but good to be explicit.
            created_by: role === 'sales_executive' ? id : (salonFormValues.created_by || id)
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

                const processMediaCreate = async (mediaType, filesObj) => {
                    if (!filesObj || !filesObj.values || !filesObj.values[mediaType]) return [];
                    const items = Array.from(filesObj.values[mediaType])
                        .filter(item => item instanceof File)
                        .map(async (item) => {
                            let formattedName = formatImageName(item.name);
                            await API.ImageAPI.uploadImage({ folder: `eden-sign/salon/${mediaType}/${formattedName}`, document: item });
                            return API.ImageAPI.createImage({
                                image_src: formattedName,
                                parent_id: salon.data.id,
                                parent: 'salon',
                                type: mediaType
                            });
                        });
                    return Promise.all(items);
                };

                const mediaCreatePromises = mediaConfig.map(config => processMediaCreate(config.type, formData.mediaData[config.type]));
                await Promise.all([...employeePromises, ...mediaCreatePromises]);

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
        
        const mediaRes = {};
        for (const config of mediaConfig) {
            mediaRes[config.type] = await config.ref.current.Submit();
        }

        const gatheredData = {
            salonData: salonRes,
            addressData: addressRes,
            mediaData: mediaRes,
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
            } else if (form.startsWith('media_')) {
                const type = form.replace('media_', '');
                return { ...prev, mediaData: { ...prev.mediaData, [type]: data } };
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


            <Box display="flex" flexWrap="wrap" gap="20px" m="10px">
                {mediaConfig.map(config => (
                    <ImagePicker
                        key={config.type}
                        onChange={data => handleFormChange(data, `media_${config.type}`)}
                        refId={config.ref}
                        reset={reset}
                        setReset={setReset}
                        setDirty={setDirty}
                        preview={mediaPreviews[config.type] || []}
                        setPreview={(val) => setMediaPreviews(prev => ({ ...prev, [config.type]: val }))}
                        updatedValues={updatedValues?.imageData?.filter(img => img.type === config.type) || []}
                        deletedImage={mediaDeleted[config.type] || []}
                        setDeletedImage={(val) => setMediaDeleted(prev => ({ ...prev, [config.type]: val }))}
                        imageType={config.type}
                        maxFiles={config.max}
                        acceptTypes={config.accept}
                        azurePath={`${s3BaseUrl}/eden-sign/salon/${config.type}`}
                        ENV={ENV}
                    />
                ))}
            </Box>

            <Box display="flex" justifyContent="end" m="20px">
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
