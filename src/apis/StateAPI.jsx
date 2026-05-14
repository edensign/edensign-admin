/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 */

import { api } from "./config/axiosConfig";
import { defineCancelApiObject } from "./config/axiosUtils";
import { Utility } from "../components/utility";

const { getLocalStorage } = Utility();

export const StateAPI = {
    /** Get all states with pagination (for listing) */
    getAll: async (conditionObj = false, page = 0, size = 10, search = false, authInfo, cancel = false) => {
        const queryParam = conditionObj ? `&${conditionObj.key}=${conditionObj.value}` : '';
        const searchParam = search ? `&search=${search}` : '';
        const { data: response } = await api.request({
            url: `/get-states?page=${page}&size=${size}${queryParam}${searchParam}`,
            method: "GET",
            headers: { "x-access-token": getLocalStorage("auth")?.token },
        });
        return response;
    },
    /** Get states by country_id (for address dropdowns) */
    getStates: async (parent_id, cancel = false) => {
        const { data: response } = await api.request({
            url: `/get-states/${parent_id}`,
            method: "GET",
            headers: { "x-access-token": getLocalStorage("auth").token },
        });
        return response;
    },
    /** Create state */
    createState: async (state, cancel = false) => {
        return await api.request({
            url: `/create-state`,
            method: "POST",
            headers: { "x-access-token": getLocalStorage("auth").token },
            data: state,
        });
    },
    /** Update state */
    updateState: async (fields, cancel = false) => {
        return await api.request({
            url: `/update-state/${fields.id}`,
            method: "PATCH",
            headers: { "x-access-token": getLocalStorage("auth").token },
            data: fields,
        });
    },
    /** Delete state */
    deleteState: async (id, cancel = false) => {
        return await api.request({
            url: `/delete-state/${id}`,
            method: "DELETE",
            headers: { "x-access-token": getLocalStorage("auth").token },
        });
    }
};

const cancelApiObject = defineCancelApiObject(StateAPI);
