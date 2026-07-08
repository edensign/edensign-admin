/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { MenuItem } from "react-pro-sidebar/dist";
import { Typography, useTheme } from "@mui/material";

import { setMenuItem } from "../../redux/actions/NavigationAction";
import { tokens } from "../../theme";
import { Utility } from "../utility";

export const SidebarItem = ({ title, to, icon, selected }) => {
    const theme = useTheme();
    const dispatch = useDispatch();

    const colors = tokens(theme.palette.mode);
    const { setLocalStorage } = Utility();

    const isDark = theme.palette.mode === "dark";
    const isActive = title === selected;

    return (
        <MenuItem
            active={isActive}
            style={{
                color: isActive
                    ? "#5c6bc0"
                    : isDark ? colors.grey[200] : colors.grey[400],
                fontSize: "13.5px",
                fontWeight: isActive ? 600 : 500,
                fontFamily: "'Inter', 'Nunito Sans', sans-serif",
            }}
            onClick={() => {
                dispatch(setMenuItem(title));
                setLocalStorage("menu", { selected: title });
            }}
            icon={icon}
        >
            <Typography
                sx={{
                    fontFamily: "'Inter', 'Nunito Sans', sans-serif",
                    fontSize: "13.5px",
                    fontWeight: isActive ? 600 : 500,
                    color: "inherit"
                }}
            >
                {title}
            </Typography>
            <Link to={to} />
        </MenuItem>
    );
};
//to be continued in link to
// {(getRole() === 'salon' && getLocalStorage("menu")?.selected === 'Salon Detail') ?
// setStorageAndDispatch(navigateTo, API)