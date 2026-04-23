import { api } from "./config/axiosConfig";
import { defineCancelApiObject } from "./config/axiosUtils";
import { Utility } from "../components/utility";

const { getLocalStorage } = Utility();

export const ProductAdAPI = {
    getAll: async (conditionObj = false, page = 0, size = 10, search = false, authInfo, cancel = false) => {
        const queryParam = conditionObj ? `&${conditionObj.key}=${conditionObj.value}` : '';
        const searchParam = search ? `&search=${search}` : '';
        const { data: response } = await api.request({
            url: `/product-ads?page=${page}&size=${size}${queryParam}${searchParam}`,
            method: "GET",
            headers: {
                "x-access-token": getLocalStorage("auth")?.token,
            },
            signal: cancel ? cancelApiObject[this.getAll.name].handleRequestCancellation().signal : undefined,
        });
        return response;
    },
    create: async (payload, cancel = false) => {
        const { data: response } = await api.request({
            url: `/product-ads/create`,
            method: "POST",
            headers: {
                "x-access-token": getLocalStorage("auth")?.token,
            },
            data: payload,
            signal: cancel ? cancelApiObject[this.create.name].handleRequestCancellation().signal : undefined,
        });
        return response;
    },
    update: async (payload, cancel = false) => {
        const { data: response } = await api.request({
            url: `/product-ads/update`,
            method: "PATCH",
            headers: {
                "x-access-token": getLocalStorage("auth")?.token,
            },
            data: payload,
            signal: cancel ? cancelApiObject[this.update.name].handleRequestCancellation().signal : undefined,
        });
        return response;
    },
    delete: async (payload, cancel = false) => {
        const { data: response } = await api.request({
            url: `/product-ads/delete`,
            method: "DELETE",
            headers: {
                "x-access-token": getLocalStorage("auth")?.token,
            },
            data: payload,
            signal: cancel ? cancelApiObject[this.delete.name].handleRequestCancellation().signal : undefined,
        });
        return response;
    }
};

const cancelApiObject = defineCancelApiObject(ProductAdAPI);
