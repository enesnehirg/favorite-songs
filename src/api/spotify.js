import { MIN_PLAYLIST_TRACKS } from "../config";

const API = "https://api.spotify.com/v1";

function toPath(path) {
  return path.startsWith("http") ? path.replace(API, "") : path;
}

async function request(accessToken, path, options = {}) {
  const response = await fetch(`${API}${toPath(path)}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  if (response.status === 204) {
    return null;
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error?.message || "Spotify request failed.");
  }
  return payload;
}

async function collectPages(accessToken, firstPath, pickItems) {
  const items = [];
  let path = firstPath;

  while (path) {
    const page = await request(accessToken, path.replace(API, ""));
    items.push(...pickItems(page));
    path = page.next;
  }

  return items;
}

function albumImage(track, sizeIndex) {
  const images = track.album?.images ?? [];
  return images[sizeIndex]?.url || images[0]?.url || "";
}

function toTrack(item) {
  const track = item.track;
  if (!track?.id || !track.uri || track.is_local) {
    return null;
  }

  return {
    id: track.id,
    uri: track.uri,
    name: track.name,
    artist: track.artists?.map((artist) => artist.name).join(", ") || "Unknown artist",
    image: albumImage(track, 1),
    thumbnail: albumImage(track, 2),
  };
}

export async function listPlaylists(accessToken) {
  const playlists = await collectPages(
    accessToken,
    "/me/playlists?limit=50",
    (page) => page.items ?? []
  );

  return playlists
    .filter((playlist) => playlist.tracks?.total >= MIN_PLAYLIST_TRACKS)
    .map((playlist) => ({
      id: playlist.id,
      name: playlist.name,
      trackCount: playlist.tracks.total,
      image: playlist.images?.[0]?.url || "",
    }));
}

export async function listPlaylistTracks(accessToken, playlistId) {
  const items = await collectPages(
    accessToken,
    `/playlists/${playlistId}/tracks?limit=100`,
    (page) => page.items ?? []
  );

  const unique = new Map();
  items.forEach((item) => {
    const track = toTrack(item);
    if (track && !unique.has(track.id)) {
      unique.set(track.id, track);
    }
  });

  return [...unique.values()];
}

export async function createPlaylistFromTracks(accessToken, playlistName, tracks) {
  const me = await request(accessToken, "/me");
  const playlist = await request(accessToken, `/users/${me.id}/playlists`, {
    method: "POST",
    body: JSON.stringify({
      name: `${playlistName} · Keepers`,
      public: false,
      description: "Songs that survived a Keepers face-off.",
    }),
  });

  const uris = tracks.map((track) => track.uri);
  for (let index = 0; index < uris.length; index += 100) {
    await request(accessToken, `/playlists/${playlist.id}/tracks`, {
      method: "POST",
      body: JSON.stringify({ uris: uris.slice(index, index + 100) }),
    });
  }

  return playlist;
}
