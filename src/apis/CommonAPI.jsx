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

export const CommonAPI = {
    /** method like GET/POST for network request, true if header and cancel signal is false
     */
    commonConfig: (method, header, cancel = false) => {
        const { getLocalStorage } = Utility();
        const commonConfig = {
            method: method,
            signal: cancel ? cancelApiObject[this.commonConfig.name].handleRequestCancellation().signal : undefined,
        }
        if (header) {
            commonConfig.headers = {
                "x-access-token": getLocalStorage("auth")?.token
            }
        }
        return commonConfig;
    },
    /** Verify the authenticity of the provided token
     */
    verifyToken: async (cancel = false) => {
        const { getLocalStorage } = Utility();
        if (!getLocalStorage("auth")?.token) {
            return false;
        }
        const commonConfig = CommonAPI.commonConfig("GET", true, cancel);
        const { data: response } = await api.request({
            url: `/verify-token`,
            ...commonConfig
        });
        return response;
    },
    /** Get the user from the specific table -- why it is required as it is made in backend
    */
    getByPk: async (id, table, cancel = false) => {
        const commonConfig = CommonAPI.commonConfig("GET", false, cancel);
        const { data: response } = await api.request({
            url: `/get-by-pk/${table}/${id}`,
            ...commonConfig
        });
        return response;
    },
    /** Get true/false for salon user agreement
    */
    getAgreement: async (cancel = false) => {
        const commonConfig = CommonAPI.commonConfig("GET", true, cancel);
        return await api.request({
            url: `/get-agreement`,
            ...commonConfig
        });
    },
    /** provide paths for multiple API calls & this function will make the request object 
     */
    multipleAPICall: async (method, paths, dataFields = [], cancel = false) => {
        const commonConfig = CommonAPI.commonConfig(method, true, cancel);
        const promises = dataFields.length ? paths.map((path, index) =>
            api.request({
                url: path,
                data: dataFields[index],
                ...commonConfig
            })) :
            paths.map((path) => api.request({
                url: path,
                ...commonConfig
            }));

        return Promise.all(promises)
            .then(responses => {
                console.log('RESPONSES=>', responses);
                return responses;
            })
            .catch(err => {
                throw err;
            });
    }
};

// defining the cancel API object for CommonAPI
const cancelApiObject = defineCancelApiObject(CommonAPI);
