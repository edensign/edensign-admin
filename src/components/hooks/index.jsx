/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setUsers } from "../../redux/actions/UserActions";
import { UserAPI } from "../../apis/UserAPI";
import { Utility } from "../utility";

export const useUser = () => {
    const selected = useSelector(state => state.menuItems.selected);
    const dispatch = useDispatch();
    const { getLocalStorage } = Utility();

    /** Get query according to user selection
     */
    const getQueryParam = () => {
        let query = '';
        switch (selected) {
            case "Employee":
                query = `admin`;
                break;
            case "Salon":
                query = "salon";
                break;
            case "Freelancer":
                query = "freelancer";
                break;
            default:
                query;
                break;
        };
        return query;
    };

    const getAllUsers = useCallback((page = 0, size, condition = false, search = false) => {
        const authInfo = getLocalStorage("auth");
        UserAPI.getAll(condition, page, size, search, authInfo)
            .then(res => {
                if (res.status === 'Success') {
                    dispatch(setUsers({ users: res.data, loading: false }));
                }
            })
            .catch(err => {
                dispatch(setUsers({ users: [], loading: false }));
                console.log(err);
            });
    }, [selected]);

    return {
        getQueryParam,
        getAllUsers
    };
};
