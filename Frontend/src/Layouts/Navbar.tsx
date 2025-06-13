import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaUser, FaShoppingCart, FaMapMarkerAlt, FaSearch, FaTimes,
  FaHeart, FaShoppingBag, FaStar, FaSignOutAlt, FaMicrophone
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { TopSuggestion, DecodedToken } from "../components/CreateForm/Product/types";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<{ avatar: string; fullName: string } | null>(null);
  const [isListening, setIsListening] = useState(false); // NEW

  const [topSuggestions, setTopSuggestions] = useState<TopSuggestion[]>([]);
  const navigate = useNavigate();

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout", {}, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Đăng xuất thành công!");

      const keysToClear = [
        "cachedBrands", "cachedBrandsExpire", "cached_products_latest", "cached_products_latest_expiry",
        "variants_cache", "wishlist_cache", "accountId", "token", "user_cache"
      ];
      keysToClear.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      toast.error("Lỗi khi đăng xuất!");
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user_cache");
      setUser(null);
    }
  };

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    let decoded: DecodedToken;
    try {
      decoded = jwtDecode(token);
    } catch (err) {
      console.error("Không thể decode token:", err);
      return;
    }

    const now = Date.now() / 1000; // convert to seconds
    if (decoded.exp <= now) {
      console.warn("Token đã hết hạn.");
      localStorage.removeItem("user_cache");
      return;
    }

    const cached = localStorage.getItem("user_cache");
    if (cached) {
      const parsed = JSON.parse(cached);
      setUser(parsed);
      return;
    }

    try {
      const response = await fetch("/api/information/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        setUser(data.data);
        localStorage.setItem("user_cache", JSON.stringify(data.data));
      } else {
        toast.error(data.message || "Không thể lấy thông tin cá nhân");
      }
    } catch (error) {
      toast.error("Lỗi khi lấy thông tin cá nhân");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSearchByVoice = () => {
    if (!browserSupportsSpeechRecognition) {
      toast.error("Trình duyệt của bạn không hỗ trợ tìm kiếm bằng giọng nói!");
      return;
    }

    if (!isListening) {
      SpeechRecognition.startListening({ continuous: true, language: "vi-VN" });
      toast.success("🎙️ Bắt đầu nghe...");
    } else {
      SpeechRecognition.stopListening();
      toast("🛑 Đã dừng nghe");
    }

    setIsListening(!isListening);
  };

  useEffect(() => {
    if (transcript) {
      setSearchQuery(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    if (!isSearchOpen && isListening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const fetchTopSelling = async () => {
      try {
        const res = await axios.get("/api/views/top-selling-names");
        if (res.data.success) {
          setTopSuggestions(res.data.data);
        }
      } catch (err) {
        console.error("Lỗi khi lấy top sản phẩm:", err);
      }
    };
    fetchTopSelling();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const match = topSuggestions.find((item) =>
        item.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (match) {
        navigate(`/product/${match.productName}`);
      } else {
        navigate(`/product/${searchQuery}`);
      }
    }
  };

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
            <div className="flex justify-between items-center px-4 py-2 bg-gray-900 bg-opacity-90 sm:px-8 shadow-md">
              <div className="flex items-center space-x-4">
                <img
                  src="/images/logo.jpg"
                  alt="Logo"
                  className="w-10 h-10"
                />
                <span className="text-xl font-bold text-white hidden md:inline">C WEB</span>
              </div>

              <div className="flex-grow flex justify-center items-center overflow-hidden">
                <div className="whitespace-nowrap text-white text-sm font-medium animate-marquee">
                  Chào mừng bạn đến với cửa hàng của chúng tôi! - Ưu đãi hấp dẫn mỗi ngày! - Mua sắm ngay!
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-2 text-white">
                    <Link to="/profile" className="flex items-center space-x-2 text-white">
                      <img
                        src={
                          user?.avatar
                            ? `/${user.avatar}` // Thêm "/" để luôn bắt đầu từ root
                            : "https://via.placeholder.com/150"
                        }
                        alt="Avatar"
                        className="w-8 h-8 rounded-full"
                      />
                      <span>{user?.fullName}</span>
                    </Link>

                    <button onClick={handleLogout} className="text-white flex items-center text-sm hover:text-yellow-400">
                      <FaSignOutAlt className="mr-2" />
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

            <nav className="hidden md:flex justify-center space-x-6 py-2 text-base bg-gray-900 bg-opacity-80 shadow-md">
              <Link to="/" className="hover:text-yellow-400 text-white">Trang chủ</Link>
              <Link to="/fashion" className="hover:text-yellow-400 text-white">Thời trang</Link>
              <Link to="/about" className="hover:text-yellow-400 text-white">Giới thiệu</Link>
              <Link to="/contact" className="hover:text-yellow-400 text-white">Liên hệ</Link>
            </nav>

            <div className="md:hidden flex justify-end px-4">
              <button onClick={toggleMenu} className="text-2xl text-yellow-400">
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
                  <Link to="/fashion" className="hover:text-yellow-400 text-white">Thời trang</Link>
                  <Link to="/about" className="hover:text-yellow-400 text-white">Giới thiệu</Link>
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

            <div className="flex-1 flex flex-col items-center px-4">
              <div className="flex w-full max-w-md bg-gray-800 rounded-full px-4 py-2 shadow-md items-center">
                <FaSearch className="text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="flex-grow bg-transparent text-white px-2 focus:outline-none"
                  onKeyDown={handleKeyDown}
                />

                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      resetTranscript();
                    }}
                    className="text-gray-400 hover:text-white ml-1"
                  >
                    <FaTimes />
                  </button>
                )}

                <button
                  onClick={handleSearchByVoice}
                  className={`text-white flex items-center text-sm ${isListening ? "text-yellow-400 animate-pulse" : "hover:text-yellow-400"}`}
                >
                  <FaMicrophone />
                </button>
                <button onClick={toggleSearch} className="text-gray-400 hover:text-white transition">
                  <FaTimes />
                </button>
              </div>

              <div className="mt-1 w-full">
                <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">Top tìm kiếm</h3>
                <div className="grid grid-cols-3 gap-1">
                  {topSuggestions
                    .slice(0, 6) // chỉ hiển thị 6 kết quả top phù hợp nhất
                    .sort((a, b) => {
                      const query = searchQuery.toLowerCase();
                      const aIndex = a.productName.toLowerCase().indexOf(query);
                      const bIndex = b.productName.toLowerCase().indexOf(query);

                      // Ưu tiên những sản phẩm có vị trí xuất hiện query thấp hơn (tức là khớp sớm hơn)
                      if (aIndex === -1) return 1;
                      if (bIndex === -1) return -1;
                      return aIndex - bIndex;
                    })
                    .map((item) => (
                      <div
                        key={item.productName}
                        onClick={() => navigate(`/product/${item.productName}`)}
                        className="bg-gray-800 text-gray-300 text-xs p-1.5 rounded-md text-center cursor-pointer hover:bg-yellow-400 hover:text-black transition"
                      >
                        <span
                          dangerouslySetInnerHTML={{
                            __html: item.productName.replace(
                              new RegExp(`(${searchQuery})`, "gi"),
                              "<span class='text-yellow-400'>$1</span>"
                            ),
                          }}
                        />
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-x-2">
              <Link to="/wishlist" className="hover:text-yellow-400 text-white flex items-center text-sm">
                <FaHeart className="mr-1" />
                <span className="hidden lg:inline">Yêu thích</span>
              </Link>
              <Link to="/purchased" className="hover:text-yellow-400 text-white flex items-center text-sm">
                <FaShoppingBag className="mr-1" />
                <span className="hidden lg:inline">Đã mua</span>
              </Link>
              <Link to="/review" className="hover:text-yellow-400 text-white flex items-center text-sm">
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
