// src/services/firestoreService.js
import { db } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from 'firebase/firestore';

// บันทึกนิสัยทั้งหมด
export const saveHabits = async (userId, habits) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      habits: habits,
      updatedAt: serverTimestamp()
    }, { merge: true });
    console.log('✅ Habits saved successfully for user:', userId, '| Total:', habits.length);
    return true;
  } catch (error) {
    console.error('❌ Error saving habits:', error);
    return false;
  }
};

// โหลดนิสัยทั้งหมด
export const loadHabits = async (userId) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log('✅ Habits loaded for user:', userId, '| Total:', data.habits?.length || 0);
      return data.habits || [];
    } else {
      console.log('ℹ️ No habits found for user:', userId);
      return [];
    }
  } catch (error) {
    console.error('❌ Error loading habits:', error);
    return [];
  }
};

// บันทึก Journal Entry
export const saveJournalEntry = async (userId, newEntry) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    const docSnap = await getDoc(userRef);
    const existingEntries = docSnap.exists() ? (docSnap.data().journalEntries || []) : [];
    
    const entryExists = existingEntries.some(e => e.id === newEntry.id);
    const updatedEntries = entryExists ? existingEntries : [newEntry, ...existingEntries];
    
    await setDoc(userRef, {
      journalEntries: updatedEntries,
      updatedAt: serverTimestamp()
    }, { merge: true });
    
    console.log('✅ Journal saved successfully for user:', userId, '| Total entries:', updatedEntries.length);
    return true;
  } catch (error) {
    console.error('❌ Error saving journal:', error);
    return false;
  }
};

// โหลด Journal Entries
export const loadJournalEntries = async (userId) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log('✅ Journal entries loaded for user:', userId, '| Total:', data.journalEntries?.length || 0);
      return data.journalEntries || [];
    } else {
      console.log('ℹ️ No journal entries found for user:', userId);
      return [];
    }
  } catch (error) {
    console.error('❌ Error loading journal:', error);
    return [];
  }
};

// บันทึกทั้ง Journal Array
export const saveAllJournalEntries = async (userId, journalEntries) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      journalEntries: journalEntries,
      updatedAt: serverTimestamp()
    }, { merge: true });
    console.log('✅ All journal entries saved for user:', userId, '| Total:', journalEntries.length);
    return true;
  } catch (error) {
    console.error('❌ Error saving all journal entries:', error);
    return false;
  }
};

// ✨ บันทึกโปรไฟล์ผู้ใช้ (ชื่อ, อวาตาร์, อีเมล)
export const saveUserProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      profile: {
        name: profileData.name || '',
        avatar: profileData.avatar || '🌱',
        email: profileData.email || '',
        updatedAt: serverTimestamp()
      }
    }, { merge: true });
    console.log('✅ Profile saved successfully for user:', userId);
    console.log('📝 Profile data:', profileData);
    return true;
  } catch (error) {
    console.error('❌ Error saving profile:', error);
    return false;
  }
};

// ✨ โหลดโปรไฟล์ผู้ใช้
export const loadUserProfile = async (userId) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists() && docSnap.data().profile) {
      const profile = docSnap.data().profile;
      console.log('✅ Profile loaded for user:', userId);
      console.log('📝 Profile data:', profile);
      return profile;
    } else {
      console.log('ℹ️ No profile found for user:', userId, '- Creating default profile');
      // สร้างโปรไฟล์เริ่มต้นถ้ายังไม่มี
      const defaultProfile = {
        name: '',
        avatar: '🌱',
        email: ''
      };
      return defaultProfile;
    }
  } catch (error) {
    console.error('❌ Error loading profile:', error);
    return null;
  }
};