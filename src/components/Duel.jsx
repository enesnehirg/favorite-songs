function Cover({ track, onChoose, opponent }) {
  return (
    <button className="duel-card" type="button" onClick={() => onChoose(track, opponent)}>
      {track.image ? (
        <img src={track.image} alt="" />
      ) : (
        <span className="cover-fallback large" />
      )}
      <span className="duel-copy">
        <strong>{track.name}</strong>
        <em>{track.artist}</em>
      </span>
    </button>
  );
}

function Duel({ playlistName, remaining, lockAfter, pair, onChoose }) {
  const [left, right] = pair;

  return (
    <section className="duel">
      <p className="eyebrow">{playlistName}</p>
      <h1>Which one stays?</h1>
      <p className="muted">
        {remaining} tracks left · a song is locked in after {lockAfter} wins
      </p>
      <div className="duel-board">
        <Cover track={left} opponent={right} onChoose={onChoose} />
        <p className="vs">VS</p>
        <Cover track={right} opponent={left} onChoose={onChoose} />
      </div>
    </section>
  );
}

export default Duel;
