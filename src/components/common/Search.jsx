/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import { useState } from "react";
import { Box, IconButton, InputBase, useMediaQuery, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { tokens } from "../../theme";

const Search = ({
    getSearchData,
    condition,
    setSearchFlag,
    oldPagination,
    reloadBtn,
    action,
    api
}) => {
    const [inputValue, setInputValue] = useState("");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isMobile = useMediaQuery("(max-width:480px)");
    const isTab = useMediaQuery("(max-width:920px)");

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSearch = () => {
        getSearchData(0, 5, action, api, condition, inputValue);
        setInputValue('');
        setSearchFlag({
            search: true,
            searching: true,
        });
        reloadBtn.style.display = "inline-flex";
    };

    //Search data by pressing down the enter key
    const handleKeyDown = (event) => {
        if (event.keyCode == 13) {
            handleSearch();
        };
    };

    return (
        <Box
            backgroundColor={colors.primary[400]}
            borderRadius="4px"
            width="44vw"
            height={isTab ? "4vh" : "auto"}
            position="relative"
        >
            <InputBase sx={{
                ml: 2,
                flex: 1,
                width: "88%",
                mt: isMobile ? 0 : 1
            }}
                placeholder="Search"
                id="input"
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
            <IconButton sx={{
                p: 1,
                position: "absolute",
                top: isTab ? "1vw" : "0",
                right: isTab ? "1vw" : "0",
                "&:hover": { backgroundColor: colors.greenAccent[600] }
            }}
                onClick={handleSearch}
            >
                <SearchIcon />
            </IconButton>
        </Box>
    );
}

export default Search;
