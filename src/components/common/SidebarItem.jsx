/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import { MenuItem } from "react-pro-sidebar/dist";
import { Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { tokens } from "../../theme";
import { menuItem } from "../../redux/actions/UserActions";

export const SidebarItem = ({ title, to, icon, selected }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const dispatch = useDispatch();

    return (
        <MenuItem
            active={title === selected}
            style={{
                color: colors.grey[100],
            }}
            onClick={() => dispatch(menuItem(title))}
            icon={icon}
        >
            <Typography>{title}</Typography>
            <Link to={to} />
        </MenuItem>
    );
};
