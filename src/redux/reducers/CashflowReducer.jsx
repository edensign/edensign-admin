/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

const initialState = {
    listData: [],
    summaryData: {
        income: 0,
        expense: 0,
        balance: 0
    },
    loading: true
};

export const setCashflowReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_CASHFLOW_LIST":
            return {
                ...state,
                listData: action.payload.listData,
                loading: action.payload.loading
            };
        case "SET_CASHFLOW_SUMMARY":
            return {
                ...state,
                summaryData: action.payload
            };
        default:
            return state;
    };
};
