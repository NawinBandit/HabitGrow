// src/components/Modals/AddHabitModal.js
import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddHabitModal = ({ onClose, onAddHabit }) => {
  const [newHabitName, setNewHabitName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('personal');
  const [selectedTime, setSelectedTime] = useState('08:00');
  const [notificationEnabled, setNotificationEnabled] = useState(true);

  const handleSubmit = () => {
    if (newHabitName.trim()) {
      onAddHabit({
        name: newHabitName.trim(),
        category: selectedCategory,
        time: selectedTime,
        notificationEnabled: notificationEnabled
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">เพิ่มนิสัยใหม่</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Habit Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อนิสัย</label>
            <input
              type="text"
              className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-green-500 transition-colors"
              placeholder="เช่น ดื่มน้ำ 2 ลิตร, อ่านหนังสือ 30 นาที"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              autoFocus
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">หมวดหมู่</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'health', name: 'สุขภาพ', icon: '💪', color: 'bg-green-50 border-green-500' },
                { id: 'learning', name: 'การเรียน', icon: '📚', color: 'bg-blue-50 border-blue-500' },
                { id: 'personal', name: 'ส่วนตัว', icon: '🎯', color: 'bg-purple-50 border-purple-500' },
                { id: 'work', name: 'งาน', icon: '💼', color: 'bg-orange-50 border-orange-500' }
              ].map(cat => (
                <button
                  key={cat.id}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    selectedCategory === cat.id 
                      ? `${cat.color} ring-2 ring-offset-1` 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <span className="text-xl block mb-1">{cat.icon}</span>
                  <div className="text-sm font-medium">{cat.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">เวลาแจ้งเตือน</label>
            <input
              type="time"
              className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-green-500 transition-colors"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            />
          </div>

          {/* Notification Toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <label className="text-sm font-medium text-gray-700">เปิดการแจ้งเตือน</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={notificationEnabled}
                onChange={(e) => setNotificationEnabled(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button 
              className="flex-1 bg-gray-100 hover:bg-gray-200 rounded-xl p-3 font-medium text-gray-700 transition-colors"
              onClick={onClose}
            >
              ยกเลิก
            </button>
            <button 
              className="flex-1 bg-green-500 hover:bg-green-600 rounded-xl p-3 font-medium text-white transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={!newHabitName.trim()}
            >
              เพิ่มนิสัย
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddHabitModal;