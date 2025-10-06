// src/components/auth/LoginScreen.js
import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { 
  signInWithRedirect, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  getRedirectResult 
} from 'firebase/auth';
import { auth, googleProvider } from '../../firebase';

const LoginScreen = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log('✅ Login successful via redirect');
        }
      } catch (error) {
        console.error('❌ Redirect error:', error);
        if (error.code !== 'auth/invalid-api-key') {
          setError('เข้าสู่ระบบไม่สำเร็จ: ' + error.message);
        }
      }
    };
    checkRedirect();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('🔐 Starting Google sign in...');
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error('❌ Google login error:', error);
      setError('เข้าสู่ระบบไม่สำเร็จ: ' + error.message);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setError('กรุณากรอกอีเมลและรหัสผ่าน');
      setLoading(false);
      return;
    }

    if (loginPassword.length < 6) {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      setLoading(false);
      return;
    }

    try {
      console.log('🔐 Attempting login with:', loginEmail);
      
      if (isSignUp) {
        const result = await createUserWithEmailAndPassword(auth, loginEmail, loginPassword);
        console.log('✅ Sign up successful:', result.user.email);
      } else {
        const result = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
        console.log('✅ Login successful:', result.user.email);
      }
    } catch (error) {
      console.error('❌ Auth error:', error.code, error.message);
      
      let errorMessage = 'เกิดข้อผิดพลาด';
      
      switch(error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'อีเมลนี้ถูกใช้งานแล้ว กรุณาเข้าสู่ระบบ';
          break;
        case 'auth/weak-password':
          errorMessage = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
          break;
        case 'auth/user-not-found':
          errorMessage = 'ไม่พบผู้ใช้นี้ กรุณาสมัครสมาชิก';
          break;
        case 'auth/wrong-password':
          errorMessage = 'รหัสผ่านไม่ถูกต้อง';
          break;
        case 'auth/invalid-email':
          errorMessage = 'รูปแบบอีเมลไม่ถูกต้อง';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'ไม่สามารถเชื่อมต่ออินเทอร์เน็ต';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'มีการพยายาม login มากเกินไป กรุณารอสักครู่';
          break;
        default:
          errorMessage = `เกิดข้อผิดพลาด: ${error.code}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🌱</div>
          <h1 className="text-4xl font-bold text-white mb-2">Habit Grow</h1>
          <p className="text-green-100">สร้างนิสัยดี เปลี่ยนแปลงชีวิต</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {isSignUp ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
          </h2>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {loading && (
            <div className="bg-blue-50 text-blue-600 p-3 rounded-lg mb-4 text-sm text-center">
              กำลังดำเนินการ...
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 py-3 rounded-lg font-medium transition-all mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            เข้าสู่ระบบด้วย Google
          </button>

          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">หรือ</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">อีเมล</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                  placeholder="your@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">รหัสผ่าน</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'กำลังดำเนินการ...' : (isSignUp ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-gray-600 hover:text-gray-800"
              disabled={loading}
            >
              {isSignUp ? 'มีบัญชีอยู่แล้ว? ' : 'ยังไม่มีบัญชี? '}
              <span className="text-green-600 font-semibold">
                {isSignUp ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
              </span>
            </button>
          </div>
        </div>

        <div className="text-center mt-6 text-white text-sm">
          <p>เริ่มต้นสร้างนิสัยดีวันนี้</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;