/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */

import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Toast(props) {
    const [state, setState] = React.useState({
        open: props.alerting,
        Transition: Slide
    });

    const handleClose = (reason) => {
        if (reason === "clickaway") {
            return;
        }
        setState({
            ...state,
            open: false,
        });
    };

    const action = (
        <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
        >
            <CloseIcon fontSize="small" />
        </IconButton>
    );

    return (
        <div>
            {props.alerting && <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={props.alerting}
                onClose={handleClose}
                autoHideDuration={2000}
                TransitionComponent={state.Transition}
                key={state.Transition.name}
            >
                <Alert severity={props.severity} sx={{ width: '100%' }} onClose={handleClose}>
                    {props.message}
                </Alert>
            </Snackbar>}
        </div>
    );
};
