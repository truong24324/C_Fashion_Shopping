import React, { useEffect, useState } from "react";
import { LineChart, Line, Tooltip, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";
import Card from "./UI/Card";
import axios from "axios";
import toast from "react-hot-toast";

interface RevenueItem {
  month: number;
  revenue: number;
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const RevenueChart: React.FC<{ className?: string }> = ({ className }) => {
  const [revenueData, setRevenueData] = useState<{ month: string; revenue: number }[]>([]);

  useEffect(() => {
    axios.get<RevenueItem[]>("/api/admin/dashboard/monthly-revenue", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((res) => {
        const formatted = res.data.map(item => ({
          month: monthNames[item.month - 1],
          revenue: item.revenue,
        }));
        setRevenueData(formatted);
      })
      .catch(err => {
        console.error("Failed to fetch revenue data", err);
        toast.error(err.response?.data?.message || "Lỗi khi tải thống kê năm");
      });
  }, []);

  return (
    <Card className={`p-6 col-span-2 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-200">📈 Doanh Thu Cửa Hàng</h2>
      <p className="text-sm text-gray-400 mb-2">Thống kê doanh thu theo tháng (VNĐ)</p>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={revenueData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <XAxis dataKey="month" stroke="#ffffff" />
          <YAxis stroke="#ffffff" />
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <Tooltip contentStyle={{ backgroundColor: "#222", borderRadius: "8px", color: "#fff" }} />
          <Line type="monotone" dataKey="revenue" stroke="#ff9800" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default RevenueChart
