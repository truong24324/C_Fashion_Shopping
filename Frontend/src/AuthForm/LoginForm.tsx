import React, { useState } from 'react';
import { FaLock, FaEnvelope, FaArrowLeft, FaEye, FaEyeSlash, FaGoogle, FaFacebook } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface LoginFormProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogin: () => void;
  goToWelcome: () => void;
  goToForgotPassword: () => void;
  loading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  formData, 
  handleChange, 
  handleLogin, 
  goToWelcome, 
  goToForgotPassword, 
  loading 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    
    if (!formData.email) {
      newErrors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (validateForm()) {
      handleLogin();
    }
  };

  const inputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.2 } },
    blur: { scale: 1, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-purple-500/10 rounded-full blur-xl"></div>

          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <FaLock className="text-white text-xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Đăng nhập</h2>
            <p className="text-gray-600">Chào mừng bạn quay trở lại!</p>
          </motion.div>

          <div className="space-y-6">
            {/* Email Input */}
            <motion.div 
              variants={inputVariants}
              whileFocus="focus"
              className="relative"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                name="email"
                type="email"
                placeholder="Nhập email của bạn"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-4 bg-gray-50/80 border-2 rounded-xl text-gray-800 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-lg ${
                  errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-200'
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
            </motion.div>

            {/* Password Input */}
            <motion.div 
              variants={inputVariants}
              whileFocus="focus"
              className="relative"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <FaLock className="text-gray-400" />
              </div>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-12 pr-12 py-4 bg-gray-50/80 border-2 rounded-xl text-gray-800 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-lg ${
                  errors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-200'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center z-10 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.password && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1 ml-1"
                >
                  {errors.password}
                </motion.p>
              )}
            </motion.div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="ml-2 text-gray-600">Ghi nhớ đăng nhập</span>
              </label>
              <button
                type="button"
                onClick={goToForgotPassword}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Quên mật khẩu?
              </button>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg relative overflow-hidden ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-xl'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Đang đăng nhập...
                </div>
              ) : (
                'Đăng nhập'
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Hoặc đăng nhập với</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="flex items-center justify-center px-4 py-3 border-2 border-gray-300 rounded-xl hover:border-red-400 hover:bg-red-50 transition-all duration-300"
              >
                <FaGoogle className="text-red-500 mr-2" />
                <span className="text-gray-700 font-medium">Google</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="flex items-center justify-center px-4 py-3 border-2 border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-300"
              >
                <FaFacebook className="text-blue-600 mr-2" />
                <span className="text-gray-700 font-medium">Facebook</span>
              </motion.button>
            </div>

            {/* Back Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={goToWelcome}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-300"
            >
              <FaArrowLeft />
              Quay lại
            </motion.button>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <button 
                onClick={() => goToWelcome()}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Đăng ký ngay
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;