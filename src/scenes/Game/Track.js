import React from "react";

class Track extends React.Component {
    render() {
      return (
        <button>
          {this.props.track}
        </button>
      );
    }
  }

  export default Track;
