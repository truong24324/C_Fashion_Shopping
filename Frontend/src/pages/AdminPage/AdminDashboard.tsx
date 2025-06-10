import React, { useState, useEffect } from "react";
import Sidebar from "../../Layouts/SideBar";
import RevenueChart from "../../components/RevenueChart";
import StatsCard from "../../components/StatsCard";
import TransactionChart from "../../components/TransactionChart";
import ListDisplay from "./ListDisplay";
import CreateDisplay from "./CreateDisplay";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AccountDisplay from "./AccountDisplay";
import OrderDisplay from "./OrderDisplay";
import EditDisplay from "./EditProfileDisplay";
import UpdateDisplay from "./UpdateDisplay";
import axios from "axios";
const AdminDashboard: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState("Tổng quan");
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    bestSeller: "",
    newCustomers: 0,
  });

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

      // Xóa token khỏi localStorage
      localStorage.removeItem("token");
      const keysToClear = [
        "cachedBrands", "cachedBrandsExpire", "cached_products_latest", "cached_products_latest_expiry",
        "variants_cache", "wishlist_cache", "accountId", "token", "user_cache"
      ];
      keysToClear.forEach(key => localStorage.removeItem(key));
      toast.success("Đăng xuất thành công!");
      navigate("/auth"); // Chuyển hướng về trang đăng nhập
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi đăng xuất!");
    }
  };

  useEffect(() => {
    if (selectedMenu === "Tổng quan") {
      axios.get("/api/admin/dashboard/overview", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then(res => {
        const data = res.data;
        setStats({
          revenue: data.totalRevenue,
          orders: data.totalOrders,
          bestSeller: data.bestSellingProduct,
          newCustomers: data.newCustomersToday,
        });
      }).catch(err => {
        toast.error("Không thể tải thống kê tổng quan");
      });
    }
  }, [selectedMenu]);

  const contentMap: Record<string, React.ReactNode> = {
    "Tổng quan": (
      <div>
        <h1 className="text-3xl font-semibold">Bảng Điều Khiển Bán Hàng</h1>
        <div className="grid grid-cols-4 gap-6 mt-6">
          <StatsCard
            title="Tổng doanh thu"
            value={stats.revenue.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
            color="text-green-400"
          />
          <StatsCard title="Đơn hàng" value={`${stats.orders}`} color="text-blue-400" />
          <StatsCard title="Sản phẩm bán chạy" value={stats.bestSeller} color="text-yellow-400" />
          <StatsCard title="Tổng số khách hàng" value={`${stats.newCustomers}`} color="text-purple-400" />
        </div>
        <div className="grid grid-cols-2 gap-8 mt-8">
          <RevenueChart />
        </div>
      </div>
    ),
    "Chỉnh sửa thông tin": <div>
      <EditDisplay />
    </div>,
    "Giao dịch": <div><h2 className="text-3xl font-semibold">Giao Dịch</h2><TransactionChart /></div>,
    "Đơn hàng": <div><h2 className="text-3xl font-semibold">Đơn hàng</h2><OrderDisplay /></div>,
    "Người dùng": <div><h2 className="text-3xl font-semibold">Người Dùng</h2><AccountDisplay /></div>,
    "Danh sách": <div><h2 className="text-3xl font-semibold">Danh Sách</h2><ListDisplay /></div>,
    "Thêm mới": <div><h2 className="text-3xl font-semibold">Thêm Mới</h2><CreateDisplay /></div>,
    "Chỉnh sửa":  <div><h2 className="text-3xl font-semibold">Chỉnh sửa</h2><UpdateDisplay /></div>,
    "Đăng xuất": (
      <div>
        <h2 className="text-3xl font-semibold">Đăng Xuất</h2>
        <button
          className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 rounded text-white"
          onClick={handleLogout}
        >
          Xác nhận đăng xuất
        </button>
      </div>
    ),
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-green-900 text-white">
      <Sidebar onSelect={setSelectedMenu} />
      <main className="flex-1 p-8">
        {contentMap[selectedMenu] || <h2 className="text-2xl">Tính năng đang phát triển. Vui lòng quay lại sau!</h2>}
      </main>
    </div>
  );
};

export default AdminDashboard;
