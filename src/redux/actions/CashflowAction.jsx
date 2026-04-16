/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

export const setCashflowList = (listData) => {
    return {
        type: "SET_CASHFLOW_LIST",
        payload: listData
    };
};

export const setCashflowSummary = (summaryData) => {
    return {
        type: "SET_CASHFLOW_SUMMARY",
        payload: summaryData
    };
};
