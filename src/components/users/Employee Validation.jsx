import * as yup from "yup";

const phoneRegExp = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
    username: yup.string().required("required"),
    password: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    contact_no: yup
        .string()
        .matches(phoneRegExp, "Phone number is not valid")
        .required("required"),
    type: yup.string().required("required"),
    //   address2: yup.string().required("required"),
});

export default checkoutSchema;
