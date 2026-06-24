/**
 * Copyright © 2026, Eden Sign Inc. ALL RIGHTS RESERVED.
 */

import { api } from "./config/axiosConfig";
import { defineCancelApiObject } from "./config/axiosUtils";
import { Utility } from "../components/utility";

const { getLocalStorage } = Utility();

export const CompanyAPI = {
    /** Get companies with pagination & condition
     */
    getAll: async (conditionObj = false, page = 0, size = 5, search = false, authInfo, cancel = false) => {
        const queryParam = conditionObj ? `&${conditionObj.key}=${conditionObj.value}` : '';
        const searchParam = search ? `&search=${search}` : '';
        const { data: response } = await api.request({
            url: `/get-companies?page=${page}&size=${size}${queryParam}${searchParam}`,
            headers: {
                "x-access-token": getLocalStorage("auth")?.token
            },
            method: "GET",
            signal: cancel ? cancelApiObject.getAll.handleRequestCancellation().signal : undefined,
        });
        return response;
    },

    /** Create new Company and its login credentials (Admin action)
     */
    createCompany: async (company, cancel = false) => {
        return await api.request({
            url: `/create-company`,
            headers: {
                "x-access-token": getLocalStorage("auth")?.token
            },
            method: "POST",
            data: company,
            signal: cancel ? cancelApiObject.createCompany.handleRequestCancellation().signal : undefined,
        });
    },

    /** Update company details (Admin or Company action)
     */
    updateCompany: async (fields, cancel = false) => {
        return await api.request({
            url: `/update-company`,
            headers: {
                "x-access-token": getLocalStorage("auth")?.token
            },
            method: "PATCH",
            data: fields,
            signal: cancel ? cancelApiObject.updateCompany.handleRequestCancellation().signal : undefined,
        });
    },

    /** Get logged-in company details and profile
     */
    getProfile: async (cancel = false) => {
        return await api.request({
            url: `/company/profile`,
            headers: {
                "x-access-token": getLocalStorage("auth")?.token
            },
            method: "GET",
            signal: cancel ? cancelApiObject.getProfile.handleRequestCancellation().signal : undefined,
        });
    },

    /** Bulk update pricing/offers of products under a company (Company action)
     */
    updatePricingOffers: async (companyId, products, cancel = false) => {
        return await api.request({
            url: `/companies/${companyId}/pricing-offers`,
            headers: {
                "x-access-token": getLocalStorage("auth")?.token
            },
            method: "PATCH",
            data: { products },
            signal: cancel ? cancelApiObject.updatePricingOffers.handleRequestCancellation().signal : undefined,
        });
    }
};

const cancelApiObject = defineCancelApiObject(CompanyAPI);
