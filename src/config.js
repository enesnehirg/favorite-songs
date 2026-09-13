export const SPOTIFY_CLIENT_ID = "86bc5d2472e548729473b068f5000414";

export const SPOTIFY_SCOPES = [
  "playlist-read-private",
  "playlist-modify-private",
];

export const MIN_PLAYLIST_TRACKS = 20;

export const redirectUri = () => `${window.location.origin}/`;
