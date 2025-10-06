// src/components/Modals/SideMenu.js
import React from 'react';
import { 
  X, User, ChevronRight, Award, Bell, BarChart3, Target, 
  Download, Share2, HelpCircle, BookOpen, LogOut 
} from 'lucide-react';

const SideMenu = ({ 
  userEmail, 
  userName,
  userAvatar,
  habits, 
  notifications, 
  onClose, 
  onLogout,
  setCurrentTab,
  setShowNotifications,
  setShowEditProfile 
}) => {
  
  const handleMenuAction = (action) => {
    console.log('Menu action:', action);
    
    switch(action) {
      case 'profile':
        if (setShowEditProfile) {
          setShowEditProfile(true);
        }
        onClose();
        break;
        
      case 'achievements':
        alert('ฟีเจอร์ความสำเร็จ\n\nกำลังพัฒนา...\n- รางวัลสำหรับ Streak\n- ความก้าวหน้ารายเดือน\n- ระดับผู้ใช้');
        break;
        
      case 'notifications':
        if (setShowNotifications) {
          setShowNotifications(true);
        }
        onClose();
        break;
        
      case 'stats':
        if (setCurrentTab) {
          setCurrentTab('stats');
        }
        onClose();
        break;
        
      case 'goals':
        if (setCurrentTab) {
          setCurrentTab('goals');
        }
        onClose();
        break;
        
      case 'export':
        const csvContent = habits.map(h => 
          `${h.name},${h.category},${h.streak},${h.completed ? 'เสร็จ' : 'ยังไม่เสร็จ'}`
        ).join('\n');
        
        const blob = new Blob(['ชื่อนิสัย,หมวดหมู่,Streak,สถานะ\n' + csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `habit-data-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        
        alert('ส่งออกข้อมูลสำเร็จ! ตรวจสอบไฟล์ดาวน์โหลด');
        break;
        
      case 'share':
        const completedCount = habits.filter(h => h.completed).length;
        const totalCount = habits.length;
        const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;
        
        const shareText = `🌱 Habit Grow\n\nวันนี้ฉันทำนิสัยได้ ${completedCount}/${totalCount}\nStreak สูงสุด: ${maxStreak} วัน!\n\nมาสร้างนิสัยดีไปด้วยกันเถอะ!`;
        
        if (navigator.share) {
          navigator.share({
            title: 'Habit Grow - ความก้าวหน้าของฉัน',
            text: shareText,
            url: window.location.href
          }).catch(() => {});
        } else {
          navigator.clipboard.writeText(shareText + '\n' + window.location.href)
            .then(() => alert('คัดลอกข้อความแล้ว! สามารถแชร์ได้เลย'))
            .catch(() => alert(shareText));
        }
        break;
        
      case 'help':
        alert('🆘 ศูนย์ช่วยเหลือ\n\n' +
              '1. กดปุ่ม + เพื่อเพิ่มนิสัยใหม่\n' +
              '2. กดที่วงกลมเพื่อทำเครื่องหมายเสร็จสิ้น\n' +
              '3. ดู Streak และสถิติในแท็บสถิติ\n' +
              '4. เปิดการแจ้งเตือนเพื่อไม่พลาดนิสัยประจำวัน\n\n' +
              'ต้องการความช่วยเหลือเพิ่มเติม?\nติดต่อ: support@habitgrow.app');
        break;
        
      case 'guide':
        alert('📖 คู่มือการใช้งาน\n\n' +
              '✅ การเริ่มต้น:\n' +
              '1. เพิ่มนิสัยที่ต้องการพัฒนา\n' +
              '2. ตั้งเวลาแจ้งเตือน\n' +
              '3. เลือกหมวดหมู่ที่เหมาะสม\n\n' +
              '🔥 สร้าง Streak:\n' +
              '- ทำนิสัยทุกวันติดต่อกัน\n' +
              '- Streak จะเพิ่มขึ้นทุกวัน\n' +
              '- พลาด 1 วัน = Streak รีเซ็ต\n\n' +
              '📊 ติดตามความก้าวหน้า:\n' +
              '- ดูสถิติในแท็บสถิติ\n' +
              '- บันทึกความรู้สึกในแท็บบันทึก');
        break;
        
      case 'logout':
  if (window.confirm('ต้องการออกจากระบบหรือไม่?')) {
    onLogout();
  }
  break;
        
      default:
        alert('ฟีเจอร์กำลังพัฒนา');
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl backdrop-blur-sm">
              {userAvatar || '🌱'}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <h2 className="text-xl font-bold">{userName || 'ผู้ใช้งาน'}</h2>
          <p className="text-blue-100 text-sm mt-1">{userEmail}</p>
          
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

        <div className="overflow-y-auto h-full pb-32">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">บัญชี</h3>
            <button 
              onClick={() => handleMenuAction('profile')}
              className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
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
                  badge: 0,
                  action: 'achievements'
                },
                { 
                  icon: Bell, 
                  label: 'การแจ้งเตือน', 
                  desc: 'จัดการการแจ้งเตือน', 
                  color: 'text-red-600', 
                  bg: 'bg-red-100', 
                  badge: notifications.length,
                  action: 'notifications'
                },
                { 
                  icon: BarChart3, 
                  label: 'รายงานโดยละเอียด', 
                  desc: 'วิเคราะห์สถิติแบบเจาะลึก', 
                  color: 'text-green-600', 
                  bg: 'bg-green-100', 
                  badge: 0,
                  action: 'stats'
                },
                { 
                  icon: Target, 
                  label: 'เป้าหมาย', 
                  desc: 'ตั้งและติดตามเป้าหมาย', 
                  color: 'text-purple-600', 
                  bg: 'bg-purple-100', 
                  badge: 0,
                  action: 'goals'
                }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <button 
                    key={index}
                    onClick={() => handleMenuAction(item.action)}
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

          <div className="p-4 border-b border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">ข้อมูล</h3>
            <div className="space-y-1">
              {[
                { icon: Download, label: 'ส่งออกข้อมูล', desc: 'ดาวน์โหลดข้อมูลนิสัย', color: 'text-blue-600', bg: 'bg-blue-100', action: 'export' },
                { icon: Share2, label: 'แชร์ความสำเร็จ', desc: 'แชร์ผลงานกับเพื่อน', color: 'text-green-600', bg: 'bg-green-100', action: 'share' }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <button 
                    key={index}
                    onClick={() => handleMenuAction(item.action)}
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

          <div className="p-4 border-b border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">ช่วยเหลือ</h3>
            <div className="space-y-1">
              {[
                { icon: HelpCircle, label: 'ศูนย์ช่วยเหลือ', color: 'text-indigo-600', bg: 'bg-indigo-100', action: 'help' },
                { icon: BookOpen, label: 'วิธีการใช้งาน', color: 'text-orange-600', bg: 'bg-orange-100', action: 'guide' }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <button 
                    key={index}
                    onClick={() => handleMenuAction(item.action)}
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

          <div className="p-4">
            <button 
              onClick={() => handleMenuAction('logout')}
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