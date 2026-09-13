import { SPOTIFY_CLIENT_ID, SPOTIFY_SCOPES, redirectUri } from "../config";
import { createCodeChallenge, createCodeVerifier } from "./pkce";
import { clearPkce, loadPkce, savePkce, saveToken } from "./session";

export async function startLogin() {
  const verifier = createCodeVerifier();
  const state = createCodeVerifier(32);
  const challenge = await createCodeChallenge(verifier);
  savePkce(verifier, state);

  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: "code",
    redirect_uri: redirectUri(),
    scope: SPOTIFY_SCOPES.join(" "),
    code_challenge_method: "S256",
    code_challenge: challenge,
    state,
    show_dialog: "true",
  });

  window.location.assign(`https://accounts.spotify.com/authorize?${params}`);
}

export async function completeLoginIfNeeded() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const returnedState = params.get("state");
  const error = params.get("error");

  if (error) {
    clearPkce();
    window.history.replaceState({}, document.title, "/");
    throw new Error("Spotify login was cancelled or failed.");
  }

  if (!code) {
    return null;
  }

  const { verifier, state } = loadPkce();
  if (!verifier || !state || state !== returnedState) {
    clearPkce();
    window.history.replaceState({}, document.title, "/");
    throw new Error("Login session expired. Try signing in again.");
  }

  const body = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri(),
    code_verifier: verifier,
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const payload = await response.json();
  clearPkce();
  window.history.replaceState({}, document.title, "/");

  if (!response.ok) {
    throw new Error(payload.error_description || "Could not finish Spotify login.");
  }

  const token = {
    accessToken: payload.access_token,
    expiresAt: Date.now() + payload.expires_in * 1000,
  };
  saveToken(token);
  return token;
}
