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

export const SalonEmployeeAPI = {
    /** Create salon employee in the database 
      */
    createSalonEmployee: async (employee, cancel = false) => {
        console.log("Salon emolyee api=>", employee)
        return await api.request({
            url: `/create-salon-employee`,
            headers: {
                "x-access-token": getLocalStorage("auth").token
            },
            method: "POST",
            data: employee,
            signal: cancel ? cancelApiObject[this.createSalonEmployee.name].handleRequestCancellation().signal : undefined,
        });
    },
    /** Update Salon Employee in the database
    */
    updateSalonEmployee: async (fields, cancel = false) => {
        console.log("Salon emolyee api=>", fields)
        return await api.request({
            url: `/update-salon-employee`,
            headers: {
                "x-access-token": getLocalStorage("auth").token
            },
            method: "PATCH",
            data: fields,
            signal: cancel ? cancelApiObject[this.updateSalonEmployee.name].handleRequestCancellation().signal : undefined,
        });
    },
    /** Get salon employees by salon id
     */
    getBySalonId: async (salonId, cancel = false) => {
        return await api.request({
            url: `/get-by-id/${salonId}`,
            headers: {
                "x-access-token": getLocalStorage("auth").token
            },
            method: "GET",
            signal: cancel ? cancelApiObject[this.getBySalonId.name].handleRequestCancellation().signal : undefined,
        });
    },
};

// defining the cancel API object for SalonEmployeeAPI
const cancelApiObject = defineCancelApiObject(SalonEmployeeAPI);
