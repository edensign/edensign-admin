/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
*/

import { combineReducers } from "redux";

import { authReducer } from "./AuthReducer";
import { menuItemReducer } from "./MenuItemReducer";
import { displayToastReducer } from "./ToastReducer";
import { setUserReducer } from "./UserReducers";
import { setSalonReducer } from "./SalonReducer";

const reducers = combineReducers({
    auth: authReducer,
    allUsers: setUserReducer,
    allSalons: setSalonReducer,
    toastInfo: displayToastReducer,
    menuItems: menuItemReducer,
});

export default reducers;
