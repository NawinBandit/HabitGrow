// src/components/Screens/JournalScreen.js
import React, { useState } from 'react';
import { Search, Clock } from 'lucide-react';

const JournalScreen = ({ journalEntries, addJournalEntry }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [journalText, setJournalText] = useState('');

  const handleSaveJournal = () => {
    if (journalText.trim() && selectedMood !== null) {
      const moods = ['😊', '🙂', '😐', '😔', '😤'];
      const now = new Date();
      const newEntry = {
        id: Date.now(),
        date: now.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }),
        mood: moods[selectedMood],
        preview: journalText.slice(0, 60) + (journalText.length > 60 ? '...' : ''),
        time: now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        fullText: journalText
      };
      addJournalEntry(newEntry);
      setJournalText('');
      setSelectedMood(null);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 p-4 overflow-y-auto h-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">บันทึกส่วนตัว</h1>
      
      {/* Mood Tracker */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">อารมณ์วันนี้เป็นอย่างไร?</h2>
        <div className="flex justify-around">
          {[
            { emoji: '😊', label: 'ดีมาก' },
            { emoji: '🙂', label: 'ดี' },
            { emoji: '😐', label: 'ธรรมดา' },
            { emoji: '😔', label: 'เศร้า' },
            { emoji: '😤', label: 'หงุดหงิด' }
          ].map((mood, index) => (
            <button 
              key={index}
              className={`w-16 h-16 rounded-full hover:scale-110 transition-transform duration-200 ${
                selectedMood === index 
                  ? 'bg-blue-100 ring-4 ring-blue-200' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedMood(index)}
            >
              <div className="text-2xl">{mood.emoji}</div>
              <div className="text-xs text-gray-600 mt-1">{mood.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Journal Entry */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">เขียนบันทึกวันนี้</h2>
        <textarea
          className="w-full border-2 border-gray-200 rounded-lg p-4 h-32 resize-none focus:outline-none focus:border-blue-500 transition-colors duration-200"
          placeholder="เขียนเรื่องราวของวันนี้... อะไรที่ทำให้คุณมีความสุข? มีความท้าทายอะไรบ้าง?"
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
        />
        <button 
          onClick={handleSaveJournal}
          disabled={!journalText.trim() || selectedMood === null}
          className="w-full bg-blue-500 hover:bg-blue-600 rounded-lg p-3 mt-4 text-white font-medium transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          บันทึก
        </button>
      </div>

      {/* Recent Entries */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">บันทึกย้อนหลัง</h2>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Search className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="space-y-4">
          {journalEntries.map((entry) => (
            <div key={entry.id} className="border-l-4 border-blue-200 pl-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors duration-200 rounded-r-lg">
              <div className="flex items-start">
                <span className="text-2xl mr-3">{entry.mood}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-medium text-gray-800">{entry.date}</h3>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {entry.time}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{entry.preview}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JournalScreen;