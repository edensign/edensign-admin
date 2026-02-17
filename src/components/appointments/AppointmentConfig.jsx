/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use, reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import dayjs from "dayjs";

export const datagridColumns = () => {
    return [
        {
            field: "id",
            headerName: "ID",
            width: 60
        },
        {
            field: "customer_name",
            headerName: "Customer",
            flex: 1,
            minWidth: 130,
            renderCell: (params) => params.row.customer_name || "Guest"
        },
        {
            field: "customer_contact",
            headerName: "Customer Contact",
            flex: 1,
            minWidth: 120,
            renderCell: (params) => params.row.customer_contact || "N/A"
        },
        {
            field: "salon_name",
            headerName: "Salon",
            flex: 1,
            minWidth: 150,
            renderCell: (params) => params.row.salon_name || "N/A"
        },
        {
            field: "employee_name",
            headerName: "Stylist",
            flex: 1,
            minWidth: 120,
            renderCell: (params) => params.row.employee_name || "N/A"
        },
        {
            field: "date",
            headerName: "Date",
            flex: 1,
            minWidth: 120,
            renderCell: (params) => {
                const date = params.row.date;
                return date ? dayjs(date).format("DD MMM YYYY") : "N/A";
            }
        },
        {
            field: "time_slot",
            headerName: "Time Slot",
            flex: 1,
            minWidth: 100
        },
        {
            field: "booked_for",
            headerName: "Booked For",
            flex: 1,
            minWidth: 100,
            renderCell: (params) => {
                const value = params.row.booked_for;
                return value ? value.charAt(0).toUpperCase() + value.slice(1).replace("_", " ") : "Self";
            }
        },

    ];
};
