// src/components/Screens/GoalsScreen.js
import React, { useState, useEffect } from 'react';
import { Target, Plus, X, CheckCircle2, Circle, TrendingUp, Calendar } from 'lucide-react';

const GoalsScreen = ({ habits, getCategoryInfo, userId }) => {
  const [goals, setGoals] = useState([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: 10,
    type: 'streak',
    category: 'health'
  });

  // โหลดเป้าหมายจาก localStorage
  useEffect(() => {
    if (userId) {
      const savedGoals = localStorage.getItem(`goals_${userId}`);
      if (savedGoals) {
        setGoals(JSON.parse(savedGoals));
      } else {
        // เป้าหมายเริ่มต้น
        const defaultGoals = [
          {
            id: 1,
            title: 'ทำนิสัยครบทุกวัน 7 วันติดต่อกัน',
            target: 7,
            current: 0,
            type: 'streak',
            reward: '🏆 ได้เหรียญทอง',
            deadline: '2025-10-14'
          },
          {
            id: 2,
            title: 'ทำนิสัยด้านสุขภาพ 20 ครั้ง',
            target: 20,
            current: 0,
            type: 'category',
            category: 'health',
            reward: '💪 ได้เหรียญสุขภาพ'
          }
        ];
        setGoals(defaultGoals);
      }
    }
  }, [userId]);

  // บันทึกเป้าหมายลง localStorage
  useEffect(() => {
    if (userId && goals.length > 0) {
      localStorage.setItem(`goals_${userId}`, JSON.stringify(goals));
    }
  }, [goals, userId]);

  // รีเซ็ตเป้าหมายรายวัน
  useEffect(() => {
    if (!userId) return;

    const checkAndResetGoals = () => {
      const today = new Date().toDateString();
      const lastCheckDate = localStorage.getItem(`lastGoalsCheckDate_${userId}`);

      if (lastCheckDate !== today) {
        console.log('🎯 New day - Resetting daily goals...');
        
        const resetGoals = goals.map(goal => {
          // รีเซ็ตเฉพาะเป้าหมายประเภท 'daily' หรือถ้าต้องการรีเซ็ตทั้งหมด
          if (goal.type === 'daily' || goal.resetDaily) {
            return { ...goal, current: 0 };
          }
          return goal;
        });

        setGoals(resetGoals);
        localStorage.setItem(`lastGoalsCheckDate_${userId}`, today);
      }
    };

    checkAndResetGoals();
    const interval = setInterval(checkAndResetGoals, 3600000); // เช็คทุก 1 ชั่วโมง

    return () => clearInterval(interval);
  }, [goals, userId]);

  const handleAddGoal = () => {
    if (newGoal.title.trim()) {
      const goal = {
        id: Date.now(),
        ...newGoal,
        current: 0,
        reward: '🎯 รางวัลพิเศษ',
        createdAt: new Date().toISOString(),
        resetDaily: newGoal.type === 'daily' // เพิ่ม flag สำหรับรีเซ็ตรายวัน
      };
      setGoals([...goals, goal]);
      setNewGoal({ title: '', target: 10, type: 'streak', category: 'health' });
      setShowAddGoal(false);
    }
  };

  const deleteGoal = (id) => {
    if (window.confirm('ต้องการลบเป้าหมายนี้?')) {
      setGoals(goals.filter(g => g.id !== id));
    }
  };

  // เพิ่มฟังก์ชันรีเซ็ตแบบ manual
  const resetGoal = (id) => {
    if (window.confirm('ต้องการรีเซ็ตเป้าหมายนี้เป็น 0?')) {
      setGoals(goals.map(g => g.id === id ? { ...g, current: 0 } : g));
    }
  };

  const getProgress = (goal) => {
    return Math.min(100, Math.round((goal.current / goal.target) * 100));
  };

  return (
    <div className="flex-1 bg-gray-50 p-4 overflow-y-auto h-full">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">เป้าหมาย</h1>
        <button
          onClick={() => setShowAddGoal(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          เพิ่ม
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-blue-600">{goals.length}</div>
          <div className="text-xs text-gray-600">เป้าหมายทั้งหมด</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-green-600">
            {goals.filter(g => getProgress(g) === 100).length}
          </div>
          <div className="text-xs text-gray-600">สำเร็จแล้ว</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-orange-600">
            {goals.filter(g => getProgress(g) < 100).length}
          </div>
          <div className="text-xs text-gray-600">กำลังดำเนินการ</div>
        </div>
      </div>

      {/* Goals List */}
      {goals.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">ยังไม่มีเป้าหมาย</h3>
          <p className="text-gray-600 mb-4">ตั้งเป้าหมายเพื่อติดตามความก้าวหน้า</p>
          <button
            onClick={() => setShowAddGoal(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            เพิ่มเป้าหมายแรก
          </button>
        </div>
      ) : (
        <div className="space-y-4 mb-20">
          {goals.map((goal) => {
            const progress = getProgress(goal);
            const isCompleted = progress === 100;

            return (
              <div
                key={goal.id}
                className={`bg-white rounded-xl p-5 shadow-sm ${
                  isCompleted ? 'border-2 border-green-500' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className={`font-semibold text-lg ${
                      isCompleted ? 'text-green-600' : 'text-gray-800'
                    }`}>
                      {isCompleted && '✅ '}
                      {goal.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {goal.type === 'category' && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          getCategoryInfo(goal.category).color
                        }`}>
                          {getCategoryInfo(goal.category).icon} {getCategoryInfo(goal.category).name}
                        </span>
                      )}
                      {goal.resetDaily && (
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                          🔄 รายวัน
                        </span>
                      )}
                      {goal.deadline && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(goal.deadline).toLocaleDateString('th-TH')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => resetGoal(goal.id)}
                      className="text-gray-400 hover:text-blue-500 transition-colors p-1"
                      title="รีเซ็ต"
                    >
                      <Circle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="ลบ"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">
                      ความคืบหน้า: {goal.current} / {goal.target}
                    </span>
                    <span className={`text-sm font-bold ${
                      isCompleted ? 'text-green-600' : 'text-blue-600'
                    }`}>
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        isCompleted 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                          : 'bg-gradient-to-r from-blue-500 to-purple-600'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Reward */}
                <div className={`text-sm p-2 rounded-lg ${
                  isCompleted ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'
                }`}>
                  {isCompleted ? '🎉 ' : '🎁 '}
                  {goal.reward}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowAddGoal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">เพิ่มเป้าหมายใหม่</h3>
              <button onClick={() => setShowAddGoal(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อเป้าหมาย</label>
                <input
                  type="text"
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-green-500"
                  placeholder="เช่น ทำนิสัยครบทุกวัน 7 วันติดต่อกัน"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ประเภท</label>
                <select
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-green-500"
                  value={newGoal.type}
                  onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
                >
                  <option value="streak">Streak ติดต่อกัน</option>
                  <option value="category">จำนวนครั้งตามหมวดหมู่</option>
                  <option value="total">จำนวนครั้งทั้งหมด</option>
                  <option value="daily">เป้าหมายรายวัน (รีเซ็ตทุกวัน)</option>
                </select>
              </div>

              {newGoal.type === 'category' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">หมวดหมู่</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['health', 'learning', 'personal', 'work'].map(cat => {
                      const info = getCategoryInfo(cat);
                      return (
                        <button
                          key={cat}
                          onClick={() => setNewGoal({ ...newGoal, category: cat })}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            newGoal.category === cat
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <span className="text-xl block mb-1">{info.icon}</span>
                          <div className="text-sm font-medium">{info.name}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">เป้าหมาย</label>
                <input
                  type="number"
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-green-500"
                  min="1"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({ ...newGoal, target: parseInt(e.target.value) || 1 })}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddGoal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 rounded-xl p-3 font-medium text-gray-700 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleAddGoal}
                  disabled={!newGoal.title.trim()}
                  className="flex-1 bg-green-500 hover:bg-green-600 rounded-xl p-3 font-medium text-white transition-colors disabled:bg-gray-300"
                >
                  เพิ่มเป้าหมาย
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsScreen;