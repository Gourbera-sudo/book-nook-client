const TOKEN_ENDPOINT = "/api/auth/jwt";
const REFRESH_MARGIN_MS = 30 * 1000;

let tokenCache = { token: null, expiresAt: 0 };

export function clearAuthToken() {
  tokenCache = { token: null, expiresAt: 0 };
}

export async function getAuthToken({ force = false } = {}) {
  if (
    !force &&
    tokenCache.token &&
    Date.now() < tokenCache.expiresAt - REFRESH_MARGIN_MS
  ) {
    return tokenCache.token;
  }

  const response = await fetch(TOKEN_ENDPOINT, {
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    clearAuthToken();
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!data?.token) {
    clearAuthToken();
    return null;
  }

  tokenCache = {
    token: data.token,
    expiresAt: Number(data.expiresAt) || Date.now() + 60 * 1000,
  };

  return tokenCache.token;
}

function withAuth(options, token) {
  const headers = new Headers(options.headers ?? {});
  headers.set("Authorization", `Bearer ${token}`);

  return { ...options, headers };
}

// For endpoints that require a signed-in reader. Retries once with a fresh
// token when the cached one has expired.
export async function authFetch(url, options = {}) {
  let token = await getAuthToken();

  if (!token) {
    throw new Error("You must be signed in to do that.");
  }

  let response = await fetch(url, withAuth(options, token));

  if (response.status === 401) {
    token = await getAuthToken({ force: true });

    if (token) {
      response = await fetch(url, withAuth(options, token));
    }
  }

  return response;
}

// For public endpoints that use the reader's identity only when available
// (for example, to flag their own active borrow).
export async function authFetchOptional(url, options = {}) {
  const token = await getAuthToken().catch(() => null);

  return fetch(url, token ? withAuth(options, token) : options);
}
