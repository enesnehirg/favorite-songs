const TOKEN_KEY = "keepers.spotify.token";
const VERIFIER_KEY = "keepers.spotify.verifier";
const STATE_KEY = "keepers.spotify.state";

export function saveToken(token) {
  sessionStorage.setItem(TOKEN_KEY, JSON.stringify(token));
}

export function loadToken() {
  const raw = sessionStorage.getItem(TOKEN_KEY);
  if (!raw) {
    return null;
  }

  try {
    const token = JSON.parse(raw);
    if (!token?.accessToken || token.expiresAt <= Date.now()) {
      clearToken();
      return null;
    }
    return token;
  } catch {
    clearToken();
    return null;
  }
}

export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

export function savePkce(verifier, state) {
  sessionStorage.setItem(VERIFIER_KEY, verifier);
  sessionStorage.setItem(STATE_KEY, state);
}

export function loadPkce() {
  return {
    verifier: sessionStorage.getItem(VERIFIER_KEY),
    state: sessionStorage.getItem(STATE_KEY),
  };
}

export function clearPkce() {
  sessionStorage.removeItem(VERIFIER_KEY);
  sessionStorage.removeItem(STATE_KEY);
}
