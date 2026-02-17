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
    getAppointments: async (cancel = false) => {
        return await api.request({
            url: `/get-appointments`,
            headers: {
                "x-access-token": getLocalStorage("auth").token
            },
            method: "GET",
            signal: cancel ? cancelApiObject[this.getAppointments.name].handleRequestCancellation().signal : undefined,
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
