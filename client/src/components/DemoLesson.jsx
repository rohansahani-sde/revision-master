import axios from 'axios';
import React, { useState } from 'react';
import { useEffect } from 'react';
// import jsPDF from 'jspdf';
import html2pdf from "html2pdf.js";
import LessonContent from './LessonContent';
import { Link } from 'react-router-dom';
import Loading from './Loading';
// import html2canvas from 'html2canvas';
import logo from '/logo.png';
import { MdDelete } from "react-icons/md";

const DemoLesson = () => {
  const [form, setForm] = useState({ days: "", topic: "" });
  const [items, setItems] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(false);

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


    setLoading(true);
    
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
    }finally{
      setLoading(false);
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


  
  

  // const lessonData = selectedIndex !== null ? history[selectedIndex]?.data || [] : items;
  // console.log(lessonData);

  return (
    <>
  

    

{/* <nav class="bg-white border-gray-200 "> */}
{/* navbar */}
  {/* <div className="bg-[#99d1ca] py-5 flex items-center ">
    <img src={logo} className=" h-32 w-36 " alt="Smart Revision Logo" />
    
    <div className='w-36 text-sm font-semibold '> 
      <h1 className='flex justify-start text-[#4C4D4F]'>Where Revision</h1> 
      <h1 className='flex justify-end text-[#F1BB18]'>Meets Intelligence</h1> 
    </div>

    <nav className=' w-3/4 flex flex-col justify-center items-center border'>
      <div className=''>
        <h3 className=' justify-center flex'>Generate Lesson Plan</h3>
        <input className='p-1 border-b-2 border-black focus:outline-none'
          type="number"
          name="days"
          placeholder="Enter number of days"
          value={form.days}
          onChange={handleInputChange}
        />
        <input className='p-1 border-b-2 border-black focus:outline-none'
          type="text"
          name="topic"
          placeholder="Enter topic (e.g., Arrays)"
          value={form.topic}
          onChange={handleInputChange}
        />
        <button className="bg-[#F1BB18] hover:bg-[#F1BB18] p-1 rounded-r"
        onClick={fetchLessonPlan}>Generate</button>
      </div>
    </nav>
    
  </div> */}

  <div className="bg-[#99d1ca] py-6 px-4 flex flex-wrap items-center justify-between">
  {/* Logo & Tagline */}
  <div className="flex items-center gap-4">
    <img src={logo} className="h-32 w-40 object-contain" alt="Smart Revision Logo" />
    <div className="text-sm font-semibold leading-tight">
      <h1 className="text-[#4C4D4F]">Where Revision</h1>
      <h1 className="text-[#F1BB18] text-end">Meets Intelligence</h1>
    </div>
  </div>

  {/* Lesson Plan Generator */}
  <nav className="flex-1 max-w-xl bg-white rounded-lg shadow-md px-6 py-4">
    <h3 className="text-lg font-bold text-center text-[#4C4D4F] mb-4">Generate Lesson Plan</h3>

    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
      <input
        className="flex-1 p-2 border-b-2 border-black focus:outline-none placeholder:text-gray-600"
        type="number"
        name="days"
        placeholder="Enter number of days"
        value={form.days}
        onChange={handleInputChange}
      />

      <input
        className="flex-1 p-2 border-b-2 border-black focus:outline-none placeholder:text-gray-600"
        type="text"
        name="topic"
        placeholder="Enter topic (e.g., Arrays)"
        value={form.topic}
        onChange={handleInputChange}
      />

      <button
        className="bg-[#F1BB18] text-black font-medium px-4 py-2 rounded hover:brightness-105 transition"
        onClick={fetchLessonPlan}
      >
        Generate
      </button>
    </div>
  </nav>

  <nav className="flex-1 max-w-xl  rounded-lg shadow-md hover:shadow-[#d8be71] px-6 py-4 flex justify-between">
    {/* <div className="flex-1  flex justify-end items-center gap-6 text-sm font-medium text-[#4C4D4F]"> */}
    <a href="/" className="hover:underline">Home</a>
    <a href="/report" className="hover:underline">Report</a>
    <a href="/profile" className="hover:underline">Profile</a>
    <a href="https://github.com/rohansahani-sde" target="_blank" rel="noopener noreferrer" className="hover:underline">
      GitHub
    </a>
  {/* </div> */}
    {/* <h3 className="text-lg font-bold text-center text-[#4C4D4F] mb-4">Generate Lesson Plan</h3> */}

    {/* <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
      <input
        className="flex-1 p-2 border-b-2 border-black focus:outline-none placeholder:text-gray-600"
        type="number"
        name="days"
        placeholder="Enter number of days"
        value={form.days}
        onChange={handleInputChange}
      />

      <input
        className="flex-1 p-2 border-b-2 border-black focus:outline-none placeholder:text-gray-600"
        type="text"
        name="topic"
        placeholder="Enter topic (e.g., Arrays)"
        value={form.topic}
        onChange={handleInputChange}
      />

      <button
        className="bg-[#F1BB18] text-black font-medium px-4 py-2 rounded hover:brightness-105 transition"
        onClick={fetchLessonPlan}
      >
        Generate
      </button>
    </div> */}
  </nav>

</div>


      {/* PDF download */}
      {/* <div>
        {lessonData.length > 0 && (
          <button onClick={exportToPDF} style={{ marginTop: "20px", background: "#4CAF50", color: "#fff", padding: "8px 12px" }}>
          💾 Export to PDF
          </button>
        )}
        </div> */}


    
    

        <div className=' bg-[#d8be71] pt-6 h-screen'>
          {history.length > 0 && (
          <div >
          {/* // style={{ marginTop: "20px" }} */}
            {/* <h4>History</h4> */}
  
            {
              loading ?  <Loading />  : (
  
                history.map((entry, index) => (
              //     <div id='topic' key={index} className='flex' >
      
              //   <Link to={`/learn/topic/${entry.topic}`} key={index} className='w-full'
              //   state={{lessonData : entry.data}}
              //   >
              //     <div key={index} className="mb-8 w-full bg-white p-4 rounded-l-2xl shadow flex justify-between">
              //       <h2 className="text-xl font-semibold text-blue-600 mb-2">
              //         {entry.topic} ({entry.days} days) - {entry.timestamp}
              //       </h2>
              //     </div>
              //   </Link>
      
              // {/* delete button */}
              // <div className="mb-8  bg-white  p-4 rounded-r-2xl shadow">
              //   <button className="text-xl font-semibold text-blue-600 mb-2"
              //   onClick={() => deleteHistoryItem(index)}
              //   >
              //     Delete
              //   </button>
              // </div>
              
      
              //     </div>
            <div id="topic" key={index} className="flex items-center mb-4 shadow rounded-2xl overflow-hidden bg-white transition hover:shadow-lg">
                {/* Lesson Link */}
                <Link
                to={`/learn/topic/${entry.topic}`}
                state={{ lessonData: entry.data }}
                className="flex-1 p-4 hover:bg-gray-50 transition duration-150"
                >
                  <h2 className="text-lg md:text-xl font-semibold text-[#F1BB18] flex justify-center">
                    {entry.topic} <span className="text-[#d8be71]">({entry.days} days)</span>
                  </h2>
                  <p className="text-sm text-gray-400 mt-1 flex justify-center">{entry.timestamp}</p>
                </Link>
                
              {/* Delete Button */}
              <div className="p-4 bg-gray-50 border-l flex items-center justify-center">
                <button
                onClick={() => deleteHistoryItem(index)}
                className="text-red-600 hover:text-red-800 font-medium text-sm md:text-base flex items-center"
                title="Delete lesson"
                >
                  <MdDelete />  Delete
                </button>
              </div>

            </div>

      
                ))
              )
            }
  
            <button onClick={viewLatest} style={{ marginTop: "10px" }}>
              View Latest
            </button>
          </div>
          )}
        </div>
      

      
    </>
  );
};

export default DemoLesson;
