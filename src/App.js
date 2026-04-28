import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import logo from "./assets/logo.png";

import Upload from "./components/Upload";
import Loader from "./components/Loader";
import Transcript from "./components/Transcript";
import Home from "./components/Home";

import "./App.css";

function App() {
  const [loading, setLoading] = React.useState(false);
  const [transcript, setTranscript] = React.useState(null);
  const [progress, setProgress] = React.useState(0);

  return (
    <Router>
      
	<nav className="navbar">
  <div className="nav-left">
    <img src={logo} alt="logo" className="nav-logo" />
    <h2 className="logo-text">SSAIS</h2>
  </div>

  <div>
    <Link to="/">Home</Link>
    <Link to="/transcription">Solutions</Link>
  </div>
</nav>

      <Routes>
        {/* 🏠 Homepage */}
        <Route path="/" element={<Home />} />

        {/* 🎬 Transcription Tool */}
        <Route
          path="/transcription"
          element={
            <div className="app">
              <h1>AI Video Transcription</h1>

              {!loading && !transcript && (
                <Upload
                  setLoading={setLoading}
                  setTranscript={setTranscript}
                  setProgress={setProgress}
                />
              )}

              {loading && <Loader progress={progress} />}

              {transcript && <Transcript data={transcript} />}
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;