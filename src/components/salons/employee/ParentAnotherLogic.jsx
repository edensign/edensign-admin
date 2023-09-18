/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use, reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
*/

import React, { useState, useEffect } from "react";
import { Box, Divider, Chip, useMediaQuery } from "@mui/material";

import ChildEmployeeFormComponent from "./ChildAnotherLogic";


const ParentEmployeeFormComponent = ({ masterValues, setMasterValues, services, updatedValues = [] }) => {

    const [defaultEmployeeCount, setDefaultEmployeeCount] = useState([1, 2, 3]);
    const isNonMobile = useMediaQuery("(min-width:600px)");
    let ordinal;


    //This function returns the ordinal & the number itself, default ordinal is 'th'
    function getOrdinal(n) {
        let ord = 'th';

        if (n % 10 == 1 && n % 100 != 11) {
            ord = 'st';
        } else if (n % 10 == 2 && n % 100 != 12) {
            ord = 'nd';
        } else if (n % 10 == 3 && n % 100 != 13) {
            ord = 'rd';
        }
        return [n, ord];
    }


    //This function will be called when user clicks on addNewEmployee chip
    const createChildEmployee = (id) => {
        const canAddEmployee = id > (defaultEmployeeCount.length - 1);
        ordinal = getOrdinal(id + 1);

        // Create new child employee form component you want to append
        return (
            <React.Fragment key={id}>
                <ChildEmployeeFormComponent
                    key={id}
                    index={id}
                    services={services}
                    updatedValues={updatedValues}
                    masterValues={masterValues}
                    setMasterValues={setMasterValues}
                />
                <Divider sx={{ width: "99%" }}>
                    <Chip color="info" label={`${canAddEmployee ? `Click Here To Add More Salon Employees` : `${ordinal.toString().replace(/,/g, "")} Employee Details`} `}
                        onClick={canAddEmployee ? () =>
                            setDefaultEmployeeCount([
                                ...defaultEmployeeCount,
                                id + 1
                            ])
                            : null}
                        sx={{
                            fontSize: "13px", fontWeight: "600", letterSpacing: "0.2em", padding: "12px",
                            cursor: canAddEmployee ? 'pointer' : 'default'
                        }}
                    />
                </Divider>
            </React.Fragment>
        );
    };

    useEffect(() => {
        if (updatedValues.length > 3) {
            setDefaultEmployeeCount([...defaultEmployeeCount, updatedValues.length]);
        }
    }, [updatedValues?.length]);


    return (
        <Box id="container" display="flex" flexDirection="column" justifyContent="center" alignItems="center" marginTop="30px">
            <Divider sx={{ width: "99%" }}>
                <Chip color="info" label="1st Employee Details"
                    sx={{
                        fontSize: "13px", fontWeight: "600", letterSpacing: "0.2em", padding: "12px", textTransform: "capitalize"
                    }}
                />
            </Divider>
            {
                defaultEmployeeCount.length && defaultEmployeeCount.map(emp => createChildEmployee(emp))
            }
        </Box>
    );
}

export default ParentEmployeeFormComponent;
