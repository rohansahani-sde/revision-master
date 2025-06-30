import axios from 'axios';
import React from 'react'
import { use } from 'react';
import { useState } from 'react';

const Lesson = () => {

    const [form, setForm] = useState({ days: "", topic: "" });
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [items, setItems] = useState([]);              // 🟢 current lesson
    const [history, setHistory] = useState([]); 
    

const handleInputChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};


    const fetchLessonPlan = async () => {
  const { days, topic } = form;

  if (!days || !topic) {
    alert("Please enter both days and topic.");
    return;
  }

  const prompt = `
Create a ${days}-day JSON lesson plan for the topic ${topic} at an intermediate level. 

Each day should include:
- "day": The day number (1–${days})
- "topic": The main ${topic} concept covered
- "content": An ${topic} of one or more objects per concept, each including:
  - "concept": Title of the concept or algorithm 
  - "about": Short explanation (2–4 lines) of the concept 
  - "problem": An object with the following structure:
    - "title": Problem title
    - "description": A coding problem description like those on LeetCode (150–200 words max)
    - "input": Description of input format
    - "output": Description of output format
    - "examples": Array of input-output pairs (minimum 2)
  - "practice_que": A link to a relevant LeetCode/GeeksforGeeks problem or prompt

Ensure:
- Concepts follow a logical progression (you know what should be) 
- Examples are language-agnostic (easy to understand pseudocode or sample input/output)
- Total JSON output should be a list of ${days} objects 

Format the entire output as a valid JSON array.
  `;

  try {
    const response = await axios.post("http://localhost:5000/generate", {
      prompt: prompt
    });

    const rawText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const jsonStart = rawText.indexOf("[");
    const jsonEnd = rawText.lastIndexOf("]");
    const jsonString = rawText.slice(jsonStart, jsonEnd + 1);
    const parsedData = JSON.parse(jsonString);

    if (items.length > 0) {
      setHistory((prev) => [...prev, items]);
    }

    setItems(parsedData);
    setSelectedIndex(null);
  } catch (error) {
    console.error("Error fetching lesson plan:", error);
  }
};

    
  return (
    <>
    <div>
        <h3>Generate Lesson Plan</h3>
<input
  type="number"
  name="days"
  placeholder="Enter number of days"
  value={form.days}
  onChange={handleInputChange}
/>
<input
  type="text"
  name="topic"
  placeholder="Enter topic (e.g., Data Structures)"
  value={form.topic}
  onChange={handleInputChange}
/>
<button onClick={fetchLessonPlan}>Generate</button>

    </div>
    <div className=' mt-10'>
        {(selectedIndex !== null ? history[selectedIndex] : items).map((dayObj, i) => (
  <div key={i} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
    <h4>Day {dayObj.day}: {dayObj.topic}</h4>
    {Array.isArray(dayObj.content) ? dayObj.content.map((contentItem, j) => (
      <div key={j}>
        <strong>Concept:</strong> {contentItem.concept}<br />
        <em>About:</em> {contentItem.about}<br />
        <p><strong>Problem:</strong> {contentItem.problem.title}</p>
        <p>{contentItem.problem.description}</p>
        <pre>Input: {contentItem.problem.input}</pre>
        <pre>Output: {contentItem.problem.output}</pre>
        <pre>
          Examples:
          {contentItem.problem.examples.map((ex, k) => (
            <div key={k}>{JSON.stringify(ex)}</div>
          ))}
        </pre>
        <a href={contentItem.practice_que} target="_blank" rel="noreferrer">Practice Link</a>
        <hr />
      </div>
    )) : <p>No content found.</p>}
  </div>
))}

    </div>
    </>
  )
}

export default Lesson