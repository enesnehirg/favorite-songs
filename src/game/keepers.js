export function lockAfterWins(trackCount) {
  return Math.max(1, Math.round(trackCount * 0.1));
}

export function createMatch(tracks) {
  if (tracks.length < 2) {
    throw new Error("Need at least two tracks to start a face-off.");
  }

  return {
    pool: tracks,
    ranking: [],
    wins: {},
    lockAfter: lockAfterWins(tracks.length),
    pair: pickPair(tracks, null),
  };
}

export function pickPair(pool, keepId) {
  if (pool.length < 2) {
    return null;
  }

  const kept = keepId ? pool.find((track) => track.id === keepId) : null;
  if (kept) {
    const opponents = pool.filter((track) => track.id !== keepId);
    return [kept, opponents[randomIndex(opponents.length)]];
  }

  const firstIndex = randomIndex(pool.length);
  let secondIndex = randomIndex(pool.length - 1);
  if (secondIndex >= firstIndex) {
    secondIndex += 1;
  }

  return [pool[firstIndex], pool[secondIndex]];
}

export function chooseWinner(match, winner, loser) {
  const wins = {
    ...match.wins,
    [winner.id]: (match.wins[winner.id] || 0) + 1,
  };
  const ranking = match.ranking.some((track) => track.id === winner.id)
    ? match.ranking
    : [...match.ranking, winner];

  let pool = match.pool.filter((track) => track.id !== loser.id);
  const lockedIn = wins[winner.id] >= match.lockAfter;
  if (lockedIn) {
    pool = pool.filter((track) => track.id !== winner.id);
  }

  return {
    ...match,
    pool,
    ranking,
    wins,
    pair: pickPair(pool, lockedIn ? null : winner.id),
  };
}

export function isFinished(match) {
  return !match.pair;
}

function randomIndex(length) {
  return Math.floor(Math.random() * length);
}
