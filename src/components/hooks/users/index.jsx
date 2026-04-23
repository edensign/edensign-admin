/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import { Utility } from "../../utility";

export const useUser = () => {
    const { getLocalStorage } = Utility();
    const selected = getLocalStorage("menu")?.selected;

    /** Get query parameter according to user selection
     */
    const getQueryParam = () => {
        let query = '';
        switch (selected) {
            case "Employee":
                query = `admin`;
                break;
            case "Salon":
                query = "salon";
                break;
            case "Freelancer":
                query = "freelancer";
                break;
            case "Sales Executive":
                query = "sales_executive";
                break;
            default:
                query;
                break;
        };
        return query;
    };

    return {
        getQueryParam
    };
};
