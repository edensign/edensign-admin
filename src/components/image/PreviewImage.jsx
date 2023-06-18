/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import { useEffect } from "react";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

import Loader from "../common/Loader";

const PreviewImage = ({ imageFiles, preview, setPreview }) => {
    let arrayOfImages = Array.from(imageFiles);
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
        arrayOfImages.forEach(item => readImageFiles(item));
    }, [imageFiles]);

    return (
        <ImageList sx={{ width: "80%", height: "60%" }} cols={3} rowHeight={220} gap={6}>
            {preview ? preview.map((item, index) => (
                <ImageListItem key={index}>
                    <img
                        src={item}
                        // srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                        alt="This image cannot be seen"
                        loading="lazy"
                        style={{
                            objectFit: "cover",
                            height: "100%",
                            width: "100%",
                            borderRadius: "12px",
                            boxShadow: "3px 3px 6px hsl(0, 0%, 50%)"
                        }}
                    />
                </ImageListItem>
            )) : <Loader />}
        </ImageList>
    );
}

export default PreviewImage;
