import { useState } from "react";
import { Box, IconButton, InputBase, useMediaQuery, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { tokens } from "../../theme";

const Search = ({ getSearchData, condition, setSearchFlag, oldPagination, reloadBtn }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:720px)");
    const [inputValue, setInputValue] = useState("");

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSearch = () => {
        getSearchData(0, 5, condition, inputValue);
        setInputValue('');
        setSearchFlag({
            search: true,
            searching: true,
        });
        reloadBtn.style.display = "inline-flex";
    };

    //Search data by hitting enter key
    const handleKeyDown = (event) => {
        if (event.keyCode == 13) {
            handleSearch();
        };
    };

    return (
        <Box
            backgroundColor={colors.primary[400]}
            borderRadius="4px"
            width="42vw"
        >
            <InputBase sx={{
                ml: 2,
                flex: 1,
                mt: 1,
                width: "88%"
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
                // right: isNonMobile ? "auto" : "2%",
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
