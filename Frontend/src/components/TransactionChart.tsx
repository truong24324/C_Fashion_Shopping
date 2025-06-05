import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import Card from "./UI/Card";
import toast from "react-hot-toast";
import Loading from "./common/Loading";

const PAYMENT_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];
const STATUS_COLORS = ["#22c55e", "#ef4444"];

const TransactionChart: React.FC = () => {
  const [transactionData, setTransactionData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [cancelData, setCancelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);


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
                <Cell key={`cell-${index}`} fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]} />
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
                <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* 🔹 Biểu đồ lý do đơn hàng bị hủy */}
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
    </div>
  );
};

export default TransactionChart;
