import React from "react";
import { Button } from 'reactstrap';

import Result from "./Result"

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
            maxChose: Math.round(tracks.length * 10 / 100)
        };
    }

    like(track, index, eliminatedTrack) {
        var { liked, eliminated, tracks } = this.state;
        // fill liked object and eliminated array
        if (!liked[track]) {
            liked[track] = 1;
        } else {
            if (liked[track] === this.state.maxChose) {
                const trackIndex = tracks.indexOf(track)
                tracks.splice(trackIndex, 1)
            }
            liked[track] += 1;
        }
        eliminated.push(eliminatedTrack);
        this.setState({liked: liked});
        this.setState({eliminated: eliminated});
        // remove eliminated track
        const trackIndex = tracks.indexOf(eliminatedTrack)
        tracks.splice(trackIndex, 1)
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
                    <Button onClick={() => this.like(firstTrack, 1, secondTrack)}>{firstTrack}</Button>
                    <p>VS</p>
                    <Button onClick={() => this.like(secondTrack, 2, firstTrack)}>{secondTrack}</Button>
                </div>
            );
        }
        return (
            <div>
                <Result liked={this.state.liked}/>
            </div>
        )
    }
}

export default Game;
