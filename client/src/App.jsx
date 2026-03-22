import { useEffect, useContext } from 'react'
import './App.css'
import { Route, Routes, Navigate } from 'react-router-dom'
import DemoLesson from './components/DemoLesson'
import Details1 from './pages/Details1'
import Topics from './pages/Topics'
// import Details from './pages/Details'
import Report from './pages/Report'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Footer from './components/Footer'
import { AuthContext } from './context/AuthContext'
import FlashCard from './components/FlashCard'
import Layout from './components/Layout'


const PrivateRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext);
  if (loading) return <div className="min-h-screen flex text-xl justify-center items-center">Loading...</div>;
  return token ? children : <Navigate to="/login" />;
}

function App() {
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
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes with shared Layout */}
      <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route path="/" element={<DemoLesson />} />
        <Route path="/flashcard" element={<FlashCard />} />
        <Route path="/learn/:id" element={<Details1 />} />
        <Route path="/learn/topic/:topic" element={<Topics />} />
        <Route path="/report" element={<Report />} />
      </Route>
    </Routes>
  )
}

export default App
