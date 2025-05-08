import React, { useState } from 'react'; 
import { FaUser, FaEnvelope, FaPhone, FaLock, FaArrowLeft } from 'react-icons/fa';
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
}

const RegisterForm: React.FC<RegisterFormProps> = ({ formData, handleChange, handleRegister, goToWelcome }) => {
  const [errors, setErrors] = useState({
    userCode: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  // Kiểm tra hợp lệ khi nhập
  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'userCode':
        return /^[a-zA-Z0-9_]{6,20}$/.test(value) ? '' : 'Mã người dùng chỉ chứa chữ cái, số và dấu gạch dưới (6-20 ký tự).';
      case 'email':
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) ? '' : 'Email không hợp lệ.';
      case 'phone':
        return /^[0-9]{10,12}$/.test(value) ? '' : 'Số điện thoại phải từ 10-12 chữ số.';
      case 'password':
        return value.length >= 6 ? '' : 'Mật khẩu phải có ít nhất 6 ký tự.';
      case 'confirmPassword':
        return value === formData.password ? '' : 'Mật khẩu xác nhận không khớp.';
      default:
        return '';
    }
  };

  // Xử lý thay đổi input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleChange(e);
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  // Xử lý đăng ký (hiển thị lỗi nếu có)
  const handleSubmit = () => {
    const newErrors = {
      userCode: validateField('userCode', formData.userCode),
      email: validateField('email', formData.email),
      phone: validateField('phone', formData.phone),
      password: validateField('password', formData.password),
      confirmPassword: validateField('confirmPassword', formData.confirmPassword),
    };
    
    setErrors(newErrors);

    // Kiểm tra có lỗi không
    if (Object.values(newErrors).some((error) => error !== '')) {
      alert("Vui lòng kiểm tra lại thông tin trước khi đăng ký!");
      return;
    }

    handleRegister();
  };

  return (
    <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
      <div className="bg-white shadow-xl rounded-xl p-8 border border-gray-200 w-full max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Đăng ký</h2>

        <div className="space-y-6">
          {/* Render Input */}
          {[{
            name: 'userCode', placeholder: 'Mã người dùng', icon: <FaUser />, type: 'text',
          }, {
            name: 'email', placeholder: 'Email', icon: <FaEnvelope />, type: 'email',
          }, {
            name: 'phone', placeholder: 'Số điện thoại', icon: <FaPhone />, type: 'tel',
          }, {
            name: 'password', placeholder: 'Mật khẩu', icon: <FaLock />, type: 'password',
          }, {
            name: 'confirmPassword', placeholder: 'Xác nhận mật khẩu', icon: <FaLock />, type: 'password',
          }].map(({ name, placeholder, icon, type }) => (
            <div key={name} className="relative">
              <div className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500">
                {icon}
              </div>
              <input
                name={name}
                type={type}
                placeholder={placeholder}
                value={formData[name as keyof typeof formData]}
                onChange={handleInputChange}
                className="w-full pl-12 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all shadow-lg"
              />
              {errors[name as keyof typeof errors] && (
                <p className="text-red-500 text-sm mt-1">{errors[name as keyof typeof errors]}</p>
              )}
            </div>
          ))}

          {/* Nút hành động */}
          <div className="flex justify-between mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToWelcome}
              className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-all"
            >
              <FaArrowLeft /> Quay lại
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
            >
              Đăng ký
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RegisterForm;
