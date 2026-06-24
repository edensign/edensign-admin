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
import { setInventoryReducer } from "./InventoryReducer";
import { setJobSeekerReducer } from "./JobSeekerReducer";
import { setProductReducer } from "./ProductReducer";
import { setSalonReducer } from "./SalonReducer";
import { setSalonInventoryReducer } from "./SalonInventoryReducer";
import { setCashflowReducer } from "./CashflowReducer";
import { setServiceReducer } from "./ServiceReducer";
import { setSkillReducer } from "./SkillReducer";
import { setStateReducer } from "./StateReducer";
import { setCityReducer } from "./CityReducer";
import { setUserReducer } from "./UserReducers";
import { setCompanyReducer } from "./CompanyReducer";
import { setDistributorReducer } from "./DistributorReducer";

const reducers = combineReducers({
    auth: authReducer,
    agreementSigned: setAgreementReducer,
    allAmenities: setAmenityReducer,
    allInventory: setInventoryReducer,
    allJobSeekers: setJobSeekerReducer,
    allProducts: setProductReducer,
    allSalons: setSalonReducer,
    allSalonInventory: setSalonInventoryReducer,
    allCashflow: setCashflowReducer,
    allServices: setServiceReducer,
    allSkills: setSkillReducer,
    allStates: setStateReducer,
    allCities: setCityReducer,
    allUsers: setUserReducer,
    allCompanies: setCompanyReducer,
    allDistributors: setDistributorReducer,
    menuItems: menuItemReducer,
    toastInfo: displayToastReducer,
});

export default reducers;
