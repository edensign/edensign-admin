/**
 * Copyright © 2026, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * System Configuration API wrapper
 */

import { api } from "./config/axiosConfig";
import { defineCancelApiObject } from "./config/axiosUtils";
import { Utility } from "../components/utility";

const { getLocalStorage } = Utility();

export const SystemConfigAPI = {
    /**
     * Get global configuration for AI Page Agent
     */
    getPageAgentConfig: async () => {
        const { data: response } = await api.request({
            url: `/system-config/page-agent`,
            method: "GET",
        });
        return response;
    },

    /**
     * Save/update Page Agent configuration (requires admin authorization)
     */
    updatePageAgentConfig: async (configData) => {
        const { data: response } = await api.request({
            url: `/system-config/page-agent`,
            headers: {
                "x-access-token": getLocalStorage("auth")?.token
            },
            method: "POST",
            data: configData
        });
        return response;
    }
};

const cancelApiObject = defineCancelApiObject(SystemConfigAPI);
