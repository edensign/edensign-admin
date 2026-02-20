/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use, reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
*/

import { lazy, Suspense, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { useIdleTimer } from 'react-idle-timer';

import { ColorModeContext, useMode } from "./theme";
import Login from "./components/login/Login";
import Topbar from "./components/common/Topbar";
import Sidebar from "./components/common/Sidebar";
import Loader from "./components/common/Loader";
const Dashboard = lazy(() => import("./components/dashboard/Dashboard"));

const AmenityListingComponent = lazy(() => import("./components/amenities/ListingComponent"));
const AppointmentListingComponent = lazy(() => import("./components/appointments/ListingComponent"));
const AppointmentFormComponent = lazy(() => import("./components/appointments/FormComponent"));

const ProductFormComponent = lazy(() => import("./components/products/FormComponent"));
const ProductListingComponent = lazy(() => import("./components/products/ListingComponent"));

const InventoryListingComponent = lazy(() => import("./components/inventory/ListingComponent"));
const InventoryFormComponent = lazy(() => import("./components/inventory/InventoryFormComponent"));

const SalonInventoryListingComponent = lazy(() => import("./components/salonInventory/SalonInventoryListingComponent"));


const SalonInventorySalonListingComponent = lazy(() => import("./components/salonInventory/SalonInventorySalonListingComponent"));


const SalonProductInventoryListingComponent = lazy(() => import("./components/salonProductInventory/ListingComponent"));
const SalonInventoryFormComponent = lazy(() => import("./components/salonInventory/SalonInventoryFormComponent"));



const CashflowListingComponent = lazy(() => import("./components/cashflow/CashflowListingComponent"));
const CashflowFormComponent = lazy(() => import("./components/cashflow/CashflowFormComponent"));

const SalonFormComponent = lazy(() => import("./components/salons/detail/FormComponent"));
const SalonListingComponent = lazy(() => import("./components/salons/detail/ListingComponent"));

const JobSeekerFormComponent = lazy(() => import("./components/jobSeeker/FormComponent"));
const JobSeekerListingComponent = lazy(() => import("./components/jobSeeker/ListingComponent"));

const ServiceListingComponent = lazy(() => import("./components/services/ListingComponent"));

const SkillListingComponent = lazy(() => import("./components/skill/ListingComponent"));
const ContactListingComponent = lazy(() => import("./components/contactUs/ListingComponent"));

const UserFormComponent = lazy(() => import("./components/users/FormComponent"));
const UserListingComponent = lazy(() => import("./components/users/ListingComponent"));

import API from "./apis";
import { Utility } from "./components/utility";
import { setMenuItem } from "./redux/actions/NavigationAction";
import { setAgreementSigned } from "./redux/actions/UserActions";
// import Calendar from "./calendar/calendar";

function App() {
  const [role, setRole] = useState(null);
  const [theme, colorMode] = useMode();
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const { pathname, search } = useLocation();
  const { getLocalStorage, getRole, setStorageAndDispatch, verifyToken } = Utility();


  useEffect(() => {
    const roleType = getRole();
    setRole(roleType);
    switchRole(roleType);
  }, [getLocalStorage("auth")?.type]);


  const switchRole = (userRole) => {
    switch (userRole) {
      case 'admin':
        navigateTo(pathname + search);
        break;
      case 'salon':
        setStorageAndDispatch(navigateTo, API, dispatch, setMenuItem, setAgreementSigned, true);
        break;
      case 'freelancer':
      // navigateTo('/freelancer/update');
      // break;
      default:
        navigateTo('/login');
        break;
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

  if (!verifyToken() && pathname !== '/login') {
    return <Navigate to="/login" replace />
  }

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
                      <Route exact path="/amenity/listing" element={<AmenityListingComponent />} />
                      <Route exact path="/appointment/listing" element={<AppointmentListingComponent />} />
                      <Route exact path="/appointment/create" element={<AppointmentFormComponent />} />

                      <Route exact path="/product/detail/create" element={<ProductFormComponent />} />
                      <Route exact path="/product/detail/update/:id" element={<ProductFormComponent />} />
                      <Route exact path="/product/detail/listing" element={<ProductListingComponent />} />

                      <Route exact path="/inventory/listing" element={<InventoryListingComponent />} />
                      <Route exact path="/inventory/create" element={<InventoryFormComponent />} />
                      <Route exact path="/inventory/update/:id" element={<InventoryFormComponent />} />

                      <Route exact path="/salon/detail/create" element={<SalonFormComponent />} />
                      <Route exact path="/salon/detail/update/:id" element={<SalonFormComponent />} />
                      <Route exact path="/salon/detail/listing" element={<SalonListingComponent />} />

                      <Route exact path="/salon-inventory/salons" element={<SalonInventorySalonListingComponent />} />
                      <Route exact path="/salon-inventory/listing" element={<SalonInventoryListingComponent />} />
                      <Route exact path="/salon-inventory/update/:id" element={<SalonInventoryFormComponent />} />

                      <Route exact path="/salon/cashflow" element={<CashflowListingComponent />} />
                      <Route exact path="/salon/cashflow/create" element={<CashflowFormComponent />} />
                      <Route exact path="/salon/cashflow/update/:id" element={<CashflowFormComponent />} />

                      <Route exact path="/service/listing" element={<ServiceListingComponent />} />
                      <Route exact path="/contact/listing" element={<ContactListingComponent />} />

                      <Route exact path="/skill/listing" element={<SkillListingComponent />} />

                      <Route exact path="/job/seeker/create" element={<JobSeekerFormComponent />} />
                      <Route exact path="/job/seeker/update/:id" element={<JobSeekerFormComponent />} />
                      <Route exact path="/job/seeker/listing" element={<JobSeekerListingComponent />} />

                      <Route exact path="/employee/create" element={<UserFormComponent />} />
                      <Route exact path="/employee/update/:id" element={<UserFormComponent />} />
                      <Route exact path="/employee/listing" element={<UserListingComponent />} />
                      <Route exact path="/salon/create" element={<UserFormComponent />} />
                      <Route exact path="/salon/update/:id" element={<UserFormComponent />} />
                      <Route exact path="/salon/listing" element={<UserListingComponent />} />
                      <Route exact path="/freelancer/create" element={<UserFormComponent />} />
                      <Route exact path="/freelancer/update/:id" element={<UserFormComponent />} />
                      <Route exact path="/freelancer/listing" element={<UserListingComponent />} />

                      {/* <Route exact path="/calendar" element={<Calendar />} /> */}
                    </>}
                  {role === 'salon' &&
                    <>
                      <Route exact path="/salon/detail/create" element={<SalonFormComponent />} />
                      <Route exact path="/salon/detail/update/:id" element={<SalonFormComponent />} />
                      <Route exact path="/appointment/listing" element={<AppointmentListingComponent />} />
                      <Route exact path="/appointment/create" element={<AppointmentFormComponent />} />
                      <Route exact path="/salon-inventory/listing" element={<SalonProductInventoryListingComponent />} />
                      <Route exact path="/salon-inventory/create" element={<SalonInventoryFormComponent />} />
                      <Route exact path="/salon-inventory/update/:id" element={<SalonInventoryFormComponent />} />
                      <Route exact path="/salon/cashflow" element={<CashflowListingComponent />} />
                      <Route exact path="/salon/cashflow/create" element={<CashflowFormComponent />} />
                      <Route exact path="/salon/cashflow/update/:id" element={<CashflowFormComponent />} />
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
