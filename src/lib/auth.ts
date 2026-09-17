export const SESSION_COOKIE = "dashboard_session";

/**
 * The cookie stores a hash of the password, not the password itself, so a
 * stale cookie automatically stops working the moment DASHBOARD_PASSWORD
 * changes — no separate invalidation logic needed.
 */
export async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
