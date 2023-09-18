/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
*/

import { combineReducers } from "redux";

import { authReducer } from "./AuthReducer";
import { displayToastReducer } from "./ToastReducer";
import { menuItemReducer } from "./MenuItemReducer";
import { setAgreementReducer } from "./UserReducers";
import { setAmenityReducer } from "./AmenityReducer";
import { setJobSeekerReducer } from "./JobSeekerReducer";
import { setSalonReducer } from "./SalonReducer";
import { setServiceReducer } from "./ServiceReducer";
import { setUserReducer } from "./UserReducers";

const reducers = combineReducers({
    auth: authReducer,
    agreementSigned: setAgreementReducer,
    allAmenities: setAmenityReducer,
    allJobSeekers: setJobSeekerReducer,
    allSalons: setSalonReducer,
    allServices: setServiceReducer,
    allUsers: setUserReducer,
    menuItems: menuItemReducer,
    toastInfo: displayToastReducer,
});

export default reducers;
