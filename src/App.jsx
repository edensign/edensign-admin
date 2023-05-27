/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
*/

import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import { CssBaseline, ThemeProvider } from "@mui/material";

import { ColorModeContext, useMode } from "./theme.jsx";
import Topbar from "./components/common/Topbar.jsx";
import Sidebar from "./components/common/Sidebar.jsx";
import Dashboard from "./components/dashboard/Dashboard.jsx";

const FormComponent = lazy( () => import("./components/users/FormComponent.jsx"));
const ListingComponent = lazy(() => import("./components/users/ListingComponent.jsx"));
const Login = lazy(() => import("./components/login/Login.jsx"));
import Loader from "./components/common/Loader.jsx"
// import Calendar from "./calendar/calendar";

function App() {
  const [theme, colorMode] = useMode();

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
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/" element={<Dashboard />} />
                <Route exact path="/user-form" element={<FormComponent />} />
                <Route exact path="/user-listing" element={<ListingComponent />} />
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
