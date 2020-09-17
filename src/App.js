import React, { Component } from "react";
import { Button } from 'reactstrap';
import axios from "axios";

import Game from "./scenes/Game";
import "./App.css"


const authUrl = "https://accounts.spotify.com/authorize/?";
const clientId = "86bc5d2472e548729473b068f5000414";
const redirectUri = 
  process.env.NODE_ENV === "development"
      ? "http://localhost:3000/"
      : "http://spotify-favorite-songs.s3-website.eu-central-1.amazonaws.com/";
const scopes = ["playlist-read-private", "playlist-modify-private"];
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      playlists: {},
      token: null,
      playlistName: null
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

  getTracks = async (token, playlistId, playlistName) => {
    const url = "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks"
    var tempTracks = this.state.tracks;
    await axios.get(url, { headers: {"Authorization": "Bearer " + token} }).then(function (response) {
      response.data.items.forEach(track => {
        tempTracks.push(track.track);
      });
    });
    this.setState({playlistName: playlistName});
    this.setState({tracks: tempTracks});
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
          <header className="App-header">
            <Button className="spotify-login" onClick={event =>  window.location.href=`${authUrl}client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=token&show_dialog=true`}>
                Login with Spotify
            </Button>
          </header>
        </div>
      );
    }
    const playlists = Object.entries(this.state.playlists).map((key, i) => {
      return (
        <ul>
          <li><Button onClick={() => this.getTracks(this.state.token, key[0], key[1])}>{key[1]}</Button></li>
        </ul>
      );
    });

    if (this.state.tracks.length > 0) {
      return <Game tracks={this.state.tracks} playlist={this.state.playlistName} />
    }

    return (
      <div className="App-header">
        {playlists}
      </div>
    );
  }
}

export default App;
