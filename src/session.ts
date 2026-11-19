export const firebaseApiKey = import.meta.env.VITE_FIREBASE_API_KEY?.trim();
const refreshKey = `westbridge.session.${firebaseApiKey}`;
const demoKey = "westbridge.preview";

function readStorage(key: string) {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string | null) {
  try {
    if (value === null) window.sessionStorage.removeItem(key);
    else window.sessionStorage.setItem(key, value);
  } catch {
    // The current tab can still sign in when its storage is unavailable.
  }
}

export function rememberCredential(refreshToken: string) {
  writeStorage(refreshKey, refreshToken);
}

export function savedCredential() {
  return readStorage(refreshKey);
}

export function clearSession() {
  writeStorage(refreshKey, null);
  if (!firebaseApiKey) writeStorage(demoKey, "signed-out");
}

export function previewActive() {
  if (firebaseApiKey) return false;
  const preview = readStorage(demoKey);
  if (preview !== null) return preview === "active";
  return !["#/sign-in", "#/register"].includes(window.location.hash);
}

export function rememberPreview() {
  writeStorage(demoKey, "active");
}

export async function restoreSession(signal: AbortSignal): Promise<string | null> {
  const credential = savedCredential();
  if (!credential) return null;
  const response = await fetch(
    `https://securetoken.googleapis.com/v1/token?key=${firebaseApiKey}`,
    {
      method: "POST",
      body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: credential }),
      signal,
    },
  );
  const token = await response.json();
  if (!response.ok) {
    const invalid = [
      "TOKEN_EXPIRED",
      "USER_DISABLED",
      "USER_NOT_FOUND",
      "INVALID_REFRESH_TOKEN",
      "INVALID_GRANT",
    ];
    if (invalid.includes(token.error?.message)) return null;
    throw new Error("Unable to check session");
  }
  if (!token.id_token || !token.refresh_token) throw new Error("Incomplete session");
  if (signal.aborted) throw new DOMException("Aborted", "AbortError");
  rememberCredential(token.refresh_token);
  const account = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseApiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: token.id_token }),
      signal,
    },
  );
  const result = await account.json();
  if (result.error?.message === "USER_NOT_FOUND" || result.error?.message === "USER_DISABLED")
    return null;
  if (!account.ok || !result.users?.[0]?.email) throw new Error("Unable to check account");
  return result.users[0].email;
}
