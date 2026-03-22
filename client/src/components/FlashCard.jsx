import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MdDelete, MdLogout, MdChevronLeft, MdChevronRight, MdRefresh, MdClass } from "react-icons/md";
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import logo from '/logo.png';
import Loading from './Loading';

const FlashCard = () => {
    const { token } = useContext(AuthContext);

    const [form, setForm] = useState({ days: "", topic: "" });
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);

    // Quiz States
    const [quizMode, setQuizMode] = useState(false);
    const [currentCards, setCurrentCards] = useState([]);
    const [currentDay, setCurrentDay] = useState("");
    const [cardIndex, setCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [activeSchedule, setActiveSchedule] = useState(null);
    const [activeTopic, setActiveTopic] = useState("");

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Fetch History from DB
    const fetchHistory = async (activeToken) => {
        const authToken = activeToken || token || localStorage.getItem('token');
        if (!authToken) return;
        try {
            setDataLoading(true);
            const res = await axios.get('http://localhost:5000/api/lessons?type=flashcard', {
                headers: { Authorization: `Bearer ${authToken}` }
            });
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
            toast.error("Failed to load your flashcards.");
        } finally {
            setDataLoading(false);
        }
    };

    useEffect(() => {
        const activeToken = token || localStorage.getItem('token');
        if (activeToken) fetchHistory(activeToken);
    }, [token]);

    const generateFlashcards = async () => {
        const { days, topic } = form;

        if (!days || !topic) {
            toast.error("Please enter both days and topic.");
            return;
        }

        const prompt = `
        Role: You are an expert Curriculum Designer and Subject Matter Expert.
        Task: Create a structured, multi-day flashcard study plan.
        
        Topic: ${topic}
        Duration: ${days} days
        Quantity: 10 flashcards per day.
        
        Format: Return ONLY a valid JSON object.
        Output Schema:
        {
          "topic": "${topic}",
          "total_days": ${days},
          "schedule": {
            "day_1": [ { "question": "...", "answer": "..." } ],
            "day_2": [ ... ]
          }
        }
        `;

        setLoading(true);

        try {
            const authToken = token || localStorage.getItem("token");
            const response = await axios.post("http://localhost:5000/generate",
                { prompt }, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            const rawText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
            const jsonStart = rawText.indexOf("{");
            const jsonEnd = rawText.lastIndexOf("}");
            const jsonString = rawText.slice(jsonStart, jsonEnd + 1);
            const parsedData = JSON.parse(jsonString);

            const cleanTopic = form.topic.split("DAY")[0].trim();
            // Save to MongoDB
            const saveRes = await axios.post('http://localhost:5000/api/lessons', {
                // topic: parsedData.topic,
                topic: cleanTopic,
                days: Number(days),
                type: 'flashcard',
                data: parsedData.schedule
            }, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            const newEntry = {
                id: saveRes.data._id,
                topic: saveRes.data.topic,
                days: saveRes.data.days,
                timestamp: new Date(saveRes.data.createdAt).toLocaleString(),
                data: saveRes.data.data
            };

            setHistory([newEntry, ...history]);
            toast.success("Flashcards generated!");
            setForm({ days: "", topic: "" });
        } catch (error) {
            console.error("Error generating flashcards:", error);
            toast.error("Failed to generate flashcards.");
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
            toast.success("Flashcard set deleted");
        } catch (err) {
            toast.error("Failed to delete.");
        }
    };

    const startQuiz = (entry) => {
        setActiveSchedule(entry.data);
        setActiveTopic(entry.topic);
        const firstDay = Object.keys(entry.data)[0];
        setCurrentDay(firstDay);
        setCurrentCards(entry.data[firstDay]);
        setCardIndex(0);
        setIsFlipped(false);
        setQuizMode(true);
    };

    const switchDay = (day) => {
        setCurrentDay(day);
        setCurrentCards(activeSchedule[day]);
        setCardIndex(0);
        setIsFlipped(false);
    };

    const nextCard = () => {
        if (cardIndex < currentCards.length - 1) {
            setCardIndex(cardIndex + 1);
            setIsFlipped(false);
        }
    };

    const prevCard = () => {
        if (cardIndex > 0) {
            setCardIndex(cardIndex - 1);
            setIsFlipped(false);
        }
    };

    if (quizMode) {
        return (
            <div className="fixed inset-0 z-[110] bg-gray-50 flex flex-col font-sans overflow-y-auto pb-12">
                <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => setQuizMode(false)}>
                        <img src={logo} className="h-12 w-auto" alt="Logo" />
                        <h1 className="text-[#4C4D4F] font-bold text-lg">Smart<span className="text-[#F1BB18]">Revision</span></h1>
                    </div>
                    <button onClick={() => setQuizMode(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md">
                        Exit Quiz
                    </button>
                </nav>

                <div className="flex-1 flex flex-col items-center py-12 px-4">
                    <div className="max-w-4xl w-full">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-2 line-clamp-1">{activeTopic}</h2>
                                <div className="flex flex-wrap gap-2">
                                    {Object.keys(activeSchedule).map((day) => (
                                        <button
                                            key={day}
                                            onClick={() => switchDay(day)}
                                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${currentDay === day ? 'bg-teal-500 text-white shadow-lg' : 'bg-white text-gray-500 border border-gray-200 hover:border-teal-300'}`}
                                        >
                                            {day.replace('_', ' ').toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Progress</p>
                                <p className="text-2xl font-black text-teal-600">{cardIndex + 1} <span className="text-gray-300">/</span> {currentCards.length}</p>
                            </div>
                        </div>

                        {/* Flashcard Area */}
                        <div className="relative h-[400px] w-full perspective-1000 group">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`${currentDay}-${cardIndex}`}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full h-full"
                                >
                                    <div
                                        className={`relative w-full h-full transition-transform duration-700 preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
                                        onClick={() => setIsFlipped(!isFlipped)}
                                    >
                                        {/* Front */}
                                        <div className="absolute inset-0 backface-hidden bg-white rounded-3xl shadow-xl border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
                                            <span className="absolute top-6 left-8 bg-teal-50 text-teal-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Question</span>
                                            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed">
                                                {currentCards[cardIndex]?.question}
                                            </h3>
                                            <p className="mt-8 text-gray-400 font-medium animate-pulse">Click to reveal answer</p>
                                        </div>

                                        {/* Back */}
                                        <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-teal-500 to-[#99d1ca] rounded-3xl shadow-xl p-12 flex flex-col items-center justify-center text-center rotate-y-180 text-white overflow-y-auto">
                                            <span className="absolute top-6 left-8 bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Answer</span>
                                            <p className="text-xl md:text-2xl font-medium leading-relaxed">
                                                {currentCards[cardIndex]?.answer}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-center gap-6 mt-12">
                            <button
                                onClick={prevCard}
                                disabled={cardIndex === 0}
                                className="h-14 w-14 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-700 hover:text-teal-600 hover:border-teal-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <MdChevronLeft className="h-8 w-8" />
                            </button>
                            <button
                                onClick={() => setIsFlipped(!isFlipped)}
                                className="h-14 px-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center gap-2 text-gray-700 font-bold hover:text-teal-600 hover:border-teal-300 transition-all"
                            >
                                <MdRefresh className="h-6 w-6" /> Flip
                            </button>
                            <button
                                onClick={nextCard}
                                disabled={cardIndex === currentCards.length - 1}
                                className="h-14 w-14 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-700 hover:text-teal-600 hover:border-teal-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <MdChevronRight className="h-8 w-8" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 flex flex-col font-sans flex-1">

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

            <div className="relative overflow-hidden w-full bg-gradient-to-br from-[#99d1ca] to-teal-500 text-white flex flex-col items-center justify-center py-16 px-4">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F1BB18]/40 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

                <div className="z-10 max-w-3xl w-full flex flex-col items-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center tracking-tight">AI Flashcard Master</h2>
                    <p className="text-lg md:text-xl text-teal-50 mb-10 text-center max-w-xl">
                        Transform any topic into interactive flashcards. Perfect for quick revisions and active recall.
                    </p>

                    <div className="glass w-full rounded-2xl p-4 md:p-6 shadow-2xl flex flex-col md:flex-row gap-4 items-center relative">
                        <div className="flex-1 w-full">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1 mb-1 block">Subject / Topic</label>
                            <input
                                className="w-full bg-white/80 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F1BB18] transition-all placeholder:text-gray-400 font-medium"
                                type="text"
                                name="topic"
                                placeholder="e.g. Compiler Design"
                                value={form.topic}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="w-full md:w-32">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1 mb-1 block">Days</label>
                            <input
                                className="w-full bg-white/80 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F1BB18] transition-all placeholder:text-gray-400 font-medium"
                                type="number"
                                name="days"
                                placeholder="Days"
                                min="1"
                                max="10"
                                value={form.days}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="w-full md:w-auto mt-auto">
                            <button
                                className="w-full md:w-auto bg-[#F1BB18] hover:bg-[#d8be71] text-gray-900 font-bold px-8 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl transform active:scale-95 disabled:opacity-70 flex justify-center"
                                onClick={generateFlashcards}
                                disabled={loading}
                            >
                                {loading ? "Crafting..." : "Generate Set"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-gray-50 px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold text-gray-800 tracking-tight">Your Flashcard Libraries</h3>
                        <span className="text-sm text-gray-500 font-medium">{history.length} Sets</span>
                    </div>

                    {dataLoading ? (
                        <div className="flex justify-center p-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F1BB18]"></div>
                        </div>
                    ) : history.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center">
                            <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <MdClass className="h-10 w-10 text-gray-300" />
                            </div>
                            <p className="text-gray-500 text-lg">No flashcard sets yet.</p>
                            <p className="text-gray-400 text-sm mt-1">Generate a new set to start practicing!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {history.map((entry) => (
                                <div key={entry.id} className="group bg-white border border-gray-100 shadow-sm hover:shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col">
                                    <div className="h-20 bg-gradient-to-br from-teal-500 to-[#F1BB18] relative">
                                        <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
                                    </div>

                                    <div className="px-6 pb-6 -mt-10 relative z-10 flex-1 flex flex-col">
                                        <div className="h-14 w-14 rounded-2xl bg-white shadow-md border border-gray-50 flex items-center justify-center text-2xl font-bold text-teal-600 mb-4">
                                            {entry.topic.charAt(0).toUpperCase()}
                                        </div>
                                        <h2 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">{entry.topic}</h2>
                                        <p className="text-xs font-bold text-teal-500 uppercase tracking-widest mb-4">{entry.days} Days Practice</p>

                                        <div className="mt-auto pt-4 border-t flex items-center justify-between gap-3">
                                            <button
                                                onClick={() => startQuiz(entry)}
                                                className="flex-1 text-center text-sm font-bold bg-teal-50 hover:bg-teal-500 text-teal-700 hover:text-white px-4 py-2.5 rounded-xl transition-all border border-teal-100/50"
                                            >
                                                Start Quiz
                                            </button>
                                            <button
                                                onClick={() => deleteHistoryItem(entry.id)}
                                                className="text-gray-400 hover:text-red-500 p-2.5 rounded-xl hover:bg-red-50 transition-all"
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

export default FlashCard;