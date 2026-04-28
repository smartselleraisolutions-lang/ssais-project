import React from "react";
import axios from "axios";

function Upload({ setLoading, setTranscript }) {

  const [progress, setProgress] = React.useState(0);
  // 📤 Handle file upload
  const handleUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("video", file);

    setLoading(true);

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/process",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percent);
            console.log("Upload Progress:", percent + "%");
          },
        }
      );

      // ✅ Set transcript from backend
      setTranscript(res.data);

    } catch (error) {
      console.error(error);
      alert("❌ Upload failed. Check backend or CORS.");
    }

    setLoading(false);
  };

  // 📦 Drag & Drop support
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleUpload(file);
  };

  return (
    <div
      className="upload-box"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <h3>📤 Upload Your Video</h3>
      <p>Drag & Drop or Select a File</p>

      <input
        type="file"
        accept="video/*"
        onChange={(e) => handleUpload(e.target.files[0])}
      />
    </div>
  );
}

export default Upload;