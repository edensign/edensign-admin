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

export const AcademyAPI = {
    /** Get academy courses from the database based on specified query parameters
     */
    getAll: async (page = 0, size = 5, search = false, cancel = false) => {
        const searchParam = search ? `&search=${search}` : '';
        const { data: response } = await api.request({
            url: `/academy/get-all?page=${page}&size=${size}${searchParam}`,
            headers: {
                "x-access-token": getLocalStorage("auth")?.token
            },
            method: "GET",
            signal: cancel ? cancelApiObject[this.getAll.name].handleRequestCancellation().signal : undefined,
        });
        return response;
    },

    /** Create an academy course
     */
    create: async (academy, cancel = false) => {
        return await api.request({
            url: `/academy/create`,
            headers: {
                "x-access-token": getLocalStorage("auth").token
            },
            method: "POST",
            data: academy,
            signal: cancel ? cancelApiObject[this.create.name].handleRequestCancellation().signal : undefined,
        });
    },

    /** Update an academy course
     */
    update: async (fields, cancel = false) => {
        return await api.request({
            url: `/academy/update`,
            headers: {
                "x-access-token": getLocalStorage("auth").token
            },
            method: "PATCH",
            data: fields,
            signal: cancel ? cancelApiObject[this.update.name].handleRequestCancellation().signal : undefined,
        });
    },

    /** Delete an academy course
     */
    delete: async (id, cancel = false) => {
        return await api.request({
            url: `/academy/delete?id=${id}`,
            headers: {
                "x-access-token": getLocalStorage("auth").token
            },
            method: "DELETE",
            signal: cancel ? cancelApiObject[this.delete.name].handleRequestCancellation().signal : undefined,
        });
    }
};

// defining the cancel API object for AcademyAPI
const cancelApiObject = defineCancelApiObject(AcademyAPI);
