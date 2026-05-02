
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, Toolbar } from '@mui/material';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import theme from './theme/theme';
import { NotificationProvider } from './state/NotificationContext';
import Sidebar, { DRAWER_WIDTH } from './components/Sidebar';
import TopBar from './components/TopBar';
import AllNotificationsPage from './pages/AllNotificationsPage';
import PriorityInboxPage from './pages/PriorityInboxPage';
import TypeFilterPage from './pages/TypeFilterPage';

function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <TopBar onMenuClick={() => setMobileOpen(true)} />

      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />


      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { md: `${DRAWER_WIDTH}px` },
          minWidth: 0,
        }}
      >
        <Toolbar />
        <Box
          sx={{
            maxWidth: 860,
            mx: 'auto',
            px: { xs: 2, sm: 3 },
            py: 3,
            pl: { lg: 5 },   /* extra left padding to clear rank badges */
          }}
        >
          <Routes>
            <Route path="/"                element={<Navigate to="/notifications" replace />} />
            <Route path="/notifications"   element={<AllNotificationsPage />} />
            <Route path="/priority"        element={<PriorityInboxPage />} />
            <Route path="/type/:type"      element={<TypeFilterPage />} />

            <Route path="*"               element={<Navigate to="/notifications" replace />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NotificationProvider>
          <AppShell />
        </NotificationProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
