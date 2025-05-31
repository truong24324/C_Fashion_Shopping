import React from 'react';
import { FaLock, FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface LoginFormProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogin: () => void;
  goToWelcome: () => void;
  goToForgotPassword: () => void;
  loading: boolean;
}

const schema = yup.object({
  email: yup.string().email('Email không hợp lệ').required('Email không được để trống'),
  password: yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Mật khẩu không được để trống'),
}).required();

const LoginForm: React.FC<LoginFormProps> = ({ formData, handleChange, handleLogin, goToWelcome, goToForgotPassword, loading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = () => {
    handleLogin();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white shadow-xl rounded-xl p-8 border border-gray-200 w-full max-w-lg">
        <h2 className="text-3xl font-semibold text-gray-900 text-center mb-6">Đăng nhập</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative">
            <FaEnvelope className="absolute top-4 left-3 text-gray-400 text-lg" />
            <input
              {...register('email')}
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all shadow-sm bg-gray-50"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div className="relative">
            <FaLock className="absolute top-4 left-3 text-gray-400 text-lg" />
            <input
              {...register('password')}
              name="password"
              type="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all shadow-sm bg-gray-50"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          <div className="flex justify-between items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToWelcome}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all shadow-md"
            >
              <FaArrowLeft /> Quay lại
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className={`px-5 py-2 rounded-lg transition-all shadow-md text-white ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </motion.button>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToForgotPassword}
            className="w-full text-blue-600 text-center mt-4 hover:text-blue-800 transition-all"
          >
            Quên mật khẩu?
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default LoginForm;