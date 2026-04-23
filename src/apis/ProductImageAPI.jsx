/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use, reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import { api } from "./config/axiosConfig";
import { defineCancelApiObject } from "./config/axiosUtils";
import { Utility } from "../components/utility";

const { getLocalStorage } = Utility();

export const ProductImageAPI = {
    /** Get product image information from the database based on parent_id
     */
    getProductImage: async (parent_id, cancel = false) => {
        const { data: response } = await api.request({
            url: `/get-product-image/${parent_id}`,
            method: "GET",
            headers: {
                "x-access-token": getLocalStorage("auth").token
            },
            signal: cancel ? cancelApiObject[this.getProductImage.name].handleRequestCancellation().signal : undefined,
        });
        return response;
    },
    /** Create product image & store it in azure while entering only image information in the database
     */
    createProductImage: async (image, cancel = false) => {
        return await api.request({
            url: `/create-product-image`,
            headers: {
                "x-access-token": getLocalStorage("auth").token
            },
            method: "POST",
            data: image,
            signal: cancel ? cancelApiObject[this.createProductImage.name].handleRequestCancellation().signal : undefined,
        });
    },
    /** Update product image in the database and azure storage
     */
    updateProductImage: async (fields, cancel = false) => {
        return await api.request({
            url: `/update-product-image`,
            headers: {
                "x-access-token": getLocalStorage("auth").token
            },
            method: "PATCH",
            data: fields,
            signal: cancel ? cancelApiObject[this.updateProductImage.name].handleRequestCancellation().signal : undefined,
        });
    },
    /** Delete all the images from db on every update
     */
    deleteProductImage: async (fields, cancel = false) => {
        return await api.request({
            url: `/delete-product-image`,
            headers: {
                "x-access-token": getLocalStorage("auth").token
            },
            method: "DELETE",
            data: fields,
            signal: cancel ? cancelApiObject[this.deleteProductImage.name].handleRequestCancellation().signal : undefined,
        });
    },
    /** Upload product image to the backend from where it is uploaded to supabase storage
     */
    uploadProductImage: async (data, cancel = false) => {
        const formData = new FormData();
        formData.append('folder', data.folder);
        formData.append('name', data.name);
        formData.append('file', data.file);

        return await api.request({
            url: `/upload-product-image`,
            headers: {
                // Do NOT set Content-Type here - axios sets it automatically with
                // the correct multipart boundary when FormData is used
                "x-access-token": getLocalStorage("auth").token
            },
            method: "POST",
            data: formData,
            signal: cancel ? cancelApiObject[this.uploadProductImage.name].handleRequestCancellation().signal : undefined,
        });
    }
};

// defining the cancel API object for ProductImageAPI
const cancelApiObject = defineCancelApiObject(ProductImageAPI);
