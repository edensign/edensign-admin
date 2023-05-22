import { combineReducers } from "redux";
import { getUserReducer, registerUserReducer } from "./UserReducers";

const reducers = combineReducers({
    allUsers: getUserReducer,
    registeredUser: registerUserReducer
});

export default reducers;
