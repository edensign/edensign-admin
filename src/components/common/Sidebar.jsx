/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar/dist";
import "react-pro-sidebar/dist/css/styles.css";

import { Box, IconButton, Typography, useTheme, useMediaQuery } from "@mui/material";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import ContentCutOutlinedIcon from "@mui/icons-material/ContentCutOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ContactMailOutlinedIcon from "@mui/icons-material/ContactMailOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import LocationCityOutlinedIcon from "@mui/icons-material/LocationCityOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import MiscellaneousServicesOutlinedIcon from "@mui/icons-material/MiscellaneousServicesOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";

import { tokens } from "../../theme";
import { SidebarItem } from "./SidebarItem";
import { Utility } from "../utility";

import edensignImg from "../assets/eden.jpg";

// Section label component — Phoenix style
const SectionLabel = ({ label, colors }) => (
  <Typography
    variant="caption"
    sx={{
      display: "block",
      color: colors.grey[500],
      fontWeight: 700,
      fontSize: "10px",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      m: "18px 0 6px 18px",
      opacity: 0.7
    }}
  >
    {label}
  </Typography>
);

const Sidebar = ({ role }) => {
  const theme = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const selected = useSelector(state => state.menuItems.selected);
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery("(max-width:480px)");
  const { getLocalStorage } = Utility();

  const id = getLocalStorage("salon")?.id;

  const isDark = theme.palette.mode === "dark";
  const sidebarBg = isDark ? colors.primary[400] : "#ffffff";
  const borderColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";
  const logoTextColor = isDark ? "#f1f5f9" : "#0f172a";

  useEffect(() => {
    setIsCollapsed(isMobile);
  }, [isMobile]);

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${sidebarBg} !important`,
          borderRight: `1px solid ${borderColor} !important`
        },
        "& .pro-icon-wrapper": {
          backgroundColor: `transparent !important`
        },
        "& .pro-inner-item": {
          padding: `8px 20px 8px 16px !important`,
          borderRadius: "8px !important",
          margin: "2px 8px !important",
          transition: "all 0.2s ease !important",
          color: `${isDark ? colors.grey[200] : colors.grey[600]} !important`
        },
        "& .pro-inner-item > .pro-icon-wrapper": {
          color: `${isDark ? colors.grey[200] : colors.grey[600]} !important`
        },
        "& .pro-inner-item > .pro-item-content": {
          color: `${isDark ? colors.grey[200] : colors.grey[600]} !important`
        },
        "& .pro-inner-item:hover": {
          backgroundColor: `rgba(92, 107, 192, 0.08) !important`,
          color: `#5c6bc0 !important`
        },
        "& .pro-inner-item:hover > .pro-icon-wrapper": {
          color: `#5c6bc0 !important`
        },
        "& .pro-inner-item:hover > .pro-item-content": {
          color: `#5c6bc0 !important`
        },
        "& .pro-menu-item.active .pro-inner-item": {
          backgroundColor: `rgba(92, 107, 192, 0.1) !important`,
          color: `#5c6bc0 !important`,
          borderLeft: "3px solid #5c6bc0 !important",
          fontWeight: "600 !important"
        },
        "& .pro-menu-item.active .pro-inner-item > .pro-icon-wrapper": {
          color: `#5c6bc0 !important`
        },
        "& .pro-menu-item.active .pro-inner-item > .pro-item-content": {
          color: `#5c6bc0 !important`
        },
        // Sticky sidebar for layout
        "& .pro-sidebar": {
          height: "100vh !important",
          position: "sticky !important",
          top: "0 !important"
        }
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon sx={{ color: "#5c6bc0" }} /> : undefined}
            style={{
              color: logoTextColor,
              margin: isMobile ? `10px 0px 10px 0` : `10px 0px 10px 0px`
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                px={1}
                py={0.5}
              >
                {/* Brand logo area */}
                <Box display="flex" alignItems="center" gap={1}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "8px",
                      background: "linear-gradient(135deg, #5c6bc0, #7c3aed)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}
                  >
                    <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "14px" }}>
                      E
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "15px",
                      color: logoTextColor,
                      letterSpacing: "-0.02em"
                    }}
                  >
                    {import.meta.env.VITE_COMPANY_NAME}
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  size="small"
                  sx={{ color: colors.grey[500] }}
                >
                  <MenuOutlinedIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {/* USER AVATAR */}
          {!isCollapsed && (
            <Box
              sx={{
                mx: 2,
                mb: 1,
                mt: 0.5,
                borderRadius: "12px",
                overflow: "hidden",
                border: `1px solid ${borderColor}`
              }}
            >
              <img
                alt="profile-user"
                src={edensignImg}
                style={{ cursor: "pointer", width: "100%", display: "block", objectFit: "cover", maxHeight: "120px" }}
              />
            </Box>
          )}

          {role === 'admin' && <>
            {/* MENU ITEMS */}
            <Box paddingLeft={isCollapsed ? undefined : "4px"}>
              <SidebarItem
                title="Dashboard"
                to="/"
                icon={<HomeOutlinedIcon />}
                selected={selected}
              />

              <SectionLabel label="Users" colors={colors} />
              <SidebarItem
                title="Employee"
                to="/employee/listing"
                icon={<BadgeOutlinedIcon />}
                selected={selected}
              />
              <SidebarItem
                title="Salon"
                to="/salon/listing"
                icon={<StoreOutlinedIcon />}
                selected={selected}
              />
              <SidebarItem
                title="Freelancer"
                to="/freelancer/listing"
                icon={<ContentCutOutlinedIcon />}
                selected={selected}
              />
              <SidebarItem
                title="Sales Executive"
                to="/Sales Executive/listing"
                icon={<SupportAgentOutlinedIcon />}
                selected={selected}
              />

              <SectionLabel label="Salons" colors={colors} />
              <SidebarItem
                title="Salon Detail"
                to="/salon/detail/listing"
                icon={<ListAltOutlinedIcon />}
                selected={selected}
              />
              <SidebarItem
                title="Appointments"
                to="/appointment/listing"
                icon={<CalendarMonthOutlinedIcon />}
                selected={selected}
              />
              <SidebarItem
                title="Salon Inventory"
                to="/salon-inventory/salons"
                icon={<Inventory2OutlinedIcon />}
                selected={selected}
              />
              <SidebarItem
                title="Salon Cashflow"
                to="/salon/cashflow"
                icon={<AccountBalanceWalletOutlinedIcon />}
                selected={selected}
              />
              <SidebarItem
                title="Offer Cards"
                to="/offer-cards/listing"
                icon={<LocalOfferOutlinedIcon />}
                selected={selected}
              />

              <SectionLabel label="Products" colors={colors} />
              <SidebarItem
                title="Product Detail"
                to="/product/detail/listing"
                icon={<ShoppingBagOutlinedIcon />}
                selected={selected}
              />
              <SidebarItem
                title="Product Inventory"
                to="/inventory/listing"
                icon={<Inventory2Icon />}
                selected={selected}
              />
              <SidebarItem
                title="Product Ads"
                to="/product-ads/listing"
                icon={<CampaignOutlinedIcon />}
                selected={selected}
              />

              <SectionLabel label="Companies" colors={colors} />
              <SidebarItem
                title="Category & Company"
                to="/category/listing"
                icon={<CategoryOutlinedIcon />}
                selected={selected}
              />
              <SidebarItem
                title="Manage Categories"
                to="/category/manage"
                icon={<CategoryOutlinedIcon />}
                selected={selected}
              />
              <SidebarItem
                title="Distributors"
                to="/distributor/listing"
                icon={<LocalShippingOutlinedIcon />}
                selected={selected}
              />

              <SectionLabel label="Enquiries" colors={colors} />
              <SidebarItem
                title="Contact Enquiries"
                to="/contact/listing"
                icon={<ContactMailOutlinedIcon />}
                selected={selected}
              />

              <SectionLabel label="Pages" colors={colors} />
              <SidebarItem
                title="State"
                to="/state/listing"
                icon={<MapOutlinedIcon />}
                selected={selected}
              />
              <SidebarItem
                title="City"
                to="/city/listing"
                icon={<LocationCityOutlinedIcon />}
                selected={selected}
              />
              <SidebarItem
                title="Amenity"
                to="/amenity/listing"
                icon={<SpaOutlinedIcon />}
                selected={selected}
              />
              <SidebarItem
                title="FAQ"
                to="/faq"
                icon={<HelpOutlineOutlinedIcon />}
                selected={selected}
              />
              <SidebarItem
                title="Job Seeker"
                to="/job/seeker/listing"
                icon={<WorkOutlineOutlinedIcon />}
                selected={selected}
              />
              <SidebarItem
                title="Skill"
                to="/skill/listing"
                icon={<PsychologyOutlinedIcon />}
                selected={selected}
              />
              <SidebarItem
                title="Service"
                to="/service/listing"
                icon={<MiscellaneousServicesOutlinedIcon />}
                selected={selected}
              />
              <SidebarItem
                title="Academy"
                to="/academy/listing"
                icon={<SchoolOutlinedIcon />}
                selected={selected}
              />

            </Box>
          </>}

          {role === 'salon' &&
            <>
              <SectionLabel label="Salons" colors={colors} />
              <SidebarItem
                title="Salon Detail"
                to={id ? `/salon/detail/update/${id}` : "/salon/detail/create"}
                icon={<ListAltOutlinedIcon />}
                selected={selected}
              />
              <SidebarItem
                title="Salon Inventory"
                to="/salon-inventory/listing"
                icon={<Inventory2OutlinedIcon />}
                selected={selected}
              />
              <SidebarItem
                title="Appointments"
                to="/appointment/listing"
                icon={<CalendarMonthOutlinedIcon />}
                selected={selected}
              />
              <SidebarItem
                title="Salon Cashflow"
                to="/salon/cashflow"
                icon={<AccountBalanceWalletOutlinedIcon />}
                selected={selected}
              />
              <SidebarItem
                title="Offer Cards"
                to="/offer-cards/listing"
                icon={<LocalOfferOutlinedIcon />}
                selected={selected}
              />
            </>}

          {role === 'sales_executive' &&
            <>
              <SectionLabel label="Sales Dashboard" colors={colors} />
              <SidebarItem
                title="Dashboard"
                to="/"
                icon={<HomeOutlinedIcon />}
                selected={selected}
              />
              <SectionLabel label="Salon Owners" colors={colors} />
              <SidebarItem
                title="Salon"
                to="/salon/listing"
                icon={<StoreOutlinedIcon />}
                selected={selected}
              />
              <SectionLabel label="My Salons" colors={colors} />
              <SidebarItem
                title="My Salons"
                to="/salon/detail/listing"
                icon={<ListAltOutlinedIcon />}
                selected={selected}
              />
            </>}

          {role === 'company' &&
            <>
              <SectionLabel label="My Company" colors={colors} />
              <SidebarItem
                title="My Profile"
                to="/company/profile/view"
                icon={<AccountCircleOutlinedIcon />}
                selected={selected}
              />
              <SidebarItem
                title="Distributor Chain"
                to="/company/distributors/listing"
                icon={<LocalShippingOutlinedIcon />}
                selected={selected}
              />
              <SidebarItem
                title="Create Distributor"
                to="/company/distributors/create"
                icon={<GroupAddOutlinedIcon />}
                selected={selected}
              />
            </>}

          {role === 'distributor' &&
            <>
              <SectionLabel label="Distributor Panel" colors={colors} />
              <SidebarItem
                title="My Products"
                to="/product/detail/listing"
                icon={<ShoppingBagOutlinedIcon />}
                selected={selected}
              />
              <SidebarItem
                title="Product Inventory"
                to="/inventory/listing"
                icon={<Inventory2Icon />}
                selected={selected}
              />
              <SidebarItem
                title="Product Offers"
                to="/product-ads/listing"
                icon={<LocalOfferOutlinedIcon />}
                selected={selected}
              />
            </>}
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
