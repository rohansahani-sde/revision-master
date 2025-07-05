


import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import Lesson from './pages/Lesson'
import { Route, Router, Routes } from 'react-router-dom'
import DemoLesson from './components/DemoLesson'
import Details1 from './pages/Details1'
import Topics from './pages/Topics'
import Details from './pages/Details'
import Report from './pages/Report'

function App() {

  const [lessonPlan, setLessonPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateLessonPlan = async ({ topic, days }) => {
  setLoading(true);
  setLessonPlan(null);

  try {
    const res = await fetch("http://localhost:3001/api/lesson-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, days }),
    });

    const result = await res.json();
    console.log("Raw Gemini response:", result);

    if (!result.choices || !result.choices[0]) {
      throw new Error("Invalid response: missing choices");
    }

    const content = result.choices[0].message.content;
    console.log("Content from Gemini:", content);

    let lessonJSON;
    try {
      lessonJSON = JSON.parse(content);
    } catch (parseError) {
      console.error("Failed to parse JSON:", parseError);
      alert("Received response is not valid JSON.");
      setLoading(false);
      return;
    }

    setLessonPlan(lessonJSON);
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to generate lesson plan.");
  }

  setLoading(false);
};

// notification 
 useEffect(() => {
    const reminders = JSON.parse(localStorage.getItem("reminders")) || [];
    const today = new Date().toISOString().split("T")[0];

    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    reminders.forEach(reminder => {
      if (reminder.status === "active" && reminder.remindOn === today) {
        new Notification(`🔔 Reminder: Revise ${reminder.topic} (Day ${reminder.day})`);
      }
    });
  }, []);

  
  return (
    <>
    
      <Routes >
        {/* <Route path="/" element={ <Lesson /> } />  */}
        <Route path="/" element={ <DemoLesson /> } /> 
        {/* <Route path="/learn/:id" element={ <Details /> } />  */}
        <Route path="/learn/:id" element={ <Details1 /> } /> 
        <Route path="/learn/topic/:topic" element={ <Topics /> } /> 
        <Route path="/report" element={ <Report /> } /> 

      </Routes>
      

    </>
  )
}

export default App
