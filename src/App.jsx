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
const KanbanCalendarView = lazy(() => import("./components/appointments/KanbanCalendarView"));

const ProductFormComponent = lazy(() => import("./components/products/FormComponent"));
const ProductListingComponent = lazy(() => import("./components/products/ListingComponent"));
const ProductAds = lazy(() => import("./components/productAds/ProductAds"));

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
const LeadsListingComponent = lazy(() => import("./components/leads/LeadsListingComponent"));

const UserFormComponent = lazy(() => import("./components/users/FormComponent"));
const UserListingComponent = lazy(() => import("./components/users/ListingComponent"));
const AcademyListingComponent = lazy(() => import("./components/academy/ListingComponent"));
const AcademyFormComponent = lazy(() => import("./components/academy/FormComponent"));

const StateListingComponent = lazy(() => import("./components/state/ListingComponent"));
const CityListingComponent = lazy(() => import("./components/city/ListingComponent"));

const OfferCardListingComponent = lazy(() => import("./components/offerCards/ListingComponent"));
const OfferCardFormComponent = lazy(() => import("./components/offerCards/FormComponent"));

const CategoryListingComponent = lazy(() => import("./components/category/CategoryListingComponent"));
const CategoryManageComponent = lazy(() => import("./components/category/CategoryManageComponent"));
const CompanyListingComponent = lazy(() => import("./components/company/CompanyListingComponent"));
const CompanyFormComponent = lazy(() => import("./components/company/CompanyFormComponent"));
const CompanyProfileComponent = lazy(() => import("./components/company/CompanyProfileComponent"));
const DistributorChainComponent = lazy(() => import("./components/company/DistributorChainComponent"));
const DistributorListingComponent = lazy(() => import("./components/distributor/DistributorListingComponent"));
const DistributorFormComponent = lazy(() => import("./components/distributor/DistributorFormComponent"));
const SystemConfig = lazy(() => import("./components/systemConfig/SystemConfig"));
const OrdersListingComponent = lazy(() => import("./components/orders/OrdersListingComponent"));

import API from "./apis";
import { Utility } from "./components/utility";
import { setMenuItem } from "./redux/actions/NavigationAction";
import { setAgreementSigned } from "./redux/actions/UserActions";
// import Calendar from "./calendar/calendar";

function App() {
  const { pathname, search } = useLocation();
  const { getLocalStorage, getRole, setStorageAndDispatch, verifyToken } = Utility();
  const [role, setRole] = useState(() => getRole());
  const [theme, colorMode] = useMode();
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const roleType = getRole();
    setRole(roleType);
    switchRole(roleType);
  }, [getLocalStorage("auth")?.type]);


  const switchRole = (userRole) => {
    switch (userRole) {
      case 'admin':
      case 'sales_executive':
        if (pathname === '/' || pathname === '/login') {
          navigateTo('/');
        } else {
          navigateTo(pathname + search);
        }
        break;
      case 'company':
        if (pathname === '/' || pathname === '/login') {
          navigateTo('/company/profile/view');
        } else {
          navigateTo(pathname + search);
        }
        break;
      case 'distributor':
        if (pathname === '/' || pathname === '/login') {
          navigateTo('/product/detail/listing');
        } else {
          navigateTo(pathname + search);
        }
        break;
      case 'salon':
        setStorageAndDispatch(navigateTo, API, dispatch, setMenuItem, setAgreementSigned, pathname);
        break;
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
        <div className="app" style={{ backgroundColor: theme.palette.background.default }}>
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
                      <Route exact path="/appointment/slots/kanban" element={<KanbanCalendarView />} />

                      <Route exact path="/product/detail/create" element={<ProductFormComponent />} />
                      <Route exact path="/product/detail/update/:id" element={<ProductFormComponent />} />
                      <Route exact path="/product/detail/listing" element={<ProductListingComponent />} />
                      <Route exact path="/product-ads/listing" element={<ProductAds />} />

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
                      <Route exact path="/leads/listing" element={<LeadsListingComponent />} />

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

                      <Route exact path="/Sales Executive/create" element={<UserFormComponent />} />
                      <Route exact path="/sales executive/update/:id" element={<UserFormComponent />} />
                      <Route exact path="/Sales Executive/listing" element={<UserListingComponent />} />

                      <Route exact path="/academy/listing" element={<AcademyListingComponent />} />
                      <Route exact path="/academy/create" element={<AcademyFormComponent />} />
                      <Route exact path="/academy/update/:id" element={<AcademyFormComponent />} />

                      <Route exact path="/state/listing" element={<StateListingComponent />} />
                      <Route exact path="/city/listing" element={<CityListingComponent />} />

                       <Route exact path="/offer-cards/listing" element={<OfferCardListingComponent />} />
                       <Route exact path="/offer-cards/create" element={<OfferCardFormComponent />} />
                       <Route exact path="/offer-cards/update/:id" element={<OfferCardFormComponent />} />

                       <Route exact path="/category/listing" element={<CategoryListingComponent />} />
                       <Route exact path="/category/manage" element={<CategoryManageComponent />} />
                       <Route exact path="/company/listing" element={<CompanyListingComponent />} />
                       <Route exact path="/company/create" element={<CompanyFormComponent />} />
                       <Route exact path="/company/update/:id" element={<CompanyFormComponent />} />
                       <Route exact path="/company/distributors/:companyId" element={<DistributorChainComponent />} />
                       <Route exact path="/distributor/listing" element={<DistributorListingComponent />} />
                       <Route exact path="/distributor/create" element={<DistributorFormComponent />} />
                       <Route exact path="/distributor/update/:id" element={<DistributorFormComponent />} />
                       <Route exact path="/system/config" element={<SystemConfig />} />
                       <Route exact path="/orders/listing" element={<OrdersListingComponent />} />

                       {/* <Route exact path="/calendar" element={<Calendar />} /> */}
                    </>}
                  {role === 'salon' &&
                    <>
                      <Route exact path="/salon/detail/create" element={<SalonFormComponent />} />
                      <Route exact path="/salon/detail/update/:id" element={<SalonFormComponent />} />
                      <Route exact path="/appointment/listing" element={<AppointmentListingComponent />} />
                      <Route exact path="/appointment/create" element={<AppointmentFormComponent />} />
                      <Route exact path="/appointment/slots/kanban" element={<KanbanCalendarView />} />
                      <Route exact path="/salon-inventory/listing" element={<SalonProductInventoryListingComponent />} />
                      <Route exact path="/salon-inventory/create" element={<SalonInventoryFormComponent />} />
                      <Route exact path="/salon-inventory/update/:id" element={<SalonInventoryFormComponent />} />
                      <Route exact path="/salon/cashflow" element={<CashflowListingComponent />} />
                      <Route exact path="/salon/cashflow/create" element={<CashflowFormComponent />} />
                      <Route exact path="/salon/cashflow/update/:id" element={<CashflowFormComponent />} />

                      <Route exact path="/offer-cards/listing" element={<OfferCardListingComponent />} />
                      <Route exact path="/offer-cards/create" element={<OfferCardFormComponent />} />
                      <Route exact path="/offer-cards/update/:id" element={<OfferCardFormComponent />} />
                    </>}
                  {role === 'sales_executive' &&
                    <>
                      <Route exact path="/" element={<Dashboard />} />
                      {/* Salon Owners: sales_executive can create/list salon-type users */}
                      <Route exact path="/salon/create" element={<UserFormComponent />} />
                      <Route exact path="/salon/update/:id" element={<UserFormComponent />} />
                      <Route exact path="/salon/listing" element={<UserListingComponent />} />
                      {/* My Salons: sales_executive can view & edit salons they referred — no create */}
                       <Route exact path="/salon/detail/update/:id" element={<SalonFormComponent />} />
                       <Route exact path="/salon/detail/listing" element={<SalonListingComponent />} />
                     </>}
                   {role === 'company' &&
                     <>
                       <Route exact path="/" element={<Dashboard />} />
                       <Route exact path="/company/profile/view" element={<CompanyProfileComponent />} />
                       <Route exact path="/company/distributors/listing" element={<DistributorChainComponent />} />
                       <Route exact path="/company/distributors/create" element={<DistributorFormComponent />} />
                       <Route exact path="/company/distributors/update/:id" element={<DistributorFormComponent />} />
                     </>}
                   {role === 'distributor' &&
                     <>
                       <Route exact path="/" element={<Dashboard />} />
                       <Route exact path="/product/detail/listing" element={<ProductListingComponent />} />
                       <Route exact path="/product/detail/create" element={<ProductFormComponent />} />
                       <Route exact path="/product/detail/update/:id" element={<ProductFormComponent />} />
                       <Route exact path="/inventory/listing" element={<InventoryListingComponent />} />
                       <Route exact path="/product-ads/listing" element={<ProductAds />} />
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
