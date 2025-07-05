// ReminderSystem.jsx
import React, { useState, useEffect } from 'react';

const ReminderSystem = () => {
  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem('reminders');
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({
    topic: '',
    note: '',
    targetDay: '',
    remindBefore: '',
  });

  // Save reminders to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem('reminders', JSON.stringify(reminders));
  }, [reminders]);

  const getCurrentDay = () => {
    const today = new Date();
    return today.getDate(); // Simplified for demo, real app can track lesson day count
  };

  const handleSetReminder = () => {
    const reminderDay = parseInt(form.targetDay) - parseInt(form.remindBefore);
    const newReminder = {
      id: Date.now(),
      ...form,
      reminderDay,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    setReminders([...reminders, newReminder]);
    setForm({ topic: '', note: '', targetDay: '', remindBefore: '' });
  };

  const handleClearReminder = (id) => {
    const updated = reminders.map(r => r.id === id ? { ...r, status: 'cleared' } : r);
    setReminders(updated);
  };

  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const today = getCurrentDay();
    reminders.forEach(r => {
      if (r.status === 'active' && r.reminderDay === today) {
        new Notification(`📌 Reminder: Revise "${r.topic}"`, {
          body: r.note || 'No additional note',
        });
      }
    });
  }, [reminders]);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Set a DSA Reminder</h2>

      <div className="space-y-3 mb-6">
        <input
          type="text"
          placeholder="Topic (e.g. Arrays)"
          value={form.topic}
          onChange={(e) => setForm({ ...form, topic: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Note (e.g. Revise prefix sums)"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          className="w-full p-2 border rounded"
        ></textarea>
        <input
          type="number"
          placeholder="Target Day (e.g. 10)"
          value={form.targetDay}
          onChange={(e) => setForm({ ...form, targetDay: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Remind how many days before?"
          value={form.remindBefore}
          onChange={(e) => setForm({ ...form, remindBefore: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleSetReminder}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Reminder
        </button>
      </div>

      <h3 className="text-xl font-semibold mb-2">Upcoming Reminders</h3>
      {reminders.filter(r => r.status === 'active').length === 0 && (
        <p className="text-gray-600">No active reminders</p>
      )}

      <ul className="space-y-4">
        {reminders
          .filter(r => r.status === 'active')
          .map(r => (
            <li key={r.id} className="p-4 border rounded shadow-sm bg-white">
              <p><strong>Topic:</strong> {r.topic}</p>
              <p><strong>Note:</strong> {r.note}</p>
              <p><strong>Reminder Day:</strong> Day {r.reminderDay}</p>
              <p><strong>Target Day:</strong> Day {r.targetDay}</p>
              <button
                onClick={() => handleClearReminder(r.id)}
                className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Clear Reminder
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ReminderSystem;
