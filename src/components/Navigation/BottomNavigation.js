// src/components/Navigation/BottomNavigation.js
import React from 'react';
import { Home, BarChart3, BookOpen, Settings, Target } from 'lucide-react';

const BottomNavigation = ({ currentTab, setCurrentTab, darkMode }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'หน้าแรก' },
    { id: 'stats', icon: BarChart3, label: 'สถิติ' },
    { id: 'goals', icon: Target, label: 'เป้าหมาย' },
    { id: 'journal', icon: BookOpen, label: 'บันทึก' },
    { id: 'settings', icon: Settings, label: 'ตั้งค่า' }
  ];

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t px-2 py-2 safe-bottom`}>
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          
          return (
            <button
              key={tab.id}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 min-h-12 min-w-12 ${
                isActive 
                  ? darkMode 
                    ? 'text-green-400 bg-green-900/30' 
                    : 'text-green-600 bg-green-50'
                  : darkMode
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setCurrentTab(tab.id)}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;