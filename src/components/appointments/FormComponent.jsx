import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import {
    Box,
    Button,
    MenuItem,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
    FormControl,
    InputLabel,
    Select,
    CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import API from "../../apis";
import { setMenuItem } from "../../redux/actions/NavigationAction";
import { tokens } from "../../theme";
import { Utility } from "../utility";

const FormComponent = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery("(max-width:480px)");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { getLocalStorage, getRole } = Utility();

    const role = getRole()?.toLowerCase();
    const salon = getLocalStorage("salon");
    const auth = getLocalStorage("auth");

    const [loading, setLoading] = useState(false);
    const [salons, setSalons] = useState([]);
    const [stylists, setStylists] = useState([]);           // salon employees for the salon
    const [allServices, setAllServices] = useState([]);      // all services from DB
    const [stylistServices, setStylistServices] = useState([]); // services the selected stylist offers
    const [bookedSlots, setBookedSlots] = useState([]);
    const [salonDetails, setSalonDetails] = useState(null);

    const [formData, setFormData] = useState({
        customer_name: "",
        customer_contact: "",
        salon_id: role === "salon" ? salon?.id : "",
        salon_employee: "",
        services: "",
        date: dayjs(),
        time_slot: "",
        booked_for: "self"
    });

    // Generate time slots dynamically from salon opening/closing time (1-hour intervals)
    const generateTimeSlots = () => {
        console.log("salonDetails for slots:", salonDetails);

        // Check if salon is closed on selected day
        if (salonDetails?.closed_on) {
            const currentDay = formData.date.format('dddd').toLowerCase();
            if (currentDay === salonDetails.closed_on) {
                return []; // Salon is closed
            }
        }

        let startHour = 10; // default 10 AM
        let endHour = 20;   // default 8 PM

        if (salonDetails?.opening_time && salonDetails?.closing_time) {
            // opening_time/closing_time are DATETIME stored as UTC in MySQL
            // Use getUTCHours() to extract the raw hour without timezone conversion
            const openDt = new Date(salonDetails.opening_time);
            const closeDt = new Date(salonDetails.closing_time);

            if (!isNaN(openDt.getTime()) && !isNaN(closeDt.getTime())) {
                startHour = openDt.getUTCHours();
                endHour = closeDt.getUTCHours();
                console.log("Salon hours (UTC):", startHour, "-", endHour);
            }
        }

        const slots = [];
        for (let hour = startHour; hour <= endHour; hour++) {
            const h = hour % 12 === 0 ? 12 : hour % 12;
            const modifier = hour < 12 ? "AM" : "PM";
            const label = `${String(h).padStart(2, '0')}:00 ${modifier}`;
            slots.push(label);
        }
        return slots;
    };

    const filteredSlots = generateTimeSlots();

    // On mount: fetch all services, fetch salons (admin) or fetch stylists directly (salon)
    useEffect(() => {
        dispatch(setMenuItem("Appointments"));
        fetchAllServices();
        if (role === "admin") {
            fetchSalons();
        } else if (role === "salon") {
            // Salon user: fetch employees directly using salon_id from localStorage
            const salonId = salon?.id;
            if (salonId) {
                fetchStylists(salonId);
                // Also fetch salon details for time filtering
                fetchCurrentSalon(auth?.id);
            }
        }
    }, []);

    // When stylist is selected, filter services based on stylist's service IDs
    useEffect(() => {
        if (formData.salon_employee && stylists.length > 0 && allServices.length > 0) {
            const selectedStylist = stylists.find(s => s.id === formData.salon_employee);
            if (selectedStylist && selectedStylist.services) {
                // services field is comma-separated IDs like "2,1" or "10,11"
                const serviceIds = selectedStylist.services.split(',').map(id => id.trim());
                const matched = allServices.filter(svc => serviceIds.includes(String(svc.id)));
                setStylistServices(matched);
            } else {
                setStylistServices([]);
            }
        } else {
            setStylistServices([]);
        }
    }, [formData.salon_employee, stylists, allServices]);

    // Fetch booked slots when stylist + date are selected
    useEffect(() => {
        if (formData.salon_employee && formData.date) {
            fetchBookedSlots();
        }
    }, [formData.salon_employee, formData.date]);

    const fetchCurrentSalon = async (userId) => {
        try {
            const response = await API.SalonAPI.getSalonByUserId({ id: userId });
            if (response.data?.status === "Success") {
                setSalonDetails(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching salon details:", error);
        }
    };

    const fetchSalons = async () => {
        try {
            const response = await API.SalonAPI.getAll();
            if (response.status === "Success") {
                setSalons(response.data.rows || []);
            }
        } catch (error) {
            console.error("Error fetching salons:", error);
        }
    };

    const fetchStylists = async (salonId) => {
        try {
            const response = await API.SalonEmployeeAPI.getBySalonId(salonId);
            console.log("Stylists response:", response);
            if (response.data?.status === "Success") {
                setStylists(response.data.data || []);
            }
        } catch (error) {
            console.error("Error fetching stylists:", error);
        }
    };

    const fetchAllServices = async () => {
        try {
            const response = await API.ServiceAPI.getAll();
            if (response.status === "Success") {
                setAllServices(response.data.rows || []);
            }
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };

    const fetchBookedSlots = async () => {
        try {
            const response = await API.AppointmentAPI.getBookedSlots({
                employee_id: formData.salon_employee,
                date: formData.date.format("YYYY-MM-DD")
            });
            if (response.data?.status === "Success") {
                setBookedSlots(response.data.data || []);
            }
        } catch (error) {
            console.error("Error fetching booked slots:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === "salon_id") {
            // Admin selects a salon -> fetch that salon's employees
            fetchStylists(value);
            const selectedSalon = salons.find(s => s.id === value);
            setSalonDetails(selectedSalon || null);
            setFormData(prev => ({ ...prev, [name]: value, salon_employee: "", services: "", time_slot: "" }));
        }

        if (name === "salon_employee") {
            // Stylist changed -> reset service and time slot
            setFormData(prev => ({ ...prev, [name]: value, services: "", time_slot: "" }));
        }

        if (name === "services") {
            // Service changed -> reset time slot
            setFormData(prev => ({ ...prev, [name]: value, time_slot: "" }));
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            date: formData.date.format("YYYY-MM-DD"),
        };

        try {
            const response = await API.AppointmentAPI.createAppointment(payload);
            if (response.data?.status === "Success") {
                navigate("/appointment/listing");
            } else {
                alert(response.data?.msg || "Failed to create appointment");
            }
        } catch (error) {
            console.error("Error creating appointment:", error);
            alert("An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box m="20px">
            <Box
                height={isMobile ? "15vh" : "11vh"}
                borderRadius="4px"
                padding={isMobile ? "2vh" : "2vh"}
                backgroundColor={colors.blueAccent[700]}
                mb={2}
            >
                <Typography
                    variant="h2"
                    color={colors.grey[100]}
                    fontWeight="bold"
                >
                    Create Appointment
                </Typography>
            </Box>

            <Box
                display="flex"
                flexDirection="column"
                gap="20px"
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    backgroundColor: colors.primary[400],
                    p: 3,
                    borderRadius: "4px"
                }}
            >
                {/* Row 1: Customer Name + Contact */}
                <Box display="flex" gap="20px" flexDirection={isMobile ? "column" : "row"}>
                    <TextField
                        fullWidth
                        required
                        label="Customer Name"
                        name="customer_name"
                        value={formData.customer_name}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        required
                        label="Customer Contact"
                        name="customer_contact"
                        value={formData.customer_contact}
                        onChange={handleChange}
                    />
                </Box>

                {/* Row 2: Salon (admin only) + Stylist */}
                <Box display="flex" gap="20px" flexDirection={isMobile ? "column" : "row"}>
                    {role === "admin" && (
                        <FormControl fullWidth required>
                            <InputLabel>Salon</InputLabel>
                            <Select
                                name="salon_id"
                                value={formData.salon_id}
                                label="Salon"
                                onChange={handleChange}
                            >
                                {salons.map(s => (
                                    <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                    <FormControl fullWidth required>
                        <InputLabel>Stylist {stylists.length > 0 ? `(${stylists.length} Available)` : ""}</InputLabel>
                        <Select
                            name="salon_employee"
                            value={formData.salon_employee}
                            label="Stylist"
                            onChange={handleChange}
                            disabled={role === "admin" && !formData.salon_id}
                        >
                            {stylists.length > 0 ? (
                                stylists.map(s => (
                                    <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled value="">
                                    No stylists found
                                </MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </Box>

                {/* Row 3: Service (based on stylist's services) + Booked For */}
                <Box display="flex" gap="20px" flexDirection={isMobile ? "column" : "row"}>
                    <FormControl fullWidth required>
                        <InputLabel>Service</InputLabel>
                        <Select
                            name="services"
                            value={formData.services}
                            label="Service"
                            onChange={handleChange}
                            disabled={!formData.salon_employee}
                        >
                            {stylistServices.length > 0 ? (
                                stylistServices.map(s => (
                                    <MenuItem key={s.id} value={s.name}>{s.name}</MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled value="">
                                    {formData.salon_employee ? "No services found" : "Select a stylist first"}
                                </MenuItem>
                            )}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Booked For</InputLabel>
                        <Select
                            name="booked_for"
                            value={formData.booked_for}
                            label="Booked For"
                            onChange={handleChange}
                        >
                            {['self', 'kid', 'boy', 'girl', 'man', 'woman', 'senior_citizen'].map(val => (
                                <MenuItem key={val} value={val}>
                                    {val.charAt(0).toUpperCase() + val.slice(1).replace("_", " ")}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* Row 4: Date + Time Slot */}
                <Box display="flex" gap="20px" flexDirection={isMobile ? "column" : "row"}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Date"
                            value={formData.date}
                            onChange={(newValue) => setFormData(prev => ({ ...prev, date: newValue }))}
                            slotProps={{ textField: { fullWidth: true, required: true } }}
                            disablePast
                        />
                    </LocalizationProvider>

                    <FormControl fullWidth required>
                        <InputLabel>Time Slot ({filteredSlots.length} Available)</InputLabel>
                        <Select
                            name="time_slot"
                            value={formData.time_slot}
                            label="Time Slot"
                            onChange={handleChange}
                            disabled={!formData.salon_employee || !formData.date || filteredSlots.length === 0}
                        >
                            {filteredSlots.length > 0 ? (
                                filteredSlots.map(slot => (
                                    <MenuItem
                                        key={slot}
                                        value={slot}
                                        disabled={bookedSlots.includes(slot)}
                                        sx={{
                                            color: bookedSlots.includes(slot) ? 'text.disabled' : 'text.primary',
                                            textDecoration: bookedSlots.includes(slot) ? 'line-through' : 'none'
                                        }}
                                    >
                                        {slot}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled value="">
                                    {salonDetails?.closed_on === formData.date.format('dddd').toLowerCase()
                                        ? "Salon is Closed"
                                        : "No slots available"}
                                </MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </Box>

                <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Button
                        type="button"
                        color="secondary"
                        variant="contained"
                        sx={{ mr: 2 }}
                        onClick={() => navigate("/appointment/listing")}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        color="secondary"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : "Create Appointment"}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default FormComponent;
