import React, { useState } from 'react';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from "react-hot-toast";

const ForgotPassword: React.FC<{ goToLogin: () => void }> = ({ goToLogin }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => setOtp(e.target.value);
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value);

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await fetch('/api/password/request-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const message = await response.text();
      setMessage(message);

      if (response.ok) {
        setIsOtpSent(true);
        toast.success("🎉 OTP đã được gửi, vui lòng kiểm tra email!");
      } else {
        const errorMessage = message || "⚠️ Gửi OTP thất bại, vui lòng thử lại!";
        toast.error(errorMessage);
      }

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "⚠️ Gửi OTP thất bại, vui lòng thử lại!";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await fetch('/api/password/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp }),
      });

      const message = await response.text();
      setMessage(message);

      if (response.ok) {
        setIsOtpVerified(true);
        toast.success("✅ OTP hợp lệ! Hãy đặt lại mật khẩu.");
      } else {
        await decreaseOtpAttempts(email); // Giảm số lần nhập OTP nếu sai
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "⚠️ Có lỗi khi xác nhận OTP, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await fetch('/api/password/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          otp: otp,
          newPassword: newPassword
        }),
      });

      const message = await response.json();
      setMessage(message.message);

      if (response.ok) {
        toast.success("🔑 Mật khẩu đã được đặt lại thành công! Mời bạn đăng nhập lại với mật khẩu mới");
        goToLogin(); // Chuyển về trang đăng nhập
      } else {
        toast.error(response || "⚠️ Đặt lại mật khẩu thất bại, vui lòng thử lại!");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "⚠️ Có lỗi khi thay đổi mật khẩu, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const decreaseOtpAttempts = async (email: string) => {
    try {
      const response = await fetch('/api/password/update-max-attempts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      setRemainingAttempts(data.remainingAttempts); // Cập nhật số lần nhập OTP còn lại

      if (response.ok) {
        toast.error(`❌ OTP không đúng. Số lần nhập OTP còn lại: ${data.remainingAttempts}`);
      } else if (response.status === 403) {
        toast.error("⚠️ Bạn đã nhập sai quá số lần cho phép. Tài khoản đã bị khóa.");
      } else {
        toast.error("⚠️ OTP có thể đã hết hạn.");
      }
    } catch (error) {
      console.error('Lỗi khi giảm số lần nhập OTP:', error);
      toast.error("⚠️ Có lỗi khi giảm số lần nhập OTP");
    }
  };

  const handleBackButtonClick = () => {
    if (isOtpVerified) {
      setIsOtpVerified(false);
    } else if (isOtpSent) {
      setIsOtpSent(false);
    } else {
      goToLogin();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-lg mx-auto mt-16 p-12 bg-white rounded-3xl shadow-xl"
    >
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Quên mật khẩu</h2>

      {!isOtpSent ? (
        <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
          <div className="relative">
            <FaEnvelope className="absolute top-4 left-4 text-gray-500" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              className="w-full pl-12 p-4 border-2 border-gray-300 rounded-lg text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              required
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading} // Tắt nút khi đang tải
            className={`w-full px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg 
    ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"} transition-all`}
          >
            {loading ? "Đang xử lý..." : "Gửi OTP"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToLogin}
            type="submit"
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-all"
          >
            Quay về đăng nhập
          </motion.button>
        </form>
      ) : !isOtpVerified ? (
        <form onSubmit={handleVerifyOtpSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Nhập OTP"
              value={otp}
              onChange={handleOtpChange}
              className="w-full p-4 border-2 border-gray-300 rounded-lg text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading} // Tắt nút khi đang tải
            className={`w-full px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg 
    ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"} transition-all`}
          >
            {loading ? "Đang xử lý..." : "Xác nhận OTP"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBackButtonClick}
            type="submit"
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-all"
          >
            Quay lại
          </motion.button>
        </form>
      ) : (
        <form onSubmit={handleResetPasswordSubmit} className="space-y-6">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChange={handleNewPasswordChange}
              className="w-full p-4 border-2 border-gray-300 rounded-lg text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="ml-2 text-gray-600">
              {showPassword ? "Ẩn" : "Hiện"}
            </button>

          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading} // Tắt nút khi đang tải
            className={`w-full px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg 
    ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"} transition-all`}
          >
            {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBackButtonClick}
            type="submit"
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-all"
          >
            Quay lại
          </motion.button>
        </form>
      )}

    </motion.div>
  );
};

export default ForgotPassword;
