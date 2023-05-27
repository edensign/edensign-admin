/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import { api } from "./config/axiosConfig";
import { defineCancelApiObject } from "./config/axiosUtils";

export const UserAPI = {
  /** */
  getAll: async (conditionObj, cancel = false) => {
    const queryParam = conditionObj ? `?${conditionObj.key}=${conditionObj.value}` : null;
    const { data: response } = await api.request({
      url: `/get-users${queryParam}`,
      method: "GET",
      signal: cancel ? cancelApiObject[this.getAll.name].handleRequestCancellation().signal : undefined,
    });
    return response;
  },
  /** */
  register: async (user, cancel = false) => {
    await api.request({
      url: `/register`,
      method: "POST",
      data: user,
      signal: cancel ? cancelApiObject[this.create.name].handleRequestCancellation().signal : undefined,
    });
  },
  /** */
  update: async (fields, cancel = false) => {
    await api.request({
      url: `/update-user`,
      method: "PATCH",
      data: fields,
      signal: cancel ? cancelApiObject[this.create.name].handleRequestCancellation().signal : undefined,
    });
  },
};

// defining the cancel API object for UserAPI
const cancelApiObject = defineCancelApiObject(UserAPI);
