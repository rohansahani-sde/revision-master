// LessonForm.jsx
import React, { useState } from "react";

export default function LessonForm({ onSubmit }) {
  const [topic, setTopic] = useState("");
  const [days, setDays] = useState(10);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ topic, days });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Topic:
        <select value={topic} onChange={(e) => setTopic(e.target.value)}>
          <option value="">Select Topic</option>
          <option value="Recursion Backtracking DP">Recursion + DP</option>
          <option value="Graphs">Graphs</option>
          <option value="Sorting and Searching">Sorting + Searching</option>
        </select>
      </label>

      <label>
        Number of Days:
        <input
          type="number"
          value={days}
          min="1"
          max="30"
          onChange={(e) => setDays(Number(e.target.value))}
        />
      </label>

      <button type="submit">Generate Plan</button>
    </form>
  );
}
