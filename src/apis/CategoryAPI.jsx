/**
 * Copyright © 2026, Eden Sign Inc. ALL RIGHTS RESERVED.
 */

import { api } from "./config/axiosConfig";
import { defineCancelApiObject } from "./config/axiosUtils";
import { Utility } from "../components/utility";

const { getLocalStorage } = Utility();

export const CategoryAPI = {
    /** Get all categories
     */
    getAll: async (cancel = false) => {
        const { data: response } = await api.request({
            url: `/get-categories`,
            headers: {
                "x-access-token": getLocalStorage("auth")?.token
            },
            method: "GET",
            signal: cancel ? cancelApiObject[this.getAll.name].handleRequestCancellation().signal : undefined,
        });
        return response;
    },
    /** Create a new category
     */
    create: async (payload) => {
        const { data: response } = await api.request({
            url: `/create-category`,
            headers: {
                "x-access-token": getLocalStorage("auth")?.token
            },
            method: "POST",
            data: payload
        });
        return response;
    },
    /** Update a category
     */
    update: async (id, payload) => {
        const { data: response } = await api.request({
            url: `/update-category/${id}`,
            headers: {
                "x-access-token": getLocalStorage("auth")?.token
            },
            method: "PATCH",
            data: payload
        });
        return response;
    },
    /** Delete a category
     */
    delete: async (id) => {
        const { data: response } = await api.request({
            url: `/delete-category/${id}`,
            headers: {
                "x-access-token": getLocalStorage("auth")?.token
            },
            method: "DELETE"
        });
        return response;
    }
};

const cancelApiObject = defineCancelApiObject(CategoryAPI);
