import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Home() {
  return (
    <div className="home">

      <div className="hero">

        {/* ✅ Logo */}
        <img src={logo} alt="SSAIS Logo" className="logo" />

        <h1>SmartSeller AI Solutions</h1>

        <p>
          We build powerful AI agents for any business need.
          Automate work. Save time. Scale faster.
        </p>

        <Link to="/transcription">
          <button>Explore Solutions 🚀</button>
        </Link>
      </div>

      <div className="solutions">
        <h2>Our AI Solutions</h2>

        <div className="card">
          <h3>🎬 Video Transcription AI</h3>
          <p>
            Convert video to text with speaker detection and timestamps.
          </p>

          <Link to="/transcription">
            <button>Use Tool</button>
          </Link>
        </div>
      </div>

    </div>
  );
}

export default Home;