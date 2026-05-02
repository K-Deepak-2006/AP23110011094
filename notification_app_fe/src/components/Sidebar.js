

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Badge,
  Divider,
  Avatar,
} from '@mui/material';
import {
  NotificationsOutlined as AllIcon,
  StarOutlined as PriorityIcon,
  WorkOutlined as PlacementIcon,
  SchoolOutlined as ResultIcon,
  EventOutlined as EventIcon,
  CampaignOutlined as LogoIcon,
} from '@mui/icons-material';
import { useNotifications } from '../state/NotificationContext';

const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
  { label: 'All Notifications', path: '/notifications', icon: <AllIcon /> },
  { label: 'Priority Inbox',   path: '/priority',       icon: <PriorityIcon /> },
  { label: 'Placements',       path: '/type/Placement', icon: <PlacementIcon /> },
  { label: 'Results',          path: '/type/Result',    icon: <ResultIcon /> },
  { label: 'Events',           path: '/type/Event',     icon: <EventIcon /> },
];

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { unreadCount } = useNotifications();

  const handleNav = (path) => {
    navigate(path);
    if (onMobileClose) onMobileClose();
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
          <LogoIcon sx={{ fontSize: 20 }} />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
            CampusAlert
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Notification Hub
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mx: 2, mb: 1 }} />


      <List sx={{ px: 1, flex: 1 }}>
        {NAV_ITEMS.map(({ label, path, icon }) => {
          const active = location.pathname === path ||
            (path === '/notifications' && location.pathname === '/');

          const showBadge = label === 'All Notifications' && unreadCount > 0;

          return (
            <ListItem key={path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                id={`nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => handleNav(path)}
                selected={active}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: 'rgba(79, 70, 229, 0.08)',
                    color: 'primary.main',
                    '& .MuiListItemIcon-root': { color: 'primary.main' },
                    '&:hover': {
                      bgcolor: 'rgba(79, 70, 229, 0.12)',
                    }
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {showBadge ? (
                    <Badge badgeContent={unreadCount} color="error" max={99}>
                      {icon}
                    </Badge>
                  ) : icon}
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant="body2" sx={{ fontWeight: 500 }}>{label}</Typography>}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>


      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary" display="block">
          Polls every 30s for new alerts
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
        open
      >
        {drawerContent}
      </Drawer>


      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}

export { DRAWER_WIDTH };
