/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
*/

import { ActionTypes } from "../constants/action-types";

export const setUsers = (users) => {
    return {
        type: ActionTypes.SET_USERS,
        payload: users
    };
};

export const registerUser = (user) => {
    return {
        type: ActionTypes.REGISTER_USER,
        payload: user
    };
};

export const setAuthInfo = (payload) => {
    return {
        type: ActionTypes.AUTH_INFO,
        payload: payload
    };
};

export const setAgreementSigned = (payload) => {
    return {
        type: ActionTypes.AGREEMENT_SIGNED,
        payload: payload
    };
};
