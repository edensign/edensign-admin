import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";

import { ColorModeContext, useMode } from "./theme";
import Topbar from "./components/common/Topbar.jsx";
import Sidebar from "./components/common/Sidebar.jsx";
import Dashboard from "./components/dashboard/Dashboard.jsx";
import EmployeeUpdateComponent from "./components/users/Employee Update Component.jsx";
import EmployeeListingComponent from "./components/users/Employee Listing Component.jsx";
import Login from "./components/login/Login.jsx";
// import Calendar from "./calendar/calendar";

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar />
          <main className="content">
            <Topbar />
            <Routes>
              <Route exact path="/login" element={<Login /> } />
              <Route exact path="/" element={<Dashboard />} />
              <Route exact path="/employee-update" element={<EmployeeUpdateComponent />} />
              <Route exact path="/employee-listing" element={<EmployeeListingComponent /> } />
              {/* <Route exact path="/calendar" element={<Calendar />} /> */}
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
