import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaArrowLeft, FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface RegisterFormProps {
  formData: {
    userCode: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleRegister: () => void;
  goToWelcome: () => void;
  loading: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ 
  formData, 
  handleChange, 
  handleRegister, 
  goToWelcome 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({
    userCode: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  // Real-time validation
  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'userCode':
        return /^[a-zA-Z0-9_]{6,20}$/.test(value) ? '' : 'Mã người dùng chỉ chứa chữ cái, số và dấu gạch dưới (6-20 ký tự)';
      case 'email':
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) ? '' : 'Email không hợp lệ';
      case 'phone':
        return /^[0-9]{10,12}$/.test(value) ? '' : 'Số điện thoại phải từ 10-12 chữ số';
      case 'password':
        return value.length >= 6 ? '' : 'Mật khẩu phải có ít nhất 6 ký tự';
      case 'confirmPassword':
        return value === formData.password ? '' : 'Mật khẩu xác nhận không khớp';
      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleChange(e);
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleSubmit = () => {
    const newErrors = {
      userCode: validateField('userCode', formData.userCode),
      email: validateField('email', formData.email),
      phone: validateField('phone', formData.phone),
      password: validateField('password', formData.password),
      confirmPassword: validateField('confirmPassword', formData.confirmPassword),
    };
    
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== '')) {
      return;
    }

    if (!acceptTerms) {
      alert("Vui lòng đồng ý với điều khoản dịch vụ!");
      return;
    }

    handleRegister();
  };

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const inputFields = [
    {
      name: 'userCode',
      placeholder: 'Tên đăng nhập',
      icon: <FaUser />,
      type: 'text',
    },
    {
      name: 'email',
      placeholder: 'Địa chỉ email',
      icon: <FaEnvelope />,
      type: 'email',
    },
    {
      name: 'phone',
      placeholder: 'Số điện thoại',
      icon: <FaPhone />,
      type: 'tel',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        {/* Main Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-green-500/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl"></div>

          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <FaUser className="text-white text-xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Tạo tài khoản</h2>
            <p className="text-gray-600">Tham gia cộng đồng mua sắm của chúng tôi</p>
          </motion.div>

          <div className="space-y-6">
            {/* Basic Input Fields */}
            {inputFields.map((field, index) => (
              <motion.div 
                key={field.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                className="relative"
              >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <span className="text-gray-400">{field.icon}</span>
                </div>
                <input
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleInputChange}
                  className={`w-full pl-12 pr-4 py-4 bg-gray-50/80 border-2 rounded-xl text-gray-800 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:bg-white focus:border-green-500 focus:shadow-lg ${
                    errors[field.name as keyof typeof errors] ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                {/* Validation Icon */}
                {formData[field.name as keyof typeof formData] && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    {errors[field.name as keyof typeof errors] ? (
                      <FaTimes className="text-red-500" />
                    ) : (
                      <FaCheck className="text-green-500" />
                    )}
                  </div>
                )}
                {errors[field.name as keyof typeof errors] && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1 ml-1"
                  >
                    {errors[field.name as keyof typeof errors]}
                  </motion.p>
                )}
              </motion.div>
            ))}

            {/* Password Field */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="relative"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <FaLock className="text-gray-400" />
              </div>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-12 pr-12 py-4 bg-gray-50/80 border-2 rounded-xl text-gray-800 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:bg-white focus:border-green-500 focus:shadow-lg ${
                  errors.password ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center z-10 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-2 flex-1 rounded ${
                          passwordStrength >= level
                            ? level <= 2
                              ? 'bg-red-400'
                              : level <= 3
                              ? 'bg-yellow-400'
                              : 'bg-green-400'
                            : 'bg-gray-200'
                        } transition-colors duration-300`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Độ mạnh: {passwordStrength <= 2 ? 'Yếu' : passwordStrength <= 3 ? 'Trung bình' : 'Mạnh'}
                  </p>
                </div>
              )}
              
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

            {/* Confirm Password Field */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="relative"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <FaLock className="text-gray-400" />
              </div>
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Xác nhận mật khẩu"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full pl-12 pr-12 py-4 bg-gray-50/80 border-2 rounded-xl text-gray-800 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:bg-white focus:border-green-500 focus:shadow-lg ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center z-10 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {/* Match Indicator */}
              {formData.confirmPassword && (
                <div className="absolute inset-y-0 right-12 pr-4 flex items-center">
                  {errors.confirmPassword ? (
                    <FaTimes className="text-red-500" />
                  ) : (
                    <FaCheck className="text-green-500" />
                  )}
                </div>
              )}
              {errors.confirmPassword && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1 ml-1"
                >
                  {errors.confirmPassword}
                </motion.p>
              )}
            </motion.div>

            {/* Terms and Conditions */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex items-start space-x-3"
            >
              <input
                type="checkbox"
                id="acceptTerms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2 mt-0.5"
              />
              <label htmlFor="acceptTerms" className="text-sm text-gray-600 leading-relaxed">
                Tôi đồng ý với{' '}
                <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                  Điều khoản dịch vụ
                </a>{' '}
                và{' '}
                <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                  Chính sách bảo mật
                </a>
              </label>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Tạo tài khoản
            </motion.button>

            {/* Back Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={goToWelcome}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-300"
            >
              <FaArrowLeft />
              Quay lại
            </motion.button>
          </div>

          {/* Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="mt-6 pt-6 border-t border-gray-200 text-center"
          >
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <button 
                onClick={goToWelcome}
                className="text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                Đăng nhập ngay
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterForm;