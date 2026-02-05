/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use, reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
 */
import { useEffect, useState } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, List } from '@mui/material';
import { Checkbox, FormControlLabel, ListItem, ListItemText, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { Utility } from '../utility';

const ResponsiveDialog = ({ agreement, handleSubmitDialog, role }) => {
    const [openDialog, setOpenDialog] = useState(agreement === false && role === 'salon');
    const [checked, setChecked] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const isMobile = useMediaQuery("(max-width:480px)");
    const isTab = useMediaQuery("(max-width:920px)");
    const { getLocalStorage } = Utility();

    const docText = `This agreement ("Agreement") is entered into between the "Salon" and\n"Eden Sign".\n
1. Purpose:
The purpose of this Agreement is to establish a mutually beneficial\nrelationship between the Salon and the Eden Sign. Eden Sign will provide\nonline listing services for the Salon, promoting its services and assisting\nwith appointment scheduling.
    
2. Listing Services:
Eden Sign agrees to list the Salon's business information, including\nname, address, contact details, and service offerings, on its online\nplatform. Eden Sign will also provide the Salon with access to its\nappointment scheduling system, enabling clients to book appointments\nonline.
    
3. Salon Responsibilities:
The Salon agrees to provide accurate and up-to-date information about\nits business, including service descriptions, pricing, and availability. The\nSalon will promptly update Eden Sign in case of any changes. The Salon\nwill also ensure the availability of its staff during the scheduled\nappointment times.
    
4. Commission and Fees:
The Salon agrees to pay Eden Sign a commission or fee, as mutually\nagreed upon, for each successful appointment made through Eden Sign's\nonline scheduling system. The payment terms and commission structure\nwill be outlined in a separate agreement or as specified in Eden Sign's\nterms and conditions.
    
5. Intellectual Property:
Both parties acknowledge that all intellectual property rights, including\ntrademarks, logos, and copyrighted materials, belong to their respective\nowners. The Salon grants Eden Sign the right to use its business\ninformation and branding solely for the purpose of promoting the Salon on\nEden Sign online platform.
    
6. Confidentiality:
Both parties agree to treat any confidential information exchanged\nduring the course of this Agreement as strictly confidential. They shall\nnot disclose such information to any third party without prior written\nconsent, except when required by law.`

    const docText2 =
        `7. Term and Termination:
This Agreement will commence on the effective date and will remain\nin effect until terminated by either party. Either party may terminate\nthis Agreement by providing written notice to the other party within a\nreasonable time frame.
    
8. Limitation of Liability:
Neither party shall be liable for any indirect, incidental, or consequential\ndamages arising out of or in connection with this Agreement. The Salon\nacknowledges that Eden Sign does not guarantee any specific results or\nbusiness outcomes from its listing services.
    
9. Governing Law and Jurisdiction:
This Agreement shall be governed by and construed in accordance\nwith the laws of [Jurisdiction]. Any disputes arising out of or in connection\nwith this Agreement shall be submitted to the exclusive jurisdiction of the\ncourts in [salon's District/City].
    
10. Entire Agreement:
This Agreement constitutes the entire understanding between the Salon\nand the Eden Sign and supersedes any prior agreements or understandings,\nwhether written or verbal, relating to the subject matter herein.`;

    const handleSubmit = () => {
        try {
            let datevar = new Date();
            setOpenDialog(false);

            //using jsPDF library to generate pdf file
            let doc = new jsPDF();
            doc.text(docText, 15, 20);
            // Add new page
            doc.addPage();
            doc.text(docText2, 15, 20);

            doc.setFont("times");
            doc.setFontType("italic");
            doc.setTextColor(0, 0, 255);
            doc.text(`${getLocalStorage("auth")?.username}\n${datevar.toLocaleDateString()}`, 130, 180);
            let output = doc.output();

            handleSubmitDialog("agreement", `${getLocalStorage("auth")?.username}_Agreement${Math.ceil(Math.random() * 1000)}.pdf`, btoa(output));
        } catch (error) {
            throw error;
        }
        finally {
            setTimeout(() => {
                location.reload();
            }, 2000);
        }
    };

    useEffect(() => {
        if (openDialog) {
            setTimeout(() => {
                scrollToBottom("dialog-content");
            }, 1000);
        }
    }, []);

    const scrollToBottom = (id) => {
        const element = document.getElementById(id);
        element.scrollTo(0, element.scrollHeight);
    }

    const scrollToTop = (id) => {
        const element = document.getElementById(id);
        element.scrollTo(10, 10);
    }

    const handleAgreementClick = () => {
        const dialogBox = document.getElementById("dialog");
        dialogBox.style.top = "0";
        dialogBox.style.height = "100%";
        scrollToTop("dialog-content");
    }

    return (
        <div>
            <Dialog
                fullScreen={fullScreen}
                open={openDialog}
                aria-labelledby="responsive-dialog-title"
                sx={{ top: isMobile ? "38%" : isTab ? "30%" : "25%", height: isMobile ? "24%" : isTab ? "14%" : "35%" }}
                id="dialog"
            >
                <DialogTitle id="responsive-dialog-title" sx={{ textAlign: "center" }}>
                    This agreement ("Agreement") is entered into between the "Salon" and "Eden Sign".
                </DialogTitle>
                <DialogContent id="dialog-content">
                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        <ListItem alignItems="flex-start">
                            <ListItemText
                                primary="1. Purpose:"
                                secondary={
                                    <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
                                        The purpose of this Agreement is to establish a mutually beneficial relationship between the Salon and the Eden Sign. Eden Sign will provide online listing services for the Salon, promoting its services and assisting with appointment scheduling.
                                    </Typography>}
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <ListItem alignItems="flex-start">
                            <ListItemText
                                primary="2. Listing Services:"
                                secondary={
                                    <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
                                        Eden Sign agrees to list the Salon's business information, including name, address, contact details, and service offerings, on its online platform. Eden Sign will also provide the Salon with access to its appointment scheduling system, enabling clients to book appointments online.
                                    </Typography>}
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <ListItem alignItems="flex-start">
                            <ListItemText
                                primary="3. Salon Responsibilities:"
                                secondary={
                                    <Typography
                                        sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
                                        The Salon agrees to provide accurate and up-to-date information about its business, including service descriptions, pricing, and availability. The Salon will promptly update Eden Sign in case of any changes. The Salon will also ensure the availability of its staff during the scheduled appointment times.
                                    </Typography>}
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <ListItem alignItems="flex-start">
                            <ListItemText
                                primary="4. Commission and Fees:"
                                secondary={
                                    <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
                                        The Salon agrees to pay Eden Sign a commission or fee, as mutually agreed upon, for each successful appointment made through Eden Sign's online scheduling system. The payment terms and commission structure will be outlined in a separate agreement or as specified in Eden Sign's terms and conditions.
                                    </Typography>}
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <ListItem alignItems="flex-start">
                            <ListItemText
                                primary="5. Intellectual Property:"
                                secondary={
                                    <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
                                        Both parties acknowledge that all intellectual property rights, including trademarks, logos, and copyrighted materials, belong to their respective owners. The Salon grants Eden Sign the right to use its business information and branding solely for the purpose of promoting the Salon on Eden Sign online platform.
                                    </Typography>}
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <ListItem alignItems="flex-start">
                            <ListItemText
                                primary="6. Confidentiality:"
                                secondary={
                                    <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
                                        Both parties agree to treat any confidential information exchanged during the course of this Agreement as strictly confidential. They shall not disclose such information to any third party without prior written consent, except when required by law.
                                    </Typography>}
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <ListItem alignItems="flex-start">
                            <ListItemText
                                primary="7. Term and Termination:"
                                secondary={
                                    <Typography
                                        sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
                                        This Agreement will commence on the effective date and will remain in effect until terminated by either party. Either party may terminate this Agreement by providing written notice to the other party within a reasonable time frame.
                                    </Typography>}
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <ListItem alignItems="flex-start">
                            <ListItemText
                                primary="8. Limitation of Liability:"
                                secondary={
                                    <Typography
                                        sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
                                        Neither party shall be liable for any indirect, incidental, or consequential damages arising out of or in connection with this Agreement. The Salon acknowledges that Eden Sign does not guarantee any specific results or business outcomes from its listing services.
                                    </Typography>}
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <ListItem alignItems="flex-start">
                            <ListItemText
                                primary="9. Governing Law and Jurisdiction:"
                                secondary={
                                    <Typography
                                        sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
                                        This Agreement shall be governed by and construed in accordance with the laws of [Jurisdiction]. Any disputes arising out of or in connection with this Agreement shall be submitted to the exclusive jurisdiction of the courts in [salon's District/City].
                                    </Typography>}
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <ListItem alignItems="flex-start">
                            <ListItemText
                                primary="10. Entire Agreement:"
                                secondary={
                                    <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
                                        This Agreement constitutes the entire understanding between the Salon and the Eden Sign and supersedes any prior agreements or understandings, whether written or verbal, relating to the subject matter herein.
                                    </Typography>
                                }
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <ListItem alignItems="flex-start">
                            <ListItemText sx={{ marginBottom: "-10%" }}>
                                By checking the box below, the Salon and the Eden Sign agree to the terms and conditions outlined in this Agreement.&nbsp;&nbsp;&nbsp;&nbsp;
                                <span style={{ color: "grey", textDecoration: "underline", cursor: "pointer", fontSize: "11px" }}
                                    onClick={handleAgreementClick}>Read Full Agreement. </span>
                            </ListItemText>
                        </ListItem>
                    </List>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "space-around" }}>
                    <FormControlLabel label="I Agree To The Terms & Conditions" sx={{ gridColumn: isMobile ? "span 2" : "" }}
                        control={
                            <Checkbox color="default"
                                onChange={(event, value) => {
                                    setChecked(value);
                                }}
                                value={checked}
                            />
                        } />
                    <Button onClick={handleSubmit} color='info' variant='outlined' disabled={!checked}>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div >
    );
}

export default ResponsiveDialog;
