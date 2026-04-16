/**
 * Copyright © 2026, Eden Sign Inc. ALL RIGHTS RESERVED.
 */

import { api } from "./config/axiosConfig";
import { defineCancelApiObject } from "./config/axiosUtils";
import { Utility } from "../components/utility";

const { getLocalStorage } = Utility();

export const SalonInventoryAPI = {
    /** Get all salon inventory with stats
     */
    getAll: async (conditionObj = false, page = 0, size = 10, search = false, cancel = false) => {
        const queryParam = conditionObj ? `&${conditionObj.key}=${conditionObj.value}` : '';
        const searchParam = search ? `&search=${search}` : '';

        const { data: response } = await api.request({
            url: `/salon-inventory/get-all?page=${page}&size=${size}${queryParam}${searchParam}`,
            headers: {
                "x-access-token": getLocalStorage("auth")?.token
            },
            method: "GET",
            signal: cancel ? cancelApiObject["getAll"].handleRequestCancellation().signal : undefined,
        });
        return response;
    },

    /** create product
     */
    createProduct: async (data, cancel = false) => {
        return await api.request({
            url: `/salon-inventory/create`,
            headers: {
                "x-access-token": getLocalStorage("auth")?.token
            },
            method: "POST",
            data: data,
            signal: cancel ? cancelApiObject["createProduct"].handleRequestCancellation().signal : undefined,
        });
    },

    /** update product
     */
    updateProduct: async (data, cancel = false) => {
        return await api.request({
            url: `/salon-inventory/update`,
            headers: {
                "x-access-token": getLocalStorage("auth")?.token
            },
            method: "PATCH",
            data: data,
            signal: cancel ? cancelApiObject["updateProduct"].handleRequestCancellation().signal : undefined,
        });
    },

    /** Update stock for a product
     */
    updateStock: async (data, cancel = false) => {
        return await api.request({
            url: `/salon-inventory/update-stock`,
            headers: {
                "x-access-token": getLocalStorage("auth")?.token
            },
            method: "PATCH",
            data: data,
            signal: cancel ? cancelApiObject["updateStock"].handleRequestCancellation().signal : undefined,
        });
    }
};

const cancelApiObject = defineCancelApiObject(SalonInventoryAPI);
