/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
*/

import { lazy, Suspense } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { useIdleTimer } from 'react-idle-timer';

import { ColorModeContext, useMode } from "./theme";
import Login from "./components/login/Login";
import Topbar from "./components/common/Topbar";
import Sidebar from "./components/common/Sidebar";
import Loader from "./components/common/Loader";
const Dashboard = lazy(() => import("./components/dashboard/Dashboard"));
const FormComponent = lazy(() => import("./components/users/FormComponent"));
const UserListingComponent = lazy(() => import("./components/users/ListingComponent"));
import { Utility } from "./components/utility";
// import Calendar from "./calendar/calendar";

function App() {
  const [theme, colorMode] = useMode();
  const { pathname } = useLocation();
  const { getLocalStorage } = Utility();

  const onIdle = () => {
    localStorage.clear();
    location.reload();
  }

  useIdleTimer({    //Automatically SignOut when a user is inactive
    onIdle,
    timeout: parseInt(import.meta.env.VITE_LOGOUT_TIMER)    //10 minute idle timeout stored in environment variable file
  })

  if (!getLocalStorage("auth")?.token && pathname !== '/login') {
    return <Navigate to="/login" replace />
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {getLocalStorage("auth")?.token &&
            <Suspense fallback={<Loader />}>
              <Sidebar />
              <main className="content">
                <Topbar />
                <Routes>
                  <Route exact path="/" element={<Dashboard />} />
                  <Route exact path="/user/create" element={<FormComponent />} />
                  <Route exact path="/user/update" element={<FormComponent />} />
                  <Route exact path="/user/listing" element={<UserListingComponent />} />
                  {/* <Route exact path="/calendar" element={<Calendar />} /> */}
                </Routes>
              </main>
            </Suspense>
          }
          <Routes>
            <Route exact path="/login" element={<Login />} />
          </Routes>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
