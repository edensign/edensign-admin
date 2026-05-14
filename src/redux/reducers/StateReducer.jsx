/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
*/

import { ActionTypes } from "../constants/action-types";

const initialState = {
    listData: [],
    loading: true
};

export const setStateReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.SET_STATES:
            return {
                ...state,
                listData: action.payload.listData,
                loading: action.payload.loading
            };
        default:
            return state;
    };
};
