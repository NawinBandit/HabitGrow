// src/components/Modals/ProfileModal.js
import React, { useState } from 'react';
import { X, Camera, Mail, User, Calendar, MapPin, Phone } from 'lucide-react';

const ProfileModal = ({ 
  userEmail, 
  userName, 
  userAvatar,
  userProfile = {},
  onClose, 
  onSave 
}) => {
  const [editName, setEditName] = useState(userName || '');
  const [editAvatar, setEditAvatar] = useState(userAvatar || '🌱');
  const [editBio, setEditBio] = useState(userProfile.bio || '');
  const [editBirthday, setEditBirthday] = useState(userProfile.birthday || '');
  const [editLocation, setEditLocation] = useState(userProfile.location || '');
  const [editPhone, setEditPhone] = useState(userProfile.phone || '');

  const avatarOptions = [
    '🌱', '🌿', '🌳', '🌸', '🌺', '🌻', '🌼', '🌷', 
    '🦋', '🐝', '🌈', '⭐', '💚', '🎯', '💪', '📚',
    '🎨', '🎭', '🎪', '🎬', '🎮', '🎯', '🏆', '🔥'
  ];

  const handleSave = () => {
    onSave({
      name: editName,
      avatar: editAvatar,
      email: userEmail,
      bio: editBio,
      birthday: editBirthday,
      location: editLocation,
      phone: editPhone
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800">แก้ไขโปรไฟล์</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Avatar Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Camera className="w-4 h-4 inline mr-1" />
              เลือกอวาตาร์
            </label>
            <div className="grid grid-cols-8 gap-2">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => setEditAvatar(avatar)}
                  className={`text-2xl p-2 rounded-lg transition-all ${
                    editAvatar === avatar
                      ? 'bg-green-100 ring-2 ring-green-500 scale-110'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              ชื่อ
            </label>
            <input
              type="text"
              className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-green-500"
              placeholder="ชื่อของคุณ"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              อีเมล
            </label>
            <input
              type="email"
              className="w-full border-2 border-gray-200 bg-gray-50 text-gray-500 rounded-xl p-3 cursor-not-allowed"
              value={userEmail}
              readOnly
            />
            <p className="text-xs text-gray-400 mt-1">ไม่สามารถเปลี่ยนอีเมลได้</p>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              เกี่ยวกับฉัน
            </label>
            <textarea
              className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-green-500 resize-none"
              placeholder="เล่าเกี่ยวกับตัวคุณ..."
              rows="3"
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              maxLength={200}
            />
            <p className="text-xs text-gray-400 mt-1 text-right">
              {editBio.length}/200 ตัวอักษร
            </p>
          </div>

          {/* Birthday */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              วันเกิด
            </label>
            <input
              type="date"
              className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-green-500"
              value={editBirthday}
              onChange={(e) => setEditBirthday(e.target.value)}
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              ที่อยู่
            </label>
            <input
              type="text"
              className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-green-500"
              placeholder="เช่น กรุงเทพมหานคร"
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              เบอร์โทรศัพท์
            </label>
            <input
              type="tel"
              className="w-full border-2 border-gray-200 rounded-xl p-3 focus:outline-none focus:border-green-500"
              placeholder="08X-XXX-XXXX"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 rounded-xl p-3 font-medium text-gray-700 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSave}
            disabled={!editName.trim()}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl p-3 font-medium transition-colors disabled:bg-gray-300"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;