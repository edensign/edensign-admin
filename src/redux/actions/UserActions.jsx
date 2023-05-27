import { ActionTypes } from "../constants/action-types";

export const getUsers = (users) => {
    return {
        type: ActionTypes.GET_USERS,
        payload: users
    };
};

export const registerUser = (user) => {
    return {
        type: ActionTypes.REGISTER_USER,
        payload: user
    };
};

export const selectedUser = (user) => {
    return {
        type: ActionTypes.SELECTED_USER,
        payload: user
    };
};
