import React from 'react';
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { Card } from "antd";

interface WelcomeScreenProps {
  goToLogin: () => void;
  goToRegister: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ goToLogin, goToRegister }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="bg-white/60 shadow-2xl rounded-3xl p-8 border border-gray-300 w-full max-w-md backdrop-blur-md">
        <motion.div 
          className="text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-extrabold text-gray-800 drop-shadow-lg">Chào mừng bạn!</h1>
          <p className="text-gray-600 mt-3 text-lg">Hãy đăng nhập hoặc tạo tài khoản mới</p>
          <div className="mt-8 flex flex-col gap-5">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToLogin} 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold text-lg transition-all shadow-md"
            >
              Đăng nhập
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToRegister} 
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold text-lg transition-all shadow-md"
            >
              Đăng ký
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold text-lg transition-all shadow-md"
            >
              <Link to="/" className="hover:text-yellow-400 text-white flex items-center justify-center text-lg">
                <FaHome className="mr-2" />
                <span className="hidden md:inline">Quay về trang chủ</span>
              </Link>
            </motion.button>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default WelcomeScreen;