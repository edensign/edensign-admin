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

  const isDark = theme.palette.mode === "dark";
  const topbarBg = isDark ? colors.primary[400] : "#ffffff";
  const topbarBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)";


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
      {/* TOPBAR */}
      <Box
        display="flex"
        textAlign="center"
        justifyContent="flex-end"
        alignItems="center"
        px={2}
        py={1}
        sx={{
          backgroundColor: topbarBg,
          borderBottom: `1px solid ${topbarBorder}`,
          boxShadow: isDark
            ? "0 1px 4px rgba(0,0,0,0.3)"
            : "0 1px 4px rgba(0,0,0,0.04)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          backdropFilter: "blur(6px)",
          minHeight: "56px"
        }}
      >
        <IconButton
          onClick={colorMode.toggleColorMode}
          size="small"
          sx={{
            color: colors.grey[500],
            "&:hover": { backgroundColor: "rgba(92, 107, 192, 0.08)", color: "#5c6bc0" },
            mr: 0.5
          }}
        >
          {theme.palette.mode === "dark" ? (
            <Tooltip title="Switch to Light Mode">
              <LightModeOutlinedIcon fontSize="small" />
            </Tooltip>
          ) : (
            <Tooltip title="Switch to Dark Mode">
              <DarkModeOutlinedIcon fontSize="small" />
            </Tooltip>
          )}
        </IconButton>

        <Tooltip title="Notifications">
          <IconButton
            size="small"
            sx={{
              color: colors.grey[500],
              "&:hover": { backgroundColor: "rgba(92, 107, 192, 0.08)", color: "#5c6bc0" },
              mr: 0.5
            }}
          >
            <NotificationsOutlinedIcon fontSize="small" />
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
            sx={{
              ml: 0.5,
              "&:hover": { backgroundColor: "rgba(92, 107, 192, 0.08)" }
            }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              sx={{
                width: 34,
                height: 34,
                fontSize: "13px",
                fontWeight: 700,
                background: "linear-gradient(135deg, #5c6bc0, #7c3aed)",
                color: "#ffffff",
                boxShadow: "0 2px 8px rgba(92, 107, 192, 0.35)"
              }}
            >
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
            filter: 'drop-shadow(0px 4px 20px rgba(0,0,0,0.12))',
            mt: 1.5,
            minWidth: 180,
            borderRadius: "12px",
            border: `1px solid ${topbarBorder}`,
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
              borderTop: `1px solid ${topbarBorder}`,
              borderLeft: `1px solid ${topbarBorder}`
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose} disableRipple>
          <Box textAlign="center" width="100%" px={1} py={0.5}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "#5c6bc0",
                fontSize: "14px"
              }}
            >
              {username}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: colors.grey[500],
                fontSize: "11px",
                textTransform: "capitalize"
              }}
            >
              {type}
            </Typography>
          </Box>
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={handleSignOut}
          sx={{
            color: "#ef4444",
            justifyContent: "center",
            borderRadius: "8px",
            mx: 1,
            mb: 0.5,
            "&:hover": { backgroundColor: "rgba(239,68,68,0.08)" }
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: "#ef4444" }} />
          </ListItemIcon>
          <Typography variant="body2" fontWeight={500}> Logout </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default Topbar;
