import { useMemo, useState } from "react";

function PlaylistPicker({ playlists, onSelect }) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return playlists;
    }
    return playlists.filter((playlist) =>
      playlist.name.toLowerCase().includes(needle)
    );
  }, [playlists, query]);

  return (
    <section className="picker">
      <div className="section-heading">
        <h1>Choose a playlist</h1>
        <p className="muted">
          Only playlists with 20 or more tracks show up. Pick one and start cutting.
        </p>
      </div>

      <input
        className="search"
        type="search"
        placeholder="Search playlists"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      {playlists.length === 0 ? (
        <p className="muted">No playlists with 20 or more tracks were found.</p>
      ) : visible.length === 0 ? (
        <p className="muted">No playlists match that search.</p>
      ) : (
        <ul className="playlist-grid">
          {visible.map((playlist) => (
            <li key={playlist.id}>
              <button type="button" onClick={() => onSelect(playlist)}>
                {playlist.image ? (
                  <img src={playlist.image} alt="" />
                ) : (
                  <span className="cover-fallback" />
                )}
                <span>
                  <strong>{playlist.name}</strong>
                  <em>{playlist.trackCount} tracks</em>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default PlaylistPicker;
