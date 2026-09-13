function Results({ playlistName, tracks, saved, saving, onCreate, onAgain }) {
  return (
    <section className="results">
      <p className="eyebrow">{playlistName}</p>
      <h1>Your keepers</h1>
      <p className="muted">
        {tracks.length} songs made the cut, in the order they first won a face-off.
      </p>

      <ol className="result-list">
        {tracks.map((track, index) => (
          <li key={track.id}>
            <span className="rank">{index + 1}</span>
            {track.thumbnail ? (
              <img src={track.thumbnail} alt="" />
            ) : (
              <span className="cover-fallback" />
            )}
            <span>
              <strong>{track.name}</strong>
              <em>{track.artist}</em>
            </span>
          </li>
        ))}
      </ol>

      <div className="actions">
        <button
          className="primary"
          type="button"
          onClick={onCreate}
          disabled={saved || saving || tracks.length === 0}
        >
          {saved ? "Playlist created" : saving ? "Creating…" : "Save as Spotify playlist"}
        </button>
        <button className="secondary" type="button" onClick={onAgain}>
          Pick another playlist
        </button>
      </div>
    </section>
  );
}

export default Results;
