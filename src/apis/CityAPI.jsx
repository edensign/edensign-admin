/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 */

import { api } from "./config/axiosConfig";
import { defineCancelApiObject } from "./config/axiosUtils";
import { Utility } from "../components/utility";

const { getLocalStorage } = Utility();

export const CityAPI = {
    /** Get all cities with pagination (for listing) */
    getAll: async (conditionObj = false, page = 0, size = 10, search = false, authInfo, cancel = false) => {
        const queryParam = conditionObj ? `&${conditionObj.key}=${conditionObj.value}` : '';
        const searchParam = search ? `&search=${search}` : '';
        const { data: response } = await api.request({
            url: `/get-cities?page=${page}&size=${size}${queryParam}${searchParam}`,
            method: "GET",
            headers: { "x-access-token": getLocalStorage("auth")?.token },
        });
        return response;
    },
    /** Get cities by state_id (for address dropdowns) */
    getCities: async (parent_id, cancel = false) => {
        const { data: response } = await api.request({
            url: `/get-cities/${parent_id}`,
            method: "GET",
            headers: { "x-access-token": getLocalStorage("auth").token },
        });
        return response;
    },
    /** Create city */
    createCity: async (city, cancel = false) => {
        return await api.request({
            url: `/create-city`,
            method: "POST",
            headers: { "x-access-token": getLocalStorage("auth").token },
            data: city,
        });
    },
    /** Update city */
    updateCity: async (fields, cancel = false) => {
        return await api.request({
            url: `/update-city/${fields.id}`,
            method: "PATCH",
            headers: { "x-access-token": getLocalStorage("auth").token },
            data: fields,
        });
    },
    /** Delete city */
    deleteCity: async (id, cancel = false) => {
        return await api.request({
            url: `/delete-city/${id}`,
            method: "DELETE",
            headers: { "x-access-token": getLocalStorage("auth").token },
        });
    }
};

const cancelApiObject = defineCancelApiObject(CityAPI);
