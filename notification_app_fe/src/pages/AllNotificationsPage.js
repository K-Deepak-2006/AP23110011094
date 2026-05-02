

import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Pagination,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Divider,
  Stack,
} from '@mui/material';
import {
  DoneAllOutlined as MarkAllIcon,
} from '@mui/icons-material';
import { useNotifications } from '../state/NotificationContext';
import NotificationCard from '../components/NotificationCard';
import { fLog } from '../middleware/logger';

const FILTER_TABS = [
  { label: 'All',        value: '' },
  { label: 'Placement',  value: 'Placement' },
  { label: 'Result',     value: 'Result' },
  { label: 'Event',      value: 'Event' },
];

const PAGE_SIZE_OPTIONS = [10, 20, 30, 50];

export default function AllNotificationsPage() {
  const { notifications, loading, error, viewedIds, markViewed, markAllViewed } = useNotifications();

  const [activeTab, setActiveTab]     = useState('');
  const [pageSize, setPageSize]       = useState(20);
  const [currentPage, setCurrentPage] = useState(1);


  useEffect(() => {
    fLog('info', 'page', 'All Notifications page mounted');
  }, []);


  const filtered = useMemo(() => {
    return activeTab
      ? notifications.filter(n => n.Type === activeTab)
      : notifications;
  }, [notifications, activeTab]);


  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated  = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const unreadOnPage = paginated.filter(n => !viewedIds.has(n.ID)).length;

  const handleTabChange = async (_, newVal) => {
    setActiveTab(newVal);
    setCurrentPage(1);
    await fLog('info', 'page', `Filter changed to "${newVal || 'All'}" on All Notifications page`);
  };

  const handlePageSizeChange = async (e) => {
    const val = Number(e.target.value);
    setPageSize(val);
    setCurrentPage(1);
    await fLog('debug', 'page', `Page size changed to ${val} on All Notifications page`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  }

  return (
    <Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            All Notifications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filtered.length} notification{filtered.length !== 1 ? 's' : ''} · {filtered.filter(n => !viewedIds.has(n.ID)).length} unread
          </Typography>
        </Box>

        <Button
          id="mark-all-read-btn"
          variant="outlined"
          size="small"
          startIcon={<MarkAllIcon />}
          onClick={markAllViewed}
          disabled={unreadOnPage === 0}
        >
          Mark all read
        </Button>
      </Box>


      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
        variant="scrollable"
        scrollButtons="auto"
        id="notification-filter-tabs"
      >
        {FILTER_TABS.map(tab => (
          <Tab key={tab.value} label={tab.label} value={tab.value} id={`tab-${tab.value || 'all'}`} />
        ))}
      </Tabs>


      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="page-size-label">Show</InputLabel>
          <Select
            labelId="page-size-label"
            id="page-size-select"
            value={pageSize}
            label="Show"
            onChange={handlePageSizeChange}
          >
            {PAGE_SIZE_OPTIONS.map(n => (
              <MenuItem key={n} value={n}>{n} per page</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>


      {paginated.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography color="text.secondary">No notifications here yet.</Typography>
        </Box>
      ) : (
        paginated.map(notification => (
          <NotificationCard
            key={notification.ID}
            notification={notification}
            isRead={viewedIds.has(notification.ID)}
            onRead={markViewed}
          />
        ))
      )}


      {totalPages > 1 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Stack alignItems="center">
            <Pagination
              id="notifications-pagination"
              count={totalPages}
              page={currentPage}
              onChange={(_, p) => setCurrentPage(p)}
              color="primary"
              shape="rounded"
            />
          </Stack>
        </>
      )}
    </Box>
  );
}
