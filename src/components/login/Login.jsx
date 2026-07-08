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
import { Box, Button, TextField, Typography, Avatar } from "@mui/material";
import { InputAdornment, IconButton, useMediaQuery, useTheme } from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';

import API from "../../apis";
import Toast from "../common/Toast";
import SignInLoader from "../common/SignInLoader";
import { tokens, themeSettings } from "../../theme";
import { Utility } from "../utility";

import bgImg from "../assets/backimg.jpg";
import bg from "../assets/signin.svg";

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

  const isMobile = useMediaQuery("(max-width:480px)");
  const isTab = useMediaQuery("(max-width:920px)");
  const colors = tokens(theme.palette.mode);
  const { typography } = themeSettings(theme.palette.mode);
  const { toastAndNavigate, setLocalStorage } = Utility();

  const isDark = theme.palette.mode === "dark";

  // Adjust body, html, root, and app styles dynamically to prevent scrollbars on the login page
  useEffect(() => {
    const originalBodyHeight = document.body.style.height;
    const originalHtmlHeight = document.documentElement.style.height;
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.height = "100vh";
    document.documentElement.style.height = "100vh";
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const appEl = document.querySelector(".app");
    let originalAppHeight = "";
    let originalAppOverflow = "";
    if (appEl) {
      originalAppHeight = appEl.style.height;
      originalAppOverflow = appEl.style.overflow;
      appEl.style.height = "100vh";
      appEl.style.overflow = "hidden";
    }

    const rootEl = document.getElementById("root");
    let originalRootHeight = "";
    let originalRootOverflow = "";
    if (rootEl) {
      originalRootHeight = rootEl.style.height;
      originalRootOverflow = rootEl.style.overflow;
      rootEl.style.height = "100vh";
      rootEl.style.overflow = "hidden";
    }

    return () => {
      document.body.style.height = originalBodyHeight;
      document.documentElement.style.height = originalHtmlHeight;
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      if (appEl) {
        appEl.style.height = originalAppHeight;
        appEl.style.overflow = originalAppOverflow;
      }
      if (rootEl) {
        rootEl.style.height = originalRootHeight;
        rootEl.style.overflow = originalRootOverflow;
      }
    };
  }, []);

  //make the POST API call when submit button is clicked
  useEffect(() => {
    if (formData.email && formData.password) {
      setLoading(true);
      API.UserAPI.login(formData)
        .then(({ data: response }) => {
          setLoading(false);

          if (response.status === 'Success' &&
            (response.data === "User does not exist" || response.data === "Username and Password do not match")) {
            toastAndNavigate(dispatch, true, "info", response?.data);
          }
          else {
            const authInfo = {
              id: response.data.id,
              token: response.data.token,
              type: response.data.type,
              username: response.data.username
            };
            setLocalStorage("auth", authInfo);
            navigateTo("/");
          }
        })
        .catch(err => {
          setLoading(false);
          initialValues.password = '';
          toastAndNavigate(dispatch, true, "error", err?.message);
        });
    };
  }, [formData]);

  return (
    <Box
      sx={{
        backgroundImage: isDark
          ? `linear-gradient(135deg, rgba(15,23,42,0.97) 0%, rgba(30,41,59,0.97) 100%)`
          : `linear-gradient(135deg, rgba(245,247,250,0.96) 0%, rgba(226,232,240,0.96) 100%)`,
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: isMobile ? "16px" : "24px",
        boxSizing: "border-box",
        overflow: "hidden",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: isDark
            ? "linear-gradient(135deg, rgba(15,23,42,0.92) 0%, rgba(30,41,59,0.88) 100%)"
            : "linear-gradient(135deg, rgba(92,107,192,0.08) 0%, rgba(245,247,250,0.92) 100%)",
          zIndex: 0
        }
      }}
    >
      <Toast
        alerting={toastInfo.toastAlert}
        severity={toastInfo.toastSeverity}
        message={toastInfo.toastMessage}
      />

      {/* Card container */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          width: isMobile ? "100%" : isTab ? "90%" : "800px",
          maxWidth: "860px",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: isDark
            ? "0 24px 64px rgba(0,0,0,0.6), 0 2px 0 rgba(255,255,255,0.04) inset"
            : "0 24px 64px rgba(92,107,192,0.15), 0 1px 0 rgba(255,255,255,1) inset",
          border: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(92,107,192,0.1)"
        }}
      >
        {/* ===== LEFT PANEL — Phoenix gradient panel ===== */}
        {!isMobile && (
          <Box
            sx={{
              flex: 1.1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "44px 36px",
              background: isDark
                ? "linear-gradient(160deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)"
                : "linear-gradient(160deg, #4338ca 0%, #5c6bc0 55%, #7c3aed 100%)",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Decorative circles */}
            <Box sx={{
              position: "absolute", top: -60, right: -60, width: 200, height: 200,
              borderRadius: "50%", background: "rgba(255,255,255,0.07)"
            }} />
            <Box sx={{
              position: "absolute", bottom: -40, left: -40, width: 150, height: 150,
              borderRadius: "50%", background: "rgba(255,255,255,0.05)"
            }} />

            {/* Brand */}
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Box display="flex" alignItems="center" gap={1.5} mb={4}>
                <Box sx={{
                  width: 40, height: 40, borderRadius: "10px",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  backdropFilter: "blur(10px)"
                }}>
                  <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "18px" }}>E</Typography>
                </Box>
                <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "16px", letterSpacing: "-0.01em" }}>
                  {import.meta.env.VITE_COMPANY_NAME || "Eden Sign"}
                </Typography>
              </Box>

              <Typography
                sx={{
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "26px",
                  lineHeight: 1.2,
                  mb: 2,
                  letterSpacing: "-0.02em"
                }}
              >
                Manage everything<br />from one place
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.72)", fontSize: "14px", lineHeight: 1.6 }}>
                The all-in-one admin dashboard for salons, products, appointments & more.
              </Typography>
            </Box>

            {/* Feature bullets */}
            <Box sx={{ position: "relative", zIndex: 1 }}>
              {[
                { icon: <DashboardCustomizeOutlinedIcon sx={{ fontSize: 18 }} />, text: "Unified salon & inventory management" },
                { icon: <InsightsOutlinedIcon sx={{ fontSize: 18 }} />, text: "Real-time cashflow & analytics" },
                { icon: <AutoAwesomeIcon sx={{ fontSize: 18 }} />, text: "Role-based access control" }
              ].map((f, i) => (
                <Box key={i} display="flex" alignItems="center" gap={1.5} mb={i < 2 ? 1.5 : 0}>
                  <Box sx={{
                    width: 32, height: 32, borderRadius: "8px",
                    background: "rgba(255,255,255,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", flexShrink: 0
                  }}>
                    {f.icon}
                  </Box>
                  <Typography sx={{ color: "rgba(255,255,255,0.85)", fontSize: "13px" }}>
                    {f.text}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Floating illustration */}
            <Box
              component="img"
              src={bg}
              alt="Dashboard"
              sx={{
                position: "absolute",
                right: "-20px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "55%",
                opacity: 0.12,
                filter: "brightness(10)",
                pointerEvents: "none"
              }}
            />
          </Box>
        )}

        {/* ===== RIGHT PANEL — Clean white form ===== */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: isMobile ? "36px 24px" : "52px 44px",
            backgroundColor: isDark ? colors.primary[400] : "#ffffff"
          }}
        >
          {/* Lock avatar */}
          <Avatar
            sx={{
              background: "linear-gradient(135deg, #5c6bc0, #7c3aed)",
              width: 52,
              height: 52,
              mb: 2.5,
              boxShadow: "0 8px 24px rgba(92,107,192,0.35)"
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 26, color: "#ffffff" }} />
          </Avatar>

          <Typography
            component="h1"
            sx={{
              fontFamily: typography.fontFamily,
              fontWeight: 800,
              fontSize: "24px",
              color: isDark ? colors.grey[100] : "#0f172a",
              mb: 0.75,
              letterSpacing: "-0.02em"
            }}
          >
            Welcome back
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: isDark ? colors.grey[400] : "#64748b",
              mb: 3.5,
              textAlign: "center",
              fontSize: "13.5px",
              lineHeight: 1.6
            }}
          >
            Sign in to your account to continue.
          </Typography>

          <Formik
            onSubmit={values => {
              setFormData(values);
            }}
            initialValues={initialValues}
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
              <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email / Username"
                  name="email"
                  type="email"
                  autoComplete="username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  error={!!touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      fontSize: "14px",
                      backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#f8fafc",
                      "&.Mui-focused fieldset": {
                        borderColor: "#5c6bc0",
                        borderWidth: "1.5px"
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(92, 107, 192, 0.5)"
                      }
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#5c6bc0"
                    }
                  }}
                />

                <TextField
                  required
                  fullWidth
                  id="password"
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  error={!!touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      fontSize: "14px",
                      backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "#f8fafc",
                      "&.Mui-focused fieldset": {
                        borderColor: "#5c6bc0",
                        borderWidth: "1.5px"
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(92, 107, 192, 0.5)"
                      }
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#5c6bc0"
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          onMouseDown={(e) => e.preventDefault()}
                          edge="end"
                          sx={{
                            color: isDark ? colors.grey[400] : "#94a3b8",
                            "&:hover": { color: "#5c6bc0" }
                          }}
                        >
                          {showPassword ? <VisibilityOutlinedIcon fontSize="small" /> : <VisibilityOffOutlinedIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />

                <Button
                  disabled={!dirty || loading}
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{
                    py: 1.4,
                    fontSize: "14px",
                    fontWeight: 700,
                    textTransform: "none",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #5c6bc0 0%, #4f46e5 100%)",
                    color: "#ffffff",
                    letterSpacing: "0.02em",
                    boxShadow: "0 4px 16px rgba(92, 107, 192, 0.4)",
                    transition: "all 0.25s ease",
                    "&:hover": {
                      background: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)",
                      boxShadow: "0 6px 24px rgba(92, 107, 192, 0.5)",
                      transform: "translateY(-1px)"
                    },
                    "&:active": {
                      transform: "translateY(0)",
                      boxShadow: "0 2px 8px rgba(92, 107, 192, 0.3)"
                    },
                    "&.Mui-disabled": {
                      background: isDark ? "rgba(255,255,255,0.1)" : "rgba(92, 107, 192, 0.2)",
                      color: isDark ? "rgba(255,255,255,0.3)" : "rgba(92, 107, 192, 0.4)",
                      boxShadow: "none"
                    }
                  }}
                >
                  {loading ? <SignInLoader /> : "Sign In"}
                </Button>
              </form>
            )}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
