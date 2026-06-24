/**
 * Copyright © 2026, Eden Sign Inc. ALL RIGHTS RESERVED.
 */

import { ActionTypes } from "../constants/action-types";

export const setDistributors = (distributors) => {
    return {
        type: ActionTypes.SET_DISTRIBUTORS,
        payload: distributors
    };
};
