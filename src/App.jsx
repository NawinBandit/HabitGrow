// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { saveHabits, loadHabits, saveJournalEntry, loadJournalEntries, saveUserProfile, loadUserProfile } from './services/firestoreService';

import LoginScreen from './components/auth/LoginScreen';
import HomeScreen from './components/Screens/HomeScreen';
import StatsScreen from './components/Screens/StatsScreen';
import JournalScreen from './components/Screens/JournalScreen';
import SettingsScreen from './components/Screens/SettingsScreen';
import NotificationsPanel from './components/modals/NotificationsPanel';
import AddHabitModal from './components/modals/AddHabitModal';
import SideMenu from './components/modals/SideMenu';
import BottomNavigation from './components/Navigation/BottomNavigation';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('🌱');
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [currentTab, setCurrentTab] = useState('home');
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAddHabit, setShowAddHabit] = useState(false);
  
  const [habits, setHabits] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const isInitialLoad = useRef(true);
  const hasLoadedData = useRef(false);

  // ตรวจสอบสถานะการ login และโหลดข้อมูล
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔍 Auth state changed:', user ? 'User found' : 'No user');
      
      try {
        if (user) {
          isInitialLoad.current = true;
          hasLoadedData.current = false;
          
          setUserId(user.uid);
          setUserEmail(user.email);
          setIsLoggedIn(true);
          
          console.log('🔓 User logged in:', user.email, 'UID:', user.uid);
          
          try {
            // โหลดโปรไฟล์ผู้ใช้
            const profile = await loadUserProfile(user.uid);
            if (profile) {
              setUserName(profile.name || '');
              setUserAvatar(profile.avatar || '🌱');
            }

            // โหลดข้อมูลจาก Firestore
            const loadedHabits = await loadHabits(user.uid);
            const loadedJournals = await loadJournalEntries(user.uid);
            
            if (loadedHabits.length > 0) {
              console.log('🔥 Loaded habits:', loadedHabits.length, 'items');
              setHabits(loadedHabits);
            } else {
              console.log('📝 Creating default habits for new user');
              const defaultHabits = [
                { 
                  id: Date.now(), 
                  name: 'ดื่มน้ำ 2 ลิตร', 
                  completed: false, 
                  streak: 0, 
                  category: 'health', 
                  time: '08:00', 
                  notificationEnabled: true,
                  createdAt: new Date().toISOString()
                },
                { 
                  id: Date.now() + 1, 
                  name: 'อ่านหนังสือ 30 นาที', 
                  completed: false, 
                  streak: 0, 
                  category: 'learning', 
                  time: '20:00', 
                  notificationEnabled: true,
                  createdAt: new Date().toISOString()
                }
              ];
              setHabits(defaultHabits);
              await saveHabits(user.uid, defaultHabits);
            }
            
            if (loadedJournals.length > 0) {
              console.log('🔥 Loaded journal entries:', loadedJournals.length, 'items');
              setJournalEntries(loadedJournals);
            }
            
            hasLoadedData.current = true;
            
          } catch (error) {
            console.error('❌ Error loading user data:', error);
            const defaultHabits = [
              { 
                id: Date.now(), 
                name: 'ดื่มน้ำ 2 ลิตร', 
                completed: false, 
                streak: 0, 
                category: 'health', 
                time: '08:00', 
                notificationEnabled: true 
              }
            ];
            setHabits(defaultHabits);
            hasLoadedData.current = true;
          }
          
          setTimeout(() => {
            isInitialLoad.current = false;
            console.log('✅ Initial load completed');
          }, 500);
          
        } else {
          console.log('🚪 User logged out');
          setIsLoggedIn(false);
          setUserId(null);
          setUserEmail('');
          setUserName('');
          setUserAvatar('🌱');
          setHabits([]);
          setJournalEntries([]);
          setNotifications([]);
          isInitialLoad.current = true;
          hasLoadedData.current = false;
        }
      } catch (error) {
        console.error('❌ Critical error in auth:', error);
      } finally {
        setLoading(false);
      }
    }, (error) => {
      console.error('❌ Auth subscription error:', error);
      setLoading(false);
    });
    
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('⚠️ Loading timeout - forcing complete');
        setLoading(false);
      }
    }, 10000);
    
    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  // บันทึกนิสัยอัตโนมัติทุกครั้งที่มีการเปลี่ยนแปลง
  useEffect(() => {
    if (userId && habits.length > 0 && !loading && !isInitialLoad.current && hasLoadedData.current) {
      console.log('💾 Auto-saving habits... Total:', habits.length);
      const saveData = async () => {
        try {
          await saveHabits(userId, habits);
        } catch (error) {
          console.error('Error auto-saving habits:', error);
        }
      };
      
      const timeoutId = setTimeout(saveData, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [habits, userId, loading]);

  // ระบบรีเซ็ตนิสัยทุกวัน + เก็บประวัติ
  useEffect(() => {
    if (!isLoggedIn || habits.length === 0 || !userId) return;

    const checkAndResetHabits = async () => {
      const today = new Date().toDateString();
      const lastCheckDate = localStorage.getItem('lastCheckDate');

      // ถ้าเป็นวันใหม่
      if (lastCheckDate !== today) {
        console.log('🌅 New day detected! Resetting habits...');
        
        // บันทึกประวัติวันเก่า (ถ้ามีข้อมูลวันเก่า)
        if (lastCheckDate) {
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
          const completedCount = habits.filter(h => h.completed).length;
          const totalCount = habits.length;
          const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
          
          // เก็บประวัติลง Firestore
          try {
            const userRef = doc(db, 'users', userId);
            const docSnap = await getDoc(userRef);
            const existingHistory = docSnap.exists() ? (docSnap.data().history || []) : [];
            
            const newHistoryEntry = {
              date: yesterday,
              completed: completedCount,
              total: totalCount,
              rate: completionRate,
              habits: habits.map(h => ({
                id: h.id,
                name: h.name,
                completed: h.completed,
                category: h.category
              }))
            };
            
            await setDoc(userRef, {
              history: [newHistoryEntry, ...existingHistory.slice(0, 89)] // เก็บ 90 วันล่าสุด
            }, { merge: true });
            
            console.log('📊 History saved:', newHistoryEntry);
          } catch (error) {
            console.error('❌ Error saving history:', error);
          }
        }
        
        // รีเซ็ตสถานะ completed
        const resetHabits = habits.map(habit => ({
          ...habit,
          completed: false,
          lastUpdated: new Date().toISOString()
        }));
        
        setHabits(resetHabits);
        
        if (userId) {
          await saveHabits(userId, resetHabits);
        }
        
        // บันทึกวันที่เช็กล่าสุด
        localStorage.setItem('lastCheckDate', today);
        console.log('✅ Habits reset for new day!');
      }
    };

    // เช็กทันทีเมื่อโหลดแอป
    checkAndResetHabits();
    
    // เช็กทุก 1 ชั่วโมง
    const interval = setInterval(checkAndResetHabits, 3600000);
    
    return () => clearInterval(interval);
  }, [habits, isLoggedIn, userId]);

  // ขอสิทธิ์การแจ้งเตือน
  useEffect(() => {
    if (isLoggedIn && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('🔔 Notification permission:', permission);
      });
    }
  }, [isLoggedIn]);

  // ตรวจสอบการแจ้งเตือน
  useEffect(() => {
    if (!isLoggedIn) return;
    
    const checkNotifications = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      habits.forEach(habit => {
        if (habit.notificationEnabled && habit.time === currentTime && !habit.completed) {
          const notification = {
            id: Date.now() + Math.random(),
            title: 'ถึงเวลาทำนิสัย',
            message: `ได้เวลาทำ "${habit.name}" แล้ว`,
            habitId: habit.id,
            time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
          };
          
          addNotification(notification);
          
          if ('serviceWorker' in navigator && Notification.permission === 'granted') {
            navigator.serviceWorker.ready.then((registration) => {
              registration.showNotification('ถึงเวลาทำนิสัย', {
                body: `ได้เวลาทำ "${habit.name}" แล้ว`,
                icon: '/logo192.png',
                badge: '/logo192.png',
                vibrate: [200, 100, 200],
                tag: `habit-${habit.id}`,
                requireInteraction: true
              });
            }).catch(() => {
              new Notification('ถึงเวลาทำนิสัย', {
                body: `ได้เวลาทำ "${habit.name}" แล้ว`,
                icon: '/logo192.png'
              });
            });
          }
        }
      });
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 60000);
    return () => clearInterval(interval);
  }, [habits, isLoggedIn]);

  const addNotification = (notification) => {
    setNotifications(prev => {
      const exists = prev.some(n => n.habitId === notification.habitId && n.time === notification.time);
      if (exists) return prev;
      return [notification, ...prev];
    });
  };

  const handleLogout = async () => {
    try {
      console.log('🚪 Logging out...');
      await auth.signOut();
      setShowSideMenu(false);
      setCurrentTab('home');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Update Profile
  const handleUpdateProfile = async (profileData) => {
    console.log('🔄 Starting profile update...');
    console.log('📝 Profile data:', profileData);
    console.log('👤 Current userId:', userId);
    console.log('📧 Current email:', userEmail);
    
    setUserName(profileData.name);
    setUserAvatar(profileData.avatar);
    
    if (!userId) {
      console.error('❌ No userId - cannot save profile');
      alert('ไม่พบ User ID กรุณา login ใหม่');
      return;
    }
    
    try {
      console.log('💾 Saving to Firestore...');
      const success = await saveUserProfile(userId, {
        name: profileData.name,
        avatar: profileData.avatar,
        email: userEmail
      });
      
      if (success) {
        console.log('✅ Profile saved successfully!');
        alert('บันทึกโปรไฟล์สำเร็จ!');
      } else {
        console.error('❌ Save returned false');
        alert('บันทึกไม่สำเร็จ กรุณาลองใหม่');
      }
    } catch (error) {
      console.error('❌ Error saving profile:', error);
      alert('เกิดข้อผิดพลาด: ' + error.message);
    }
  };

  // Toggle Habit
  const toggleHabit = async (id) => {
    const updatedHabits = habits.map(habit => 
      habit.id === id ? { 
        ...habit, 
        completed: !habit.completed,
        streak: !habit.completed ? habit.streak + 1 : Math.max(0, habit.streak - 1),
        lastUpdated: new Date().toISOString()
      } : habit
    );
    
    setHabits(updatedHabits);
    
    if (userId && !isInitialLoad.current) {
      console.log('✅ Toggled habit:', id, '- Saving to Firestore...');
      try {
        await saveHabits(userId, updatedHabits);
      } catch (error) {
        console.error('Error saving toggled habit:', error);
      }
    }
  };

  // Add Habit
  const addHabit = async (habitData) => {
    const newHabit = {
      id: Date.now(),
      ...habitData,
      completed: false,
      streak: 0,
      createdAt: new Date().toISOString()
    };
    
    console.log('➕ Adding new habit:', newHabit.name);
    const updatedHabits = [...habits, newHabit];
    setHabits(updatedHabits);
    
    if (userId && !isInitialLoad.current) {
      try {
        await saveHabits(userId, updatedHabits);
      } catch (error) {
        console.error('Error saving new habit:', error);
      }
    }
  };

  // Delete Habit
  const deleteHabit = async (id) => {
    console.log('🗑️ Deleting habit:', id);
    const updatedHabits = habits.filter(habit => habit.id !== id);
    setHabits(updatedHabits);
    
    if (userId && !isInitialLoad.current) {
      try {
        await saveHabits(userId, updatedHabits);
      } catch (error) {
        console.error('Error deleting habit:', error);
      }
    }
  };

  // Add Journal Entry
  const addJournalEntry = async (entry) => {
    const newEntry = { 
      ...entry, 
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    console.log('📝 Adding journal entry');
    setJournalEntries([newEntry, ...journalEntries]);
    
    if (userId) {
      await saveJournalEntry(userId, newEntry);
    }
  };

  const getCategoryInfo = (category) => {
    const categories = {
      health: { name: 'สุขภาพ', color: 'bg-green-100 text-green-800', icon: '💪' },
      learning: { name: 'การเรียน', color: 'bg-blue-100 text-blue-800', icon: '📚' },
      personal: { name: 'ส่วนตัว', color: 'bg-purple-100 text-purple-800', icon: '🎯' },
      work: { name: 'งาน', color: 'bg-orange-100 text-orange-800', icon: '💼' }
    };
    return categories[category] || categories.personal;
  };

  const renderCurrentScreen = () => {
    const screenProps = {
      habits, 
      userEmail,
      userName,
      userAvatar,
      notifications, 
      journalEntries,
      toggleHabit, 
      deleteHabit, 
      addJournalEntry, 
      getCategoryInfo,
      setShowNotifications, 
      setShowSideMenu, 
      setShowAddHabit
    };

    switch(currentTab) {
      case 'home': 
        return <HomeScreen {...screenProps} />;
      case 'stats': 
        return <StatsScreen {...screenProps} />;
      case 'journal': 
        return <JournalScreen {...screenProps} />;
      case 'settings': 
        return <SettingsScreen 
          {...screenProps} 
          handleLogout={handleLogout}
          onUpdateProfile={handleUpdateProfile}
        />;
      default: 
        return <HomeScreen {...screenProps} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🌱</div>
          <div className="text-white text-xl font-semibold">กำลังโหลด...</div>
          <div className="text-green-100 mt-2">รอสักครู่นะคะ</div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen flex flex-col relative">
      {/* Header Bar */}
      <div className="h-8 bg-gradient-to-r from-green-500 to-emerald-600" />
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {renderCurrentScreen()}
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation currentTab={currentTab} setCurrentTab={setCurrentTab} />
      
      {/* Modals */}
      {showNotifications && (
        <NotificationsPanel 
          notifications={notifications} 
          onClose={() => setShowNotifications(false)}
        />
      )}
      
      {showAddHabit && (
        <AddHabitModal 
          onClose={() => setShowAddHabit(false)} 
          onAddHabit={addHabit}
        />
      )}
      
      {showSideMenu && (
        <SideMenu 
          userEmail={userEmail}
          userName={userName}
          userAvatar={userAvatar}
          habits={habits} 
          notifications={notifications} 
          onClose={() => setShowSideMenu(false)} 
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default App;