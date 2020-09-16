import React from "react";

class Result extends React.Component {
    render() {
      const res = this.props.result.map(element => {
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
      return (
        <div>
          <div className="result-list">
            {res}
          </div>
        </div>
      )
    }
}

export default Result;