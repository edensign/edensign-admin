/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
*/

import { ActionTypes } from "../constants/action-types";

export const setStates = (states) => {
    return {
        type: ActionTypes.SET_STATES,
        payload: states
    };
};
