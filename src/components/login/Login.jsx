/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Formik } from "formik";
import { Box, Grid, Button, TextField, Typography, Container, Avatar } from "@mui/material";
import { InputAdornment, IconButton, useMediaQuery, useTheme } from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

import API from "../../apis";
import Toast from "../common/Toast";
import SignInLoader from "../common/SignInLoader";
import { themeSettings } from "../../theme";
import { Utility } from "../utility";

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
  height: "62vh",
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

const Login = () => {
  const [formData, setFormData] = useState(initialValues);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigateTo = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();
  const toastInfo = useSelector(state => state.toastInfo);

  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { typography } = themeSettings(theme.palette.mode);
  const { toastModal, setLocalStorage } = Utility();

  //make the POST API call when submit button is clicked
  useEffect(() => {
    if (formData.email && formData.password) {
      setLoading(true);
      API.UserAPI.login(formData)
        .then(({ data: response }) => {
          setLoading(false);

          if (response.status === 'Success' &&
            (response.data === "User does not exist" || response.data === "Username and Password do not match")) {
            toastModal(dispatch, true, "info", response?.data);
          }
          else {
            const authInfo = { token: response.data.token, username: response.data.username, type: response.data.type };
            setLocalStorage("auth", authInfo);
            navigateTo("/");
          }
        })
        .catch(err => {
          setLoading(false);
          toastModal(dispatch, true, "error", err);
        });
    };
  }, [formData]);

  return (
    <>
      <Toast
        alerting={toastInfo.toastAlert}
        severity={toastInfo.toastSeverity}
        message={toastInfo.toastMessage}
      />
      <div
        style={{
          backgroundImage: `url(${bgImg})`,
          backgroundSize: "cover",
          height: "99.9vh",
          width: "100vw",
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
                  height: "56vh",
                  color: "#f5f5f5",
                }}
              ></Box>
            </Grid>
            <Grid item xs={12} sm={12} lg={6}>
              <Box
                style={{
                  height: "58.5vh",
                  backgroundColor: "#3b33d5",
                  borderRadius: 26
                }}
              >
                <Container>
                  <Box height={35} />
                  <Box sx={center}>
                    <Avatar
                      sx={{
                        ml: "35px", bgcolor: `${theme.palette.mode} === dark ? dark : light`
                      }}
                    >
                      <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h2" sx={{
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
                              autoComplete="new-email"
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
                              type={showPassword ? "text" : "password"} // <-- This is where the pw toggle happens
                              autoComplete="off"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.password}
                              error={!!touched.contact_no && !!errors.contact_no}
                              helperText={touched.contact_no && errors.contact_no}
                              InputProps={{ // <-- This is where the toggle button is added
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={() => setShowPassword(!showPassword)}
                                      onMouseDown={() => setShowPassword(!showPassword)}
                                    >
                                      {showPassword ? <VisibilityOutlinedIcon /> :
                                        <VisibilityOffOutlinedIcon />}
                                    </IconButton>
                                  </InputAdornment>
                                )
                              }}
                            />
                          </Grid>
                          {/* <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
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
                          </Grid> */}
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

export default Login;
