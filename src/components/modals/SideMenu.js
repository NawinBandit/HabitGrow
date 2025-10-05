// src/components/Modals/SideMenu.js
import React from 'react';
import { 
  X, User, ChevronRight, Award, Bell, BarChart3, Target, 
  Download, Share2, HelpCircle, BookOpen, LogOut 
} from 'lucide-react';

const SideMenu = ({ userEmail, habits, notifications, onClose, onLogout }) => {
  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Menu Drawer */}
      <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300">
        {/* Menu Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl backdrop-blur-sm">
              🌱
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <h2 className="text-xl font-bold">ผู้ใช้งาน</h2>
          <p className="text-blue-100 text-sm mt-1">{userEmail}</p>
          
          {/* Quick Stats */}
          <div className="flex gap-4 mt-4">
            <div className="flex-1 bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm">
              <div className="text-2xl font-bold">{habits.length}</div>
              <div className="text-xs text-blue-100">นิสัย</div>
            </div>
            <div className="flex-1 bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm">
              <div className="text-2xl font-bold">
                {habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0}
              </div>
              <div className="text-xs text-blue-100">Streak</div>
            </div>
            <div className="flex-1 bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm">
              <div className="text-2xl font-bold">
                {habits.length > 0 ? Math.round((habits.filter(h => h.completed).length / habits.length) * 100) : 0}%
              </div>
              <div className="text-xs text-blue-100">วันนี้</div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="overflow-y-auto h-full pb-32">
          {/* Account Section */}
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">บัญชี</h3>
            <button className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800">โปรไฟล์</div>
                <div className="text-sm text-gray-500">แก้ไขข้อมูลส่วนตัว</div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Main Menu */}
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">เมนูหลัก</h3>
            <div className="space-y-1">
              {[
                { 
                  icon: Award, 
                  label: 'ความสำเร็จ', 
                  desc: 'ดูรางวัลและความก้าวหน้า', 
                  color: 'text-yellow-600', 
                  bg: 'bg-yellow-100', 
                  badge: 0 
                },
                { 
                  icon: Bell, 
                  label: 'การแจ้งเตือน', 
                  desc: 'จัดการการแจ้งเตือน', 
                  color: 'text-red-600', 
                  bg: 'bg-red-100', 
                  badge: notifications.length 
                },
                { 
                  icon: BarChart3, 
                  label: 'รายงานโดยละเอียด', 
                  desc: 'วิเคราะห์สถิติแบบเจาะลึก', 
                  color: 'text-green-600', 
                  bg: 'bg-green-100', 
                  badge: 0 
                },
                { 
                  icon: Target, 
                  label: 'เป้าหมาย', 
                  desc: 'ตั้งและติดตามเป้าหมาย', 
                  color: 'text-purple-600', 
                  bg: 'bg-purple-100', 
                  badge: 0 
                }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <button 
                    key={index}
                    className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className={`w-10 h-10 ${item.bg} rounded-full flex items-center justify-center mr-3 relative`}>
                      <Icon className={`w-5 h-5 ${item.color}`} />
                      {item.badge > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.desc}</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Data Section */}
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">ข้อมูล</h3>
            <div className="space-y-1">
              {[
                { icon: Download, label: 'ส่งออกข้อมูล', desc: 'ดาวน์โหลดข้อมูลนิสัย', color: 'text-blue-600', bg: 'bg-blue-100' },
                { icon: Share2, label: 'แชร์ความสำเร็จ', desc: 'แชร์ผลงานกับเพื่อน', color: 'text-green-600', bg: 'bg-green-100' }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <button 
                    key={index}
                    className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className={`w-10 h-10 ${item.bg} rounded-full flex items-center justify-center mr-3`}>
                      <Icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.desc}</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Help Section */}
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">ช่วยเหลือ</h3>
            <div className="space-y-1">
              {[
                { icon: HelpCircle, label: 'ศูนย์ช่วยเหลือ', color: 'text-indigo-600', bg: 'bg-indigo-100' },
                { icon: BookOpen, label: 'วิธีการใช้งาน', color: 'text-orange-600', bg: 'bg-orange-100' }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <button 
                    key={index}
                    className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className={`w-10 h-10 ${item.bg} rounded-full flex items-center justify-center mr-3`}>
                      <Icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{item.label}</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Logout */}
          <div className="p-4">
            <button 
              onClick={onLogout}
              className="w-full flex items-center p-3 rounded-lg hover:bg-red-50 transition-colors text-left group"
            >
              <div className="w-10 h-10 bg-gray-100 group-hover:bg-red-100 rounded-full flex items-center justify-center mr-3 transition-colors">
                <LogOut className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-800 group-hover:text-red-600 transition-colors">ออกจากระบบ</div>
              </div>
            </button>
          </div>

          {/* App Version */}
          <div className="p-4 text-center">
            <div className="text-xs text-gray-400">Habit Grow v1.0.0</div>
            <div className="text-xs text-gray-400 mt-1">Made with 💚 for better habits</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideMenu;