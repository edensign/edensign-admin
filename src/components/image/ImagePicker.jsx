/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use, reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
*/

import React, { useState, useEffect } from "react";

import { useFormik } from "formik";
import { Box, IconButton, TextField } from "@mui/material";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

import PreviewImage from "./PreviewImage";

const ENV = import.meta.env;

const ImagePicker = ({
    onChange,
    refId,
    setDirty,
    reset,
    setReset,
    preview,
    setPreview,
    updatedValues = null,
    deletedImage = [],
    setDeletedImage,
    imageType,
    azurePath
}) => {
    const initialValues = {};
    let newCount;

    initialValues[`${imageType}`] = null;

    const [initialState, setInitialState] = useState(initialValues);

    const formik = useFormik({
        initialValues: initialState,
        enableReinitialize: true,
        onSubmit: () => watchForm()
    });

    React.useImperativeHandle(refId, () => ({
        Submit: async () => {
            await formik.submitForm();
        }
    }));

    const watchForm = () => {
        if (onChange) {
            onChange({
                values: formik.values,
                validated: formik.isSubmitting
                    ? Object.keys(formik.errors).length === 0
                    : false
            });
        };
    };

    console.log(`imagepicker formik values ${imageType}=>`, formik.values);
    useEffect(() => {
        if (reset) {
            formik.resetForm();
            setPreview([]);
            setReset(false);
        }
    }, [reset]);

    useEffect(() => {
        if (!formik.dirty) {
            setDirty(true);
        }
    }, [formik.dirty]);

    useEffect(() => {
        if (updatedValues) {
            console.log("Updated Values=>", updatedValues)
            setInitialState(updatedValues);
            const srcArray = [];
            updatedValues.map(img => {
                if (img.image_src) {
                    srcArray.push(`${azurePath}/${img.image_src}?${ENV.VITE_SAS_TOKEN}`);
                }
            });
            setPreview(srcArray);
        }
    }, [updatedValues?.length]);

    // useEffect(() => {
    //     if (deletedImage) {
    //         delete formik.values(deletedImage);
    //     }
    // }, [deletedImage?.length]);


    return (
        <Box m="10px">
            <form ref={refId} encType="multipart/form-data">
                <TextField
                    accept="image/*, application/pdf"
                    name={imageType}
                    label={`Upload ${imageType} Image`}
                    value={undefined}
                    size="small"
                    onBlur={formik.handleBlur}
                    InputProps={{
                        multiple: true,
                        startAdornment: (
                            <IconButton component="label" sx={{ width: "88%" }}>
                                <AddPhotoAlternateIcon />
                                <input
                                    hidden
                                    multiple
                                    type="file"
                                    name="file"
                                    onChange={(event) => {
                                        console.log(`Onchange picker ${imageType} files=>`, event.target.files)
                                        formik.setFieldValue(`${imageType}`, event.target.files);
                                        newCount = event.target.files.length;
                                        console.log(newCount)
                                        setDirty(true);
                                    }}
                                />
                            </IconButton>
                        )
                    }}
                    error={formik.touched[`${imageType}`] && Boolean(formik.errors[`${imageType}`])}
                    helperText={formik.touched[`${imageType}`] && formik.errors[`${imageType}`]}
                    sx={{ m: 1, outline: "none", width: "15%" }}
                />
            </form>
            {formik.values[`${imageType}`] || preview.length ?
                <PreviewImage
                    formik={formik}
                    deletedImage={deletedImage}
                    setDeletedImage={setDeletedImage}
                    setDirty={setDirty}
                    updatedValues={updatedValues}
                    imageFiles={formik.values[`${imageType}`]}
                    preview={preview}
                    setPreview={setPreview}
                    imageType={imageType}
                    newCount={newCount}
                />
                : null}
        </Box>
    );
}

export default ImagePicker;
