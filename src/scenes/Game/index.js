import React from "react";
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
            secondIndex: secondRandomIndex
        };
    }

    like(track, index, eliminatedTrack) {
        var { liked, eliminated, tracks } = this.state;
        // fill liked object and eliminated array
        if (!liked[track]) {
            liked[track] = 1;
        } else {
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
        do {
            if (index === 1) {
                newTrackIndex = tracks.indexOf(track);
                var secondRandomIndex = Math.floor(Math.random() * tracks.length);
                this.setState({secondIndex: secondRandomIndex, firstIndex: newTrackIndex});
            } else if (index === 2) {
                newTrackIndex = tracks.indexOf(track);
                var firstRandomIndex = Math.floor(Math.random() * tracks.length);
                this.setState({firstIndex: firstRandomIndex, secondIndex: newTrackIndex});
            }
        } while(firstRandomIndex === secondRandomIndex || firstRandomIndex === newTrackIndex || secondRandomIndex === newTrackIndex);
    }

    render() {
        const tracks = this.props.tracks;
        const firstTrack = tracks[this.state.firstIndex];
        const secondTrack = tracks[this.state.secondIndex];
        if (tracks.length > 2) {
            return (
                <div>
                    <button onClick={() => this.like(firstTrack, 1, secondTrack)}>{firstTrack}</button>
                    <button onClick={() => this.like(secondTrack, 2, firstTrack)}>{secondTrack}</button>
                </div>
            )
        }
        console.log(this.state.liked);
        return (
            <div>
                <Result liked={this.state.liked}/>
            </div>
        )
    }
}

export default Game;
