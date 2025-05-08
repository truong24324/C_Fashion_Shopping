import React from "react";
import { 
  BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from "recharts";
import Card from "./UI/Card";

// 🔹 Dữ liệu số lượng đơn hàng theo tháng
const transactionData = [
  { month: "Jan", transactions: 120 },
  { month: "Feb", transactions: 150 },
  { month: "Mar", transactions: 200 },
  { month: "Apr", transactions: 300 },
  { month: "May", transactions: 350 },
  { month: "Jun", transactions: 280 },
  { month: "Jul", transactions: 400 },
  { month: "Aug", transactions: 420 },
  { month: "Sep", transactions: 500 },
  { month: "Oct", transactions: 450 },
  { month: "Nov", transactions: 520 },
  { month: "Dec", transactions: 600 },
];

// 🔹 Dữ liệu phương thức thanh toán phổ biến
const paymentData = [
  { method: "MoMo", value: 40 },
  { method: "Thẻ tín dụng", value: 35 },
  { method: "Tiền mặt", value: 15 },
  { method: "VNPay", value: 10 },
];
const PAYMENT_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

// 🔹 Dữ liệu tỷ lệ đơn hàng thành công vs. thất bại
const orderStatusData = [
  { status: "Thành công", value: 85 },
  { status: "Thất bại", value: 15 },
];
const STATUS_COLORS = ["#22c55e", "#ef4444"];

// 🔹 Dữ liệu lý do hủy đơn hàng
const cancelData = [
  { reason: "Sai kích thước", count: 35 },
  { reason: "Không đúng mẫu", count: 25 },
  { reason: "Giao hàng chậm", count: 20 },
  { reason: "Lý do khác", count: 10 },
];

const TransactionChart: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-6">
      {/* 🔹 Biểu đồ số lượng đơn hàng theo tháng */}
      <Card className="p-6 col-span-2">
        <h2 className="text-lg font-semibold">📊 Số lượng đơn hàng</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={transactionData}>
            <XAxis dataKey="month" stroke="#ffffff" />
            <YAxis stroke="#ffffff" />
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <Tooltip contentStyle={{ backgroundColor: "#222", borderRadius: "8px", color: "#fff" }} />
            <Bar dataKey="transactions" fill="#4f46e5" barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* 🔹 Biểu đồ phương thức thanh toán */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold">💳 Phương thức thanh toán</h2>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={paymentData} dataKey="value" nameKey="method" cx="50%" cy="50%" outerRadius={80}>
              {paymentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PAYMENT_COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* 🔹 Biểu đồ tỷ lệ đơn hàng thành công */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold">📈 Tỷ lệ đơn hàng thành công</h2>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={orderStatusData} dataKey="value" nameKey="status" cx="50%" cy="50%" outerRadius={80}>
              {orderStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={STATUS_COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* 🔹 Biểu đồ đơn hàng bị hủy */}
      <Card className="p-6 col-span-1">
        <h2 className="text-lg font-semibold">❌ Đơn hàng bị hủy</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart layout="vertical" data={cancelData}>
            <XAxis type="number" stroke="#ffffff" />
            <YAxis type="category" dataKey="reason" stroke="#ffffff" />
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <Tooltip />
            <Bar dataKey="count" fill="#ef4444" barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* 🔹 Biểu đồ thời gian cao điểm giao dịch
      <Card className="p-6 col-span-2">
        <h2 className="text-lg font-semibold">⏰ Thời gian cao điểm giao dịch</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={peakHoursData}>
            <XAxis dataKey="hour" stroke="#ffffff" />
            <YAxis stroke="#ffffff" />
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <Tooltip />
            <Line type="monotone" dataKey="transactions" stroke="#f59e0b" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </Card> */}
    </div>
  );
};

export default TransactionChart;
