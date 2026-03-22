import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import html2pdf from "html2pdf.js";
import { Link, useNavigate } from 'react-router-dom';
import Loading from './Loading';
import logo from '/logo.png';
import { MdDelete, MdLogout } from "react-icons/md";
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const DemoLesson = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ days: "", topic: "" });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Fetch History from DB
  const fetchHistory = async (activeToken) => {
    const authToken = activeToken || token || localStorage.getItem('token');
    if (!authToken) return;
    try {
      setDataLoading(true);
      const res = await axios.get('http://localhost:5000/api/lessons', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      // Map MongoDB _id to the items for deletion later
      const formattedHistory = res.data.map(item => ({
        id: item._id,
        topic: item.topic,
        days: item.days,
        timestamp: new Date(item.createdAt).toLocaleString(),
        data: item.data
      }));
      setHistory(formattedHistory);
    } catch (err) {
      console.error("Error fetching history:", err);
      toast.error("Failed to load your study plans.");
    } finally {
      setDataLoading(false);
    }
  };

  // Fetch on mount and whenever token changes.
  // Also reads directly from localStorage as a safety net so plans
  // always load even if the context token state hasn't propagated yet.
  useEffect(() => {
    const activeToken = token || localStorage.getItem('token');
    if (activeToken) fetchHistory(activeToken);
  }, [token]);

  const fetchLessonPlan = async () => {
    const { days, topic } = form;

    if (!days || !topic) {
      toast.error("Please enter both days and topic.");
      return;
    }

    const prompt = `
    Create a ${days}-day JSON lesson plan for the topic "${topic}" at a intermediate level.
Each day should include:
- "day": The day number (1–${days})
- "topic": The main concept covered that day
- "content": An array of one or more objects per concept, each including:
  - "concept": Title of the subtopic or algorithm
  - "about": A short explanation (1–2 lines) of the concept
  - "problem": An object with:
    - "title": Problem title
    - "description": A concise coding problem description (max 200 words)
    - "input": Input format description
    - "output": Output format description
    - "examples": Minimum 2 input-output examples in a language-agnostic format
  - "practice_que": A relevant problem link from LeetCode, GeeksforGeeks, or similar

Requirements:
- Format the entire output as a **valid JSON array** with ${days} objects
    `;

    setLoading(true);

    try {
      const authToken = token || localStorage.getItem("token");
      const response = await axios.post("http://localhost:5000/generate",
        { prompt }, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      const rawText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const jsonStart = rawText.indexOf("[");
      const jsonEnd = rawText.lastIndexOf("]");
      const jsonString = rawText.slice(jsonStart, jsonEnd + 1);
      const parsedData = JSON.parse(jsonString);

      // Save to MongoDB Instead of LocalStorage
      const saveRes = await axios.post('http://localhost:5000/api/lessons', {
        topic,
        days: Number(days),
        data: parsedData
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const newLesson = {
        id: saveRes.data._id,
        topic: saveRes.data.topic,
        days: saveRes.data.days,
        timestamp: new Date(saveRes.data.createdAt).toLocaleString(),
        data: saveRes.data.data
      };

      setHistory([newLesson, ...history]);
      toast.success("Study plan generated successfully!");
      setForm({ days: "", topic: "" });
    } catch (error) {
      console.error("Error fetching lesson plan:", error);
      toast.error("Failed to generate plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteHistoryItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/lessons/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(history.filter(item => item.id !== id));
      toast.success("Lesson deleted successfully");
    } catch (err) {
      toast.error("Failed to delete lesson.");
    }
  };

  return (
    <div className="bg-gray-50 flex flex-col font-sans flex-1">

      {/* Fullscreen AI Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gray-900/80 backdrop-blur-md transition-all duration-300">
          <div className="relative flex items-center justify-center w-28 h-28 mb-8">
            <div className="absolute inset-0 rounded-full border-[6px] border-t-[#F1BB18] border-r-transparent border-b-[#99d1ca] border-l-transparent animate-spin" style={{ animationDuration: '1.5s' }}></div>
            <div className="absolute inset-2 rounded-full border-[4px] border-t-transparent border-r-teal-400 border-b-transparent border-l-[#F1BB18] animate-spin" style={{ animationDuration: '1s', animationDirection: 'reverse' }}></div>
            <div className="w-12 h-12 bg-gradient-to-tr from-teal-400 to-[#F1BB18] rounded-full animate-pulse shadow-[0_0_40px_rgba(241,187,24,0.8)]"></div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3 tracking-tight animate-pulse">Crafting Your Curriculum...</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F1BB18] animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#F1BB18] animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
          <p className="text-gray-300 text-sm mt-8 font-medium">Please wait a few seconds while AI generates the perfect study plan.</p>
        </div>
      )}

      {/* Premium Navbar */}
      <nav className="glass sticky top-0 z-50 px-6 py-4 flex flex-wrap items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <img src={logo} className="h-16 w-auto object-contain drop-shadow-md" alt="Smart Revision Logo" />
          <div className="hidden sm:block">
            <h1 className="text-[#4C4D4F] font-bold text-lg leading-tight tracking-tight">Smart<span className="text-[#F1BB18]">Revision</span></h1>
            <p className="text-xs text-gray-500 font-medium">Where Revision Meets Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/" className="text-gray-700 font-medium hover:text-[#F1BB18] transition-colors">Home</Link>
          <Link to="/report" className="text-gray-700 font-medium hover:text-[#F1BB18] transition-colors">Report</Link>
          <div className="h-8 w-px bg-gray-300"></div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 shadow-sm pl-1.5 pr-4 py-1.5 rounded-full cursor-default hover:border-teal-300 transition-colors">
              <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-teal-500 to-[#F1BB18] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-inner">
                {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
              </div>
              <span className="text-sm font-bold text-gray-700 tracking-tight">
                {user?.name || "Student"}
              </span>
            </div>
            <button onClick={handleLogout} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors group" title="Logout">
              <MdLogout className="h-6 w-6 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Header & Generator */}
      <div className="relative overflow-hidden w-full bg-gradient-to-br from-[#99d1ca] to-teal-500 text-white flex flex-col items-center justify-center py-16 px-4">
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F1BB18]/40 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div className="z-10 max-w-3xl w-full flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center tracking-tight">Create Your Next Study Plan</h2>
          <p className="text-lg md:text-xl text-teal-50 mb-10 text-center max-w-xl">
            Tell us what you want to learn and how many days you have. AI will curate an optimal learning path for you.
          </p>

          <div className="glass w-full rounded-2xl p-4 md:p-6 shadow-2xl flex flex-col md:flex-row gap-4 items-center relative">
            <div className="flex-1 w-full">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1 mb-1 block">Subject / Topic</label>
              <input
                className="w-full bg-white/80 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F1BB18] transition-all placeholder:text-gray-400 font-medium"
                type="text"
                name="topic"
                placeholder="e.g. Dynamic Programming"
                value={form.topic}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-full md:w-32">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1 mb-1 block">Duration</label>
              <input
                className="w-full bg-white/80 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F1BB18] transition-all placeholder:text-gray-400 font-medium"
                type="number"
                name="days"
                placeholder="Days"
                min="1"
                max="30"
                value={form.days}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-full md:w-auto mt-auto">
              <button
                className="w-full md:w-auto bg-[#F1BB18] hover:bg-[#d8be71] text-gray-900 font-bold px-8 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl transform active:scale-95 disabled:opacity-70 flex justify-center"
                onClick={fetchLessonPlan}
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate Plan"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content (History) */}
      <div className="flex-1 bg-gray-50 px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-800 tracking-tight">Your Study Libraries</h3>
            <span className="text-sm text-gray-500 font-medium">{history.length} Plans</span>
          </div>

          {dataLoading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F1BB18]"></div>
            </div>
          ) : history.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center">
              <img src="/logo.png" className="h-24 opacity-30 grayscale mb-4" alt="Empty" />
              <p className="text-gray-500 text-lg">You haven't generated any study plans yet.</p>
              <p className="text-gray-400 text-sm mt-1">Generate your first plan above to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {history.map((entry) => (
                <div key={entry.id} className="group relative bg-white border border-gray-100 shadow-sm hover:shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-teal-300 flex flex-col">

                  {/* Premium Banner */}
                  <div className="h-24 bg-gradient-to-br from-teal-500 to-[#F1BB18] opacity-90 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
                    <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/20"></div>
                    <div className="absolute bottom-2 left-10 w-8 h-8 rounded-full bg-white/10"></div>
                  </div>

                  {/* Icon Badge */}
                  <div className="absolute top-16 left-6 h-14 w-14 rounded-2xl bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex items-center justify-center text-2xl font-bold text-teal-600 border flex-shrink-0 border-gray-100 z-10">
                    {entry.topic.charAt(0).toUpperCase()}
                  </div>

                  <div className="pt-10 pb-6 px-6 flex-1 flex flex-col">
                    <h2 className="text-xl font-bold text-gray-800 leading-tight mb-2 group-hover:text-teal-700 transition-colors line-clamp-2">
                      {entry.topic}
                    </h2>

                    <div className="text-sm font-medium text-gray-500 flex flex-wrap items-center gap-2 mb-6">
                      <span className="bg-teal-50 text-teal-700 px-2.5 py-1 rounded-md text-xs font-bold">{entry.days} Days Plan</span>
                      <span>•</span>
                      <span className="text-xs">{entry.timestamp.split(',')[0]}</span>
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                      <Link
                        to={`/learn/topic/${entry.topic}`}
                        state={{ lessonData: entry.data }}
                        className="flex-1 text-center text-sm font-bold bg-gray-50 hover:bg-teal-50 text-gray-700 hover:text-teal-700 px-4 py-2.5 rounded-xl transition-colors border border-transparent hover:border-teal-100"
                      >
                        Open Plan
                      </Link>
                      <button
                        onClick={() => deleteHistoryItem(entry.id)}
                        className="text-gray-400 hover:bg-red-50 hover:text-red-600 p-2.5 rounded-xl transition-colors border border-transparent hover:border-red-100 flex-shrink-0"
                        title="Delete lesson"
                      >
                        <MdDelete className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoLesson;
