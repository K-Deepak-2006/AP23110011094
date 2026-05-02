/**
 * TypeFilterPage
 * --------------
 * Dedicated page for a single notification type:
 *   /type/Placement  →  only placement alerts
 *   /type/Result     →  only result announcements
 *   /type/Event      →  only event invitations
 *
 * Uses the URL param `:type` so no logic duplication is needed.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Pagination,
  Stack,
  Chip,
  Divider,
  Button,
} from '@mui/material';
import {
  WorkOutlined as PlacementIcon,
  SchoolOutlined as ResultIcon,
  EventOutlined as EventIcon,
  ArrowBackOutlined as BackIcon,
} from '@mui/icons-material';
import { useNotifications } from '../state/NotificationContext';
import NotificationCard from '../components/NotificationCard';
import { getTypeColor } from '../utils/priority';
import { fLog } from '../middleware/logger';

const TYPE_META = {
  Placement: { icon: <PlacementIcon />, description: 'Job and internship opportunities from recruiters visiting campus.' },
  Result:    { icon: <ResultIcon />,    description: 'Academic result announcements, grade releases, and evaluations.' },
  Event:     { icon: <EventIcon />,     description: 'Upcoming campus events, workshops, and fest announcements.' },
};

const PAGE_SIZE = 15;

export default function TypeFilterPage() {
  const { type }    = useParams();
  const navigate    = useNavigate();
  const { notifications, loading, error, viewedIds, markViewed } = useNotifications();

  const [currentPage, setCurrentPage] = useState(1);

  const meta  = TYPE_META[type];
  const color = getTypeColor(type);

  // Redirect if type is invalid
  useEffect(() => {
    if (!meta) {
      navigate('/notifications', { replace: true });
      return;
    }
    fLog('info', 'page', `${type} filter page mounted`);
    setCurrentPage(1);
  }, [type, meta, navigate]);

  const filtered = useMemo(
    () => notifications.filter(n => n.Type === type),
    [notifications, type]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  if (!meta) return null;

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

  const unreadCount = filtered.filter(n => !viewedIds.has(n.ID)).length;

  return (
    <Box>
      {/* Back */}
      <Button
        id={`back-from-${type.toLowerCase()}-btn`}
        startIcon={<BackIcon />}
        onClick={() => navigate('/notifications')}
        size="small"
        sx={{ mb: 2, color: 'text.secondary' }}
      >
        All Notifications
      </Button>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
        <Chip icon={meta.icon} label={type} color={color} size="medium" />
        <Typography variant="h5" fontWeight={700}>
          {type} Notifications
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" mb={2}>
        {meta.description}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        {filtered.length} total · {unreadCount} unread
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* List */}
      {paginated.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography color="text.secondary">
            No {type.toLowerCase()} notifications yet.
          </Typography>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Stack alignItems="center">
            <Pagination
              id={`${type.toLowerCase()}-pagination`}
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
