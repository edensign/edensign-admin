import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";

import { ColorModeContext, useMode } from "./theme";
import Topbar from "./scenes/global/Topbar.jsx";
import Sidebar from "./scenes/global/Sidebar.jsx";
import Dashboard from "./scenes/dashboard";
import Form from "./scenes/form";
import Employees from "./scenes/team/Employees";
import Contacts from "./scenes/contacts";
// import Calendar from "./scenes/calendar/calendar";

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
              <Route exact path="/" element={<Dashboard />} />
              <Route exact path="/form" element={<Form />} />
              <Route exact path="/employees" element={<Employees />} />
              <Route exact path="/contacts" element={<Contacts />} />
              {/* <Route exact path="/calendar" element={<Calendar />} /> */}
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
