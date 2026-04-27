/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * Offer Card Form — Create / Update
 */

import {
    Box, Button, TextField, useMediaQuery, MenuItem, Typography, useTheme,
    Checkbox, FormControlLabel, FormGroup, Divider, Switch, FormControl, FormLabel
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import API from "../../apis";
import { setMenuItem } from "../../redux/actions/NavigationAction";
import { tokens } from "../../theme";
import { Utility } from "../utility";
import Toast from "../common/Toast";
import AddIcon from '@mui/icons-material/Add';

const SERVICES_LIST = [
    "Threading",
    "Haircut",
    "Wax Services",
    "Hair Spa",
    "Manicure / Pedicure",
    "Facial",
    "Bleach",
    "Hair Color",
    "Keratin Treatment",
    "Blow Dry",
];

const checkoutSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    validity_type: yup.string().required("Required"),
    price: yup.number().nullable().typeError("Must be a number"),
    discount_percentage: yup.number().nullable().max(100, "Max 100%").typeError("Must be a number"),
    discount_amount: yup.number().nullable().typeError("Must be a number"),
    duration_days: yup.number().nullable().when("validity_type", {
        is: "duration",
        then: (s) => s.required("Duration (days) is required").positive(),
    }),
    expiry_date: yup.string().nullable().when("validity_type", {
        is: "date",
        then: (s) => s.required("Expiry date is required"),
    }),
});

const initialValues = {
    title: "",
    services: [],
    discount_amount: "",
    discount_percentage: "",
    price: "",
    validity_type: "duration",
    start_date: "",
    expiry_date: "",
    duration_days: "",
    terms: "",
    is_active: true,
    salon_id: "",
};

const FormComponent = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { id } = useParams();
    const navigateTo = useNavigate();
    const dispatch = useDispatch();
    const [initialFormValues, setInitialFormValues] = useState(initialValues);
    const [selectedServices, setSelectedServices] = useState([]);
    const [customService, setCustomService] = useState("");
    const [salons, setSalons] = useState([]);
    const [toastInfo, setToastInfo] = useState({ toastAlert: false, severity: "", message: "" });
    const selected = useSelector(state => state.menuItems.selected);
    const { getLocalStorage } = Utility();
    const role = getLocalStorage("auth")?.type;

    useEffect(() => {
        const selectedMenu = getLocalStorage("menu");
        dispatch(setMenuItem(selectedMenu.selected));
        if (id) fetchOffer();
        if (role === 'admin') fetchSalons();
    }, [id]);

    const fetchSalons = async () => {
        try {
            const response = await API.SalonAPI.getAll(false, 0, 100); 
            if (response.status === "Success") {
                setSalons(response.data.rows || []);
            }
        } catch (error) {
            console.error("Error fetching salons:", error);
        }
    };

    const fetchOffer = async () => {
        try {
            const response = await API.CommonAPI.getByPk(id, "digital_offers");
            if (response.status === "Success") {
                const data = response.data;
                setInitialFormValues({
                    ...initialValues,
                    ...data,
                    price: data.price ?? "",
                    discount_amount: data.discount_amount ?? "",
                    discount_percentage: data.discount_percentage ?? "",
                    duration_days: data.duration_days ?? "",
                    start_date: data.start_date ? data.start_date.split("T")[0] : "",
                    expiry_date: data.expiry_date ? data.expiry_date.split("T")[0] : "",
                    salon_id: data.salon_id ?? "",
                });
                setSelectedServices(data.services || []);
            }
        } catch (error) {
            console.error("Error fetching offer:", error);
        }
    };

    const handleServiceToggle = (service) => {
        setSelectedServices((prev) =>
            prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
        );
    };

    const handleAddCustomService = () => {
        if (customService.trim() && !selectedServices.includes(customService.trim())) {
            setSelectedServices([...selectedServices, customService.trim()]);
            setCustomService("");
        }
    };

    const handleFormSubmit = async (values) => {
        try {
            const payload = {
                ...values,
                services: selectedServices,
                price: values.price || null,
                discount_amount: values.discount_amount || null,
                discount_percentage: values.discount_percentage || null,
                duration_days: values.duration_days || null,
                start_date: values.start_date || null,
                expiry_date: values.expiry_date || null,
            };

            const role = getLocalStorage("auth")?.type;
            if (role === 'salon' && !payload.salon_id) {
                const salonId = getLocalStorage("salon")?.id;
                if (salonId) payload.salon_id = salonId;
            }
            
            // Convert empty string to null for DB
            if (payload.salon_id === "") payload.salon_id = null;

            let response;
            if (id) {
                response = await API.DigitalOfferAPI.update({ ...payload, id: parseInt(id) });
            } else {
                response = await API.DigitalOfferAPI.create(payload);
            }

            if (response.status === "Success") {
                setToastInfo({
                    toastAlert: true,
                    severity: "success",
                    message: id ? "Updated Successfully" : "Created Successfully"
                });
                setTimeout(() => navigateTo("/offer-cards/listing"), 1500);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setToastInfo({
                toastAlert: true,
                severity: "error",
                message: "Error saving offer card"
            });
        }
    };

    return (
        <Box m="20px">
            <Box
                height="10vh"
                borderRadius="4px"
                padding="2vh"
                backgroundColor={colors.blueAccent[700]}
                mb="20px"
            >
                <Typography component="h2" variant="h2" color={colors.grey[100]} fontWeight="bold">
                    {id ? "Update" : "Create"} {selected}
                </Typography>
            </Box>

            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialFormValues}
                validationSchema={checkoutSchema}
                enableReinitialize={true}
            >
                {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>
                        <Box display="grid" gap="24px" gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 4" } }}
                        >
                            {/* Salon Selection (Admin Only) */}
                            {role === 'admin' && (
                                <TextField
                                    fullWidth variant="filled" select label="Select Salon *"
                                    onBlur={handleBlur} onChange={handleChange}
                                    value={values.salon_id} name="salon_id"
                                    error={!!touched.salon_id && !!errors.salon_id}
                                    helperText={touched.salon_id && errors.salon_id}
                                    sx={{ gridColumn: "span 4" }}
                                >
                                    <MenuItem value=""><em>System Wide (No Salon)</em></MenuItem>
                                    {salons.map((salon) => (
                                        <MenuItem key={salon.id} value={salon.id}>
                                            {salon.name} ({salon.salon_code})
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}

                            {/* Title */}
                            <TextField
                                fullWidth variant="filled" type="text" label="Card Title *"
                                onBlur={handleBlur} onChange={handleChange}
                                value={values.title} name="title"
                                error={!!touched.title && !!errors.title}
                                helperText={touched.title && errors.title}
                                sx={{ gridColumn: "span 4" }}
                            />

                            {/* Services Checkboxes */}
                            <Box sx={{ gridColumn: "span 4" }}>
                                <FormControl component="fieldset" fullWidth>
                                    <FormLabel component="legend" sx={{ mb: 1, fontWeight: "bold", fontSize: "0.95rem" }}>
                                        Select Services Included
                                    </FormLabel>
                                    <FormGroup row>
                                        {SERVICES_LIST.map((service) => (
                                            <FormControlLabel
                                                key={service}
                                                control={
                                                    <Checkbox
                                                        checked={selectedServices.includes(service)}
                                                        onChange={() => handleServiceToggle(service)}
                                                        color="secondary"
                                                    />
                                                }
                                                label={service}
                                                sx={{ minWidth: "200px" }}
                                            />
                                        ))}
                                        {/* Show custom services that are not in the predefined list */}
                                        {selectedServices.filter(s => !SERVICES_LIST.includes(s)).map((service) => (
                                            <FormControlLabel
                                                key={service}
                                                control={
                                                    <Checkbox
                                                        checked={true}
                                                        onChange={() => handleServiceToggle(service)}
                                                        color="secondary"
                                                    />
                                                }
                                                label={service}
                                                sx={{ minWidth: "200px" }}
                                            />
                                        ))}
                                    </FormGroup>
                                    <Box display="flex" alignItems="center" gap={1} mt={2} maxWidth="400px">
                                        <TextField
                                            size="small"
                                            label="Add Custom Service"
                                            value={customService}
                                            onChange={(e) => setCustomService(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomService())}
                                        />
                                        <Button 
                                            variant="outlined" 
                                            color="secondary" 
                                            onClick={handleAddCustomService}
                                            startIcon={<AddIcon />}
                                        >
                                            Add
                                        </Button>
                                    </Box>
                                </FormControl>
                            </Box>

                            <Divider sx={{ gridColumn: "span 4", borderColor: colors.grey[500] }} />

                            {/* Pricing & Discounts */}
                            <TextField
                                fullWidth variant="filled" type="number" label="Price (Rs.)"
                                onBlur={handleBlur} onChange={handleChange}
                                value={values.price} name="price"
                                error={!!touched.price && !!errors.price}
                                helperText={touched.price && errors.price}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth variant="filled" type="number" label="Discount % (e.g. 30)"
                                onBlur={handleBlur} onChange={handleChange}
                                value={values.discount_percentage} name="discount_percentage"
                                error={!!touched.discount_percentage && !!errors.discount_percentage}
                                helperText={touched.discount_percentage && errors.discount_percentage}
                                sx={{ gridColumn: "span 1" }}
                            />
                            <TextField
                                fullWidth variant="filled" type="number" label="Flat Discount (Rs.)"
                                onBlur={handleBlur} onChange={handleChange}
                                value={values.discount_amount} name="discount_amount"
                                error={!!touched.discount_amount && !!errors.discount_amount}
                                helperText={touched.discount_amount && errors.discount_amount}
                                sx={{ gridColumn: "span 1" }}
                            />

                            <Divider sx={{ gridColumn: "span 4", borderColor: colors.grey[500] }} />

                            {/* Validity */}
                            <TextField
                                fullWidth variant="filled" select label="Validity Type *"
                                onBlur={handleBlur} onChange={handleChange}
                                value={values.validity_type} name="validity_type"
                                sx={{ gridColumn: "span 2" }}
                            >
                                <MenuItem value="duration">Duration (Days)</MenuItem>
                                <MenuItem value="date">Fixed Expiry Date</MenuItem>
                            </TextField>

                            {values.validity_type === "duration" ? (
                                <TextField
                                    fullWidth variant="filled" type="number" label="Duration (Days) *"
                                    onBlur={handleBlur} onChange={handleChange}
                                    value={values.duration_days} name="duration_days"
                                    error={!!touched.duration_days && !!errors.duration_days}
                                    helperText={touched.duration_days && errors.duration_days}
                                    sx={{ gridColumn: "span 2" }}
                                />
                            ) : (
                                <>
                                    <TextField
                                        fullWidth variant="filled" type="date" label="Start Date"
                                        InputLabelProps={{ shrink: true }}
                                        onBlur={handleBlur} onChange={handleChange}
                                        value={values.start_date} name="start_date"
                                        sx={{ gridColumn: "span 1" }}
                                    />
                                    <TextField
                                        fullWidth variant="filled" type="date" label="Expiry Date *"
                                        InputLabelProps={{ shrink: true }}
                                        onBlur={handleBlur} onChange={handleChange}
                                        value={values.expiry_date} name="expiry_date"
                                        error={!!touched.expiry_date && !!errors.expiry_date}
                                        helperText={touched.expiry_date && errors.expiry_date}
                                        sx={{ gridColumn: "span 1" }}
                                    />
                                </>
                            )}

                            {/* Terms */}
                            <TextField
                                fullWidth variant="filled" type="text" label="Terms & Conditions"
                                multiline rows={3}
                                onBlur={handleBlur} onChange={handleChange}
                                value={values.terms} name="terms"
                                sx={{ gridColumn: "span 4" }}
                            />

                            {/* Active Toggle */}
                            <Box sx={{ gridColumn: "span 4", display: "flex", alignItems: "center", gap: 2 }}>
                                <Switch
                                    checked={values.is_active}
                                    onChange={(e) => setFieldValue("is_active", e.target.checked)}
                                    color="success"
                                />
                                <Typography>
                                    {values.is_active ? "Active (visible to customers)" : "Inactive (hidden)"}
                                </Typography>
                            </Box>
                        </Box>

                        <Box display="flex" justifyContent="space-between" mt="30px">
                            <Button variant="outlined" color="inherit" onClick={() => navigateTo("/offer-cards/listing")}>
                                Cancel
                            </Button>
                            <Button type="submit" color="secondary" variant="contained" size="large">
                                {id ? "Update" : "Create"} Offer Card
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
            <Toast 
                alerting={toastInfo.toastAlert} 
                severity={toastInfo.severity} 
                message={toastInfo.message} 
            />
        </Box>
    );
};

export default FormComponent;
