import { describe, expect, it } from "vitest";
import { chooseWinner, createMatch, lockAfterWins, pickPair } from "./keepers";

function track(id) {
  return { id, name: id, uri: `spotify:track:${id}` };
}

describe("lockAfterWins", () => {
  it("locks a track after 10% of the playlist, at least once", () => {
    expect(lockAfterWins(20)).toBe(2);
    expect(lockAfterWins(4)).toBe(1);
  });
});

describe("pickPair", () => {
  it("returns two different tracks", () => {
    const pool = [track("a"), track("b"), track("c")];
    const [left, right] = pickPair(pool, null);
    expect(left.id).not.toBe(right.id);
  });

  it("keeps a winner in the next pair when possible", () => {
    const pool = [track("a"), track("b"), track("c")];
    const [left, right] = pickPair(pool, "a");
    expect([left.id, right.id]).toContain("a");
    expect(left.id).not.toBe(right.id);
  });
});

describe("chooseWinner", () => {
  it("eliminates the loser and ranks a first-time winner", () => {
    const match = {
      pool: [track("a"), track("b"), track("c")],
      ranking: [],
      wins: {},
      lockAfter: 3,
      pair: [track("a"), track("b")],
    };

    const next = chooseWinner(match, track("a"), track("b"));
    expect(next.pool.map((item) => item.id)).toEqual(["a", "c"]);
    expect(next.ranking.map((item) => item.id)).toEqual(["a"]);
    expect(next.wins.a).toBe(1);
    expect(next.pair).not.toBeNull();
  });

  it("removes a winner once it has enough wins", () => {
    const match = {
      pool: [track("a"), track("b")],
      ranking: [track("a")],
      wins: { a: 1 },
      lockAfter: 2,
      pair: [track("a"), track("b")],
    };

    const next = chooseWinner(match, track("a"), track("b"));
    expect(next.pool).toHaveLength(0);
    expect(next.pair).toBeNull();
  });
});

describe("createMatch", () => {
  it("starts with a pair from the full pool", () => {
    const match = createMatch([track("a"), track("b"), track("c")]);
    expect(match.pool).toHaveLength(3);
    expect(match.pair).toHaveLength(2);
    expect(match.lockAfter).toBe(1);
  });
});
