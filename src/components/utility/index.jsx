/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import { useSelector } from "react-redux";

export const Utility = () => {
    const authInfo = useSelector(state => state.auth);

    /** Get initials of logged in user
     */
    const getInitials = () => {
        let fullName = authInfo.auth.username.split(" ");
        let firstNameInitial = fullName[0][0].toUpperCase();
        let lastNameInitial = '';
        if (fullName[1] !== undefined) {
            lastNameInitial = fullName[1][0].toUpperCase();
        };
        return `${firstNameInitial} ${lastNameInitial}`;
    };

    return {
        getInitials
    };
};
