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

export const AddressAPI = {
  /** */
  createAddress: async (address, cancel = false) => {
    return await api.request({
      url: `/create-address`,
      headers: {
        "x-access-token": getLocalStorage("auth").token
      },
      method: "POST",
      data: address,
      signal: cancel ? cancelApiObject[this.create.name].handleRequestCancellation().signal : undefined,
    });
  },
  getAddress: async (parent, parent_id, cancel = false) => {
    const { data: response } = await api.request({
      url: `/get-address/${parent}/${parent_id}`,
      method: "GET",
      headers: {
        "x-access-token": getLocalStorage("auth").token
      },
      signal: cancel ? cancelApiObject[this.getAll.name].handleRequestCancellation().signal : undefined,
    });
    return response;
  },
    /** */
    updateAddress: async (fields, cancel = false) => {
      return await api.request({
        url: `/update-address`,
        headers: {
          "x-access-token": getLocalStorage("auth").token
        },
        method: "PATCH",
        data: fields,
        signal: cancel ? cancelApiObject[this.create.name].handleRequestCancellation().signal : undefined,
      });
    }
}

// defining the cancel API object for AddressAPI
const cancelApiObject = defineCancelApiObject(AddressAPI);