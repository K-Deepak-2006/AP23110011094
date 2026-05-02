
import React, { useCallback } from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Typography,
  Box,
  Tooltip,
} from '@mui/material';
import {
  WorkOutlined as PlacementIcon,
  SchoolOutlined as ResultIcon,
  EventOutlined as EventIcon,
  FiberManualRecord as UnreadDot,
} from '@mui/icons-material';
import { getTypeColor } from '../utils/priority';
import { fLog } from '../middleware/logger';


function TypeIcon({ type, size = 18 }) {
  const sx = { fontSize: size };
  switch (type) {
    case 'Placement': return <PlacementIcon sx={sx} />;
    case 'Result':    return <ResultIcon    sx={sx} />;
    case 'Event':     return <EventIcon     sx={sx} />;
    default:          return null;
  }
}


function formatTimestamp(raw) {
  if (!raw) return '';
  try {
    const d = new Date(raw.replace(' ', 'T'));
    return d.toLocaleString(undefined, {
      month:  'short',
      day:    'numeric',
      hour:   '2-digit',
      minute: '2-digit',
    });
  } catch {
    return raw;
  }
}


function relativeTime(raw) {
  if (!raw) return '';
  try {
    const diff = Date.now() - new Date(raw.replace(' ', 'T')).getTime();
    const mins  = Math.floor(diff / 60_000);
    const hours = Math.floor(mins / 60);
    const days  = Math.floor(hours / 24);
    if (days  > 0)  return `${days}d ago`;
    if (hours > 0)  return `${hours}h ago`;
    if (mins  > 0)  return `${mins}m ago`;
    return 'just now';
  } catch {
    return '';
  }
}

export default function NotificationCard({ notification, isRead, onRead }) {
  const { ID, Type, Message, Timestamp } = notification;
  const color = getTypeColor(Type);

  const handleClick = useCallback(async () => {
    if (!isRead) {
      onRead(ID);
      await fLog(
        'info',
        'component',
        `Notification opened — id=${ID}, type=${Type}, message="${Message}"`
      );
    }
  }, [ID, Type, Message, isRead, onRead]);

  return (
    <Card
      id={`notification-${ID}`}
      className="animate-fade-in-up"
      sx={{
        mb: 1.5,
        position: 'relative',
        borderLeft: isRead ? undefined : `3px solid`,
        borderLeftColor: isRead ? undefined : `${color}.main`,
        bgcolor: isRead ? 'background.paper' : 'rgba(79, 70, 229, 0.02)',
        opacity: isRead ? 0.75 : 1,
        cursor: 'pointer',
      }}
    >
      <CardActionArea onClick={handleClick} sx={{ borderRadius: 'inherit' }}>
        <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">

            {!isRead && (
              <UnreadDot
                color="primary"
                sx={{ fontSize: 10, flexShrink: 0 }}
                aria-label="Unread notification"
              />
            )}


            <Chip
              icon={<TypeIcon type={Type} size={14} />}
              label={Type}
              color={color}
              size="small"
              sx={{ height: 22, fontSize: '0.72rem' }}
            />


            <Typography
              variant="body2"
              sx={{
                flex: 1,
                fontWeight: isRead ? 400 : 600,
                color: isRead ? 'text.secondary' : 'text.primary',
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={Message}
            >
              {Message}
            </Typography>


            <Tooltip title={formatTimestamp(Timestamp)} arrow placement="top">
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ flexShrink: 0, fontStyle: 'italic' }}
              >
                {relativeTime(Timestamp)}
              </Typography>
            </Tooltip>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
