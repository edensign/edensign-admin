/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import { useNavigate } from "react-router-dom";

import { Box, Button, Typography, useTheme } from '@mui/material';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import { tokens } from "../../../theme";
import { Utility } from "../../utility";
import { Chip } from "@mui/material";

export const datagridColumns = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const navigateTo = useNavigate();
    const { getLocalStorage } = Utility();
    
    const auth = getLocalStorage("auth");
    const role = auth?.type;
    const userId = auth?.id;

    const handleActionEdit = (id) => {
        navigateTo(`/salon/detail/update/${id}`, { state: { id: id } });
    };

    const handleActionView = (salon_code) => {
        let websiteUrl = import.meta.env.VITE_WEBSITE_URL || 'http://localhost:5173';
        console.log("Raw websiteUrl from env:", websiteUrl);
        websiteUrl = websiteUrl.replace(/^['"]|['"]$/g, '');
        console.log("Clean websiteUrl (quotes stripped):", websiteUrl);
        const cleanWebsiteUrl = websiteUrl.endsWith('/') ? websiteUrl.slice(0, -1) : websiteUrl;
        const targetUrl = `${cleanWebsiteUrl}/salon/detail/${salon_code}`;
        console.log("Opening URL:", targetUrl);
        window.open(targetUrl, "_blank", "noopener,noreferrer");
    };

    const columns = [
        {
            field: "name",
            headerName: "NAME",
            headerAlign: "center",
            align: "center",
            flex: 1,
            minWidth: 120
        },
        {
            field: "contact_no",
            headerName: "CONTACT",
            headerAlign: "center",
            align: "center",
            flex: 1,
            minWidth: 100
        },
        {
            field: "email",
            headerName: "EMAIL",
            headerAlign: "center",
            align: "center",
            flex: 1,
            minWidth: 200
        }
    ];

    if (role === 'admin') {
        columns.push(
            {
                field: "Creator",
                headerName: "CREATED BY",
                headerAlign: "center",
                align: "center",
                flex: 1,
                minWidth: 120,
                valueGetter: (params) => params.row.Creator?.username || 'N/A'
            },
            {
                field: "Referrer",
                headerName: "REFERRAL BY",
                headerAlign: "center",
                align: "center",
                flex: 1,
                minWidth: 120,
                valueGetter: (params) => params.row.Referrer?.username || 'N/A'
            }
        );
    }

    if (role === 'sales_executive') {
        columns.push({
            field: "relation",
            headerName: "MY RELATION",
            headerAlign: "center",
            align: "center",
            flex: 1,
            minWidth: 150,
            renderCell: ({ row }) => {
                const isReferrer = row.referral_by === userId;
                return (
                    <Box display="flex" gap="5px">
                        {isReferrer && <Chip label="Referred By Me" size="small" color="secondary" />}
                    </Box>
                );
            }
        });
    }

    columns.push(
        {
            field: "updated_at",
            headerName: "UPDATED AT",
            headerAlign: "center",
            align: "center",
            flex: 1,
            minWidth: 100,
            valueFormatter: params => params?.value ? params?.value.substring(0, 10) : ''
        },
        {
            field: "status",
            headerName: "STATUS",
            headerAlign: "center",
            align: "center",
            flex: 1,
            minWidth: 120,
            renderCell: ({ row: { status } }) => {
                return (
                    <Box
                        width="60%"
                        m="0 auto"
                        p="5px"
                        display="flex"
                        justifyContent="center"
                        backgroundColor={
                            status === "active"
                                ? colors.greenAccent[600]
                                : colors.redAccent[700]
                        }
                        borderRadius="4px"
                    >
                        <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
                            {status}
                        </Typography>
                    </Box>
                );
            },
        },
        {
            field: "action",
            headerName: "ACTION",
            headerAlign: "center",
            align: "center",
            flex: 1,
            minWidth: 130,
            renderCell: ({ row }) => {
                // Sales Executive can only edit salons where they are the referrer
                const canEdit = role === 'admin' || (role === 'sales_executive' && row.referral_by === userId);
                
                return (
                    <Box
                        m="0 auto"
                        p="5px"
                        display="flex"
                        justifyContent="center"
                        gap="8px"
                        width="100%"
                    >
                        {canEdit && (
                            <Button color="info" variant="contained"
                                onClick={() => handleActionEdit(row.id)}
                                sx={{ minWidth: "40px" }}
                            >
                                <DriveFileRenameOutlineOutlinedIcon />
                            </Button>
                        )}
                        {row.salon_code && (
                            <Button color="secondary" variant="contained"
                                onClick={() => handleActionView(row.salon_code)}
                                sx={{ minWidth: "40px" }}
                            >
                                <VisibilityOutlinedIcon />
                            </Button>
                        )}
                    </Box>
                );
            },
        }
    );
    return columns;
}
