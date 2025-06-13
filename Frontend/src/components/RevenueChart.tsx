import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Card from "./UI/Card";
import axios from "axios";
import toast from "react-hot-toast";
import { RevenueItem } from "./CreateForm/Product/types";

const monthNames = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

const RevenueChart: React.FC<{ className?: string }> = ({ className }) => {
  const [revenueData, setRevenueData] = useState<
    { month: string; revenue: number }[]
  >([]);

  useEffect(() => {
    axios
      .get("/api/admin/dashboard/monthly-revenue", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {

        const formatted = res.data.map((item: RevenueItem) => {
          // Kiểm tra month hợp lệ 1-12, nếu không thì "Unknown"
          const monthLabel =
            item.month >= 1 && item.month <= 12
              ? monthNames[item.month - 1]
              : "Unknown";

          // Ép kiểu số revenue, nếu không hợp lệ thì 0
          const revenueNumber = Number(item.revenue);
          return {
            month: monthLabel,
            revenue: isNaN(revenueNumber) ? 0 : revenueNumber,
          };
        });

        setRevenueData(formatted);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Lỗi khi tải thống kê năm");
      });
  }, []);

  return (
    <Card className={`p-6 col-span-2 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-200">📈 Doanh Thu Cửa Hàng</h2>
      <p className="text-sm text-gray-400 mb-2">
        Thống kê doanh thu theo tháng (VNĐ)
      </p>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          data={revenueData}
          margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
        >
          <XAxis dataKey="month" stroke="#ffffff" />
          <YAxis
            stroke="#ffffff"
            tickFormatter={(value) =>
              value >= 1_000_000_000
                ? `${(value / 1_000_000_000).toFixed(1)} Tỷ`
                : value >= 1_000_000
                  ? `${(value / 1_000_000).toFixed(1)} Triệu`
                  : value >= 1_000
                    ? `${(value / 1_000).toFixed(1)} Nghìn`
                    : value
            }
          />
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <Tooltip
            formatter={(value: number) =>
              value.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
                maximumFractionDigits: 0,
              })
            }
            contentStyle={{ backgroundColor: "#222", borderRadius: "8px", color: "#fff" }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#ff9800"
            strokeWidth={3}
            dot={{ stroke: "#ff9800", strokeWidth: 2, fill: "#ff9800" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default RevenueChart;
