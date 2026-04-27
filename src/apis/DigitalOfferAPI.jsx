/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 */

import { api } from "./config/axiosConfig";
import { defineCancelApiObject } from "./config/axiosUtils";
import { Utility } from "../components/utility";

const { getLocalStorage } = Utility();

export const DigitalOfferAPI = {
    /** Get digital offers from the database based on specified query parameters
     */
    getAll: async (page = 0, size = 5, search = false, cancel = false) => {
        let url = `/digital-offers/get-all?page=${page}&size=${size}`;
        // we can add search support later or just use it here if controller supports it
        const role = getLocalStorage("auth")?.type;
        if (role === 'salon') {
            const salonId = getLocalStorage("salon")?.id;
            if (salonId) url += `&salonId=${salonId}`;
        }
        
        const { data: response } = await api.request({
            url,
            headers: {
                "x-access-token": getLocalStorage("auth")?.token
            },
            method: "GET",
            signal: cancel ? cancelApiObject[this.getAll.name].handleRequestCancellation().signal : undefined,
        });
        return response;
    },

    /** Create a digital offer
     */
    create: async (offer, cancel = false) => {
        const { data: response } = await api.request({
            url: `/digital-offers/create`,
            headers: {
                "x-access-token": getLocalStorage("auth").token
            },
            method: "POST",
            data: offer,
            signal: cancel ? cancelApiObject[this.create.name].handleRequestCancellation().signal : undefined,
        });
        return response;
    },

    /** Update a digital offer
     */
    update: async (fields, cancel = false) => {
        const { data: response } = await api.request({
            url: `/digital-offers/update`,
            headers: {
                "x-access-token": getLocalStorage("auth").token
            },
            method: "PATCH",
            data: fields,
            signal: cancel ? cancelApiObject[this.update.name].handleRequestCancellation().signal : undefined,
        });
        return response;
    },

    /** Delete a digital offer
     */
    delete: async (id, cancel = false) => {
        const { data: response } = await api.request({
            url: `/digital-offers/delete?id=${id}`,
            headers: {
                "x-access-token": getLocalStorage("auth").token
            },
            method: "DELETE",
            signal: cancel ? cancelApiObject[this.delete.name].handleRequestCancellation().signal : undefined,
        });
        return response;
    }
};

// defining the cancel API object for DigitalOfferAPI
const cancelApiObject = defineCancelApiObject(DigitalOfferAPI);
