import { useEffect, useContext } from 'react'
import './App.css'
import { Route, Routes, Navigate } from 'react-router-dom'
import DemoLesson from './components/DemoLesson'
import Details1 from './pages/Details1'
import Topics from './pages/Topics'
import Details from './pages/Details'
import Report from './pages/Report'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Footer from './components/Footer'
import { AuthContext } from './context/AuthContext'


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
    <div className="min-h-screen flex flex-col">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route path="/" element={<PrivateRoute><DemoLesson /></PrivateRoute>} />
        <Route path="/learn/:id" element={<PrivateRoute><Details1 /></PrivateRoute>} />
        <Route path="/learn/topic/:topic" element={<PrivateRoute><Topics /></PrivateRoute>} />
        <Route path="/report" element={<PrivateRoute><Report /></PrivateRoute>} />
        {/* <Route path="/CodeEditor" element={<PrivateRoute><CodeEditor /></PrivateRoute>} /> */}
      </Routes>
      <Footer />
    </div>
  )
}

export default App
