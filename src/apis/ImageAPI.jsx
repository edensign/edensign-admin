/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import { api } from "./config/axiosConfig";
import { defineCancelApiObject } from "./config/axiosUtils";
import { Utility } from "../components/utility";

const { getLocalStorage } = Utility();

export const ImageAPI = {
    /** Get image information from the database based on parent
     */
    getImage: async (parent, parent_id, cancel = false) => {
        const { data: response } = await api.request({
            url: `/get-image/${parent}/${parent_id}`,
            method: "GET",
            headers: {
                "x-access-token": getLocalStorage("auth").token
            },
            signal: cancel ? cancelApiObject[this.getImage.name].handleRequestCancellation().signal : undefined,
        });
        return response;
    },
    /** Create an image & store it in azure while entering only image information in the database
     */
    createImage: async (image, cancel = false) => {
        return await api.request({
            url: `/create-image`,
            headers: {
                "x-access-token": getLocalStorage("auth").token
            },
            method: "POST",
            data: image,
            signal: cancel ? cancelApiObject[this.createImage.name].handleRequestCancellation().signal : undefined,
        });
    },
    /** Update the image in the database and azure storage
     */
    updateImage: async (fields, cancel = false) => {
        return await api.request({
            url: `/update-image`,
            headers: {
                "x-access-token": getLocalStorage("auth").token
            },
            method: "PATCH",
            data: fields,
            signal: cancel ? cancelApiObject[this.updateImage.name].handleRequestCancellation().signal : undefined,
        });
    },
    /** Delete all the images from db on every update
     */
    deleteImage: async (fields, cancel = false) => {
        return await api.request({
            url: `/delete-image`,
            headers: {
                "x-access-token": getLocalStorage("auth").token
            },
            method: "DELETE",
            data: fields,
            signal: cancel ? cancelApiObject[this.deleteImage.name].handleRequestCancellation().signal : undefined,
        });
    },
    /** Upload image to the backend from where it is uploaded to supabase storage
     */
    uploadImage: async (data, cancel = false) => {
        const formData = new FormData();
        formData.append('folder', data.folder);
        formData.append('document', data.document);

        return await api.request({
            url: `/upload-image`,
            headers: {
                // Do NOT set Content-Type here - axios sets it automatically with
                // the correct multipart boundary when FormData is used
                "x-access-token": getLocalStorage("auth").token
            },
            method: "POST",
            data: formData,
            signal: cancel ? cancelApiObject[this.uploadImage.name].handleRequestCancellation().signal : undefined,
        });
    },
    /** Delete images of a specific type for a parent (e.g. only 'front' images for salon 103) */
    deleteImageByType: async (fields, cancel = false) => {
        return await api.request({
            url: `/delete-image-by-type`,
            headers: {
                "x-access-token": getLocalStorage("auth").token
            },
            method: "DELETE",
            data: fields,
            signal: cancel ? cancelApiObject[this.deleteImageByType.name].handleRequestCancellation().signal : undefined,
        });
    },
    /** Delete a file from AWS S3 storage */
    deleteS3File: async (key) => {
        return await api.request({
            url: `/delete-s3-file`,
            headers: {
                "x-access-token": getLocalStorage("auth").token
            },
            method: "DELETE",
            data: { key }
        });
    }
};

// defining the cancel API object for ImageAPI
const cancelApiObject = defineCancelApiObject(ImageAPI);
