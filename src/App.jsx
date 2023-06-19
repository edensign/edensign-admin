/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
*/

import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import { CssBaseline, ThemeProvider } from "@mui/material";

import { ColorModeContext, useMode } from "./theme";
// const AccountMenu = lazy(() => import("./components/common/AccountMenu"));
import Login from "./components/login/Login";
import Topbar from "./components/common/Topbar";
import Sidebar from "./components/common/Sidebar";
import Loader from "./components/common/Loader";
const Dashboard = lazy(() => import("./components/dashboard/Dashboard"));
const FormComponent = lazy(() => import("./components/users/FormComponent"));
const ListingComponent = lazy(() => import("./components/users/ListingComponent"));
// import Calendar from "./calendar/calendar";

function App() {
  const [theme, colorMode] = useMode();
  const authInfo = useSelector(state => state.auth);

  if (!authInfo.auth.token) {
    console.log("Not logged in")
    return (
      <ThemeProvider theme={theme}>
        <Login />
      </ThemeProvider>
    );
  }

  console.log("Logged in=>", authInfo.auth.token)
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Suspense fallback={<Loader />}>
            <Sidebar />
            <main className="content">
              <Topbar />
              <Routes>
                <Route exact path="/" element={<Dashboard />} />
                <Route exact path="/user-form" element={<FormComponent />} />
                <Route exact path="/user-listing" element={<ListingComponent />} />
                {/* <Route exact path="/account" element={<AccountMenu /> } /> */}
                {/* <Route exact path="/calendar" element={<Calendar />} /> */}
              </Routes>
            </main>
          </Suspense>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
