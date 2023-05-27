import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Grid, Button, TextField, Typography, Container, Avatar, Checkbox } from "@mui/material";
import { Stack, FormControlLabel } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import bg from "./bg/signin.svg";
import bgImg from "./bg/backimg.jpg";
import Toast from "../common/Toast.jsx";


const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const boxstyle = {
  position: "absolute",
  top: "50%",
  left: "60%",
  transform: "translate(-50%, -50%)",
  width: "75%",
  height: "80%",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 6
};

const center = {
  position: "relative",
  top: "50%",
  left: "37%",
};

export default function Login() {
  const [toastAlert, setToastAlert] = useState(false);
  const [toastSeverity, setToastSeverity] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [remember, setRemember] = useState(false);
  const navigateTo = useNavigate();

  const handleSubmit = async (event) => {
    setToastAlert(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
  };

  return (
    <>
      <Toast alerting={toastAlert} severity={toastSeverity} message={toastMessage} />
      {/* <div
        style={{
          backgroundImage: `url(${bgImg})`,
          backgroundSize: "cover",
          height: "100vh",
          width: "99%",
          position: "absolute",
          left: "-10%",
          top: "-10%",
          zIndex: "30"
        }} */}
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
                height: "70vh",
                color: "#f5f5f5",
              }}
            ></Box>
          </Grid>
          <Grid item xs={12} sm={12} lg={6}>
            <Box
              style={{
                backgroundSize: "cover",
                height: "70vh",
                minHeight: "500px",
                backgroundColor: "#3b33d5",
                borderRadius: 26
              }}
            >
              <ThemeProvider theme={darkTheme}>
                <Container>
                  <Box height={35} />
                  <Box sx={center}>
                    <Avatar
                      sx={{ ml: "35px", mb: "4px", bgcolor: "#ffffff" }}
                    >
                      <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h4">
                      Sign In
                    </Typography>
                  </Box>
                  <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{ mt: 2 }}
                  >
                    <Grid container spacing={1}>
                      <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                        <TextField
                          required
                          fullWidth
                          id="email"
                          label="Username"
                          name="email"
                          autoComplete="email"
                        />
                      </Grid>
                      <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                        <TextField
                          required
                          fullWidth
                          name="password"
                          label="Password"
                          type="password"
                          id="password"
                          autoComplete="new-password"
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
                          type="submit"
                          variant="contained"
                          fullWidth
                          size="large"
                          sx={{
                            mt: "10px",
                            mr: "20px",
                            borderRadius: 28,
                            color: "#ffffff",
                            minWidth: "170px",
                            backgroundColor: "#FF9A01",
                          }}
                        >
                          Sign in
                        </Button>
                      </Grid>
                      <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                        <Stack direction="row" spacing={2}>
                          <Typography
                            variant="body1"
                            component="span"
                            style={{ marginTop: "10px" }}
                          >
                            Not registered yet?{" "}
                            <span
                              style={{ color: "#beb4fb", cursor: "pointer" }}
                              onClick={() => {
                                navigateTo("/user-form");
                              }}
                            >
                              Create an Account
                            </span>
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                </Container>
              </ThemeProvider>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
