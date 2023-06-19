/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
*/

import React, { useState, useEffect } from "react";

import { useFormik } from "formik";
import { Box, Button, IconButton, TextField, useMediaQuery } from "@mui/material";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

import PreviewImage from "./PreviewImage";

const initialValues = {     //clicking on main form reset button does not clears file value
    file: null
};

const ImagePicker = ({ onChange, refId, setDirty, reset, setReset, updatedValues = null }) => {
    const [initialState, setInitialState] = useState(initialValues);
    const [preview, setPreview] = useState([]);

    const isNonMobile = useMediaQuery("(min-width:600px)");

    const formik = useFormik({
        initialValues: initialState,
        enableReinitialize: true,
        onSubmit: () => watchForm(),
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
    }

    useEffect(() => {
        if (reset) {
            formik.resetForm();
            setReset(false);
        }
    }, [reset]);

    useEffect(() => {
        if (formik.dirty) {
            setDirty(true);
        }
    }, [formik.dirty]);

    useEffect(() => {
        if (updatedValues) {
            setInitialState(updatedValues);
        }
    }, [updatedValues]);

    const handleResetUpload = () => {
        console.log("Inside Reset");
        // setDirty(false);
        setPreview([]);
        formik.setFieldValue("file", null);
    };

    return (
        <Box m="10px">
            <form ref={refId} encType="multipart/form-data">
                <TextField
                    accept="image/*, application/pdf"
                    name="file"
                    label="Upload Image"
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
                                        formik.setFieldValue("file", event.target.files);
                                    }}
                                />
                            </IconButton>
                        )
                    }}
                    error={formik.touched.file && Boolean(formik.errors.file)}
                    helperText={formik.touched.file && formik.errors.file}
                    sx={{ m: 1, outline: "none", width: "15ch" }}
                />
                <Button type="button" color="warning" variant="contained" id="reset-btn"
                    disabled={!formik.dirty}
                    onClick={handleResetUpload}
                    sx={{ marginLeft: "6px" }}
                >
                    Reset Upload </Button>
            </form>
            {formik.values.file ?
                <PreviewImage imageFiles={formik.values.file} preview={preview} setPreview={setPreview} />
                : null}
        </Box>
    );
}

export default ImagePicker;
