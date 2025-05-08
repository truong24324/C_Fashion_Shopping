import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { FaUser, FaShoppingCart, FaMapMarkerAlt, FaSearch, FaTimes, FaHeart, FaShoppingBag, FaStar, FaSignOutAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<{ avatar: string; fullName: string } | null>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsMenuOpen(false); // Đóng menu khi tìm kiếm mở
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "/api/logout",
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      localStorage.removeItem("token"); // Xóa token khỏi localStorage
      setUser(null); // Đặt lại trạng thái user thành null
      toast.success("Đăng xuất thành công!");
    } catch (error) {
      toast.error("Lỗi khi đăng xuất!");
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/information/me", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (data.success) {
          setUser(data.data);
        } else {
          toast.error(data.message || "Không thể lấy thông tin cá nhân");
        }
      } catch (error) {
        toast.error("Lỗi khi lấy thông tin cá nhân");
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      <AnimatePresence mode="wait">
        {!isSearchOpen ? (
          <motion.div
            key="navbar"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Navbar chính */}
            <div className="flex justify-between items-center px-4 py-2 bg-gray-900 bg-opacity-90 sm:px-8 shadow-md">
              {/* Logo */}
              <div className="flex items-center space-x-4">
                <img
                  src="https://th.bing.com/th?id=OSK.Gx03gXuGYG4opIcw73oEeAm33KFjNvHyQaeBmIQaoBg&w=46&h=46&c=11&rs=1&qlt=80&o=6&dpr=1.3&pid=SANGAM"
                  alt="Logo"
                  className="w-10 h-10"
                />
                <span className="text-xl font-bold text-white hidden md:inline">
                  Thương hiệu
                </span>
              </div>

              {/* Thông báo chạy ngang */}
              <div className="flex-grow flex justify-center items-center overflow-hidden">
                <div className="whitespace-nowrap text-white text-sm font-medium animate-marquee">
                  Chào mừng bạn đến với cửa hàng của chúng tôi! - Ưu đãi hấp dẫn
                  mỗi ngày! - Mua sắm ngay!
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-2 text-white">

                    <Link to="/profile" className="flex items-center space-x-2 text-white">
                      <img
                        src={user?.avatar || "https://via.placeholder.com/150"}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full"
                      />
                      <span>{user?.fullName}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-white flex items-center text-sm hover:text-yellow-400"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Đăng xuất
                    </button>
                  </div>
                ) : (
                  <Link to="/auth" className="hover:text-yellow-400 text-white flex items-center text-sm">
                    <FaUser className="mr-2" />
                    <span className="hidden md:inline">Đăng nhập</span>
                  </Link>
                )}

                <Link to="/cart" className="hover:text-yellow-400 text-white flex items-center text-sm">
                  <FaShoppingCart className="mr-2" />
                  <span className="hidden md:inline">Giỏ hàng</span>
                </Link>
                <Link to="/store" className="hover:text-yellow-400 text-white flex items-center text-sm">
                  <FaMapMarkerAlt className="mr-2" />
                  <span className="hidden md:inline">Cửa hàng</span>
                </Link>
                <button onClick={toggleSearch} className="hover:text-yellow-400 text-white flex items-center text-sm">
                  <FaSearch className="mr-2" />
                  <span className="hidden md:inline">Tìm kiếm</span>
                </button>
              </div>
            </div>

            {/* Menu trên desktop */}
            <nav className="hidden md:flex justify-center space-x-6 py-2 text-base bg-gray-900 bg-opacity-80 shadow-md">
              <Link to="/" className="hover:text-yellow-400 text-white">Trang chủ</Link>
              <Link to="/about" className="hover:text-yellow-400 text-white">Giới thiệu</Link>
              <Link to="/thoi-trang" className="hover:text-yellow-400 text-white">Thời trang</Link>
              <Link to="/acc-game" className="hover:text-yellow-400 text-white">Tài khoản game</Link>
              <Link to="/khuyen-mai" className="hover:text-yellow-400 text-white">Khuyến mãi</Link>
              <Link to="/dich-vu" className="hover:text-yellow-400 text-white">Dịch vụ</Link>
              <Link to="/contact" className="hover:text-yellow-400 text-white">Liên hệ</Link>
            </nav>

            {/* Menu mobile */}
            <div className="md:hidden flex justify-end px-4">
              <button onClick={toggleMenu} className="text-2xl text-white">
                {isMenuOpen ? "×" : "☰"}
              </button>
            </div>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.nav
                  key="mobile-menu"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="md:hidden flex flex-col items-center space-y-3 mt-2 text-base bg-gray-900 bg-opacity-90 p-4 shadow-md"
                >
                  <Link to="/" className="hover:text-yellow-400 text-white">Trang chủ</Link>
                  <Link to="/about" className="hover:text-yellow-400 text-white">Giới thiệu</Link>
                  <Link to="/thoi-trang" className="hover:text-yellow-400 text-white">Thời trang</Link>
                  <Link to="/acc-game" className="hover:text-yellow-400 text-white">Tài khoản game</Link>
                  <Link to="/khuyen-mai" className="hover:text-yellow-400 text-white">Khuyến mãi</Link>
                  <Link to="/dich-vu" className="hover:text-yellow-400 text-white">Dịch vụ</Link>
                  <Link to="/contact" className="hover:text-yellow-400 text-white">Liên hệ</Link>
                </motion.nav>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="searchbar"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900 p-3 text-white flex items-center"
          >
            {/* Logo */}
            <div className="flex items-center">
              <img
                src="https://th.bing.com/th?id=OSK.Gx03gXuGYG4opIcw73oEeAm33KFjNvHyQaeBmIQaoBg&w=46&h=46&c=11&rs=1&qlt=80&o=6&dpr=1.3&pid=SANGAM"
                alt="Logo"
                className="w-10 h-10"
              />
            </div>

            {/* Thanh tìm kiếm */}
            <div className="flex-1 flex flex-col items-center px-4">
              <div className="flex w-full max-w-md bg-gray-800 rounded-full px-4 py-2 shadow-md items-center">
                <FaSearch className="text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="flex-grow bg-transparent text-white px-2 focus:outline-none"
                />
                <button onClick={toggleSearch} className="text-gray-400 hover:text-white transition">
                  <FaTimes />
                </button>
              </div>

              {/* Top tìm kiếm */}
              <div className="mt-1 w-full">
                <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Top tìm kiếm
                </h3>
                <div className="grid grid-cols-3 gap-1">
                  {["Áo thun nam", "Giày sneaker", "Túi xách nữ", "Laptop gaming", "Đồng hồ", "Balo thời trang"].map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 text-gray-300 text-xs p-1.5 rounded-md text-center cursor-pointer hover:bg-yellow-400 hover:text-black transition"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Biểu tượng yêu thích */}
            <div className="flex items-center gap-x-2">
              <Link to="/wishlist" className="hover:text-yellow-400 text-white flex items-center text-sm">
                <FaHeart className="mr-1" />
                <span className="hidden lg:inline">Yêu thích</span>
              </Link>
              <Link to="/purchased" className="hover:text-yellow-400 text-white flex items-center text-sm">
                <FaShoppingBag className="mr-1" />
                <span className="hidden lg:inline">Đã mua</span>
              </Link>
              <Link to="/reviewed" className="hover:text-yellow-400 text-white flex items-center text-sm">
                <FaStar className="mr-1" />
                <span className="hidden lg:inline">Đã đánh giá</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
