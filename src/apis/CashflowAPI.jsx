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

export const CashflowAPI = {
    /** Get all cashflow transactions
     */
    getAll: async (conditionObj = false, page = 0, size = 10, search = false, startDate = null, endDate = null, salonId = null, cancel = false) => {
        const queryParam = conditionObj ? `&${conditionObj.key}=${conditionObj.value}` : '';
        const searchParam = search ? `&search=${search}` : '';
        const dateParam = startDate && endDate ? `&startDate=${startDate}&endDate=${endDate}` : '';
        const salonParam = salonId ? `&salonId=${salonId}` : '';

        const { data: response } = await api.request({
            url: `/cashflow/get-all?page=${page}&size=${size}${queryParam}${searchParam}${dateParam}${salonParam}`,
            headers: {
                "x-access-token": getLocalStorage("auth")?.token
            },
            method: "GET",
            signal: cancel ? cancelApiObject[this.getAll.name].handleRequestCancellation().signal : undefined,
        });
        return response;
    },

    /** Create a new cashflow transaction
     */
    create: async (data, cancel = false) => {
        return await api.request({
            url: `/cashflow/create`,
            headers: {
                "x-access-token": getLocalStorage("auth")?.token
            },
            method: "POST",
            data: data,
            signal: cancel ? cancelApiObject[this.create.name].handleRequestCancellation().signal : undefined,
        });
    },

    /** Update a cashflow transaction
     */
    update: async (data, cancel = false) => {
        return await api.request({
            url: `/cashflow/update`,
            headers: {
                "x-access-token": getLocalStorage("auth")?.token
            },
            method: "PATCH",
            data: data,
            signal: cancel ? cancelApiObject[this.update.name].handleRequestCancellation().signal : undefined,
        });
    },

    /** Delete a cashflow transaction
     */
    delete: async (id, cancel = false) => {
        return await api.request({
            url: `/cashflow/delete?id=${id}`,
            headers: {
                "x-access-token": getLocalStorage("auth")?.token
            },
            method: "DELETE",
            signal: cancel ? cancelApiObject[this.delete.name].handleRequestCancellation().signal : undefined,
        });
    },

    /** Get a cashflow transaction by ID
     */
    getById: async (id, cancel = false) => {
        const { data: response } = await api.request({
            url: `/cashflow/get-by-id/${id}`,
            headers: {
                "x-access-token": getLocalStorage("auth")?.token
            },
            method: "GET",
            signal: cancel ? cancelApiObject[this.getById.name].handleRequestCancellation().signal : undefined,
        });
        return response;
    },

    /** Get cashflow summary
     */
    getSummary: async (startDate = null, endDate = null, salonId = null, cancel = false) => {
        const dateParam = startDate && endDate ? `?startDate=${startDate}&endDate=${endDate}` : '';
        const salonParam = salonId ? `${dateParam ? '&' : '?'}salonId=${salonId}` : '';

        const { data: response } = await api.request({
            url: `/cashflow/summary${dateParam}${salonParam}`,
            headers: {
                "x-access-token": getLocalStorage("auth")?.token
            },
            method: "GET",
            signal: cancel ? cancelApiObject[this.getSummary.name].handleRequestCancellation().signal : undefined,
        });
        return response;
    }
};

const cancelApiObject = defineCancelApiObject(CashflowAPI);
