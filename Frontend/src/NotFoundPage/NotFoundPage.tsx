import React, { useState, useEffect } from 'react';   
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-gray-900 to-black text-white relative">
      {/* Digital Clock Display */}
      <div className="relative w-96 h-32 bg-gradient-to-r from-blue-600 to-indigo-800 rounded-xl shadow-2xl flex items-center justify-center border-8 border-gray-700">
        <div className="text-6xl font-mono text-yellow-300 tracking-wide drop-shadow-lg">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
      </div>

      {/* Error Message */}
      <div className="text-center mt-16">
        <h1 className="text-7xl font-bold text-yellow-500 mb-4 animate-pulse">404</h1>
        <p className="text-3xl text-gray-300 mt-4 font-light">Ồ! Trang bạn đang tìm kiếm không tồn tại.</p>
      </div>

      {/* Go Back Button */}
      <Link
        to="/"
        className="mt-12 bg-yellow-500 text-black px-8 py-4 rounded-full text-2xl font-semibold hover:bg-yellow-400 transition-all duration-300 shadow-2xl transform hover:scale-105"
      >
        Quay về trang đăng nhập
      </Link>
    </div>
  );
};

export default NotFoundPage;
