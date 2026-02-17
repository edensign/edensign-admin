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
            field: "name",
            headerName: "Name",
            flex: 1,
            minWidth: 150
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1,
            minWidth: 200
        },
        {
            field: "message",
            headerName: "Message",
            flex: 2,
            minWidth: 300,
            renderCell: (params) => (
                <div style={{
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                }}>
                    {params.row.message}
                </div>
            )
        },
        {
            field: "created_at",
            headerName: "Date",
            flex: 1,
            minWidth: 150,
            renderCell: (params) => {
                const date = params.row.created_at;
                return date ? dayjs(date).format("DD MMM YYYY, hh:mm A") : "N/A";
            }
        }
    ];
};
