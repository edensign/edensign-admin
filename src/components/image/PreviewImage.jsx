/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import { useEffect } from "react";
import { IconButton, ImageList, ImageListItem, Tooltip, useMediaQuery } from "@mui/material";
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';

import Loader from "../common/Loader";

const PreviewImage = ({
    formik,
    preview,
    setPreview,
    deletedImage = [],
    setDeletedImage,
    setDirty,
    imageFiles,
    imageType,
    newCount,
    updatedValues,
    azurePath,
    ENV,
    setInitialState
}) => {
    const isMobile = useMediaQuery("(max-width:480px)");
    const isTab = useMediaQuery("(max-width:920px)");
    let oldCount;
    let uploadedImages = [];
    console.log('azurePath', azurePath);

    useEffect(() => {
        console.log('USE EFFECT 2')
        const srcArray = [];
        if (updatedValues) {
            updatedValues.map(img => {
                if (img.image_src) {
                    srcArray.push(`${azurePath}/${img.image_src}`);
                }
            });
        }

        setPreview([
            ...srcArray,         //We are not doing ...preview because in imagePicker file we have already
        ]);
    }, [updatedValues?.length]);

    const readImageFiles = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            uploadedImages.push(reader.result);

            const srcArray = [];
            if (updatedValues) {
                updatedValues.map(img => {
                    if (img.image_src) {
                        srcArray.push(`${azurePath}/${img.image_src}`);
                    }
                });
            }

            setPreview([
                ...srcArray,         //We are not doing ...preview because in imagePicker file we have already
                ...uploadedImages   //done manual merge of formik.values in onchange of input
            ]);
        }
        reader.readAsDataURL(file);
    };

    useEffect(() => {
        console.log('USE EFFECT 1');
        if (imageFiles) {
            console.log('imageFiles', imageFiles);
            let arrayOfImages = Array.from(imageFiles);
            arrayOfImages.forEach(item => readImageFiles(item));
        }
    }, [imageFiles]);
    console.log('preview=>', preview);

    const handleDeleteClick = (item) => {
        const index = preview.indexOf(item);

        if (updatedValues) {
            setDeletedImage([
                ...deletedImage,
                updatedValues[index]?.image_src,
            ]);
        }

        if (index > -1) {                   // only splice 1 item from array when it is found
            preview.splice(index, 1);
            if (updatedValues) {
                updatedValues.splice(index, 1);
                setInitialState({
                    ...updatedValues
                });
                console.log("Values after delete=>", updatedValues);
            }
            // On update imageFiles is empty
            if (imageFiles) {
                imageFiles.splice(index, 1);
                formik.setFieldValue(imageType, imageFiles);
            }
            setPreview([...preview]);
            setDirty(true);     //to enable the submit button
        }
    };
    console.log("TEST updatedValues =>", updatedValues);


    return (
        <ImageList sx={{ width: "80%", height: "60%", overflow: "inherit", marginBottom: "8%" }}
            cols={3} rowHeight={isMobile ? 80 : isTab ? 160 : 220} gap={8}>
            {preview ? preview.map((item, index) => (
                <ImageListItem key={index}>
                    <IconButton
                        sx={{
                            position: "absolute",
                            left: "87%",
                            '@media screen and (max-width: 920px)': {
                                left: '77%',
                            },
                            '@media screen and (max-width: 480px)': {
                                left: '60%',
                            },
                            top: "-2%"
                        }}
                        onClick={() => handleDeleteClick(item)}
                    >
                        <Tooltip title="DELETE">
                            <HighlightOffOutlinedIcon sx={{
                                color: "#002147",
                                "&:hover": {
                                    color: "red", fontSize: "1.5rem", transition: "all 0.3s ease-in-out"
                                }
                            }}
                            />
                        </Tooltip>
                    </IconButton>
                    <img
                        src={item}
                        alt="This image is not available"
                        loading="lazy"
                        style={{
                            objectFit: "cover",
                            height: "100%",
                            width: "100%",
                            borderRadius: isMobile ? "6px" : "12px",
                            boxShadow: "2px 2px 4px hsl(0, 0%, 30%)"
                        }}
                    />
                </ImageListItem>
            )) : <Loader />}
        </ImageList>
    );
}

export default PreviewImage;
