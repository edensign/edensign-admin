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

export const AppointmentAPI = {
    /** Get all appointments with salon and employee details
     */
    getAppointments: async (salonId = null, cancel = false) => {
        const salonParam = salonId ? `?salonId=${salonId}` : '';
        return await api.request({
            url: `/get-appointments${salonParam}`,
            headers: {
                "x-access-token": getLocalStorage("auth").token
            },
            method: "GET",
            signal: cancel ? cancelApiObject[this.getAppointments.name].handleRequestCancellation().signal : undefined,
        });
    },

    /** Create appointment
     */
    createAppointment: async (data, cancel = false) => {
        return await api.request({
            url: `/create-appointment`,
            headers: {
                "x-access-token": getLocalStorage("auth").token
            },
            method: "POST",
            data,
            signal: cancel ? cancelApiObject[this.createAppointment.name].handleRequestCancellation().signal : undefined,
        });
    },

    /** Get booked slots
     */
    getBookedSlots: async (data, cancel = false) => {
        return await api.request({
            url: `/get-booked-slots`,
            headers: {
                "x-access-token": getLocalStorage("auth").token
            },
            method: "POST",
            data,
            signal: cancel ? cancelApiObject[this.getBookedSlots.name].handleRequestCancellation().signal : undefined,
        });
    },

    /** Get Kanban slots: stylists + appointments + salon hours for a given date
     */
    getKanbanSlots: async ({ date, salonId }, cancel = false) => {
        return await api.request({
            url: `/get-kanban-slots?date=${date}&salonId=${salonId}`,
            headers: {
                "x-access-token": getLocalStorage("auth").token
            },
            method: "GET",
        });
    },

    /** Get appointment list for datagrid (format for ServerPaginationGrid)
     */
    getList: async function (page, pageSize, cancel = false) {
        const response = await this.getAppointments(cancel);
        return response;
    }
};

// defining the cancel API object for AppointmentAPI
const cancelApiObject = defineCancelApiObject(AppointmentAPI);
