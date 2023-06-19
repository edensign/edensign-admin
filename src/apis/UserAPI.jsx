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

export const UserAPI = {
  /** */
  login: async (loginInfo, cancel = false) => {
    return await api.request({
      url: `/login`,
      method: "POST",
      data: loginInfo,
      signal: cancel ? cancelApiObject[this.create.name].handleRequestCancellation().signal : undefined,
    });
  },
  /** */
  profile: async (cancel = false) => {
    return await api.request({
      url: `/profile`,
      headers: {
        "x-access-token": getLocalStorage("auth").token
      },
      method: "GET",
      data: token,
      signal: cancel ? cancelApiObject[this.create.name].handleRequestCancellation().signal : undefined,
    });
  },
  /** */
  getAll: async (conditionObj = false, page = 0, size = 5, search = false, authInfo, cancel = false) => {
    const queryParam = conditionObj ? `&${conditionObj.key}=${conditionObj.value}` : '';
    const searchParam = search ? `&search=${search}` : '';
    const { data: response } = await api.request({
      url: `/get-users?page=${page}&size=${size}${queryParam}${searchParam}`,
      headers: {
        "x-access-token": getLocalStorage("auth")?.token
      },
      method: "GET",
      signal: cancel ? cancelApiObject[this.getAll.name].handleRequestCancellation().signal : undefined,
    });
    return response;
  },
  /** */
  register: async (user, cancel = false) => {
    return await api.request({
      url: `/register`,
      headers: {
        "x-access-token": getLocalStorage("auth").token
      },
      method: "POST",
      data: user,
      signal: cancel ? cancelApiObject[this.create.name].handleRequestCancellation().signal : undefined,
    });
  },
  /** */
  update: async (fields, cancel = false) => {
    return await api.request({
      url: `/update-user`,
      headers: {
        "x-access-token": getLocalStorage("auth").token
      },
      method: "PATCH",
      data: fields,
      signal: cancel ? cancelApiObject[this.create.name].handleRequestCancellation().signal : undefined,
    });
  }
};

// defining the cancel API object for UserAPI
const cancelApiObject = defineCancelApiObject(UserAPI);
