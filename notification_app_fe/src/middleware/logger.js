
const LOG_API_URL = "http://20.207.122.201/evaluation-service/logs";

const VALID_LEVELS = new Set(["debug", "info", "warn", "error", "fatal"]);

const FRONTEND_PACKAGES = new Set([
  "api", "component", "hook", "page", "state", "style",
  // shared packages also allowed on frontend
  "auth", "config", "middleware", "utils",
]);

export async function fLog(level, pkg, message) {
  const normLevel = String(level).toLowerCase().trim();
  const normPkg   = String(pkg).toLowerCase().trim();
  const normMsg   = String(message).trim();

  if (!VALID_LEVELS.has(normLevel)) {
    console.warn(`[campus-logger] Invalid level: "${normLevel}"`);
    return;
  }
  if (!FRONTEND_PACKAGES.has(normPkg)) {
    console.warn(`[campus-logger] Package "${normPkg}" not valid for frontend stack.`);
    return;
  }
  if (!normMsg) return;

  let finalMsg = normMsg;
  if (finalMsg.length < 5) finalMsg = finalMsg.padEnd(5, ".");
  if (finalMsg.length > 48) finalMsg = finalMsg.substring(0, 45) + "...";

  try {
    const res = await fetch(LOG_API_URL, {
      method:  "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.REACT_APP_API_TOKEN}`
      },
      body: JSON.stringify({
        stack:   "frontend",
        level:   normLevel,
        package: normPkg,
        message: finalMsg,
      }),
    });
    if (!res.ok) {
      console.warn(`[campus-logger] Server returned ${res.status}`);
    }
  } catch (err) {
    console.error("[campus-logger] Network error:", err.message);
  }
}
