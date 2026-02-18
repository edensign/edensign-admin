/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use, reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

const initialState = {
    listData: [],
    loading: true
};

export const setSalonInventoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_SALON_INVENTORY":
            return {
                ...state,
                listData: action.payload.listData,
                loading: action.payload.loading
            };
        default:
            return state;
    };
};
