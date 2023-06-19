/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import { useSelector } from "react-redux";

export const useUser = () => {
    const { selected } = useSelector(state => state.menuItems);

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
