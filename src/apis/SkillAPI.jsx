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

export const SkillAPI = {
    /** Get all skills from the database that meets the specified query parameters
     */
    getAll: async (conditionObj = false, page = 0, size = 5, search = false, authInfo, cancel = false) => {
        const queryParam = conditionObj ? `&${conditionObj.key}=${conditionObj.value}` : '';
        const searchParam = search ? `&search=${search}` : '';
        const { data: response } = await api.request({
            url: `/get-skills?page=${page}&size=${size}${queryParam}${searchParam}`,
            method: "GET",
            headers: {
                "x-access-token": getLocalStorage("auth").token
            },
            signal: cancel ? cancelApiObject[this.getAll.name].handleRequestCancellation().signal : undefined,
        });
        return response;
    },
    /** Create a Skill and store in the database
     */
    createSkill: async (skill, cancel = false) => {
        console.log("skillapi=", skill)
        return await api.request({
            url: `/create-skill`,
            headers: {
                "x-access-token": getLocalStorage("auth").token
            },
            method: "POST",
            data: skill,
            signal: cancel ? cancelApiObject[this.createSkill.name].handleRequestCancellation().signal : undefined,
        });
    },
    /** Update the skill in the database 
     */
    updateSkill: async (fields, cancel = false) => {
        console.log('sillapi=', fields)
        return await api.request({
            url: `/update-skill`,
            headers: {
                "x-access-token": getLocalStorage("auth").token
            },
            method: "PATCH",
            data: fields,
            signal: cancel ? cancelApiObject[this.updateSkill.name].handleRequestCancellation().signal : undefined,
        });
    },
    /** Get skill information from the database
     */
    getSkillById: async (id, cancel = false) => {
        console.log("skillapi=", id)
        const { data: response } = await api.request({
            url: `/get-skill/${id}`,
            method: "GET",
            headers: {
                "x-access-token": getLocalStorage("auth").token
            },
            signal: cancel ? cancelApiObject[this.getSkillById.name].handleRequestCancellation().signal : undefined,
        });
        return response;
    },
};

// defining the cancel API object for SkillAPI
const cancelApiObject = defineCancelApiObject(SkillAPI);
