import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../../Layouts/SideBar";
import RevenueChart from "../../components/RevenueChart";
import StatsCard from "../../components/StatsCard";
import TransactionChart from "../../components/TransactionChart";
import ListDisplay from "./ListDisplay";
import CreateDisplay from "./CreateDisplay";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState("Tổng quan");
  const navigate = useNavigate();

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

      toast.success("Đăng xuất thành công!");
      navigate("/auth"); // Chuyển hướng về trang đăng nhập
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi đăng xuất!");
    }
  };

  const contentMap: Record<string, React.ReactNode> = {
    "Tổng quan": (
      <div>
        <h1 className="text-3xl font-semibold">Bảng Điều Khiển Bán Hàng</h1>
        <div className="grid grid-cols-4 gap-6 mt-6">
          <StatsCard title="Tổng doanh thu" value="$120,450" color="text-green-400" change="+15% tháng này" />
          <StatsCard title="Đơn hàng" value="3,245" color="text-blue-400" change="+8% tuần này" />
          <StatsCard title="Sản phẩm bán chạy" value="Áo Hoodie" color="text-yellow-400" />
          <StatsCard title="Khách hàng mới" value="1,245" color="text-purple-400" change="+5% hôm nay" />
        </div>
        <div className="grid grid-cols-2 gap-8 mt-8">
          <RevenueChart />
        </div>
      </div>
    ),
    "Giao dịch": <div><h2 className="text-3xl font-semibold">Giao Dịch</h2><TransactionChart /></div>,
    "Báo cáo": <div><h2 className="text-3xl font-semibold">Báo Cáo</h2></div>,
    "Người dùng": <div><h2 className="text-3xl font-semibold">Người Dùng</h2></div>,
    "Danh sách": <div><h2 className="text-3xl font-semibold">Danh Sách</h2><ListDisplay /></div>,
    "Thêm mới": <div><h2 className="text-3xl font-semibold">Thêm Mới</h2><CreateDisplay /></div>,
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
        {contentMap[selectedMenu] || <h2 className="text-2xl">Chưa có nội dung</h2>}
      </main>
    </div>
  );
};

export default AdminDashboard;
