import React, { Component } from "react";
import axios from "axios";

const authUrl = "https://accounts.spotify.com/authorize/?";
const clientId = process.env.REACT_APP_CLIENT_ID;
const redirectUri = "http://localhost:3000/";
const scopes = "playlist-read-private";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      playlists: {},
      likes: {},
      eliminated: [],
      token: null
    };
  }

  getPlaylists = async token => {
    const url = "https://api.spotify.com/v1/me/playlists"
    const { playlists } = this.state;
    let tempPlaylists = Object.assign({}, playlists);
    await axios.get(url, { headers: {"Authorization": "Bearer " + token} }).then(function (response) {
      response.data.items.forEach(playlist => {
        if (playlist.tracks.total >= 20) {
          let playlistId = playlist.id;
          tempPlaylists[playlistId] = playlist.name;
        }
      });
    });
    this.setState({playlists: tempPlaylists});
  }

  getTracks = async (token, playlistId) => {
    const url = "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks"
    const { tracks } = this.state;
    await axios.get(url, { headers: {"Authorization": "Bearer " + token} }).then(function (response) {
      response.data.items.forEach(track => {
        tracks.push(track.track.name);
      });
    });
    this.setState({tracks: tracks});
  }

  componentDidMount() {
    const hash = window.location.hash.substring(1).split("&")
    const access_token = hash[0].split("=")[1]
    this.setState({token: access_token});
    this.getPlaylists(access_token);
  }

  render() {
    if (!this.state.token) {
      return (
        <div className="App">
          <a href={`${authUrl}client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=token&show_dialog=true`}>
            Login with Spotify
          </a>
        </div>
      );
    }
      
    const playlists = Object.entries(this.state.playlists).map((key, i) => {
      return (
        <ul>
          <li><button onClick={() => this.getTracks(this.state.token, key[0])}>{key[1]}</button></li>
        </ul>
      );
    });

    return playlists;
  }
}

export default App;
