/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 */

import { api } from "./config/axiosConfig";
import { defineCancelApiObject } from "./config/axiosUtils";
import { Utility } from "../components/utility";

const { getLocalStorage } = Utility();

export const DashboardAPI = {
  /** Get stats for the admin dashboard
   */
  getAdminStats: async (cancel = false) => {
    return await api.request({
      url: `/get-admin-stats`,
      method: "GET",
      headers: {
        "x-access-token": getLocalStorage("auth")?.token
      },
      signal: cancel ? cancelApiObject[this.getAdminStats.name].handleRequestCancellation().signal : undefined,
    });
  }
};

// defining the cancel API object for DashboardAPI
const cancelApiObject = defineCancelApiObject(DashboardAPI);
