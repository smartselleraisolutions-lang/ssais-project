import React from "react";

function Transcript({ data }) {

  // ⬇️ Download TXT
  const downloadTXT = () => {
    const text = data
      .map(line => `[${line.time}] ${line.speaker}: ${line.text}`)
      .join("\n");

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "transcript.txt";
    a.click();
  };

  // ⬇️ Download SRT
  const downloadSRT = () => {
    const srt = data.map((line, i) => {
      return `${i + 1}
00:${line.time},000 --> 00:${line.time},500
${line.speaker}: ${line.text}\n`;
    }).join("\n");

    const blob = new Blob([srt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "subtitles.srt";
    a.click();
  };

  return (
    <div className="transcript">
      <h2>Transcript</h2>

      <div className="actions">
        <button onClick={downloadTXT}>⬇️ Download TXT</button>
        <button onClick={downloadSRT}>⬇️ Download SRT</button>
      </div>

      {data.map((line, index) => (
        <div key={index} className="line">
          <span className="time">[{line.time}]</span>
          <span className="speaker">{line.speaker}:</span>
          <span className="text">{line.text}</span>
        </div>
      ))}
    </div>
  );
}

export default Transcript;