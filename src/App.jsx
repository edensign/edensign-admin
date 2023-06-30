/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
*/

import { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { useIdleTimer } from 'react-idle-timer';

import { ColorModeContext, useMode } from "./theme";
import Login from "./components/login/Login";
import Topbar from "./components/common/Topbar";
import Sidebar from "./components/common/Sidebar";
import Loader from "./components/common/Loader";
const Dashboard = lazy(() => import("./components/dashboard/Dashboard"));
const UserFormComponent = lazy(() => import("./components/users/FormComponent"));
const UserListingComponent = lazy(() => import("./components/users/ListingComponent"));
const SalonFormComponent = lazy(() => import("./components/salons/detail/FormComponent"));
const SalonListingComponent = lazy(() => import("./components/salons/detail/ListingComponent"));
import { Utility } from "./components/utility";
import API from "./apis";
import { setMenuItem } from "./redux/actions/NavigationAction";
// import Calendar from "./calendar/calendar";

function App() {
  const [role, setRole] = useState();
  const [theme, colorMode] = useMode();
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const { pathname } = useLocation();
  const { getLocalStorage, getRole, setStorageAndDispatch } = Utility();

  useEffect(() => {
    const roleType = getRole();
    switchRole(roleType);
    setRole(roleType);
  }, [getLocalStorage("auth")?.type]);

  const switchRole = (userRole) => {
    switch (userRole) {
      case 'admin':
        navigateTo('/');
        break;
      case 'salon':
        setStorageAndDispatch(navigateTo, API, dispatch, setMenuItem, true);
        break;
      case 'freelancer':
      // navigateTo('/salon/update');
      // break;
      default:
        navigateTo('/login');
    }
  };

  const onIdle = () => {
    localStorage.clear();
    location.reload();
  };

  useIdleTimer({    //Automatically SignOut when a user is inactive for 30 minutes
    onIdle,
    timeout: parseInt(import.meta.env.VITE_LOGOUT_TIMER)    //30 minute idle timeout stored in environment variable file
  });

  if (!getLocalStorage("auth")?.token && pathname !== '/login') {
    return <Navigate to="/login" replace />
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {getLocalStorage("auth")?.token &&
            <Suspense fallback={<Loader />}>
              <Sidebar role={role} />
              <main className="content">
                <Topbar />
                <Routes>
                  {role === 'admin' &&
                    <>
                      <Route exact path="/" element={<Dashboard />} />
                      <Route exact path="/user/create" element={<UserFormComponent />} />
                      <Route exact path="/user/update" element={<UserFormComponent />} />
                      <Route exact path="/user/listing" element={<UserListingComponent />} />
                      <Route exact path="/salon/create" element={<SalonFormComponent />} />
                      <Route exact path="/salon/update" element={<SalonFormComponent />} />
                      <Route exact path="/salon/listing" element={<SalonListingComponent />} />
                      {/* <Route exact path="/calendar" element={<Calendar />} /> */}
                    </>}
                  {role === 'salon' &&
                    <>
                      <Route exact path="/salon/create" element={<SalonFormComponent />} />
                      <Route exact path="/salon/update" element={<SalonFormComponent />} />
                    </>}
                  {/* {role === 'freelancer' &&
                    <Route exact path="/freelancer/update" element={<SalonFormComponent />} />} */}
                </Routes>
              </main>
            </Suspense>}
          <Routes>
            <Route exact path="/login" element={<Login />} />
          </Routes>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
