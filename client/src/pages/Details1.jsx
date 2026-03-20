import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Home, BellRing, BellOff, Code2, Link as LinkIcon, BookOpen } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Details1 = () => {
  const location = useLocation();
  const lesson = location.state.lesson;
  const data = location.state.lesson;

  const [activeTab, setActiveTab] = useState(0);
  const [hasReminder, setHasReminder] = useState(false);
  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem('reminders');
    return saved ? JSON.parse(saved) : [];
  });
  const [remindAfterDays, setRemindAfterDays] = useState(1);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('reminders')) || [];
    const found = saved.find(
      r => r.day === lesson.day && r.topic === lesson.topic && r.status === 'active'
    );
    setHasReminder(!!found);
  }, [lesson, reminders]);

  const clearReminder = () => {
    const saved = JSON.parse(localStorage.getItem('reminders')) || [];
    const filtered = saved.filter(
      r => !(r.day === lesson.day && r.topic === lesson.topic)
    );
    setReminders(filtered);
    localStorage.setItem('reminders', JSON.stringify(filtered));
    setHasReminder(false);
    toast.success('Reminder cleared!');
  };

  const handleSetReminder = () => {
    const today = new Date();
    const remindDate = new Date(today);
    remindDate.setDate(today.getDate() + parseInt(remindAfterDays));

    const newReminder = {
      id: Date.now(),
      topic: lesson.topic,
      day: lesson.day,
      remindOn: remindDate.toISOString().split('T')[0],
      status: 'active',
    };

    const updated = [...reminders, newReminder];
    setReminders(updated);
    localStorage.setItem('reminders', JSON.stringify(updated));
    toast.success(`Reminder set for Day ${lesson.day} on ${newReminder.remindOn}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-12">
      <Toaster position="top-center" />
      
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 px-6 py-4 flex items-center justify-between shadow-sm">
        <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-teal-600 font-semibold transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>
        <Link to="/" className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-teal-50 hover:text-teal-600 transition-colors">
           <Home className="w-5 h-5" />
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto w-full px-6 mt-8">
        
        {/* Lesson Header */}
        <div className="bg-gradient-to-br from-[#1e293b] to-gray-800 rounded-3xl p-8 mb-8 text-white shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
           <p className="text-teal-400 font-bold uppercase tracking-wider text-sm mb-2 flex items-center gap-2">
             <BookOpen className="w-4 h-4" /> Day {data.day}
           </p>
           <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight relative z-10">
             {data.topic}
           </h1>
        </div>

        {/* Reminder Block */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className={`p-3 rounded-xl flex-shrink-0 ${hasReminder ? 'bg-teal-50 text-teal-600' : 'bg-amber-50 text-amber-500'}`}>
              <BellRing className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Study Reminder</h3>
              <p className="text-sm text-gray-500">
                {hasReminder ? 'You have an active reminder for this lesson.' : 'Never forget to revise this topic.'}
              </p>
            </div>
          </div>

          {!hasReminder ? (
            <div className="flex items-center gap-2 w-full md:w-auto">
              <input
                type="number"
                min="1"
                value={remindAfterDays}
                onChange={(e) => setRemindAfterDays(e.target.value)}
                className="w-20 border border-gray-200 p-2 text-center rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 bg-gray-50"
                placeholder="Days"
              />
              <span className="text-gray-500 text-sm font-medium mr-2">days later</span>
              <button
                onClick={handleSetReminder}
                className="shrink-0 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold px-4 py-2 rounded-xl transition-colors shadow-sm"
              >
                Set Reminder
              </button>
            </div>
          ) : (
            <button
              onClick={clearReminder}
              className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold px-4 py-2 rounded-xl transition-colors"
            >
              <BellOff className="w-5 h-5" /> Clear Reminder
            </button>
          )}
        </div>

        {/* Concepts Tabs */}
        {data.content.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide mb-2">
            {data.content.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`shrink-0 px-6 py-3 rounded-xl font-bold transition-all ${
                  activeTab === idx 
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-500/30' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-teal-300'
                }`}
              >
                Topic {idx + 1}: {item.concept}
              </button>
            ))}
          </div>
        )}

        {/* Active Concept Content */}
        {(() => {
          const item = data.content[activeTab];
          if (!item) return null;
          return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
               
               <div className="bg-gray-50 border-b border-gray-100 p-6">
                 <h3 className="text-xl font-bold text-gray-800 mb-2">{item.concept}</h3>
                 <p className="text-gray-600 leading-relaxed font-medium">{item.about}</p>
               </div>

               <div className="p-6">
                 <div className="flex items-start gap-3 mb-4">
                   <div className="mt-1 shrink-0 p-2 bg-teal-50 rounded-lg text-teal-600">
                     <Code2 className="w-5 h-5" />
                   </div>
                   <div>
                     <h4 className="font-bold text-lg text-gray-800 tracking-tight">{item.problem.title}</h4>
                     <p className="text-gray-600 mt-1">{item.problem.description}</p>
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                   <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                     <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Input Format</span>
                     <p className="text-gray-800 font-mono text-sm break-words">{item.problem.input}</p>
                   </div>
                   <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                     <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Output Format</span>
                     <p className="text-gray-800 font-mono text-sm break-words">{item.problem.output}</p>
                   </div>
                 </div>

                 <div className="mt-6 border border-gray-100 rounded-xl overflow-hidden">
                   <div className="bg-gray-50 border-b border-gray-100 px-4 py-2">
                     <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Examples</span>
                   </div>
                   <div className="divide-y divide-gray-100 bg-white">
                      {item.problem.examples.map((ex, i) => (
                        <div key={i} className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono">
                          <div>
                            <span className="text-gray-400 text-xs uppercase mb-1 block">Input:</span>
                            <div className="text-gray-800 break-words whitespace-pre-wrap">{ex.input}</div>
                          </div>
                          <div>
                            <span className="text-gray-400 text-xs uppercase mb-1 block">Output:</span>
                            <div className="text-gray-800 text-teal-700 font-semibold break-words whitespace-pre-wrap">{ex.output}</div>
                          </div>
                        </div>
                      ))}
                   </div>
                 </div>

                 <a
                    href={item.practice_que}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-teal-600 hover:text-teal-800 font-bold transition-colors group/link"
                  >
                    <LinkIcon className="w-4 h-4 group-hover/link:-rotate-45 transition-transform" /> 
                    Solve Practice Question
                  </a>

               </div>
            </div>
          );
        })()}

      </div>
    </div>
  );
};

export default Details1;
