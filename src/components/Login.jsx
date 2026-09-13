function Login({ onLogin }) {
  return (
    <section className="hero">
      <p className="eyebrow">Spotify playlist playoffs</p>
      <h1>Keep the songs you would actually play.</h1>
      <p className="lede">
        Huge playlists are easy to make and hard to edit. Keepers puts two tracks
        against each other until only your favorites are left.
      </p>
      <button className="primary" type="button" onClick={onLogin}>
        Continue with Spotify
      </button>
    </section>
  );
}

export default Login;
