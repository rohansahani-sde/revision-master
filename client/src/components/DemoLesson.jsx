import axios from 'axios';
import React, { useState } from 'react';
import { useEffect } from 'react';
// import jsPDF from 'jspdf';
import html2pdf from "html2pdf.js";
import LessonContent from './LessonContent';
import { Link } from 'react-router-dom';
// import html2canvas from 'html2canvas';


const DemoLesson = () => {
  const [form, setForm] = useState({ days: "", topic: "" });
  const [items, setItems] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchLessonPlan = async () => {
    const { days, topic } = form;

    if (!days || !topic) {
      alert("Please enter both days and topic.");
      return;
    }

//     const prompt = `
// Create a ${days}-day JSON lesson plan for the topic ${topic} at an intermediate level. 

// Each day should include:
// - "day": The day number (1–${days})
// - "topic": The main ${topic} concept covered
// - "content": An ${topic} of one or more objects per concept, each including:
//   - "concept": Title of the concept or algorithm 
//   - "about": Short explanation (2–4 lines) of the concept 
//   - "problem": An object with the following structure:
//     - "title": Problem title
//     - "description": A coding problem description like those on LeetCode (150–200 words max)
//     - "input": Description of input format
//     - "output": Description of output format
//     - "examples": Array of input-output pairs (minimum 2)
//   - "practice_que": A link to a relevant LeetCode/GeeksforGeeks problem or prompt

// Ensure:
// - Concepts follow a logical progression
// - Examples are language-agnostic
// - Output is a valid JSON array of ${days} objects
// `;

    const prompt = `
    Create a ${days}-day JSON lesson plan for the topic "${topic}" at a intermediate  level.

Each day should include:
- "day": The day number (1–${days})
- "topic": The main concept covered that day
- "content": An array of one or more objects per concept, each including:
  - "concept": Title of the subtopic or algorithm (e.g., "Two Pointer Technique")
  - "about": A short explanation (1–2 lines) of the concept
  - "problem": An object with the following structure:
    - "title": Problem title
    - "description": A concise coding problem description (max 200 words)
    - "input": Input format description
    - "output": Output format description
    - "examples": Minimum 2 input-output examples in a language-agnostic format
  - "practice_que": A relevant problem link from LeetCode, GeeksforGeeks, or similar

Requirements:
- Ensure the concepts follow a logical learning progression suitable for a intermediate learner
- Use simple, language-neutral examples (pseudocode or plain input/output)
- Format the entire output as a **valid JSON array** with ${days} objects

    `;
    try {
      const response = await axios.post("http://localhost:5000/generate", { prompt });
      const rawText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const jsonStart = rawText.indexOf("[");
      const jsonEnd = rawText.lastIndexOf("]");
      const jsonString = rawText.slice(jsonStart, jsonEnd + 1);
      const parsedData = JSON.parse(jsonString);

      // ✅ Save new lesson to localStorage
      localStorage.setItem("latestLesson", JSON.stringify(parsedData));

      // ✅ Save new history item to localStorage
      const newHistoryItem = {
        topic,
        days,
        timestamp: new Date().toLocaleString(),
        data: parsedData,
      };
      const updatedHistory = [newHistoryItem, ...history];
      localStorage.setItem("lessonHistory", JSON.stringify(updatedHistory));

      setItems(parsedData);

      // Save current version into history
      const timestamp = new Date().toLocaleString();
      setHistory(prev => [
        ...prev,
        {
          topic,
          days,
          timestamp,
        //   data: items
          data: parsedData   
        }
      ]);

      // Set the new lesson as current
      setItems(parsedData);
      // ✅ Update React state
      setHistory(updatedHistory);
      setSelectedIndex(null);
    } catch (error) {
      console.error("Error fetching lesson plan:", error);
    }
  };

  

useEffect(() => {
  const savedItems = localStorage.getItem("latestLesson");
  const savedHistory = localStorage.getItem("lessonHistory");

  if (savedItems) {
    setItems(JSON.parse(savedItems));
  }

  if (savedHistory) {
    setHistory(JSON.parse(savedHistory));
  }
}, []);


//   const deleteHistoryItem = (indexToDelete) => {
//     setHistory(prev => prev.filter((_, index) => index !== indexToDelete));
//     if (selectedIndex === indexToDelete) {
//       setSelectedIndex(null);
//     }
//   };

// const deleteHistoryItem = (indexToDelete) => {
//   const updatedHistory = history.filter((_, index) => index !== indexToDelete);
//   setHistory(updatedHistory);
//   localStorage.setItem("lessonHistory", JSON.stringify(updatedHistory));

//   if (selectedIndex === indexToDelete) {
//     // If you're deleting the one currently being viewed
//     setSelectedIndex(null);
//     const latest = localStorage.getItem("latestLesson");
//     setItems(latest ? JSON.parse(latest) : []);
//   } else if (selectedIndex !== null && indexToDelete < selectedIndex) {
//     // If you're deleting an item before the currently selected one,
//     // shift selectedIndex back since history array shrinks
//     setSelectedIndex(selectedIndex - 1);
//   }
// };
const deleteHistoryItem = (indexToDelete) => {
  const updatedHistory = history.filter((_, index) => index !== indexToDelete);
  setHistory(updatedHistory);
  localStorage.setItem("lessonHistory", JSON.stringify(updatedHistory));

  // If deleting the item being currently viewed
  if (selectedIndex === indexToDelete) {
    setSelectedIndex(null);

    // If only 1 item left (that we just deleted), clear everything
    if (updatedHistory.length === 0) {
      setItems([]);
      localStorage.removeItem("latestLesson");
    } else {
      // Else, update latestLesson to the new most recent item
      const newLatest = updatedHistory[0].data;
      setItems(newLatest);
      localStorage.setItem("latestLesson", JSON.stringify(newLatest));
    }
  } else if (selectedIndex !== null && indexToDelete < selectedIndex) {
    // Adjust index if item before current was deleted
    setSelectedIndex(selectedIndex - 1);
  }
};


  const viewLesson = (index) => {
    setSelectedIndex(index);
  };

  const viewLatest = () => {
    setSelectedIndex(null);
  };



const exportToPDF = () => {
  const element = document.getElementById("lesson-content");

  const rawTopic =
    selectedIndex !== null
      ? history[selectedIndex]?.topic
      : form.topic;

  const safeTopic = (rawTopic || "Lesson")
    .trim()
    .replace(/\s+/g, "_");


  const opt = {
    margin:       10,
    // filename:     `LessonPlan_${new Date().getTime()}.pdf`,
    filename: `LessonPlan_${safeTopic}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true  },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
};


  
  

  const lessonData = selectedIndex !== null ? history[selectedIndex]?.data || [] : items;
  console.log(lessonData);

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
          placeholder="Enter topic (e.g., Arrays)"
          value={form.topic}
          onChange={handleInputChange}
        />
        <button onClick={fetchLessonPlan}>Generate</button>
      </div>

      {history.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h4>History</h4>
          {history.map((entry, index) => (
            <div id='topic' key={index} style={{ marginBottom: "5px" }}>
              <button onClick={() => viewLesson(index)}>
                {entry.topic} ({entry.days} days) - {entry.timestamp}
              </button>
              <button
                onClick={() => deleteHistoryItem(index)}
                style={{ marginLeft: "5px", color: "red" }}
              >
                Delete
              </button>
            </div>
          ))}
          <button onClick={viewLatest} style={{ marginTop: "10px" }}>
            View Latest
          </button>
        </div>
      )}
      <div>
        {lessonData.length > 0 && (
  <button onClick={exportToPDF} style={{ marginTop: "20px", background: "#4CAF50", color: "#fff", padding: "8px 12px" }}>
    💾 Export to PDF
  </button>
)}
      </div>

      <div id="lesson-content" style={{ background: "#fff", color: "#000", padding: "20px" }}  className="mt-10">
        {/* {lessonData.length > 0 && <LessonContent lessonData={lessonData} />} */}
        {
            // lessonData.map((lesson, idx) =>(
            //     <Link to={`/learn/${lesson.day}`} 
            //     key={idx}
            //     state={{lesson}}
            //     >
            //     <div key={idx} className='flex border-t bg-amber-400 p-4'> 
            //     <h1>{lesson.day}</h1>
            //     <h1>{lesson.topic}</h1>
            //     </div>
            //     </Link>
            // ))
        }
      </div>

      <div>
        <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Lesson Plan</h1>
      {lessonData.map((lesson, index) => (
        <Link to={`/learn/${lesson.day}`} 
                key={index}
                state={{lesson}}
                >
        <div key={index} className="mb-8 bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            Day {lesson.day}: {lesson.topic}
          </h2>
        </div>
        </Link>
      ))}
    </div>
      </div>
      

      
    </>
  );
};

export default DemoLesson;
