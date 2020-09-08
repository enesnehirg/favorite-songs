import React from "react";
import Track from "./Track";

class Game extends React.Component {
    renderTrack(track) {
        return (
            <div>
                <Track value={track} />
            </div>
        )
    }

    render() {
        return (
            <div>
                <div>
                    {this.renderTrack(this.props.tracks[0])}
                </div>
                <div>
                    {this.renderTrack(this.props.tracks[1])}
                </div>
            </div>
        )
    }
}

export default Game;
