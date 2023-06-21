/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import { useEffect } from "react";
import { IconButton, ImageList, ImageListItem, Tooltip } from "@mui/material";
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';

import Loader from "../common/Loader";

const PreviewImage = ({ deletedImage, setDeletedImage, updatedValues, imageFiles, preview, setPreview }) => {
    let uploadedImages = [];

    const readImageFiles = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            uploadedImages.push(reader.result);
            setPreview([
                ...preview,
                ...uploadedImages
            ]);
        }
        reader.readAsDataURL(file);
    };

    useEffect(() => {
        if (imageFiles) {
            let arrayOfImages = Array.from(imageFiles);
            arrayOfImages.forEach(item => readImageFiles(item));
        }
    }, [imageFiles]);

    const handleDeleteClick = (item) => {
        const index = preview.indexOf(item);
        setDeletedImage([
            ...deletedImage,
            updatedValues[index].image_src
        ]);
        if (index > -1) {               // only splice 1 item from array when it is found
            preview.splice(index, 1);
            updatedValues.splice(index, 1);
            setPreview([
                ...preview
            ]);
        }
    };

    return (
        <ImageList sx={{ width: "80%", height: "60%", overflow: "inherit" }} cols={3} rowHeight={220} gap={8}>
            {preview ? preview.map((item, index) => (
                <ImageListItem key={index}>
                    <IconButton
                        sx={{
                            position: "absolute", left: "87%", top: "-2%"
                        }}
                        onClick={() => handleDeleteClick(item)}
                    >
                        <Tooltip title="DELETE">
                            <HighlightOffOutlinedIcon sx={{
                                "&:hover": {
                                    color: "red", fontSize: "1.5rem", transition: "all 0.5s ease-in-out"
                                }
                            }}
                            />
                        </Tooltip>
                    </IconButton>
                    <img
                        src={item}
                        alt="This image cannot be seen"
                        loading="lazy"
                        style={{
                            objectFit: "cover",
                            height: "100%",
                            width: "100%",
                            borderRadius: "12px",
                            boxShadow: "2px 2px 4px hsl(0, 0%, 30%)"
                        }}
                    />
                </ImageListItem>
            )) : <Loader />}
        </ImageList>
    );
}

export default PreviewImage;
