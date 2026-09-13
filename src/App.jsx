import { useEffect, useState } from "react";
import { createPlaylistFromTracks, listPlaylists, listPlaylistTracks } from "./api/spotify";
import { clearToken } from "./auth/session";
import { startLogin } from "./auth/spotify";
import Duel from "./components/Duel";
import Login from "./components/Login";
import PlaylistPicker from "./components/PlaylistPicker";
import Results from "./components/Results";
import { chooseWinner, createMatch, isFinished } from "./game/keepers";

function App({ initialToken, bootError }) {
  const [token, setToken] = useState(initialToken);
  const [screen, setScreen] = useState(initialToken ? "playlists" : "login");
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [match, setMatch] = useState(null);
  const [error, setError] = useState(bootError);
  const [loading, setLoading] = useState(Boolean(initialToken));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;
    setLoading(true);
    listPlaylists(token.accessToken)
      .then((items) => {
        if (!cancelled) {
          setPlaylists(items);
          setScreen("playlists");
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          if (/unauthorized|expired|token/i.test(err.message)) {
            clearToken();
            setToken(null);
            setScreen("login");
          }
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleSelectPlaylist(playlist) {
    setError(null);
    setLoading(true);
    setSelectedPlaylist(playlist);
    setSaved(false);

    try {
      const tracks = await listPlaylistTracks(token.accessToken, playlist.id);
      if (tracks.length < 2) {
        throw new Error("This playlist does not have enough playable tracks.");
      }
      setMatch(createMatch(tracks));
      setScreen("duel");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChoice(winner, loser) {
    const next = chooseWinner(match, winner, loser);
    setMatch(next);
    if (isFinished(next)) {
      setScreen("results");
    }
  }

  async function handleCreatePlaylist() {
    setSaving(true);
    setError(null);
    try {
      await createPlaylistFromTracks(
        token.accessToken,
        selectedPlaylist.name,
        match.ranking
      );
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setMatch(null);
    setSelectedPlaylist(null);
    setSaved(false);
    setError(null);
    setScreen("playlists");
  }

  function handleLogout() {
    clearToken();
    setToken(null);
    setPlaylists([]);
    setMatch(null);
    setSelectedPlaylist(null);
    setScreen("login");
  }

  return (
    <div className="app">
      <header className="topbar">
        <button className="brand" type="button" onClick={token ? handleReset : undefined}>
          Keepers
        </button>
        {token ? (
          <button className="text-button" type="button" onClick={handleLogout}>
            Log out
          </button>
        ) : null}
      </header>

      <main>
        {error ? <p className="banner">{error}</p> : null}
        {loading ? <p className="muted">Loading…</p> : null}

        {!loading && screen === "login" ? <Login onLogin={startLogin} /> : null}

        {!loading && screen === "playlists" ? (
          <PlaylistPicker playlists={playlists} onSelect={handleSelectPlaylist} />
        ) : null}

        {!loading && screen === "duel" && match?.pair ? (
          <Duel
            playlistName={selectedPlaylist?.name}
            remaining={match.pool.length}
            lockAfter={match.lockAfter}
            pair={match.pair}
            onChoose={handleChoice}
          />
        ) : null}

        {!loading && screen === "results" ? (
          <Results
            playlistName={selectedPlaylist?.name}
            tracks={match.ranking}
            saved={saved}
            saving={saving}
            onCreate={handleCreatePlaylist}
            onAgain={handleReset}
          />
        ) : null}
      </main>
    </div>
  );
}

export default App;
