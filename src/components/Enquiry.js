import React, { useState } from "react";
import axios from "axios";

const Enquiry = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("https://your-backend-url.onrender.com/enquiry", form);
      alert("✅ Request sent successfully!");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      alert("❌ Failed to send request");
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "500px", margin: "auto" }}>
      <h2>🤖 Request Custom AI Agent</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <br /><br />

        <textarea
          name="message"
          placeholder="Describe your AI requirement..."
          value={form.message}
          onChange={handleChange}
          required
        />
        <br /><br />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Enquiry;