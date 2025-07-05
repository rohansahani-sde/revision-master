import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaHome } from "react-icons/fa";
import CodeEditor from '../components/CodeEditor';

const Details1 = () => {
  const location = useLocation();
  const lesson = location.state.lesson;
  const data = location.state.lesson;
  const example = lesson.content;
  const content = lesson.content[0];

  const [hasReminder, setHasReminder] = useState(false);

//   check for reminder
// Check if a reminder already exists for this lesson
useEffect(() => {
  const saved = JSON.parse(localStorage.getItem('reminders')) || [];
  const found = saved.find(
    r => r.day === lesson.day && r.topic === lesson.topic && r.status === 'active'
  );
  setHasReminder(!!found);
}, []);

// clear reminder
const clearReminder = () => {
  const saved = JSON.parse(localStorage.getItem('reminders')) || [];
  const filtered = saved.filter(
    r => !(r.day === lesson.day && r.topic === lesson.topic)
  );
  setReminders(filtered);
  localStorage.setItem('reminders', JSON.stringify(filtered));
  setHasReminder(false);
  alert('Reminder cleared!');
};


  // 🟡 Reminder states
  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem('reminders');
    return saved ? JSON.parse(saved) : [];
  });

  const [remindAfterDays, setRemindAfterDays] = useState(1);

  // 🟢 Save reminder to localStorage
  const handleSetReminder = () => {
    const today = new Date();
    const remindDate = new Date(today);
    remindDate.setDate(today.getDate() + parseInt(remindAfterDays));

    // remindDate.setDate(today.getDate());

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
    alert(`Reminder set for "${lesson.topic}" on ${newReminder.remindOn}`);
  };

  // 🔔 Show notification if today's reminder matches
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];

    reminders.forEach(reminder => {
      if (reminder.status === 'active' && reminder.remindOn === today) {
        if (Notification.permission === 'granted') {
          new Notification(`🔔 Reminder: Revise ${reminder.topic} (Day ${reminder.day})`);
        } else {
          Notification.requestPermission().then(perm => {
            if (perm === 'granted') {
              new Notification(`🔔 Reminder: Revise ${reminder.topic} (Day ${reminder.day})`);
            }
          });
        }
      }
    });
  }, [reminders]);

  return (
    <>
      <div className="p-6 bg-gray-100 min-h-screen">
        <Link to={"/"} >
          <h1 className='flex items-center'> <span><FaArrowLeft /></span>  Home <FaHome />  </h1>
        </Link>

        <h1 className="text-3xl font-bold mb-6 text-center">Lesson Details</h1>

        <div className="mb-8 bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            Day {data.day}: {data.topic}
          </h2>

          {data.content.map((item, idx) => (
            <div key={idx} className="border-l-4 border-blue-500 pl-4 mb-6">
              <h3 className="text-lg font-semibold">{item.concept}</h3>
              <p className="text-gray-700 mb-2">{item.about}</p>

              <div className="mb-2">
                <h4 className="font-medium text-md">🧩 Problem: {item.problem.title}</h4>
                <p className="text-sm text-gray-800 mb-1">{item.problem.description}</p>

                <p className="text-sm text-gray-700">
                  <strong>Input:</strong> {item.problem.input}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Output:</strong> {item.problem.output}
                </p>

                <div className="mt-2 text-sm text-gray-800">
                  <strong>Examples:</strong>
                  <ul className="list-disc ml-6">
                    {item.problem.examples.map((ex, i) => (
                      <li key={i}>
                        <strong>Input:</strong> {ex.input} | <strong>Output:</strong> {ex.output}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <a
                href={item.practice_que}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-blue-500 hover:underline"
              >
                🔗 Practice Question
              </a>
            </div>
          ))}

          {/* ✅ Reminder UI Section */}
          <div className="mt-6 bg-gray-100 p-4 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">⏰ Set Reminder for this topic</h3>
            <input
              type="number"
              min="1"
              value={remindAfterDays}
              onChange={(e) => setRemindAfterDays(e.target.value)}
              className="border p-2 rounded w-64 mb-2"
              placeholder="Enter days after which to remind"
            />
            <button
              onClick={handleSetReminder}
              className="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Set Reminder
            </button>

          </div>

          <div>

            {hasReminder && (
  <div className="mt-4">
    <button
      onClick={clearReminder}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      Clear Reminder
    </button>
  </div>
)}
          </div>

        </div>
      </div>

      {/* <CodeEditor /> */}
    </>
  );
};

export default Details1;
