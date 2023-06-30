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
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

import { tokens } from "../../theme";
import { SidebarItem } from "./SidebarItem";
import { Utility } from "../utility";

import DummyImg from "./Faraz.png";

const Sidebar = ({ role }) => {
  const theme = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const selected = useSelector(state => state.menuItems.selected);
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery("(max-width:480px)");
  const { getLocalStorage } = Utility();

  const id = getLocalStorage("salon")?.id;

  useEffect(() => {
    setIsCollapsed(isMobile);
  }, [isMobile]);

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`
        },
        "& .pro-icon-wrapper": {
          backgroundColor: `transparent !important`
        },
        "& .pro-inner-item": {
          padding: `4px 35px 4px 15px !important`
        },
        "& .pro-inner-item:hover": {
          color: `#868dfb !important`
        },
        "& .pro-menu-item.active": {
          color: `#6870fa !important`
        }
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              color: colors.grey[100],
              margin: isMobile ? `10px 0px 10px 0` : `10px 0px 10px 20px !important`
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="5px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  {import.meta.env.VITE_COMPANY_NAME}
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {/* USER */}
          {!isCollapsed && (
            <Box mb="15px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="80px"
                  height="80px"
                  src={DummyImg}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
            </Box>
          )}
          {role === 'admin' && <>
            {/* MENU ITEMS */}
            <Box paddingLeft={isCollapsed ? undefined : "10%"}>
              <SidebarItem
                title="Dashboard"
                to="/"
                icon={<HomeOutlinedIcon />}
                selected={selected}
              />

              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 10px" }}
              >
                Users
              </Typography>
              <SidebarItem
                title="Employee"
                to="/user/listing"
                icon={<PeopleOutlinedIcon />}
                selected={selected}
              />
              <SidebarItem
                title="Salon"
                to="/user/listing"
                icon={<PeopleOutlinedIcon />}
                selected={selected}

              />
              <SidebarItem
                title="Freelancer"
                to="/user/listing"
                icon={<PeopleOutlinedIcon />}
                selected={selected}
              />

              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 10px" }}
              >
                Salons
              </Typography>
              <SidebarItem
                title="Salon Detail"
                to="/salon/listing"
                icon={<FormatListBulletedIcon />}
                selected={selected}
              />
              <SidebarItem
                title="Salon Inventory"
                to="/salon/inventory"
                icon={<ReceiptLongIcon />}
                selected={selected}
              />
              <SidebarItem
                title="Salon Cashflow"
                to="/salon/cashflow"
                icon={<ReceiptOutlinedIcon />}
                selected={selected}
              />

              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 10px" }}
              >
                Products
              </Typography>
              <SidebarItem
                title="Product Listing"
                to="/employee/listing"
                icon={<ReceiptOutlinedIcon />}
                selected={selected}
              />
              <SidebarItem
                title="Product Update"
                to="/employee/update"
                icon={<ContactsOutlinedIcon />}
                selected={selected}
              />

              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 10px" }}
              >
                Pages
              </Typography>
              <SidebarItem
                title="FAQ Page"
                to="/faq"
                icon={<HelpOutlineOutlinedIcon />}
                selected={selected}
              />
              <SidebarItem
                title="JFF Page"
                to="/faq"
                icon={<HelpOutlineOutlinedIcon />}
                selected={selected}
              />
            </Box>
          </>}
          {role === 'salon' &&
            <>
              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 10px" }}
              >
                Salons
              </Typography>
              <SidebarItem
                title="Salon Detail"
                to={id ? "/salon/update" : "/salon/create"}
                icon={<FormatListBulletedIcon />}
                selected={selected}
              />
              <SidebarItem
                title="Salon Inventory"
                to="/salon/inventory"
                icon={<ReceiptLongIcon />}
                selected={selected}
              />
              <SidebarItem
                title="Salon Cashflow"
                to="/salon/cashflow"
                icon={<ReceiptOutlinedIcon />}
                selected={selected}
              />
            </>}
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
