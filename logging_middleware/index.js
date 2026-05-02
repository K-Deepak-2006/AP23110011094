
/** Valid values as specified by the evaluation server */
const VALID_STACKS = new Set(["backend", "frontend"]);

const VALID_LEVELS = new Set(["debug", "info", "warn", "error", "fatal"]);

const BACKEND_PACKAGES = new Set([
  "cache", "controller", "cron_job", "db", "domain",
  "handler", "repository", "route", "service",
]);

const FRONTEND_PACKAGES = new Set([
  "api", "component", "hook", "page", "state", "style",
]);

const SHARED_PACKAGES = new Set(["auth", "config", "middleware", "utils"]);

/**
 * Validates that the provided package name is allowed for the given stack.
 * @param {string} stack
 * @param {string} pkg
 * @returns {boolean}
 */
function isPackageValid(stack, pkg) {
  if (SHARED_PACKAGES.has(pkg)) return true;
  if (stack === "backend" && BACKEND_PACKAGES.has(pkg)) return true;
  if (stack === "frontend" && FRONTEND_PACKAGES.has(pkg)) return true;
  return false;
}

/**
 * Sends a structured log entry to the campus evaluation server.
 *
 * @param {string} stack   - "frontend" or "backend"
 * @param {string} level   - "debug" | "info" | "warn" | "error" | "fatal"
 * @param {string} pkg     - package name (see valid lists above)
 * @param {string} message - human-readable description of the event
 * @returns {Promise<{ logID: string } | null>}
 */
async function Log(stack, level, pkg, message) {
  // Normalise to lowercase so callers don't have to worry about case
  const normStack = String(stack).toLowerCase().trim();
  const normLevel = String(level).toLowerCase().trim();
  const normPkg   = String(pkg).toLowerCase().trim();
  const normMsg   = String(message).trim();

  // Guard: reject silently (but warn to console) if params are invalid
  if (!VALID_STACKS.has(normStack)) {
    console.warn(`[campus-logger] Invalid stack: "${normStack}". Must be one of: ${[...VALID_STACKS].join(", ")}`);
    return null;
  }
  if (!VALID_LEVELS.has(normLevel)) {
    console.warn(`[campus-logger] Invalid level: "${normLevel}". Must be one of: ${[...VALID_LEVELS].join(", ")}`);
    return null;
  }
  if (!isPackageValid(normStack, normPkg)) {
    console.warn(`[campus-logger] Package "${normPkg}" is not valid for stack "${normStack}".`);
    return null;
  }
  if (!normMsg) {
    console.warn("[campus-logger] Log message must not be empty.");
    return null;
  }

  let finalMsg = normMsg;
  if (finalMsg.length < 5) finalMsg = finalMsg.padEnd(5, ".");
  if (finalMsg.length > 48) finalMsg = finalMsg.substring(0, 45) + "...";

  const payload = {
    stack:   normStack,
    level:   normLevel,
    package: normPkg,
    message: finalMsg,
  };

  try {
    const response = await fetch(LOG_API_URL, {
      method:  "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.CAMPUS_API_TOKEN || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJkZWVwYWtfa3VyYXBhdGlAZ21haWwuY29tIiwiZXhwIjoxNzc3NzAzMTU0LCJpYXQiOjE3Nzc3MDIyNTQsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIwODJlMjU3MC1kZjhlLTRkNjktOWQ4Mi1iYzg2YmU3OGUwZGUiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJrdXJhcGF0aSBkZWVwYWsgaGFyaSBnb3BhbCBzcmluaXZhcyIsInN1YiI6IjExNjAyYTE2LTQ3MDgtNDQ4YS1iZTA1LTg1MzA1M2RjZGY5ZSJ9LCJlbWFpbCI6ImRlZXBha19rdXJhcGF0aUBnbWFpbC5jb20iLCJuYW1lIjoia3VyYXBhdGkgZGVlcGFrIGhhcmkgZ29wYWwgc3Jpbml2YXMiLCJyb2xsTm8iOiJhcDIzMTEwMDExMDk0IiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiMTE2MDJhMTYtNDcwOC00NDhhLWJlMDUtODUzMDUzZGNkZjllIiwiY2xpZW50U2VjcmV0IjoicnpIYU5QdWRGYmhGVkFlVCJ9.hprZIAs1cJyKYH_P3fwH2XMwVmt0ttwEZAszT92YUhI"}`
      },
      body:    JSON.stringify(payload),
    });

    if (!response.ok) {
      // Non-2xx — log to console but don't crash the caller
      console.warn(`[campus-logger] Server responded with ${response.status} for log: "${normMsg}"`);
      return null;
    }

    const data = await response.json();
    // data = { logID: "...", message: "log created successfully" }
    return data;
  } catch (networkError) {
    // Network failures should never break the application
    console.error("[campus-logger] Failed to reach log server:", networkError.message);
    return null;
  }
}

module.exports = { Log };
