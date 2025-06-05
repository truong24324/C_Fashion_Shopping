import { useEffect, useState } from "react";
import {
  Home,
  CreditCard,
  ListOrderedIcon,
  Users,
  FileText,
  PlusCircle,
  Trash,
  Edit,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode";

const menuSections = [
  {
    title: "Thống kê",
    items: [
      { icon: Home, label: "Tổng quan" },
      { icon: CreditCard, label: "Giao dịch" },
      { icon: ListOrderedIcon, label: "Đơn hàng" },
    ],
  },
  {
    title: "Quản lý dữ liệu",
    items: [
      { icon: Users, label: "Người dùng" },
      { icon: FileText, label: "Danh sách" },
      { icon: PlusCircle, label: "Thêm mới" },
      { icon: Edit, label: "Chỉnh sửa" },
    ],
  },
  {
    title: "Tùy chọn hệ thống",
    items: [
      { icon: Settings, label: "Cài đặt" },
      { icon: LogOut, label: "Đăng xuất" },
    ],
  },
];

const Sidebar = ({ onSelect }: { onSelect: (label: string) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeLabel, setActiveLabel] = useState("Tổng quan");
  const [user, setUser] = useState<any>(null);

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp <= now) {
        localStorage.removeItem("user_cache");
        return;
      }

      const cached = localStorage.getItem("user_cache");
      if (cached) {
        setUser(JSON.parse(cached));
        return;
      }

      const response = await fetch("/api/information/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.data);
        localStorage.setItem("user_cache", JSON.stringify(data.data));
      }
    } catch (err) {
      console.error("Lỗi khi lấy profile:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <motion.aside
      animate={{ width: isExpanded ? "260px" : "90px" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen bg-gray-900/40 backdrop-blur-xl border-r border-gray-700 flex flex-col p-4 shadow-xl rounded-tr-3xl rounded-br-3xl relative"
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute right-[-14px] top-5 bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-700 transition-all"
      >
        {isExpanded ? (
          <ChevronLeft size={20} className="text-white" />
        ) : (
          <ChevronRight size={20} className="text-white" />
        )}
      </button>

      {/* Avatar + User Info */}
      <div
        className="flex items-center gap-3 px-3 mb-6 mt-8 cursor-pointer"
        onClick={() => {
          setActiveLabel("Chỉnh sửa thông tin");
          onSelect("Chỉnh sửa thông tin");
        }}
      >
        <img
          src={user?.avatar || "https://via.placeholder.com/150"}
          alt="Avatar"
          className="w-10 h-10 rounded-full border border-white"
        />
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-white font-semibold text-sm truncate"
            >
              {user?.fullName || "Tài khoản"}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Sections */}
      <nav className="flex flex-col gap-6 w-full">
        {menuSections.map((section, index) => (
          <div key={index} className="w-full">
            <AnimatePresence>
              {isExpanded && (
                <motion.h3
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-gray-400 text-xs uppercase px-5"
                >
                  {section.title}
                </motion.h3>
              )}
            </AnimatePresence>
            <div className="flex flex-col mt-2">
              {section.items.map(({ icon: Icon, label }, idx) => {
                const isActive = activeLabel === label;
                return (
                  <motion.button
                    key={idx}
                    onClick={() => {
                      setActiveLabel(label);
                      onSelect(label);
                    }}
                    className={`flex items-center gap-4 px-4 py-3 w-full text-lg font-medium rounded-xl transition-all
                      ${isActive
                        ? "bg-green-500/30 text-green-300"
                        : "hover:bg-green-500/20 hover:text-green-300 text-white"
                      }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon
                      size={isExpanded ? 22 : 28}
                      className={`${isActive ? "text-green-300" : "text-green-400"}`}
                    />
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          {label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
