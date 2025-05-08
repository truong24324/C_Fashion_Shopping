import React from "react";
import { LineChart, Line, Tooltip, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";
import Card from "./UI/Card";

const revenueData = [
  { month: "Jan", revenue: 1200 },
  { month: "Feb", revenue: 1600 },
  { month: "Mar", revenue: 2100 },
  { month: "Apr", revenue: 2500 },
  { month: "May", revenue: 3100 },
  { month: "Jun", revenue: 2800 },
  { month: "Jul", revenue: 3400 },
  { month: "Aug", revenue: 3700 },
  { month: "Sep", revenue: 3900 },
  { month: "Oct", revenue: 4100 },
  { month: "Nov", revenue: 4500 },
  { month: "Dec", revenue: 5000 },
];

interface ChartProps {
  className?: string;
}

const RevenueChart: React.FC<ChartProps> = ({ className }) => {
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

export default RevenueChart;
