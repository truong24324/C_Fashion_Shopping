import React, { useState, useEffect } from 'react';
import {
  FaEnvelope, FaLock, FaArrowLeft, FaEye, FaEyeSlash,
  FaShieldAlt, FaClock, FaCheckCircle
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios'; // ✅ Bổ sung import axios

interface ForgotPasswordProps {
  goToLogin: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ goToLogin }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [remainingAttempts, setRemainingAttempts] = useState<number>(3); // ✅ Đặt mặc định là 3
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [message, setMessage] = useState<string | null>(null); // ✅ Thêm biến message

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) =>
    password.length >= 6;

  const handleEmailSubmit = async () => {
    setLoading(true);
    setErrors({});
    setMessage(null);

    if (!email) {
      setErrors({ email: 'Email không được để trống' });
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setErrors({ email: 'Email không hợp lệ' });
      setLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = await axios.post('/api/password/request-reset', { email });
      setMessage(response.data?.message || 'OTP sent');
      setIsOtpSent(true);
      setCountdown(300); // 5 phút
      toast.success("🎉 OTP đã được gửi, vui lòng kiểm tra email!");
    } catch (error) {
      setErrors({ email: 'Có lỗi xảy ra, vui lòng thử lại' });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    setLoading(true);
    setErrors({});
    setMessage(null);

    if (!otp) {
      setErrors({ otp: 'Vui lòng nhập mã OTP' });
      setLoading(false);
      return;
    }

    if (otp.length !== 6) {
      setErrors({ otp: 'Mã OTP phải có 6 chữ số' });
      setLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = await axios.post('/api/password/verify-otp', { otp });
      setMessage(response.data?.message || 'OTP verified');
      setIsOtpVerified(true);
      toast.success("✅ OTP hợp lệ! Hãy đặt lại mật khẩu.");
    } catch (error) {
      setErrors({ otp: 'Mã OTP không đúng hoặc đã hết hạn' });
      if (remainingAttempts !== null && remainingAttempts > 0) {
        setRemainingAttempts(remainingAttempts - 1);
      }
      await decreaseOtpAttempts(email); // ✅ gọi API cập nhật số lần nhập

    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setLoading(true);
    setErrors({});
    setMessage(null);

    if (!newPassword) {
      setErrors({ newPassword: 'Mật khẩu mới không được để trống' });
      setLoading(false);
      return;
    }

    if (!validatePassword(newPassword)) {
      setErrors({ newPassword: 'Mật khẩu phải có ít nhất 6 ký tự' });
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: 'Mật khẩu xác nhận không khớp' });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/password/reset-password', {
        email,
        otp,
        newPassword
      });

      setMessage(response.data?.message || 'Password reset successful');
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("🔑 Mật khẩu đã được đặt lại thành công! Mời bạn đăng nhập lại với mật khẩu mới");
      goToLogin();
    } catch (error) {
      setErrors({ general: 'Có lỗi xảy ra khi đặt lại mật khẩu' });
    } finally {
      setLoading(false);
    }
  };

  const handleBackButton = () => {
    setMessage(null);
    if (isOtpVerified) {
      setIsOtpVerified(false);
    } else if (isOtpSent) {
      setIsOtpSent(false);
    } else {
      goToLogin();
    }
  };

  const decreaseOtpAttempts = async (email: string) => {
    try {
      const response = await axios.post('/api/password/update-max-attempts',
        { email },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

      const data = response.data;
      setRemainingAttempts(data.data); // `data.data` chứa remainingAttempts
      // toast.error(`❌ OTP không đúng. Số lần nhập OTP còn lại: ${data.data}`);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data;

        if (status === 403) {
          toast.error("⚠️ Bạn đã nhập sai quá số lần cho phép. Tài khoản đã bị khóa.");
          setRemainingAttempts(0);
        } else if (status === 400) {
          toast.error("⚠️ OTP đã hết hạn hoặc không hợp lệ.");
        } else {
          toast.error("⚠️ Lỗi không xác định khi giảm số lần nhập OTP.");
        }
      } else {
        toast.error("⚠️ Lỗi hệ thống.");
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStepTitle = () => {
    if (!isOtpSent) return "Quên mật khẩu";
    if (!isOtpVerified) return "Xác thực OTP";
    return "Đặt lại mật khẩu";
  };

  const getStepDescription = () => {
    if (!isOtpSent) return "Nhập email để nhận mã xác thực";
    if (!isOtpVerified) return `Nhập mã OTP đã gửi đến ${email}`;
    return "Tạo mật khẩu mới cho tài khoản";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"></div>
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-orange-500/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-red-500/10 rounded-full blur-xl"></div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <FaShieldAlt className="text-white text-xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{getStepTitle()}</h2>
            <p className="text-gray-600">{getStepDescription()}</p>
          </motion.div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${!isOtpSent ? 'bg-orange-500 scale-125' : 'bg-orange-300'
                }`}></div>
              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${isOtpSent && !isOtpVerified ? 'bg-orange-500 scale-125' : isOtpSent ? 'bg-orange-300' : 'bg-gray-300'
                }`}></div>
              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${isOtpVerified ? 'bg-orange-500 scale-125' : 'bg-gray-300'
                }`}></div>
            </div>
          </div>

          {/* Step 1: Email Input */}
          {!isOtpSent && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="Nhập địa chỉ email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 bg-gray-50/80 border-2 rounded-xl text-gray-800 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:bg-white focus:border-orange-500 focus:shadow-lg ${errors.email ? 'border-red-300' : 'border-gray-200'
                    }`}
                />
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1 ml-1"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEmailSubmit}
                disabled={loading}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg ${loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white hover:shadow-xl'
                  }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Đang gửi...
                  </div>
                ) : (
                  'Gửi mã OTP'
                )}
              </motion.button>
            </motion.div>
          )}

          {/* Step 2: OTP Verification */}
          {isOtpSent && !isOtpVerified && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Countdown Timer */}
              {countdown > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <FaClock className="text-blue-500 mx-auto mb-2" />
                  <p className="text-blue-700 text-sm">
                    Mã OTP sẽ hết hạn sau: <span className="font-mono font-bold">{formatTime(countdown)}</span>
                  </p>
                </div>
              )}

              <div className="flex justify-center gap-2">
                {[...Array(6)].map((_, idx) => (
                  <input
                    key={idx}
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength={1}
                    value={otp[idx] || ''}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 1);
                      let newOtp = otp.split('');
                      newOtp[idx] = val;
                      setOtp(newOtp.join(''));
                      // Auto focus next input
                      if (val && idx < 5) {
                        const next = document.getElementById(`otp-input-${idx + 1}`);
                        if (next) (next as HTMLInputElement).focus();
                      }
                      // Auto submit if last digit entered
                      if (val && idx === 5 && newOtp.join('').length === 6) {
                        handleOtpSubmit();
                      }
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
                        const prev = document.getElementById(`otp-input-${idx - 1}`);
                        if (prev) (prev as HTMLInputElement).focus();
                      }
                    }}
                    id={`otp-input-${idx}`}
                    className={`w-12 h-12 text-center text-lg font-mono rounded-xl border-2 bg-gray-50/80 transition-all duration-300 focus:outline-none focus:bg-white focus:border-orange-500 focus:shadow-lg ${errors.otp ? 'border-red-300' : 'border-gray-200'}`}
                    disabled={loading}
                    autoFocus={idx === 0}
                  />
                ))}
              </div>
              {errors.otp && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1 text-center"
                >
                  {errors.otp}
                </motion.p>
              )}

              {remainingAttempts !== null && (
                <div className="text-center text-sm text-amber-600">
                  Số lần thử còn lại: {remainingAttempts}
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleOtpSubmit}
                disabled={loading || otp.length !== 6}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg ${loading || otp.length !== 6
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white hover:shadow-xl'
                  }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Đang xác thực...
                  </div>
                ) : (
                  'Xác thực OTP'
                )}
              </motion.button>

              {/* Resend OTP */}
              {countdown === 0 && (
                <button
                  onClick={() => {
                    setCountdown(300);
                    // Resend OTP logic here
                  }}
                  className="w-full text-orange-600 hover:text-orange-700 font-medium transition-colors"
                >
                  Gửi lại mã OTP
                </button>
              )}
            </motion.div>
          )}

          {/* Step 3: Reset Password */}
          {isOtpVerified && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Success Message */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center mb-6">
                <FaCheckCircle className="text-green-500 mx-auto mb-2 text-2xl" />
                <p className="text-green-700 text-sm">OTP xác thực thành công!</p>
              </div>

              {/* New Password */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu mới"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full pl-12 pr-12 py-4 bg-gray-50/80 border-2 rounded-xl text-gray-800 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:bg-white focus:border-orange-500 focus:shadow-lg ${errors.newPassword ? 'border-red-300' : 'border-gray-200'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center z-10 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {errors.newPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1 ml-1"
                  >
                    {errors.newPassword}
                  </motion.p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Xác nhận mật khẩu mới"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-12 pr-12 py-4 bg-gray-50/80 border-2 rounded-xl text-gray-800 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:bg-white focus:border-orange-500 focus:shadow-lg ${errors.confirmPassword ? 'border-red-300' : 'border-gray-200'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center z-10 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {errors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1 ml-1"
                  >
                    {errors.confirmPassword}
                  </motion.p>
                )}
              </div>

              {errors.general && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm text-center"
                >
                  {errors.general}
                </motion.p>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePasswordReset}
                disabled={loading}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg ${loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white hover:shadow-xl'
                  }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Đang cập nhật...
                  </div>
                ) : (
                  'Đặt lại mật khẩu'
                )}
              </motion.button>
            </motion.div>
          )}

          {/* Back Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBackButton}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-300 mt-6"
          >
            <FaArrowLeft />
            Quay lại
          </motion.button>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Nếu bạn gặp khó khăn, vui lòng liên hệ{' '}
              <a href="#" className="text-orange-600 hover:text-orange-700 font-medium">
                hỗ trợ khách hàng
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;