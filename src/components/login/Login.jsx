import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import propTypes from 'prop-types';

import { Box, Grid, Button, TextField, Typography, Container, Avatar, Checkbox } from "@mui/material";
import { Stack, FormControlLabel, useMediaQuery, useTheme } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Formik } from "formik";

import Toast from "../common/Toast";
import SignInLoader from "../common/SignInLoader";
import { UserAPI } from "../../apis/UserAPI";
import { setAuthToken } from "../../redux/actions/UserActions";
import { themeSettings } from "../../theme";

import bgImg from "../assets/backimg.jpg";
import bg from "../assets/signin.svg";

const boxstyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  boxShadow: 24,
  borderRadius: 6,
  bgcolor: "background.paper",
  width: "62%",
  height: "60%",
  transform: "translate(-50%, -50%)",
  padding: "10px"
};

const center = {
  position: "relative",
  top: "50%",
  left: "35%",
};

const initialValues = {
  email: "",
  password: ""
};

export default function Login() {
  const theme = useTheme();
  const { typography } = themeSettings(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState(initialValues);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastAlert, setToastAlert] = useState(false);
  const [toastSeverity, setToastSeverity] = useState("");
  const [toastMessage, setToastMessage] = useState("");


  //make the POST API call when submit button is clicked
  useEffect(() => {
    let toastTimeout;
    let toastTimeout2;

    if (formData.email && formData.password) {
      setLoading(true);
      UserAPI.login(formData)
        .then(({ data: response }) => {
          setLoading(false);
          if (response.status === 'Success' && response.data !== "Username and Password do not match") {
            dispatch(setAuthToken({ token: response.data.token }));
          } else if (response.status === 'Success' && response.data === "Username and Password do not match") {
            setToastAlert(true);
            setToastSeverity("info");
            setToastMessage(response.data);
            toastTimeout = setTimeout(() => {
              setToastAlert(false);
            }, 2000);
          };
        })
        .catch(err => {
          setLoading(false);
          setToastAlert(true);
          setToastSeverity("error");
          setToastMessage(err);

          toastTimeout2 = setTimeout(() => {
            setToastAlert(false);
          }, 2000);
        });
    };

    return () => {
      clearTimeout(toastTimeout);
      clearTimeout(toastTimeout2);
    }

  }, [formData]);

  return (
    <>
      <Toast alerting={toastAlert} severity={toastSeverity} message={toastMessage} />
      <div
        style={{
          backgroundImage: `url(${bgImg})`,
          backgroundSize: "cover",
          height: "80vh",
          color: "#f5f5f5"
        }}
      >
        <Box sx={boxstyle}>
          <Grid container>
            <Grid item xs={12} sm={12} lg={6}>
              <Box
                style={{
                  backgroundImage: `url(${bg})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  marginTop: "40px",
                  marginLeft: "15px",
                  marginRight: "15px",
                  height: "54vh",
                  color: "#f5f5f5",
                }}
              ></Box>
            </Grid>
            <Grid item xs={12} sm={12} lg={6}>
              <Box
                style={{
                  height: "100%",
                  backgroundColor: "#3b33d5",
                  borderRadius: 26
                }}
              >
                <Container>
                  <Box height={35} />
                  <Box sx={center}>
                    <Avatar
                      sx={{
                        ml: "35px", bgcolor: `${theme.palette.mode} === "dark" ? "dark" : "light"`
                      }}
                    >
                      <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h2" variant="h4" sx={{
                      marginLeft: "-18px",
                      fontFamily: typography.fontFamily,
                      fontSize: typography.h2.fontSize
                    }}>
                      Eden Sign
                    </Typography>
                  </Box>
                  <Formik
                    onSubmit={values => {
                      setFormData(values);
                    }}
                    initialValues={initialValues}
                  // validationSchema={UserValidation}
                  // enableReinitialize={true}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      dirty,
                      handleBlur,
                      handleChange,
                      handleSubmit
                    }) => (
                      <form onSubmit={handleSubmit}>
                        <Grid container spacing={1}>
                          <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                            <TextField
                              required
                              fullWidth
                              id="email"
                              label="Username"
                              name="email"
                              type="email"
                              autoComplete="on"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.email}
                              error={!!touched.contact_no && !!errors.contact_no}
                              helperText={touched.contact_no && errors.contact_no}
                            />
                          </Grid>
                          <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                            <TextField
                              required
                              fullWidth
                              id="password"
                              label="Password"
                              name="password"
                              type="password"
                              autoComplete="off"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.password}
                              error={!!touched.contact_no && !!errors.contact_no}
                              helperText={touched.contact_no && errors.contact_no}
                            />
                          </Grid>
                          <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                            <Stack direction="row" spacing={2}>
                              <FormControlLabel
                                sx={{ width: "60%" }}
                                onClick={() => setRemember(!remember)}
                                control={<Checkbox checked={remember} />}
                                label="Remember me"
                              />
                              <Typography
                                variant="body1"
                                component="span"
                                onClick={() => {
                                  navigateTo("/reset-password");
                                }}
                                style={{ marginTop: "10px", cursor: "pointer" }}
                              >
                                Forgot password?
                              </Typography>
                            </Stack>
                          </Grid>
                          <Grid item xs={12} sx={{ ml: "5em", mr: "5em" }}>
                            <Button
                              fullWidth
                              disabled={!dirty || loading}
                              type="submit"
                              variant="contained"
                              size="large"
                              sx={{
                                mt: "10px",
                                mr: "20px",
                                color: "#ffffff",
                                minWidth: "170px",
                                backgroundColor: "#FF9A01",
                                borderRadius: 28,
                              }}
                            >
                              {loading === true ? <SignInLoader /> : "Sign In"}
                            </Button>
                          </Grid>
                        </Grid>
                      </form>
                    )}
                  </Formik>
                </Container>
              </Box>
            </Grid>
          </Grid >
        </Box >
      </div >
    </>
  );
};

Login.propTypes = {
  setToken: propTypes.func.isRequired
};
