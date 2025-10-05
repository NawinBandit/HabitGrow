// src/components/Screens/SettingsScreen.js
import React, { useState } from 'react';
import { Edit, Clock, ChevronRight, LogOut, Camera } from 'lucide-react';

const SettingsScreen = ({ userEmail, userName, userAvatar, handleLogout, onUpdateProfile }) => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState(userName || '');
  const [editEmail, setEditEmail] = useState(userEmail || '');
  const [editAvatar, setEditAvatar] = useState(userAvatar || '🌱');
  
  const avatarOptions = ['🌱', '🌿', '🌳', '🌸', '🌺', '🌻', '🌼', '🌷', '🦋', '🐝', '🌈', '⭐', '💚', '🎯', '💪', '📚'];

  const handleSaveProfile = () => {
    onUpdateProfile({
      name: editName,
      email: editEmail,
      avatar: editAvatar
    });
    setShowEditProfile(false);
  };

  return (
    <div className="flex-1 bg-gray-50 p-4 overflow-y-auto h-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">ตั้งค่า</h1>
      
      {/* Profile Section */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
            {userAvatar || '🌱'}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-800">{userName || 'ผู้ใช้งาน'}</h2>
            <p className="text-gray-600 text-sm">{userEmail}</p>
          </div>
          <button 
            onClick={() => setShowEditProfile(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Edit className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Notifications Settings */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">การแจ้งเตือน</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium text-gray-800">แจ้งเตือนรายวัน</h3>
              <p className="text-sm text-gray-600">รับการแจ้งเตือนสำหรับนิสัยของคุณ</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
          
          <div className="pt-2 border-t border-gray-100">
            <h3 className="font-medium text-gray-800 mb-2">เวลาแจ้งเตือน</h3>
            <p className="text-sm text-gray-600 mb-3">แอปจะแจ้งเตือนตามเวลาที่ตั้งไว้ในแต่ละนิสัย</p>
            <div className="grid grid-cols-2 gap-2">
              <button className="p-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                เช้า 08:00
              </button>
              <button className="p-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                เย็น 20:00
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-20">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-3 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          ออกจากระบบ
        </button>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowEditProfile(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">แก้ไขโปรไฟล์</h3>
              <button onClick={() => setShowEditProfile(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <ChevronRight className="w-5 h-5 text-gray-400 transform rotate-90" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Avatar Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">เลือกอวาตาร์</label>
                <div className="grid grid-cols-8 gap-2">
                  {avatarOptions.map((avatar) => (
                    <button
                      key={avatar}
                      onClick={() => setEditAvatar(avatar)}
                      className={`text-2xl p-2 rounded-lg transition-all ${
                        editAvatar === avatar 
                          ? 'bg-green-100 ring-2 ring-green-500'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อ</label>
                <input
                  type="text"
                  className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-green-500 transition-colors"
                  placeholder="ชื่อของคุณ"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>

              {/* Email Display (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">อีเมล</label>
                <input
                  type="email"
                  className="w-full border-2 border-gray-200 bg-gray-50 text-gray-500 rounded-xl p-3 cursor-not-allowed"
                  value={editEmail}
                  readOnly
                />
                <p className="text-xs text-gray-400 mt-1">ไม่สามารถเปลี่ยนอีเมลได้</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button 
                  className="flex-1 bg-gray-100 hover:bg-gray-200 rounded-xl p-3 font-medium text-gray-700 transition-colors"
                  onClick={() => setShowEditProfile(false)}
                >
                  ยกเลิก
                </button>
                <button 
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl p-3 font-medium transition-colors"
                  onClick={handleSaveProfile}
                >
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsScreen;