import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  StarOutlined as StarIcon,
  WorkOutlined as PlacementIcon,
  SchoolOutlined as ResultIcon,
  EventOutlined as EventIcon,
} from '@mui/icons-material';
import { useNotifications } from '../state/NotificationContext';
import NotificationCard from '../components/NotificationCard';
import { getTopN } from '../utils/priority';
import { fLog } from '../middleware/logger';

const N_OPTIONS = [5, 10, 15, 20];

function ScoringLegend() {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        flexWrap: 'wrap',
        p: 1.5,
        borderRadius: 2,
        bgcolor: 'rgba(79, 70, 229, 0.08)',
        border: '1px solid rgba(79, 70, 229, 0.2)',
        mb: 2,
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ width: '100%', mb: 0.5, fontWeight: 600 }}>
        Priority order:
      </Typography>
      {[
        { icon: <PlacementIcon sx={{ fontSize: 14 }} />, label: 'Placement', color: 'success' },
        { icon: <ResultIcon    sx={{ fontSize: 14 }} />, label: 'Result',    color: 'warning' },
        { icon: <EventIcon     sx={{ fontSize: 14 }} />, label: 'Event',     color: 'info'    },
      ].map(({ icon, label, color }) => (
        <Chip key={label} icon={icon} label={label} color={color} size="small" sx={{ height: 22, fontSize: '0.72rem' }} />
      ))}
      <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center', ml: 0.5 }}>
        + recency (24 h half-life)
      </Typography>
    </Box>
  );
}

export default function PriorityInboxPage() {
  const { notifications, loading, error, viewedIds, markViewed } = useNotifications();
  const [topN, setTopN] = useState(10);

  useEffect(() => {
    fLog('info', 'page', 'Priority Inbox mounted');
  }, []);

  const priorityList = useMemo(() => {
    return getTopN(notifications, topN, viewedIds);
  }, [notifications, topN, viewedIds]);

  const handleNChange = async (_, newVal) => {
    if (!newVal) return;
    setTopN(newVal);
    await fLog('info', 'page', `Priority Inbox top-N changed to ${newVal}`);
  };

  const handleRead = async (id) => {
    markViewed(id);
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

  const totalUnread = notifications.filter(n => !viewedIds.has(n.ID)).length;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
        <StarIcon color="warning" />
        <Typography variant="h5" fontWeight={700}>
          Priority Inbox
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Top {topN} unread notifications ranked by importance and freshness.
        {totalUnread > topN && ` (${totalUnread - topN} more unread below the cut-off)`}
      </Typography>

      {totalUnread > 0 && (
        <Tooltip title={`${totalUnread} unread out of ${notifications.length} total`} arrow>
          <Box mb={2}>
            <LinearProgress
              variant="determinate"
              value={Math.round((totalUnread / notifications.length) * 100)}
              color="primary"
              sx={{ height: 6, borderRadius: 3 }}
            />
            <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
              {totalUnread} unread · {notifications.length - totalUnread} read
            </Typography>
          </Box>
        </Tooltip>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          Show top:
        </Typography>
        <ToggleButtonGroup
          id="top-n-selector"
          value={topN}
          exclusive
          onChange={handleNChange}
          size="small"
          aria-label="Select number of priority notifications"
        >
          {N_OPTIONS.map(n => (
            <ToggleButton key={n} value={n} id={`top-n-${n}`}>
              {n}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      <ScoringLegend />

      <Divider sx={{ mb: 2 }} />

      {priorityList.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <StarIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography color="text.secondary" variant="h6">
            You're all caught up!
          </Typography>
          <Typography color="text.secondary" variant="body2">
            No unread notifications at the moment.
          </Typography>
        </Box>
      ) : (
        priorityList.map((notification, idx) => (
          <Box key={notification.ID} sx={{ position: 'relative' }}>
            <Box
              sx={{
                position: 'absolute',
                left: -28,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 22,
                height: 22,
                borderRadius: '50%',
                bgcolor: idx < 3 ? 'warning.main' : 'primary.main',
                color: '#fff',
                display: { xs: 'none', lg: 'flex' },
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: 700,
                zIndex: 1,
              }}
            >
              {idx + 1}
            </Box>
            <NotificationCard
              notification={notification}
              isRead={viewedIds.has(notification.ID)}
              onRead={handleRead}
            />
          </Box>
        ))
      )}
    </Box>
  );
}
