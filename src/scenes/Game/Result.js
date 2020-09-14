import React from "react";

class Result extends React.Component {
    render() {
        const liked = this.props.liked;
        var keysSorted = Object.keys(liked).sort(function(a,b){return liked[b]-liked[a]})
        var result = keysSorted.map((key, i) => {
            return (
              <ul>
                <li>
                    <h3>{key}</h3>
                </li>
              </ul>
            );
        });
        return (
          <div className="App-header">
            {result}
          </div>
        )
    }
}

export default Result;