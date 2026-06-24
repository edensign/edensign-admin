/**
 * Copyright © 2026, Eden Sign Inc. ALL RIGHTS RESERVED.
 */

import { api } from "./config/axiosConfig";
import { defineCancelApiObject } from "./config/axiosUtils";
import { Utility } from "../components/utility";

const { getLocalStorage } = Utility();

export const DistributorAPI = {
    /** Get distributors with pagination & condition (can list all or list company allotted distributors)
     */
    getAll: async (conditionObj = false, page = 0, size = 5, search = false, authInfo, cancel = false) => {
        // If we are logged in as a company, we retrieve the distributors for our own company
        const urlPath = (authInfo?.type === 'company') ? '/company/distributors' : '/get-distributors';
        const queryParam = conditionObj ? `&${conditionObj.key}=${conditionObj.value}` : '';
        const searchParam = search ? `&search=${search}` : '';

        const { data: response } = await api.request({
            url: `${urlPath}?page=${page}&size=${size}${queryParam}${searchParam}`,
            headers: {
                "x-access-token": getLocalStorage("auth")?.token
            },
            method: "GET",
            signal: cancel ? cancelApiObject.getAll.handleRequestCancellation().signal : undefined,
        });
        return response;
    },

    /** Create new distributor and login credentials (Company action)
     */
    createDistributor: async (distributor, cancel = false) => {
        return await api.request({
            url: `/create-distributor`,
            headers: {
                "x-access-token": getLocalStorage("auth")?.token
            },
            method: "POST",
            data: distributor,
            signal: cancel ? cancelApiObject.createDistributor.handleRequestCancellation().signal : undefined,
        });
    },

    /** Update distributor details (Company or Admin action)
     */
    updateDistributor: async (fields, cancel = false) => {
        return await api.request({
            url: `/update-distributor`,
            headers: {
                "x-access-token": getLocalStorage("auth")?.token
            },
            method: "PATCH",
            data: fields,
            signal: cancel ? cancelApiObject.updateDistributor.handleRequestCancellation().signal : undefined,
        });
    },

    /** Get logged-in distributor profile and company details
     */
    getProfile: async (cancel = false) => {
        return await api.request({
            url: `/distributor/profile`,
            headers: {
                "x-access-token": getLocalStorage("auth")?.token
            },
            method: "GET",
            signal: cancel ? cancelApiObject.getProfile.handleRequestCancellation().signal : undefined,
        });
    }
};

const cancelApiObject = defineCancelApiObject(DistributorAPI);
