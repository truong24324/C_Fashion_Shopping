// AuthenticatePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// Components
import WelcomeScreen from '../../AuthForm/WelcomeScreen';
import LoginForm from '../../AuthForm/LoginForm';
import RegisterForm from '../../AuthForm/RegisterForm';
import ForgotPassword from '../../AuthForm/ForgotPassword';
import PersonalInfoForm from '../../AuthForm/PersonalInfoForm';

const AuthenticatePage: React.FC = () => {
  const [step, setStep] = useState<'welcome' | 'login' | 'register' | 'personalInfo' | 'forgotpassword'>('welcome');
  const [formData, setFormData] = useState({
    userCode: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    homeAddress: '',
    birthday: '',
    gender: '',
    avatar: '',
    officeAddress: '',
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `C WEB - ${
      step === 'welcome'
        ? 'Chào mừng'
        : step === 'login'
        ? 'Đăng nhập'
        : step === 'register'
        ? 'Đăng ký'
        : step === 'personalInfo'
        ? 'Thông tin cá nhân'
        : 'Quên mật khẩu'
    }`;
  }, [step]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const goToWelcome = () => setStep('welcome');
  const goToLogin = () => setStep('login');
  const goToRegister = () => setStep('register');
  const goToForgotPassword = () => setStep('forgotpassword');
  const goToPersonalInfo = () => setStep('personalInfo');

  const handleLogin = async () => {
    if (loadingLogin) return;
    setLoadingLogin(true);
    try {
      if (!formData.email || !formData.password) {
        toast.error('Vui lòng nhập đầy đủ thông tin đăng nhập!');
        return;
      }
      const response = await fetch('/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Đăng nhập thất bại!');

      toast.success('Đăng nhập thành công!');
      const decoded: any = jwtDecode(data.token);
      const roles = decoded.roles.map((r: any) => r.authority);

      ["cachedBrands", "cachedBrandsExpire", "cached_products_latest", "cached_products_latest_expiry",
        "variants_cache", "wishlist_cache", "accountId", "token", "user_cache"].forEach(key => localStorage.removeItem(key));

      localStorage.setItem('token', data.token);
      localStorage.setItem('refresh_token', data.refreshToken);
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;

      if (roles.includes("ROLE_Admin") || roles.includes("ROLE_Super_Admin") || roles.includes("ROLE_Manager")) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message || 'Đăng nhập thất bại!');
    } finally {
      setLoadingLogin(false);
    }
  };

  const handleRegister = async () => {
    if (loadingRegister) return;
    setLoadingRegister(true);
    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Đăng ký thất bại!');

      const decoded: any = jwtDecode(data.token);
      setAccountId(decoded.accountId);
      localStorage.setItem('token', data.token);

      toast.success('Đăng ký thành công! Mời bạn nhập thông tin cá nhân');
      setStep('personalInfo');
    } catch (error: any) {
      toast.error(error.message || 'Đăng ký thất bại!');
    } finally {
      setLoadingRegister(false);
    }
  };

  const handleSubmitPersonalInfo = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('homeAddress', formData.homeAddress);
      formDataToSend.append('officeAddress', formData.officeAddress);
      formDataToSend.append('birthday', formData.birthday);

      if (avatarPreview) {
        const avatarFile = dataURLtoFile(avatarPreview, 'avatar.jpg');
        formDataToSend.append('avatarFile', avatarFile);
      }

      const response = await fetch(`/api/information/${accountId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formDataToSend,
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Cập nhật thông tin thất bại!');

      toast.success('Thông tin cá nhân đã được lưu thành công!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Cập nhật thông tin thất bại!');
    }
  };

  const dataURLtoFile = (dataUrl: string, filename: string): File => {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) throw new Error("Invalid data URL format");
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };

  const pageVariants = {
    initial: { opacity: 0, x: 300 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -300 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  };

  return (
    <div className="relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
            animate={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
            transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, repeatType: 'reverse' }}
          />
        ))}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-3/4 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {step === 'welcome' && (
            <motion.div key="welcome" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="w-full max-w-md">
              <WelcomeScreen goToLogin={goToLogin} goToRegister={goToRegister} />
            </motion.div>
          )}

          {step === 'login' && (
            <motion.div key="login" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="w-full max-w-md">
              <LoginForm formData={formData} handleChange={handleChange} handleLogin={handleLogin} goToWelcome={goToWelcome} goToForgotPassword={goToForgotPassword} loading={loadingLogin} />
            </motion.div>
          )}

          {step === 'register' && (
            <motion.div key="register" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="w-full max-w-lg">
              <RegisterForm formData={formData} handleChange={handleChange} handleRegister={handleRegister} goToWelcome={goToWelcome} loading={loadingRegister} />
            </motion.div>
          )}

          {step === 'personalInfo' && (
            <motion.div key="personalInfo" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="w-full max-w-2xl">
              <PersonalInfoForm formData={formData} avatarPreview={avatarPreview} handleChange={handleChange} handleAvatarChange={handleAvatarChange} handleSubmitPersonalInfo={handleSubmitPersonalInfo} goToRegister={goToRegister} />
            </motion.div>
          )}

          {step === 'forgotpassword' && (
            <motion.div key="forgotpassword" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="w-full max-w-md">
              <ForgotPassword goToLogin={goToLogin} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-4 left-4 right-4 z-20">
        <div className="text-center">
          <p className="text-white/60 text-sm">© 2024 C WEB Store. Được thiết kế với ❤️ tại Việt Nam</p>
        </div>
      </div>
    </div>
  );
};

export default AuthenticatePage;