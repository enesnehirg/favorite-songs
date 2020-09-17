import React from "react";

import Result from "./Result";

class Game extends React.Component {
    constructor(props) {
        super(props);
        const tracks = this.props.tracks;
        do {
            var firstRandomIndex = Math.floor(Math.random() * tracks.length);
            var secondRandomIndex = Math.floor(Math.random() * tracks.length);
        } while (firstRandomIndex === secondRandomIndex)
        this.state = {
            eliminated: [],
            liked: {},
            tracks: tracks,
            firstIndex: firstRandomIndex,
            secondIndex: secondRandomIndex,
            maxChose: Math.round(tracks.length * 10 / 100),
            result: []
        };
    }

    like(track, index, eliminatedTrack) {
        var { liked, eliminated, tracks, result } = this.state;
        // fill liked object and eliminated array
        if (!liked[track.name]) {
            liked[track.name] = 1;
            result.push(track);
        } else {
            if (liked[track.name] === this.state.maxChose) {
                const trackIndex = tracks.indexOf(track);
                tracks.splice(trackIndex, 1);
            }
            liked[track.name] += 1;
        }
        eliminated.push(eliminatedTrack);
        this.setState({liked: liked});
        this.setState({eliminated: eliminated});
        this.setState({result: result});
        // remove eliminated track
        const trackIndex = tracks.indexOf(eliminatedTrack);
        tracks.splice(trackIndex, 1);
        // generate new random index
        var newTrackIndex;
        var firstRandomIndex;
        var secondRandomIndex;
        do {
            if (index === 1) {
                if (tracks.includes(track)) {
                    newTrackIndex = tracks.indexOf(track);
                    secondRandomIndex = Math.floor(Math.random() * tracks.length);
                    this.setState({secondIndex: secondRandomIndex, firstIndex: newTrackIndex});
                } else {
                    firstRandomIndex = Math.floor(Math.random() * tracks.length);
                    secondRandomIndex = Math.floor(Math.random() * tracks.length);
                    this.setState({secondIndex: secondRandomIndex, firstIndex: firstRandomIndex});
                }
            } else if (index === 2) {
                if (tracks.includes(track)) {
                    newTrackIndex = tracks.indexOf(track);
                    firstRandomIndex = Math.floor(Math.random() * tracks.length);
                    this.setState({firstIndex: firstRandomIndex, secondIndex: newTrackIndex});
                } else {
                    firstRandomIndex = Math.floor(Math.random() * tracks.length);
                    secondRandomIndex = Math.floor(Math.random() * tracks.length);
                    this.setState({secondIndex: secondRandomIndex, firstIndex: firstRandomIndex});
                }
            }
        } while(tracks.length !== 1 && (firstRandomIndex === secondRandomIndex || firstRandomIndex === newTrackIndex || secondRandomIndex === newTrackIndex));
    }

    render() {
        const tracks = this.state.tracks;
        const firstTrack = tracks[this.state.firstIndex];
        const secondTrack = tracks[this.state.secondIndex];
        if (tracks.length >= 2) {
            return (
                <div className="App-header">
                    <div className="container">
                        <div className="alt-container">
                            <img src={firstTrack.album.images[1].url} alt="first" />
                            <div className="bottom-centered">
                                <button className="track-button" onClick={() => this.like(firstTrack, 1, secondTrack)}>
                                    {firstTrack.name}
                                </button>
                            </div>
                        </div>
                        <p>VS</p>
                        <div className="alt-container">
                            <img src={secondTrack.album.images[1].url} alt="second" />
                            <div className="top-centered">
                                <button className="track-button" onClick={() => this.like(secondTrack, 2, firstTrack)}>
                                    {secondTrack.name}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <Result result={this.state.result} playlist={this.props.playlist} />
        )
    }
}

export default Game;
