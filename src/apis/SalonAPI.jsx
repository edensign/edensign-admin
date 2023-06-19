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

export const SalonAPI = {
    /** Get salons from the database that meets the specified query parameters
     */
    getAll: async (conditionObj = false, page = 0, size = 5, search = false, authInfo, cancel = false) => {
        const queryParam = conditionObj ? `&${conditionObj.key}=${conditionObj.value}` : '';
        const searchParam = search ? `&search=${search}` : '';
        const { data: response } = await api.request({
            url: `/get-salons?page=${page}&size=${size}${queryParam}${searchParam}`,
            headers: {
                "x-access-token": getLocalStorage("auth")?.token
            },
            method: "GET",
            signal: cancel ? cancelApiObject[this.getAll.name].handleRequestCancellation().signal : undefined,
        });
        return response;
    },
    /** Create salon in the database
     */
    createSalon: async (user, cancel = false) => {
        return await api.request({
            url: `/create-salon`,
            headers: {
                "x-access-token": getLocalStorage("auth").token
            },
            method: "POST",
            data: user,
            signal: cancel ? cancelApiObject[this.createSalon.name].handleRequestCancellation().signal : undefined,
        });
    },
    /** Update salon in the database
     */
    updateSalon: async (fields, cancel = false) => {
        return await api.request({
            url: `/update-salon`,
            headers: {
                "x-access-token": getLocalStorage("auth").token
            },
            method: "PATCH",
            data: fields,
            signal: cancel ? cancelApiObject[this.updateSalon.name].handleRequestCancellation().signal : undefined,
        });
    }
};

// defining the cancel API object for SalonAPI
const cancelApiObject = defineCancelApiObject(SalonAPI);
