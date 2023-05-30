import { ActionTypes } from "../constants/action-types";

const initialState = {
    auth: {}
}

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.AUTH_TOKEN:
            return {
                ...state, auth: action.payload
            };
        default:
            return state;
    };
};
