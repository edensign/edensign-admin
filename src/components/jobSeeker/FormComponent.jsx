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

import { Box, Button, Typography, useTheme } from "@mui/material";

import API from "../../apis";
import AddressFormComponent from "../address/AddressFormComponent";
import JobSeekerFormComponent from "./JobSeekerFormComponent";
import Loader from "../common/Loader";
import Toast from "../common/Toast";

import { uploadResumeToAzure, uploadDocumentToAzure } from "../azure/AzureStorageConnection";
import { setMenuItem } from "../../redux/actions/NavigationAction";
import { tokens, themeSettings } from "../../theme";
import { Utility } from "../utility";

const FormComponent = () => {
    const [title, setTitle] = useState("Create");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        jobSeekerData: { values: null, validated: false },
        addressData: { values: null, validated: false },
    });
    const [updatedValues, setUpdatedValues] = useState(null);
    const [dirty, setDirty] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [reset, setReset] = useState(false);
    const [filename, setFilename] = useState();     //for uploaded resume file name
    const [skills, setSkills] = useState([]);       //for skill table in salon form component

    const jobSeekerFormRef = useRef();
    const addressFormRef = useRef();

    const selected = useSelector(state => state.menuItems.selected);
    const toastInfo = useSelector(state => state.toastInfo);
    const theme = useTheme();
    const { state } = useLocation();
    const { toastAndNavigate, getLocalStorage } = Utility();
    const { typography } = themeSettings(theme.palette.mode);

    const navigateTo = useNavigate();
    const dispatch = useDispatch();
    const userParams = useParams();
    const colors = tokens(theme.palette.mode);
    //after page refresh the id in router state becomes undefined, so getting user id from url params
    let id = state?.id || userParams?.id;


    useEffect(() => {
        const selectedMenu = getLocalStorage("menu");
        dispatch(setMenuItem(selectedMenu.selected));
    }, []);

    const updateJobSeekerAndAddress = useCallback(async formData => {
        console.log(formData)
        if (formData.jobSeekerData?.values?.resume instanceof File && filename) {
            let formattedResumeName = formatResumeName(formData.jobSeekerData?.values?.name, filename);
            formData.jobSeekerData.values.resume = formattedResumeName;
        } else if (Array.isArray(formData.jobSeekerData?.values?.resume) || !formData.jobSeekerData?.values?.resume) {
            formData.jobSeekerData.values.resume = "";
        }
        const dataFields = [
            {
                ...formData.jobSeekerData.values,
                skills: getSelectedSkills(formData.jobSeekerData.values.skills),
            },
            { ...formData.addressData.values }
        ];
        const paths = ["/update-job-seeker", "/update-address"];
        setLoading(true);

        try {
            const responses = await API.CommonAPI.multipleAPICall("PATCH", paths, dataFields);
            let status = true;
            responses.forEach(response => {
                if (response.data.status !== "Success") {
                    status = false;
                }
            });
            if (status) {
                setLoading(false);
                toastAndNavigate(dispatch, true, "info", "Successfully Updated", navigateTo, `/job/seeker/listing`);
            } else {
                setLoading(false);
                toastAndNavigate(dispatch, true, "error", "An Error Occurred. Please Try Again", navigateTo, 0);
            }
        } catch (err) {
            setLoading(false);
            toastAndNavigate(dispatch, true, "error", err?.response?.data?.msg || "An Error Occurred");
            throw err;
        }
    }, [formData, filename, dispatch, navigateTo, toastAndNavigate]);


    const getSelectedSkillsByName = (dataObj) => {
        const objId = dataObj?.split(",");
        if (objId) {
            return skills.filter(skill => objId.includes(skill.id.toString()));
        }
    };

    const populateJobSeekerData = (id) => {
        setLoading(true);
        const paths = [`/get-by-pk/job_seeker/${id}`, `/get-address/job_seeker/${id}`];
        API.CommonAPI.multipleAPICall("GET", paths)
            .then(responses => {
                console.log("responses=", responses)
                if (responses[0]?.data?.data) {
                    responses[0].data.data.skills = getSelectedSkillsByName(responses[0].data.data?.skills);
                }

                const dataObj = {
                    jobSeekerData: responses[0].data.data,
                    addressData: responses[1]?.data?.data
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

    //taking out only the id from skills object from formData.jobSeekerData.values.skills
    function getSelectedSkills(skills) {
        let skillId = [];          //using traditional function statement for hoisting
        skills?.forEach(skill => {
            skillId.push(skill.id);
        });
        return skillId.toString();
    };

    const formatResumeName = (name, file) => {
        let formattedName;
        if (name && file) {
            formattedName = Math.ceil(Math.random() * 100) + name
                .toLowerCase()
                .trim()
                .replace(/[!@#$%^&*();:'"`~`'$]/g, "")
                .replace(/\s+/g, "_") + "-" + file
                    .toLowerCase()
                    .trim()
                    .replace(/[!@#$%^&*();:'"`~`'$]/g, "")
                    .replace(/\s+/g, "_");
        }
        return formattedName;
    };

    const createJobSeeker = () => {
        setLoading(true);
        if (formData.jobSeekerData?.values?.resume instanceof File && filename) {
            let formattedResumeName = formatResumeName(formData.jobSeekerData?.values?.name, filename);
            console.log("Uploading...");
            // uploadResumeToAzure("job-seeker", formattedResumeName, formData.jobSeekerData?.values?.resume);
            formData.jobSeekerData.values.resume = formattedResumeName;
        } else {
            formData.jobSeekerData.values.resume = "";
        }
        formData.jobSeekerData.values = {
            ...formData.jobSeekerData.values,
            skills: getSelectedSkills(formData.jobSeekerData.values?.skills),
        }

        API.JobSeekerAPI.createJobSeeker({ ...formData.jobSeekerData.values })
            .then(({ data: jobSeeker }) => {
                if (jobSeeker?.status === 'Success') {
                    API.AddressAPI.createAddress({
                        ...formData.addressData.values,
                        parent_id: jobSeeker.data.id,
                        parent: 'job_seeker',
                    })
                        .then(address => {
                            setLoading(false);
                            toastAndNavigate(dispatch, true, "success", "Successfully Created", navigateTo, `/job/seeker/listing`);
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
                toastAndNavigate(dispatch, true, "error", err?.response?.data?.msg);
                throw err;
            });
    };

    //get all skills from skill table stored in db before populating data
    useEffect(() => {
        const getskills = () => {
            API.SkillAPI.getAll(false, 0, 30)
                .then(skills => {
                    if (skills.status === 'Success') {
                        setSkills(skills.data.rows);
                    } else {
                        console.log("Error, Please Try Again");
                    }
                })
                .catch(err => {
                    throw err;
                });
        };
        getskills();
    }, []);


    //Create/Update/Populate Job Seeker
    useEffect(() => {
        if (id && !submitted && skills) {
            setTitle("Update");
            populateJobSeekerData(id);
        }
        if (formData.jobSeekerData.validated && formData.addressData.validated) {
            formData.jobSeekerData.values?.id ? updateJobSeekerAndAddress(formData) : createJobSeeker();
        } else {
            setSubmitted(false);
        }
    }, [id, submitted, skills]);

    const handleSubmit = async () => {
        await jobSeekerFormRef.current.Submit();
        await addressFormRef.current.Submit();
        setSubmitted(true);
    };

    const handleFormChange = (data, form) => {
        form === 'jobSeeker' ? setFormData({ ...formData, jobSeekerData: data }) :
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
            <JobSeekerFormComponent
                onChange={(data) => {
                    handleFormChange(data, 'jobSeeker');
                }}
                refId={jobSeekerFormRef}
                setDirty={setDirty}
                reset={reset}
                setReset={setReset}
                jobSeekerId={id}
                updatedValues={updatedValues?.jobSeekerData}
                filename={filename}
                setFilename={setFilename}
                skills={skills}
            />
            <AddressFormComponent
                onChange={(data) => {
                    handleFormChange(data, 'address');
                }}
                refId={addressFormRef}
                update={id ? true : false}
                setDirty={setDirty}
                reset={reset}
                setReset={setReset}
                updatedValues={updatedValues?.addressData}
            />

            <Box display="flex" justifyContent="end" m="20px">
                <Button type="reset" color="warning" variant="contained" sx={{ mr: 3 }}
                    disabled={!dirty || submitted}
                    onClick={() => {
                        if (window.confirm("Do You Really Want To Reset?")) {
                            setReset(true);
                            location.reload();
                        };
                    }}
                >
                    Reset
                </Button>
                <Button color="error" variant="contained" sx={{ mr: 3 }}
                    onClick={() => navigateTo(`/job/seeker/listing`)}>
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
