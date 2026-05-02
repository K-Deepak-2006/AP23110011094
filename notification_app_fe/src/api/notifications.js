
import { fLog } from '../middleware/logger';

const BASE_URL = "http://20.207.122.201/evaluation-service/notifications";

export async function fetchNotifications({
  limit = 10,
  page = 1,
  notification_type = "",
} = {}) {
  const params = new URLSearchParams({ limit, page });
  if (notification_type) {
    params.append("notification_type", notification_type);
  }

  const url = `${BASE_URL}?${params.toString()}`;

  await fLog(
    "info",
    "api",
    `Fetching notifications — page=${page}, limit=${limit}, type="${notification_type || "all"}"`
  );

  try {
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${process.env.REACT_APP_API_TOKEN}`
      }
    });

    if (!response.ok) {
      await fLog(
        "error",
        "api",
        `Notifications fetch failed — HTTP ${response.status} for url: ${url}`
      );
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();
    
    // Safely extract the notifications array from the response
    let notifications = [];
    if (Array.isArray(data?.notifications)) {
      notifications = data.notifications;
    } else if (Array.isArray(data)) {
      notifications = data;
    }

    await fLog(
      "debug",
      "api",
      `Received ${notifications.length} notification(s) from server`
    );

    return notifications;
  } catch (err) {
    await fLog(
      "fatal",
      "api",
      `Notifications API unreachable: ${err.message}`
    );
    throw err;
  }
}
