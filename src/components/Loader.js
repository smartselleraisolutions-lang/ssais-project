import React from "react";

function Loader({ progress }) {
  return (
    <div className="loader">
      <h2>Processing Video...</h2>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <p>{progress}% uploaded</p>
    </div>
  );
}

export default Loader;