/**
 * Copyright © 2026, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * System Config Panel
 * Full-page dashboard component for managing AI Page Agent configurations.
 */

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
  Snackbar,
  IconButton,
  InputAdornment,
  CircularProgress
} from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';

import { tokens, themeSettings } from "../../theme";
import API from "../../apis";

const SystemConfig = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { typography } = themeSettings(theme.palette.mode);

  // Form States
  const [enabled, setEnabled] = useState(true);

  // UI States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Load current configuration
  const loadConfig = () => {
    setLoading(true);
    API.SystemConfigAPI.getPageAgentConfig()
      .then(res => {
        if (res.status === 'Success' && res.data) {
          const config = res.data;
          setEnabled(!!config.enabled);
        }
      })
      .catch(err => {
        console.error("Error loading system config:", err);
        showToast("Failed to load settings from server.", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    
    const payload = {
      enabled
    };

    API.SystemConfigAPI.updatePageAgentConfig(payload)
      .then(res => {
        if (res.status === 'Success') {
          showToast("Configuration saved successfully!", "success");
        } else {
          showToast(res.msg || "Failed to save configuration", "warning");
        }
      })
      .catch(err => {
        console.error("Error saving system config:", err);
        showToast("Error communicating with server: " + (err.message || err), "error");
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const showToast = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
        <CircularProgress sx={{ color: colors.blueAccent[500] }} />
      </Box>
    );
  }

  return (
    <Box m="20px">
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
        <Box display="flex" alignItems="center" gap={1.5}>
          <PsychologyOutlinedIcon sx={{ color: colors.blueAccent[500], fontSize: "32px" }} />
          <Typography
            fontFamily={typography.fontFamily}
            fontSize={typography.h2.fontSize}
            color={colors.grey[100]}
            fontWeight="bold"
          >
            System Settings
          </Typography>
        </Box>
        <Button
          variant="outlined"
          color="info"
          startIcon={<RefreshIcon />}
          onClick={loadConfig}
          sx={{ borderRadius: "6px" }}
        >
          Reload
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Main Settings Card */}
        <Grid item xs={12} md={8}>
          <Card sx={{ backgroundColor: colors.primary[400], borderRadius: "12px" }}>
            <CardContent>
              <Typography variant="h5" fontWeight="600" color={colors.grey[100]} mb="20px">
                AI Page Agent Configuration
              </Typography>
              <Divider sx={{ mb: "20px" }} />

              <form onSubmit={handleSave}>
                <Grid container spacing={3}>
                  {/* Toggle Switch */}
                  <Grid item xs={12}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" p="10px" sx={{ backgroundColor: "rgba(0,0,0,0.06)", borderRadius: "8px" }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="600" color={colors.grey[100]}>
                          Enable AI Page Agent
                        </Typography>
                        <Typography variant="body2" color={colors.grey[300]}>
                          When enabled, the "Ask AI" concierge search bar is shown on the website home page.
                        </Typography>
                      </Box>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={enabled}
                            onChange={(e) => setEnabled(e.target.checked)}
                            color="success"
                          />
                        }
                        label={enabled ? "RUNNING" : "TURNED OFF"}
                        sx={{ ml: 0 }}
                      />
                    </Box>
                  </Grid>



                  {/* Actions */}
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="flex-end" gap={2} mt="10px">
                      <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        startIcon={<SaveIcon />}
                        disabled={saving}
                        sx={{ px: 4, py: 1, borderRadius: "6px", fontWeight: "bold" }}
                      >
                        {saving ? "Saving..." : "Save Configuration"}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Side Panel: Information/Status */}
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: colors.primary[400], borderRadius: "12px", height: "100%" }}>
            <CardContent>
              <Typography variant="h5" fontWeight="600" color={colors.grey[100]} mb="20px">
                System Status
              </Typography>
              <Divider sx={{ mb: "20px" }} />

              <Box mb="25px">
                <Typography variant="subtitle2" color={colors.grey[300]}>
                  PAGE AGENT FUNCTION
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mt="5px">
                  <span
                    style={{
                      display: "inline-block",
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: enabled ? "#4caf50" : "#f44336",
                      boxShadow: enabled ? "0 0 8px #4caf50" : "0 0 8px #f44336"
                    }}
                  />
                  <Typography variant="body1" fontWeight="bold" color={enabled ? "#4caf50" : "#f44336"}>
                    {enabled ? "ACTIVE (Running on portal)" : "DISABLED (Hidden/Removed)"}
                  </Typography>
                </Box>
              </Box>

              <Alert severity={enabled ? "info" : "warning"} sx={{ borderRadius: "8px" }}>
                {enabled
                  ? "The AI Page Agent is running. Users on the Eden Sign homepage will see the 'Ask AI' widget to interact and navigate the application via Natural Language."
                  : "The AI Page Agent is turned off. The portal has automatically fallen back to the traditional premium directory search input."
                }
              </Alert>

              <Box mt="30px">
                <Typography variant="subtitle2" fontWeight="600" color={colors.grey[100]} mb="10px">
                  Deployment Notes
                </Typography>
                <Typography variant="body2" color={colors.grey[300]} sx={{ lineHeight: 1.6 }}>
                  Configuration changes take effect instantly. The AI Page Agent uses the OpenRouter credentials and model configured securely in the server environment variables.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Toast Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', borderRadius: "8px" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SystemConfig;
