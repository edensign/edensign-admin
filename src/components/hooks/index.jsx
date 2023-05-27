/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import { useSelector } from "react-redux";

export const useUtility = () => {
    const selected = useSelector(state => state.menuItems.selected);

    /** Get query according to user selection
     */
    const getQuery = () => {
        let query = '';
        switch (selected) {
            case "Employee":
                query = `admin, subadmin`;
                break;
            case "Salon":
                query = "salon";
                break;
            case "Freelancer":
                query = "freelancer";
                break;
            default:
                query;
                break;
        };
        return query;
    };

    return {
        getQuery
    };
};

