

import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Tooltip,
  Box,
} from '@mui/material';
import {
  MenuOutlined as MenuIcon,
  NotificationsOutlined as BellIcon,
  RefreshOutlined as RefreshIcon,
} from '@mui/icons-material';
import { useNotifications } from '../state/NotificationContext';
import { DRAWER_WIDTH } from './Sidebar';

export default function TopBar({ onMenuClick }) {
  const { unreadCount, reload, loading } = useNotifications();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml:    { md: `${DRAWER_WIDTH}px` },
        zIndex: (theme) => theme.zIndex.drawer - 1,
      }}
    >
      <Toolbar sx={{ gap: 1 }}>

        <IconButton
          edge="start"
          color="inherit"
          onClick={onMenuClick}
          sx={{ display: { md: 'none' } }}
          aria-label="Open navigation menu"
          id="menu-toggle-btn"
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, color: 'text.primary' }}>
          Campus<Box component="span" color="primary.main">Alert</Box>
        </Typography>


        <Tooltip title="Refresh notifications" arrow>
          <span>
            <IconButton
              color="inherit"
              onClick={reload}
              disabled={loading}
              id="refresh-btn"
              aria-label="Refresh notifications"
            >
              <RefreshIcon
                sx={{
                  animation: loading ? 'spin 1s linear infinite' : 'none',
                  '@keyframes spin': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
                }}
              />
            </IconButton>
          </span>
        </Tooltip>


        <Tooltip title={`${unreadCount} unread`} arrow>
          <IconButton color="inherit" id="unread-bell-btn" aria-label="Unread notifications">
            <Badge badgeContent={unreadCount} color="error" max={99}>
              <BellIcon />
            </Badge>
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
