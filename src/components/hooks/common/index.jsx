/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Utility } from "../../utility";

export const useCommon = () => {
    const dispatch = useDispatch();
    const selected = useSelector(state => state.menuItems.selected);
    const { getLocalStorage } = Utility();

    /** Get data for pagination according to given parameters to be used in API call
     */
    const getPaginatedData = useCallback((page = 0, size, action, api, condition = false, search = false) => {
        const authInfo = getLocalStorage("auth");
        api.getAll(condition, page, size, search, authInfo)
            .then(res => {
                if (res.status === 'Success') {
                    dispatch(action({ listData: res.data, loading: false }));
                } else if (res.status === 'Error') {
                    dispatch(action({ listData: [], loading: false }));
                }
            })
            .catch(err => {
                dispatch(action({ listData: [], loading: false }));
                throw err;
            });
    }, [selected]);

    return {
        getPaginatedData
    };
};
