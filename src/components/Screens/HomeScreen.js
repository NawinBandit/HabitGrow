// src/components/Screens/HomeScreen.js
import React from 'react';
import { Menu, Bell, Target, Zap, Plus, CheckCircle2, Circle, X } from 'lucide-react';

const HomeScreen = ({ 
  habits, 
  userEmail,
  userName,
  userAvatar,
  notifications,
  toggleHabit, 
  deleteHabit, 
  getCategoryInfo,
  setShowNotifications,
  setShowSideMenu,
  setShowAddHabit,
  testNotification  // เพิ่มตรงนี้
}) => {
  return (
    <div className="flex-1 bg-gray-50 p-4 overflow-y-auto h-full">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">สวัสดี!</h1>
          <p className="text-gray-600 mt-1 text-sm">{userName || userEmail}</p>
        </div>
        <div className="flex gap-2">
          {/* Test Notification Button - เพิ่มใหม่ */}
          {testNotification && (
            <button
              onClick={testNotification}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-100 transition-colors duration-200"
              title="ทดสอบการแจ้งเตือน"
            >
              <span className="text-lg">🧪</span>
            </button>
          )}
          
          {/* Notifications Button */}
          <button
            onClick={() => setShowNotifications(true)}
            className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors duration-200"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                {notifications.length}
              </span>
            )}
          </button>
          
          {/* Menu Button */}
          <button
            onClick={() => setShowSideMenu(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors duration-200"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-lg mr-3">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {habits.filter(h => h.completed).length}/{habits.length}
              </div>
              <div className="text-sm text-gray-500">เสร็จวันนี้</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="bg-orange-100 p-2 rounded-lg mr-3">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                {habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0}
              </div>
              <div className="text-sm text-gray-500">Streak สูงสุด</div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Habit Button */}
      <button 
        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-4 font-medium mb-6 hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
        onClick={() => setShowAddHabit(true)}
      >
        <Plus className="w-5 h-5 inline mr-2" />
        เพิ่มนิสัยใหม่
      </button>

      {/* Habits List */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">นิสัยของวันนี้</h2>
        
        {habits.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <div className="text-4xl mb-4">🌱</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">เริ่มต้นสร้างนิสัยดี</h3>
            <p className="text-gray-600 mb-4">เพิ่มนิสัยแรกของคุณเพื่อเริ่มต้นการเปลี่ยนแปลง</p>
            <button 
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
              onClick={() => setShowAddHabit(true)}
            >
              เพิ่มนิสัยแรก
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {habits.map((habit) => {
              const categoryInfo = getCategoryInfo(habit.category);
              return (
                <div
                  key={habit.id}
                  className={`bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all ${
                    habit.completed ? 'border-l-4 border-green-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      {/* Toggle Checkbox */}
                      <button
                        onClick={() => toggleHabit(habit.id)}
                        className="mr-3 hover:scale-110 transition-transform"
                      >
                        {habit.completed ? (
                          <CheckCircle2 className="w-7 h-7 text-green-500" />
                        ) : (
                          <Circle className="w-7 h-7 text-gray-300 hover:text-gray-400" />
                        )}
                      </button>
                      
                      {/* Habit Info */}
                      <div className="flex-1">
                        <div className={`font-medium text-lg ${
                          habit.completed ? 'text-gray-500 line-through' : 'text-gray-800'
                        }`}>
                          {habit.name}
                        </div>
                        <div className="flex items-center mt-1 gap-2 flex-wrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                            {categoryInfo.icon} {categoryInfo.name}
                          </span>
                          {habit.streak > 0 && (
                            <span className="text-sm text-orange-600 font-medium">
                              🔥 {habit.streak} วัน
                            </span>
                          )}
                          {habit.notificationEnabled && (
                            <span className="text-xs text-blue-600 flex items-center gap-1">
                              <Bell className="w-3 h-3" />
                              {habit.time}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Delete Button */}
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="ml-2 text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Motivational Card */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-md mb-20">
        <h3 className="text-lg font-semibold mb-2">💡 คำแนะนำวันนี้</h3>
        <p className="text-green-50">
          "ความสำเร็จคือการทำสิ่งเล็กๆ อย่างต่อเนื่อง ไม่ใช่การทำสิ่งใหญ่ๆ ในครั้งเดียว"
        </p>
      </div>
    </div>
  );
};

export default HomeScreen;