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

export const ServiceAPI = {
    /** Get services from the database that meets the specified query parameters
     */
    getAll: async (conditionObj = false, page = 0, size = 5, search = false, authInfo, cancel = false) => {
        const queryParam = conditionObj ? `&${conditionObj.key}=${conditionObj.value}` : '';
        const searchParam = search ? `&search=${search}` : '';
        const { data: response } = await api.request({
            url: `/get-services?page=${page}&size=${size}${queryParam}${searchParam}`,
            headers: {
                "x-access-token": getLocalStorage("auth")?.token
            },
            method: "GET",
            signal: cancel ? cancelApiObject[this.getAll.name].handleRequestCancellation().signal : undefined,
        });
        return response;
    },
    /** Create Service in the database
 */
    createService: async (service, cancel = false) => {
        return await api.request({
            url: `/create-service`,
            headers: {
                "x-access-token": getLocalStorage("auth").token
            },
            method: "POST",
            data: service,
            signal: cancel ? cancelApiObject[this.createService.name].handleRequestCancellation().signal : undefined,
        });
    },
    /** Update Service in the database
     */
    updateService: async (fields, cancel = false) => {
        return await api.request({
            url: `/update-service`,
            headers: {
                "x-access-token": getLocalStorage("auth").token
            },
            method: "PATCH",
            data: fields,
            signal: cancel ? cancelApiObject[this.updateService.name].handleRequestCancellation().signal : undefined,
        });
    }
}

// defining the cancel API object for ServiceAPI
const cancelApiObject = defineCancelApiObject(ServiceAPI);
