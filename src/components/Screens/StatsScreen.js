// src/components/Screens/StatsScreen.js
import React from 'react';
import { Filter, Calendar, TrendingUp } from 'lucide-react';

const StatsScreen = ({ habits, getCategoryInfo }) => {
  // คำนวณสถิติจริงจากข้อมูล
  const completedToday = habits.filter(h => h.completed).length;
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  const longestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak || 0)) : 0;

  return (
    <div className="flex-1 bg-gray-50 p-4 overflow-y-auto h-full">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">สถิติ & ความก้าวหน้า</h1>
        <button className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
          <Filter className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {habits.length === 0 ? (
        // แสดงเมื่อยังไม่มีนิสัย
        <div className="bg-white rounded-xl p-8 text-center shadow-sm">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">ยังไม่มีข้อมูลสถิติ</h3>
          <p className="text-gray-600">เพิ่มนิสัยและเริ่มต้นติดตามความก้าวหน้าของคุณ</p>
        </div>
      ) : (
        <>
          {/* Today's Progress */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">ความคืบหน้าวันนี้</h2>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">เสร็จสมบูรณ์</span>
                <span className="text-lg font-bold text-green-600">{completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {completedToday} จาก {totalHabits} นิสัย
              </div>
            </div>
            {completionRate > 0 && (
              <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-100">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">ทำได้ดีมาก! </span>
                <span className="text-lg font-bold text-green-600">{completionRate}%</span>
              </div>
            )}
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-green-600 mb-1">{completionRate}%</div>
              <div className="text-xs text-gray-600">เสร็จวันนี้</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-orange-600 mb-1">{longestStreak}</div>
              <div className="text-xs text-gray-600">วันติดต่อกัน</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-purple-600 mb-1">{totalHabits}</div>
              <div className="text-xs text-gray-600">นิสัยทั้งหมด</div>
            </div>
          </div>

          {/* Habits List */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">นิสัยของคุณ</h2>
            <div className="space-y-3">
              {habits.slice(0, 5).map((habit, index) => {
                const categoryInfo = getCategoryInfo(habit.category);
                return (
                  <div key={habit.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      habit.completed 
                        ? 'bg-gradient-to-br from-green-400 to-green-600 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {habit.completed ? '✓' : index + 1}
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${habit.completed ? 'text-green-700' : 'text-gray-800'}`}>
                        {habit.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {habit.streak > 0 ? `${habit.streak} วันติดต่อกัน` : 'เริ่มต้นสร้าง Streak'}
                      </div>
                    </div>
                    <div className="text-2xl">{categoryInfo.icon}</div>
                  </div>
                );
              })}
            </div>
            {habits.length > 5 && (
              <div className="text-center mt-4 text-sm text-gray-500">
                และอีก {habits.length - 5} นิสัย
              </div>
            )}
          </div>

          {/* Motivation Card */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-md mb-20">
            <h3 className="text-lg font-semibold mb-2">💪 กำลังใจ</h3>
            <p className="text-green-50">
              {completionRate === 100 
                ? 'ยอดเยี่ยม! คุณทำนิสัยครบทุกอย่างวันนี้!' 
                : completionRate >= 50 
                  ? 'ทำได้ดีมาก! อีกนิดเดียวก็ครบแล้ว' 
                  : 'เริ่มต้นได้ดีแล้ว! ค่อยๆ ทำไปทีละนิสัย'}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default StatsScreen;