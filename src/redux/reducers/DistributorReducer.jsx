/**
 * Copyright © 2026, Eden Sign Inc. ALL RIGHTS RESERVED.
 */

import { ActionTypes } from "../constants/action-types";

const initialState = {
    listData: [],
    loading: true
};

export const setDistributorReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.SET_DISTRIBUTORS:
            return {
                ...state,
                listData: action.payload.listData,
                loading: action.payload.loading
            };
        default:
            return state;
    }
};
