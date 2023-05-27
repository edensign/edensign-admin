/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import { api } from "./config/axiosConfig";
import { defineCancelApiObject } from "./config/axiosUtils";

export const CommonAPI = {
    /** */
    getByPk: async (id, table, cancel = false) => {
        const { data: response } = await api.request({
            url: `/get-by-pk/${table}/${id}`,
            method: "GET",
            signal: cancel ? cancelApiObject[this.getAll.name].handleRequestCancellation().signal : undefined,
        });
        return response;
    }
};

// defining the cancel API object for CommonAPI
const cancelApiObject = defineCancelApiObject(CommonAPI);