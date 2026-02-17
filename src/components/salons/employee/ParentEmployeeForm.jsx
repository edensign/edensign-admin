/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use, reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
*/

import React, { useState, useEffect } from "react";

import { useFormik } from "formik";
import { Box, Divider, useMediaQuery } from "@mui/material";

import ChildEmployeeFormComponent from "./ChildEmployeeForm";

// let employeeValues = {};

const ParentEmployeeFormComponent = ({
    onChange1,
    onChange2,
    onChange3,
    refId1,
    refId2,
    refId3,
    update,
    setEmployeeFormCount,
    setDirty,
    reset,
    setReset,
    services,
    updatedValues = null
}) => {

    const [employeeValues, setEmployeeValues] = useState({
        name: "",
        email: "",
        contact_no: "",
        services: [],
        gender: "",
        age: "",
        slots: []
    });
    const isNonMobile = useMediaQuery("(min-width:600px)");

    // const formik = useFormik({
    //     initialValues: employeeValues,
    //     enableReinitialize: true,
    //     onSubmit: (values) => {
    //         return new Promise((resolve, reject) => {
    //             if (values) {
    //                 resolve(setEmployeeValues({ ...values, values }));
    //             } else {
    //                 resolve(setEmployeeValues({ ...values, values }));
    //             }
    //         })
    //     }
    // });

    // React.useImperativeHandle(refId, () => ({
    //     Submit: async () => {
    //         await formik.submitForm();
    //     }
    // }));

    // const watchForm = () => {
    //     if (onChange) {
    //         onChange({
    //             values: formik.values
    //         });
    //     };
    // }
    console.log("Parent values=>", employeeValues)

    return (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center"                >
            <ChildEmployeeFormComponent
                key="first"
                index="second"
                refId={refId1}
                onChange={onChange1}
                reset={reset}
                setReset={setReset}
                setDirty={setDirty}
                services={services}
                // formCount={formCount}
                employeeValues={employeeValues}
                setEmployeeValues={setEmployeeValues}
                setEmployeeFormCount={setEmployeeFormCount}
                updatedValues={updatedValues?.employeeData}
            />
            <ChildEmployeeFormComponent
                key="second"
                index="third"
                refId={refId2}
                onChange={onChange2}
                reset={reset}
                setReset={setReset}
                setDirty={setDirty}
                services={services}
                // formCount={formCount}
                employeeValues={employeeValues}
                setEmployeeValues={setEmployeeValues}
                setEmployeeFormCount={setEmployeeFormCount}
                updatedValues={updatedValues?.employeeData}
            />
            <ChildEmployeeFormComponent
                key="third"
                index="fourth"
                refId={refId3}
                onChange={onChange3}
                reset={reset}
                setReset={setReset}
                setDirty={setDirty}
                services={services}
                // formCount={formCount}
                employeeValues={employeeValues}
                setEmployeeValues={setEmployeeValues}
                setEmployeeFormCount={setEmployeeFormCount}
                updatedValues={updatedValues?.employeeData}
            />
        </Box>
    );
}

export default ParentEmployeeFormComponent;
