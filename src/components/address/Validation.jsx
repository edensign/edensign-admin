/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
*/

import * as yup from "yup";

const checkoutSchema = yup.object({
    parent: yup.string(),
    // .min(2, 'Username is Too Short!')
    // .max(50, 'Username is Too Long!')
    // .required("This Field is Required"),
    parent_id: yup.number(),
    // .required("This Field is Required"),
    street: yup.string()
        .required("This Field is Required"),
    city: yup.number(),
    // .matches(phoneRegExp, "Phone Number Is Not Valid")
    // .required("This Field is Required"),
    state: yup.number(),
    country: yup.number(),
    //   address2: yup.string().required("required"),
});

export default checkoutSchema;
