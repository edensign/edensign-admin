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

export const CityAPI = {
    /** Get cities from the database
     */
    getCities: async (parent_id, cancel = false) => {
        const { data: response } = await api.request({
            url: `/get-cities/${parent_id}`,
            method: "GET",
            headers: {
                "x-access-token": getLocalStorage("auth").token
            },
            signal: cancel ? cancelApiObject[this.getCities.name].handleRequestCancellation().signal : undefined,
        });
        return response;
    },
}

// defining the cancel API object for CityAPI
const cancelApiObject = defineCancelApiObject(CityAPI);
