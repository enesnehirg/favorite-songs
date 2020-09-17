import React from "react";
import { Button } from 'reactstrap';
import axios from "axios";

class Result extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      downloaded: false
    }
  }

  createPlaylist = async uris => {
    const meUrl = "https://api.spotify.com/v1/me"
    var userId;
    // get user id
    await axios.get(meUrl, { headers: {"Authorization": "Bearer " + this.state.token} }).then(function(response) {
      userId = response.data.id
    });
    const createUrl = "https://api.spotify.com/v1/users/" + userId + "/playlists";
    const body = {
      name: this.props.playlist + " Top " + uris.length,
      public: false
    }
    var playlistId;
    // create playlist
    await axios.post(createUrl, body, { headers: {"Authorization": "Bearer " + this.state.token} }).then(function(response) {
      playlistId = response.data.id;
    })
    const addTracksUrl = "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks";

    const params = {
      uris: uris.join(",")
    };
    // add tracks
    await axios.post(addTracksUrl, {}, { headers: {"Authorization": "Bearer " + this.state.token}, params: params }).then(function(response) {
      alert("Yay, we created a playlist in your library!");
    });
    this.setState({downloaded: true});
  }

  componentDidMount() {
    const hash = window.location.hash.substring(1).split("&")
    const access_token = hash[0].split("=")[1]
    this.setState({token: access_token});
  }

  render() {
    var uris = [];
    const res = this.props.result.map(element => {
      uris.push(element.uri);
      return (
        <ul>
          <li>
            <div className="result">
              <div className="image">
                <img className="preview" src={element.album.images[2].url} alt="go"/>
              </div>
              <div className="song">
                <p className="artist">{element.artists[0].name}</p>
                <p className="track">{element.name}</p>
              </div>
            </div>
          </li>
        </ul>
      );
    });
    if (this.state.downloaded) {
      return (
        <div className="result-list">
          <h1>Your top favorites!</h1>
          {res}
          <Button disabled className="create-playlist" onClick={() => this.createPlaylist(uris)}>Create Playlist</Button>
        </div> 
      )
    }
    return (
        <div className="result-list">
          <h1>Your top favorites!</h1>
          {res}
          <Button className="create-playlist" onClick={() => this.createPlaylist(uris)}>Create Playlist</Button>
        </div>
      
    )
  }
}

export default Result;
