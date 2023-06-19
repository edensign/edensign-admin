/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
*/

import { useContext, useState } from "react";

import { Avatar, Box, Divider, useTheme, IconButton, Tooltip, MenuItem } from "@mui/material";
import { Menu, ListItemIcon, Typography } from "@mui/material";

import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
// import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
// import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
// import PersonAdd from '@mui/icons-material/PersonAdd';
import Logout from '@mui/icons-material/Logout';

import { ColorModeContext, tokens } from "../../theme";
import { Utility } from "../utility";

const Topbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { getInitials, getNameAndType } = Utility();
  const { username, type } = getNameAndType();


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    localStorage.clear();
    location.reload();
  };

  return (
    <>
      {/* ICONS */}
      <Box display="flex" textAlign="center" justifyContent="flex-end" p={2}>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <Tooltip title="Dark Mode">
              <DarkModeOutlinedIcon />
            </Tooltip>
          ) : (
            <Tooltip title="Light Mode">
              <LightModeOutlinedIcon />
            </Tooltip>
          )}
        </IconButton>
        <Tooltip title="Notifications">
          <IconButton>
            <NotificationsOutlinedIcon />
          </IconButton>
        </Tooltip>
        {/* <Tooltip title="Settings">
          <IconButton>
            <SettingsOutlinedIcon />
          </IconButton>
        </Tooltip>
        <PersonOutlinedIcon /> */}
        <Tooltip title="Account">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 1 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{ padding: "2px", width: 36, height: 33, bgcolor: colors.grey[100] }}>
              {getInitials()}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          <Box textAlign="center">
            <Typography
              variant="h3"
              color={colors.blueAccent[600]}
              fontWeight="bold"
              sx={{ m: "10px 0 4px 0" }}
            >
              {username}
            </Typography>
            <Typography variant="h5" color={colors.greenAccent[500]}> {type} </Typography>
          </Box>

        </MenuItem>
        <Divider />
        <MenuItem onClick={handleSignOut} sx={{ color: colors.blueAccent[600], justifyContent: "center" }}>
          <ListItemIcon >
            <Logout fontSize="medium" sx={{ color: colors.blueAccent[600] }} />
          </ListItemIcon>
          <Typography variant="h5"> Logout </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Topbar;
