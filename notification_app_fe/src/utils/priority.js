/**
 * Priority scoring for the Campus Notification Priority Inbox.
 *
 * Score = (typeWeight * 10) + recencyScore
 *
 * typeWeight:
 *   Placement → 3   (highest — career-defining)
 *   Result    → 2   (important — academic)
 *   Event     → 1   (lowest — informational)
 *
 * recencyScore:
 *   Exponential decay: e^(-ageHours / 24)
 *   Range (0, 1] — 1.0 means "just arrived"
 *   Half-life ≈ 24 hours
 *
 * The weight*10 gap ensures type hierarchy is never overridden purely
 * by recency — a very old Placement (≈30.00) still beats a fresh Event (≈11.00).
 */

const TYPE_WEIGHTS = {
  Placement: 3,
  Result:    2,
  Event:     1,
};

/**
 * Computes a priority score for a single notification.
 *
 * @param {{ Type: string, Timestamp: string }} notification
 * @returns {number}
 */
export function computePriorityScore(notification) {
  const weight = TYPE_WEIGHTS[notification.Type] ?? 0;

  // Parse timestamp — server sends "YYYY-MM-DD HH:mm:ss"
  const ts = new Date(notification.Timestamp.replace(" ", "T"));
  const ageMs    = Date.now() - ts.getTime();
  const ageHours = ageMs / (1000 * 60 * 60);

  // Clamp negative ages (future timestamps) to 0
  const clampedAge = Math.max(0, ageHours);
  const recencyScore = Math.exp(-clampedAge / 24);

  return weight * 10 + recencyScore;
}

/**
 * Returns the top-n highest-priority notifications from a list.
 * Uses a min-heap approach — O(k log n) for streaming datasets.
 *
 * For the sizes the campus app deals with we simply sort,
 * which is functionally identical and easier to read.
 *
 * @param {Array}  notifications  - Full notification list
 * @param {number} n              - How many to return (default 10)
 * @param {Set}    viewedIds      - Set of already-viewed notification IDs
 * @returns {Array} Top n notifications, sorted priority desc
 */
export function getTopN(notifications, n = 10, viewedIds = new Set()) {
  return notifications
    .filter(notif => !viewedIds.has(notif.ID))   // unread only
    .map(notif => ({
      ...notif,
      _score: computePriorityScore(notif),
    }))
    .sort((a, b) => b._score - a._score)
    .slice(0, n);
}

/**
 * Returns a human-readable label for the notification type.
 */
export function getTypeLabel(type) {
  return type || "Unknown";
}

/**
 * Returns the MUI colour token for each notification type.
 */
export function getTypeColor(type) {
  switch (type) {
    case "Placement": return "success";
    case "Result":    return "warning";
    case "Event":     return "info";
    default:          return "default";
  }
}
