/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
*/

import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material";

// color design tokens — Phoenix/Aurora style palette
export const tokens = (mode) => ({
    ...(mode === 'dark'
        ? {
            grey: {
                100: "#f1f5f9",
                200: "#e2e8f0",
                300: "#cbd5e1",
                400: "#94a3b8",
                500: "#64748b",
                600: "#475569",
                700: "#334155",
                800: "#1e293b",
                900: "#0f172a"
            },
            primary: {
                100: "#c7d2fe",
                200: "#a5b4fc",
                300: "#818cf8",
                400: "#1e293b",  // sidebar bg in dark
                500: "#0f172a",  // page bg in dark
                600: "#172554",
                700: "#1e1b4b",
                800: "#312e81",
                900: "#3730a3"
            },
            greenAccent: {
                100: "#dcfce7",
                200: "#bbf7d0",
                300: "#86efac",
                400: "#4ade80",
                500: "#22c55e",
                600: "#16a34a",
                700: "#15803d",
                800: "#166534",
                900: "#14532d"
            },
            redAccent: {
                100: "#fee2e2",
                200: "#fecaca",
                300: "#fca5a5",
                400: "#f87171",
                500: "#ef4444",
                600: "#dc2626",
                700: "#b91c1c",
                800: "#991b1b",
                900: "#7f1d1d"
            },
            blueAccent: {
                100: "#e0e7ff",
                200: "#c7d2fe",
                300: "#a5b4fc",
                400: "#818cf8",
                500: "#5c6bc0",   // Phoenix primary indigo
                600: "#4f46e5",
                700: "#4338ca",
                800: "#3730a3",
                900: "#312e81"
            }
        } : {
            grey: {
                100: "#0f172a",
                200: "#1e293b",
                300: "#334155",
                400: "#475569",
                500: "#64748b",
                600: "#94a3b8",
                700: "#cbd5e1",
                800: "#e2e8f0",
                900: "#f1f5f9"
            },
            primary: {
                100: "#312e81",
                200: "#3730a3",
                300: "#4338ca",
                400: "#ffffff",  // sidebar bg in light
                500: "#0f172a",
                600: "#475569",
                700: "#64748b",
                800: "#94a3b8",
                900: "#f1f5f9"
            },
            greenAccent: {
                100: "#14532d",
                200: "#166534",
                300: "#15803d",
                400: "#16a34a",
                500: "#22c55e",
                600: "#4ade80",
                700: "#86efac",
                800: "#bbf7d0",
                900: "#dcfce7"
            },
            redAccent: {
                100: "#7f1d1d",
                200: "#991b1b",
                300: "#b91c1c",
                400: "#dc2626",
                500: "#ef4444",
                600: "#f87171",
                700: "#fca5a5",
                800: "#fecaca",
                900: "#fee2e2"
            },
            blueAccent: {
                100: "#312e81",
                200: "#3730a3",
                300: "#4338ca",
                400: "#4f46e5",
                500: "#5c6bc0",   // Phoenix primary indigo
                600: "#818cf8",
                700: "#a5b4fc",
                800: "#c7d2fe",
                900: "#e0e7ff"
            }
        })
});


//mui Theme Settings
export const themeSettings = (mode) => {
    const colors = tokens(mode);

    return {
        palette: {
            mode: mode,
            ...(mode === "dark"
                ? {
                    primary: {
                        main: colors.blueAccent[500]
                    },
                    secondary: {
                        main: colors.greenAccent[500]
                    },
                    neutral: {
                        dark: colors.grey[700],
                        main: colors.grey[500],
                        light: colors.grey[100]
                    },
                    background: {
                        default: colors.primary[500]    // deep navy
                    }
                } : {
                    primary: {
                        main: colors.blueAccent[500]
                    },
                    secondary: {
                        main: colors.greenAccent[500]
                    },
                    neutral: {
                        dark: colors.grey[700],
                        main: colors.grey[500],
                        light: colors.grey[100]
                    },
                    background: {
                        default: "#f5f7fa"              // Phoenix light bg
                    }
                })
        },
        typography: {
            fontFamily: ["Inter", "Nunito Sans", "sans-serif"].join(","),
            fontSize: 13,
            h1: {
                fontFamily: ["Inter", "Nunito Sans", "sans-serif"].join(","),
                fontSize: 40,
                fontWeight: 700
            },
            h2: {
                fontFamily: ["Inter", "Nunito Sans", "sans-serif"].join(","),
                fontSize: 32,
                fontWeight: 700
            },
            h3: {
                fontFamily: ["Inter", "Nunito Sans", "sans-serif"].join(","),
                fontSize: 24,
                fontWeight: 600
            },
            h4: {
                fontFamily: ["Inter", "Nunito Sans", "sans-serif"].join(","),
                fontSize: 20,
                fontWeight: 600
            },
            h5: {
                fontFamily: ["Inter", "Nunito Sans", "sans-serif"].join(","),
                fontSize: 16,
                fontWeight: 500
            },
            h6: {
                fontFamily: ["Inter", "Nunito Sans", "sans-serif"].join(","),
                fontSize: 14,
                fontWeight: 500
            },
        }
    };
};

//Context for Color Mode
export const ColorModeContext = createContext({
    toggleColorMode: () => { }
});

export const useMode = () => {
    const [mode, setMode] = useState("light");

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode(prev => (prev === "light" ? "dark" : "light"));
            }
        }), []);

    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

    return [theme, colorMode];
};
