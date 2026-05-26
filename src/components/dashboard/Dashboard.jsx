/**
 * Copyright © 2023, Eden Sign Inc. ALL RIGHTS RESERVED.
 *
 * This software is the confidential information of Eden Sign Inc., and is licensed as
 * restricted rights software. The use,reproduction, or disclosure of this software is subject to
 * restrictions set forth in your license agreement with Eden Sign.
*/

import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import StorefrontIcon from '@mui/icons-material/Storefront';
import HandshakeIcon from '@mui/icons-material/Handshake';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { ResponsiveBar } from "@nivo/bar";

import { tokens, themeSettings } from "../../theme";
import StatBox from "../common/StatBox";
import API from "../../apis";
import { Utility } from "../utility";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { typography } = themeSettings(theme.palette.mode);
  const { getRole } = Utility();
  const role = getRole();

  const [stats, setStats] = useState({
    totalCreated: 0,
    totalReferred: 0,
    totalActive: 0
  });

  const [adminStats, setAdminStats] = useState({
    totalSalons: 0,
    totalSales: 0,
    totalClients: 0,
    totalProducts: 0,
    graphData: []
  });

  useEffect(() => {
    if (role === 'sales_executive') {
      API.SalonAPI.getSalonStats()
        .then(res => {
          if (res.data.status === 'Success') {
            setStats(res.data.data);
          }
        })
        .catch(err => console.error("Error fetching SE stats:", err));
    } else if (role === 'admin') {
      API.DashboardAPI.getAdminStats()
        .then(res => {
          if (res.data.status === 'Success') {
            setAdminStats(res.data.data);
          }
        })
        .catch(err => console.error("Error fetching Admin stats:", err));
    }
  }, [role]);

  return (
    <Box m="10px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          fontFamily={typography.fontFamily}
          fontSize={typography.h2.fontSize}
          color={colors.grey[100]}
          fontWeight="bold"
          display="inline-block"
        >
          {role === 'sales_executive' ? 'Sales Executive Dashboard' : 'Admin Dashboard'}
        </Typography>

        <Box>
          <Typography
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 15px",
              borderRadius: "6px"
            }}
          >
            Welcome Back!
          </Typography>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
        mt="20px"
      >
        {role === 'sales_executive' ? (
          <>
            <Box
              gridColumn="span 4"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={stats.totalCreated.toString()}
                subtitle="Salons Created By Me"
                icon={
                  <StorefrontIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
            <Box
              gridColumn="span 4"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={stats.totalReferred.toString()}
                subtitle="Salons Referred By Me"
                icon={
                  <HandshakeIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
            <Box
              gridColumn="span 4"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={stats.totalActive.toString()}
                subtitle="Active Salons"
                icon={
                  <CheckCircleOutlineIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
          </>
        ) : (
          <>
            {/* ROW 1 - DYNAMIC ADMIN STATS */}
            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={adminStats.totalSalons.toString()}
                subtitle="Total Salons"
                progress="0.75"
                increase="+14%"
                icon={
                  <StorefrontIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={adminStats.totalSales.toString()}
                subtitle="Total Revenue"
                progress="0.50"
                increase="+21%"
                icon={
                  <PointOfSaleIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={adminStats.totalClients.toString()}
                subtitle="Total Clients"
                progress="0.30"
                increase="+5%"
                icon={
                  <PersonAddIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={adminStats.totalProducts.toString()}
                subtitle="Total Products"
                progress="0.80"
                increase="+43%"
                icon={
                  <TrafficIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>

            {/* ROW 2 - BAR CHART FOR SALONS CREATED PER MONTH */}
            <Box
              gridColumn="span 12"
              gridRow="span 2"
              backgroundColor={colors.primary[400]}
              p="30px"
            >
              <Typography variant="h5" fontWeight="600" color={colors.grey[100]} mb="15px">
                Salons Onboarded (This Year)
              </Typography>
              <Box height="250px">
                <ResponsiveBar
                  data={adminStats.graphData}
                  theme={{
                    axis: {
                      domain: { line: { stroke: colors.grey[100] } },
                      legend: { text: { fill: colors.grey[100] } },
                      ticks: { line: { stroke: colors.grey[100], strokeWidth: 1 }, text: { fill: colors.grey[100] } }
                    },
                    legends: { text: { fill: colors.grey[100] } },
                    tooltip: { container: { color: colors.primary[500] } }
                  }}
                  keys={['salons']}
                  indexBy="month"
                  margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
                  padding={0.3}
                  valueScale={{ type: 'linear' }}
                  indexScale={{ type: 'band', round: true }}
                  colors={{ scheme: 'nivo' }}
                  defs={[
                    { id: 'dots', type: 'patternDots', background: 'inherit', color: '#38bcb2', size: 4, padding: 1, stagger: true },
                    { id: 'lines', type: 'patternLines', background: 'inherit', color: '#eed312', rotation: -45, lineWidth: 6, spacing: 10 }
                  ]}
                  borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Month',
                    legendPosition: 'middle',
                    legendOffset: 32
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'New Salons',
                    legendPosition: 'middle',
                    legendOffset: -40
                  }}
                  labelSkipWidth={12}
                  labelSkipHeight={12}
                  labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                  legends={[
                    {
                      dataFrom: 'keys',
                      anchor: 'bottom-right',
                      direction: 'column',
                      justify: false,
                      translateX: 120,
                      translateY: 0,
                      itemsSpacing: 2,
                      itemWidth: 100,
                      itemHeight: 20,
                      itemDirection: 'left-to-right',
                      itemOpacity: 0.85,
                      symbolSize: 20,
                      effects: [{ on: 'hover', style: { itemOpacity: 1 } }]
                    }
                  ]}
                  role="application"
                  ariaLabel="Nivo bar chart demo"
                  barAriaLabel={e => e.id + ": " + e.formattedValue + " in month: " + e.indexValue}
                />
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

export default Dashboard;
