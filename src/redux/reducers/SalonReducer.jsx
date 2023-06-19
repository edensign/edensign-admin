/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
*/

import { ActionTypes } from "../constants/action-types";

const initialState = {
    listData: [],
    loading: false
};

export const setSalonReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.SET_SALONS:
            return {
                ...state,
                listData: action.payload.listData
            };
        default:
            return state;
    };
};
