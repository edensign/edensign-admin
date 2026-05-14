/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
*/

import * as yup from "yup";

const phoneRegExp = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;
const emailRegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const checkoutSchema = yup.object().shape({
    name: yup.string()
        .min(2, 'Name is Too Short!')
        .max(50, 'Name is Too Long!')
        .required("This Field is Required"),
    email: yup.string()
        .matches(emailRegExp, "Email Address is Not Valid"),
    address: yup.string(),
    contact_no: yup.string()
        .matches(phoneRegExp, "Phone Number Is Not Valid")
        .required("This Field is Required"),
    // status: yup.string(),
    // opening_time: yup.date(),
    // closing_time: yup.date()
});

export default checkoutSchema;
