import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaVenusMars,
  FaHome,
  FaBuilding,
  FaGlobe,
  FaEdit,
  FaKey,
  FaHome as FaHomeIcon,
  FaCog,
  FaSignOutAlt,
  FaEye,
  FaDownload,
  FaTrash,
  FaShieldAlt,
  FaPhone
} from "react-icons/fa";
import { EditProfileFormProps } from "../../components/CreateForm/Product/types";
import QRCodeGenerator from "src/AuthForm/QRCodeGenerator";

const ProfileInfoForm: React.FC<EditProfileFormProps> = ({ user, setIsEditing, setIsChangePassword }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'account' | 'security'>('info');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const Navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout", {}, {
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
      Navigate("/");
    }
  };

  const handleDownloadData = () => {
    // Mock data download
    const userData = JSON.stringify(user, null, 2);
    const blob = new Blob([userData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'profile-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = () => {
    // Mock account deletion
    console.log('Deleting account...');
    setShowConfirmDelete(false);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const InfoField = ({ icon: Icon, label, value, color = "text-blue-400" }: {
    icon: React.ComponentType<any>;
    label: string;
    value: string;
    color?: string;
  }) => (
    <motion.div
      className="flex items-center p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
      variants={itemVariants}
      whileHover={{ scale: 1.02, backgroundColor: "rgba(31, 41, 55, 0.8)" }}
    >
      <div className={`p-3 rounded-lg bg-gradient-to-r ${color === "text-blue-400" ? "from-blue-500/20 to-blue-600/20" : "from-purple-500/20 to-purple-600/20"}`}>
        <Icon className={`text-xl ${color}`} />
      </div>
      <div className="ml-4 flex-1">
        <p className="text-sm text-gray-400 mb-1">{label}</p>
        <p className="text-white font-medium">{value || "Chưa cập nhật"}</p>
      </div>
    </motion.div>
  );

  const ActionButton = ({ icon: Icon, label, onClick, color = "blue", variant = "primary" }: {
    icon: React.ComponentType<any>;
    label: string;
    onClick: () => void;
    color?: "blue" | "yellow" | "green" | "red" | "purple";
    variant?: "primary" | "secondary" | "outline";
  }) => {
    const colorClasses = {
      blue: variant === "primary" ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700" :
        variant === "secondary" ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30" :
          "border-blue-500 text-blue-400 hover:bg-blue-500/10",
      yellow: variant === "primary" ? "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700" :
        variant === "secondary" ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30" :
          "border-yellow-500 text-yellow-400 hover:bg-yellow-500/10",
      green: variant === "primary" ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700" :
        variant === "secondary" ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" :
          "border-green-500 text-green-400 hover:bg-green-500/10",
      red: variant === "primary" ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700" :
        variant === "secondary" ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" :
          "border-red-500 text-red-400 hover:bg-red-500/10",
      purple: variant === "primary" ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700" :
        variant === "secondary" ? "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30" :
          "border-purple-500 text-purple-400 hover:bg-purple-500/10"
    };

    return (
      <motion.button
        onClick={onClick}
        className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${colorClasses[color]} ${variant === "outline" ? "border-2" : ""} ${variant === "primary" ? "text-white shadow-lg" : ""}`}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon className="text-lg" />
        <span>{label}</span>
      </motion.button>
    );
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <motion.div
        className="relative bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 p-8 rounded-2xl mb-8 overflow-hidden"
        variants={itemVariants}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
        <div className="relative z-10 flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-75" />
            <img
              src={user?.avatar || "https://via.placeholder.com/150"}
              alt="Avatar"
              className="relative w-32 h-32 rounded-full object-cover border-4 border-white/20 shadow-2xl"
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-900 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </motion.div>

          <div className="text-center md:text-left flex-1">
            <motion.h1
              className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2"
              variants={itemVariants}
            >
              {user?.fullName || "John Doe"}
            </motion.h1>
            <motion.p
              className="text-gray-400 text-lg mb-4"
              variants={itemVariants}
            >
              {user?.email || "example@example.com"}
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-2 justify-center md:justify-start"
              variants={itemVariants}
            >
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                Thành viên
              </span>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                Đang hoạt động
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        className="flex space-x-1 bg-gray-800/50 backdrop-blur-sm p-1 rounded-xl mb-8"
        variants={itemVariants}
      >
        {[
          { id: 'info', label: 'Thông tin cá nhân', icon: FaUser },
          { id: 'account', label: 'Tài khoản', icon: FaCog },
          { id: 'security', label: 'Bảo mật', icon: FaShieldAlt }
        ].map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 flex-1 justify-center ${activeTab === tab.id
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <tab.icon className="text-lg" />
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {activeTab === 'info' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoField icon={FaCalendarAlt} label="Ngày sinh" value={user?.birthday ? formatDate(user.birthday) : "N/A"} />
              <InfoField icon={FaVenusMars} label="Giới tính" value={user?.gender || "N/A"} color="text-purple-400" />
              <InfoField icon={FaHome} label="Địa chỉ nhà" value={user?.homeAddress || "N/A"} />
              <InfoField icon={FaBuilding} label="Địa chỉ công ty" value={user?.officeAddress || "N/A"} />
              <InfoField icon={FaGlobe} label="Quốc tịch" value={user?.nationality || "N/A"} color="text-purple-400" />
              <InfoField icon={FaEnvelope} label="Email" value={user?.email || "N/A"} />
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <ActionButton
                icon={FaEdit}
                label="Chỉnh sửa thông tin"
                onClick={() => setIsEditing(true)}
                color="yellow"
              />
              <ActionButton
                icon={FaHomeIcon}
                label="Trang chủ"
                onClick={() => Navigate("/")}
                color="blue"
                variant="secondary"
              />
            </div>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoField
                icon={FaUser}
                label="Mã tài khoản"
                value={user?.userCode || "N/A"}
              />
              <InfoField
                icon={FaEnvelope}
                label="Email"
                value={user?.email || "N/A"}
              />
              <InfoField
                icon={FaPhone}
                label="Số điện thoại"
                value={user?.phone || "N/A"}
              />
              <InfoField
                icon={FaCalendarAlt}
                label="Ngày tạo tài khoản"
                value={user?.createdAt ? formatDate(user.createdAt) : "N/A"}
              />
              <InfoField
                icon={FaCalendarAlt}
                label="Cập nhật lần cuối"
                value={user?.updatedAt ? formatDate(user.updatedAt) : "N/A"}
                color="text-yellow-400"
              />
              <InfoField
                icon={FaEye}
                label="Lần thay đổi mật khẩu"
                value={user?.passwordChangedAt ? formatDate(user.passwordChangedAt) : "N/A"}
                color="text-green-400"
              />
              <InfoField
                icon={FaEye}
                label="Lần đăng nhập cuối"
                value={user?.loginTime ? formatDate(user.loginTime) : "N/A"}
                color="text-purple-400"
              />
              <QRCodeGenerator/>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Quản lý dữ liệu</h3>
              <div className="flex flex-wrap gap-4">
                <ActionButton
                  icon={FaDownload}
                  label="Tải xuống dữ liệu"
                  onClick={handleDownloadData}
                  color="green"
                  variant="secondary"
                />
                <ActionButton
                  icon={FaTrash}
                  label="Xóa tài khoản"
                  onClick={() => setShowConfirmDelete(true)}
                  color="red"
                  variant="outline"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Bảo mật tài khoản</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FaKey className="text-blue-400" />
                    <div>
                      <p className="text-white font-medium">Mật khẩu</p>
                      <p className="text-gray-400 text-sm">Thay đổi mật khẩu định kỳ</p>
                    </div>
                  </div>
                  <ActionButton
                    icon={FaKey}
                    label="Đổi mật khẩu"
                    onClick={() => setIsChangePassword(true)}
                    color="blue"
                    variant="secondary"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FaShieldAlt className="text-green-400" />
                    <div>
                      <p className="text-white font-medium">Xác thực 2 lớp</p>
                      <p className="text-gray-400 text-sm">Bảo vệ tài khoản với xác thực 2 lớp</p>
                    </div>
                  </div>
                  <ActionButton
                    icon={FaShieldAlt}
                    label="Thiết lập"
                    onClick={() => console.log("Setup 2FA")}
                    color="green"
                    variant="secondary"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-red-400 mb-4">Vùng nguy hiểm</h3>
              <div className="flex flex-wrap gap-4">
                <ActionButton
                  icon={FaSignOutAlt}
                  label="Đăng xuất"
                  color="red"
                  variant="outline"
                  onClick={() => setShowConfirmLogout(true)}
                />
                <ActionButton
                  icon={FaTrash}
                  label="Xóa tài khoản vĩnh viễn"
                  onClick={() => setShowConfirmDelete(true)}
                  color="red"
                />
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {showConfirmLogout && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h3 className="text-xl font-bold text-white mb-4">Xác nhận đăng xuất</h3>
            <p className="text-gray-400 mb-6">
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản này?
            </p>
            <div className="flex space-x-4">
              <ActionButton
                icon={FaSignOutAlt}
                label="Đăng xuất"
                onClick={handleLogout}
                color="red"
                variant="primary"
              />
              <ActionButton
                icon={FaSignOutAlt}
                label="Hủy"
                onClick={() => setShowConfirmLogout(false)}
                color="blue"
                variant="secondary"
              />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Confirm Delete Modal */}
      {showConfirmDelete && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h3 className="text-xl font-bold text-white mb-4">Xác nhận xóa tài khoản</h3>
            <p className="text-gray-400 mb-6">
              Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.
            </p>
            <div className="flex space-x-4">
              <ActionButton
                icon={FaTrash}
                label="Xóa vĩnh viễn"
                onClick={handleDeleteAccount}
                color="red"
              />
              <ActionButton
                icon={FaSignOutAlt}
                label="Hủy"
                onClick={() => setShowConfirmDelete(false)}
                color="blue"
                variant="secondary"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProfileInfoForm;