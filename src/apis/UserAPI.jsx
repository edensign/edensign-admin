import { api } from "./config/axiosConfig";
import { defineCancelApiObject } from "./config/axiosUtils";

export const UserAPI = {

  getAll: async function (cancel = false) {
    const response = await api.request({
      url: "/get-users",
      method: "GET",
      signal: cancel ? cancelApiObject[this.getAll.name].handleRequestCancellation().signal : undefined,
    });
    return response.data.data;
  },

  register: async function (user, cancel = false) {
    await api.request({
      url: `/register`,
      method: "POST",
      data: user,
      signal: cancel ? cancelApiObject[this.create.name].handleRequestCancellation().signal : undefined,
    });
  },
};

// defining the cancel API object for ProductAPI
const cancelApiObject = defineCancelApiObject(UserAPI);
