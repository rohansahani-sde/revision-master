import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';

const Topics = () => {
  const location = useLocation();
  const lessonData = location.state?.lessonData || [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans p-6">
      
      {/* Premium Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center mb-8">
        <Link to="/" className="flex items-center text-gray-500 hover:text-teal-600 font-medium transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>
      </div>

      <div className="max-w-4xl mx-auto w-full">
        <div className="bg-gradient-to-r from-teal-500 to-[#99d1ca] rounded-3xl p-8 mb-8 text-white shadow-xl shadow-teal-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 relative z-10 flex items-center gap-3">
             <BookOpen className="w-8 h-8 opacity-80" /> Study Plan Overview
          </h1>
          <p className="text-teal-50 text-lg opacity-90 relative z-10">
            {lessonData.length} days of learning structured for you.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {lessonData.map((lesson, index) => (
            <Link 
              to={`/learn/${lesson.day}`} 
              key={index}
              state={{ lesson }}
              className="group block"
            >
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-teal-300 transition-all duration-300 h-full flex items-center justify-between">
                <div>
                   <p className="text-sm font-bold text-teal-600 uppercase tracking-wider mb-1">Day {lesson.day}</p>
                   <h2 className="text-xl font-bold text-gray-800 group-hover:text-teal-700 transition-colors leading-tight">
                     {lesson.topic}
                   </h2>
                </div>
                <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                   <ArrowLeft className="w-5 h-5 rotate-180" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Topics;