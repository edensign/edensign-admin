import { ActionTypes } from "../constants/action-types";

const initialState = {
    users: [],
};

export const getUserReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.GET_USERS:
            return {
                ...state, users: action.payload
            };
        default:
            return state;
    };
};

export const registerUserReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.REGISTER_USER:
            return {
                ...state, users: action.payload
            };
        default:
            return state;
    };
};
