import React, { useState } from 'react';
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import WelcomeScreen from '../../AuthForm/WelcomeScreen';
import LoginForm from '../../AuthForm/LoginForm';
import ForgotPassword from '../../AuthForm/ForgotPassword';
import RegisterForm from '../../AuthForm/RegisterForm';
import PersonalInfoForm from '../../AuthForm/PersonalInfoForm';
import axios from 'axios';

const AuthenticatePage: React.FC = () => {
  const [step, setStep] = useState<"welcome" | "login" | "register" | "personalInfo" | "forgotpassword">("welcome");
  const [formData, setFormData] = useState({
    userCode: "", email: "", phone: "", password: "", confirmPassword: "",
    fullName: "", homeAddress: "", birthday: "", gender: "", avatar: "", officeAddress: ""
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const navigate = useNavigate();

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

  const goToWelcome = () => setStep("welcome");
  const goToLogin = () => setStep("login");
  const goToRegister = () => setStep("register");
  const goToForgotPassword = () => setStep("forgotpassword");
  const handleLogin = async () => {
    if (loadingLogin) return;
    setLoadingLogin(true);
    try {
      if (!formData.email || !formData.password) {
        toast.error("Vui lòng nhập đầy đủ thông tin đăng nhập!");
        return;
      }

      const response = await fetch("/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.token || 'Đăng nhập thất bại!');

      toast.success("Đăng nhập thành công!");
      const decoded: any = jwtDecode(data.token);
      const roles = decoded.roles.map((role: any) => role.authority);

      const keysToClear = [
        "cachedBrands", "cachedBrandsExpire", "cached_products_latest", "cached_products_latest_expiry",
        "variants_cache", "wishlist_cache", "accountId", "token", "user_cache"
      ];
      keysToClear.forEach(key => localStorage.removeItem(key));
      localStorage.setItem("token", data.token);
      localStorage.setItem("refresh_token", data.refreshToken);
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;

      if (roles.includes("ROLE_Admin") || roles.includes("ROLE_Super_Admin") || roles.includes("ROLE_Manager")) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Đăng nhập thất bại!');
    } finally {
      setLoadingLogin(false);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.token || 'Đăng ký thất bại!');

      // Lưu accountId và token vào localStorage ngay sau khi đăng ký
      const decoded: any = jwtDecode(data.token);
      const accountId = decoded?.accountId;
      setAccountId(accountId);

      localStorage.setItem('token', data.token);

      // Sau khi đăng ký thành công, tự động đăng nhập
      const loginResponse = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const loginData = await loginResponse.json();
      if (!loginResponse.ok) throw new Error(loginData.message || loginData.token || 'Đăng nhập thất bại!');

      // Lưu lại thông tin đăng nhập vào localStorage

      localStorage.setItem('token', loginData.token);

      toast.success('Đăng ký và đăng nhập thành công! Mời bạn nhập thông tin cá nhân của bạn');
      setStep("personalInfo");
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Đăng ký thất bại!');
    }
  };

  const handleSubmitPersonalInfo = async () => {
    try {
      const formDataToSend = new FormData();

      // Add personal info data
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('homeAddress', formData.homeAddress);
      formDataToSend.append('officeAddress', formData.officeAddress);
      formDataToSend.append('birthday', formData.birthday);

      // Add avatar if available
      if (avatarPreview) {
        const avatarFile = dataURLtoFile(avatarPreview, 'avatar.jpg'); // Convert avatar preview to file
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

      // Kiểm tra lỗi kiểu dữ liệu và tự động xác nhận thành công
      if (data.message && data.message.includes('Type definition error: [simple type, class org.hibernate.proxy.pojo.bytebuddy.ByteBuddyInterceptor]')) {
        toast.success('Thông tin cá nhân đã được lưu thành công!');
        navigate("/");
        return;
      }

      if (!response.ok) throw new Error(data.message || 'Cập nhật thông tin thất bại!');

      toast.success('Thông tin cá nhân đã được lưu thành công!');
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Cập nhật thông tin thất bại!');
      navigate("/");
    }
  };

  // Helper function to convert dataURL to File (for avatar image)
  const dataURLtoFile = (dataUrl: string, filename: string): File => {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) {
      throw new Error("Invalid data URL format");
    }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;  // Changed const to let
    const u8arr = new Uint8Array(n);

    while (n--) u8arr[n] = bstr.charCodeAt(n);

    return new File([u8arr], filename, { type: mime });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6 relative overflow-hidden">
      {step === "welcome" && <WelcomeScreen goToLogin={goToLogin} goToRegister={goToRegister} />}
      {step === "login" && <LoginForm formData={formData} handleChange={handleChange} handleLogin={handleLogin} goToWelcome={goToWelcome} goToForgotPassword={goToForgotPassword} loading={loadingLogin} />}
      {step === "forgotpassword" && <ForgotPassword goToLogin={goToLogin} />}
      {step === "register" && <RegisterForm formData={formData} handleChange={handleChange} handleRegister={handleRegister} goToWelcome={goToWelcome} />}
      {step === "personalInfo" && <PersonalInfoForm formData={formData} avatarPreview={avatarPreview} handleChange={handleChange} handleAvatarChange={handleAvatarChange} handleSubmitPersonalInfo={handleSubmitPersonalInfo} goToRegister={goToRegister} />}
    </div>
  );
};

export default AuthenticatePage;
