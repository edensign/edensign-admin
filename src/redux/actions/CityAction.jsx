/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
*/

import { ActionTypes } from "../constants/action-types";

export const setCities = (cities) => {
    return {
        type: ActionTypes.SET_CITIES,
        payload: cities
    };
};
