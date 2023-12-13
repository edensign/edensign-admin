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
    /** Upload product image to the backend from where it is uploaded to azure storage
     */
    uploadProductImage: async (data, cancel = false) => {
        return await api.request({
            url: `/upload-product-image`,
            headers: {
                "Content-Type": "multipart/form-data",
                "x-access-token": getLocalStorage("auth").token
            },
            method: "POST",
            data: data,
            signal: cancel ? cancelApiObject[this.uploadProductImage.name].handleRequestCancellation().signal : undefined,
        });
    }
};

// defining the cancel API object for ProductImageAPI
const cancelApiObject = defineCancelApiObject(ProductImageAPI);
