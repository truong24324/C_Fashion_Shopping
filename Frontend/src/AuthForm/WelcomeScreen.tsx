import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaShoppingBag, FaStar, FaUsers } from 'react-icons/fa';

interface WelcomeScreenProps {
  goToLogin: () => void;
  goToRegister: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ goToLogin, goToRegister }) => {
  const features = [
    { icon: <FaShoppingBag className="text-blue-500" />, text: "Hàng nghìn sản phẩm" },
    { icon: <FaStar className="text-yellow-500" />, text: "Đánh giá 5 sao" },
    { icon: <FaUsers className="text-green-500" />, text: "Cộng đồng tin cậy" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-spin duration-[20s]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
          {/* Decorative gradient overlay */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          
          <div className="text-center">
            {/* Logo/Brand Section */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-6"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                <FaShoppingBag className="text-white text-2xl" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                C WEB Store
              </h1>
            </motion.div>

            {/* Welcome Message */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Chào mừng bạn!</h2>
              <p className="text-gray-600 leading-relaxed">
                Khám phá thế giới mua sắm trực tuyến với hàng nghìn sản phẩm chất lượng
              </p>
            </motion.div>

            {/* Features */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="grid grid-cols-3 gap-4 mb-8"
            >
              {features.map((feature, index) => (
                <div key={index} className="text-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="text-2xl mb-2 flex justify-center">{feature.icon}</div>
                  <p className="text-xs text-gray-600 font-medium">{feature.text}</p>
                </div>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="space-y-4"
            >
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                onClick={goToLogin}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg relative overflow-hidden group"
              >
                <span className="relative z-10">Đăng nhập</span>
                <div className="absolute inset-0 bg-white/10 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                onClick={goToRegister}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg relative overflow-hidden group"
              >
                <span className="relative z-10">Tạo tài khoản mới</span>
                <div className="absolute inset-0 bg-white/10 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-800 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              >
                <FaHome className="text-lg" />
                <span>
                  <Link to='/'>Khám phá cửa hàng
                </Link>
                </span>
              </motion.button>
            </motion.div>

            {/* Footer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-6 pt-6 border-t border-gray-200"
            >
              <p className="text-sm text-gray-500">
                Bằng việc tiếp tục, bạn đồng ý với{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Điều khoản dịch vụ</a>
              </p>
            </motion.div>
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-500/20 rounded-full blur-sm animate-bounce delay-300"></div>
        <div className="absolute -top-2 -right-6 w-6 h-6 bg-purple-500/20 rounded-full blur-sm animate-bounce delay-700"></div>
        <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-pink-500/20 rounded-full blur-sm animate-bounce delay-500"></div>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;