import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import Card from "./UI/Card";
import toast from "react-hot-toast";
import Loading from "./common/Loading";
import axios from "axios";

const PAYMENT_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];
const STATUS_COLORS = ["#22c55e", "#ef4444", "#3b82f6", "#f97316"];

const TransactionChart: React.FC = () => {
  const [transactionData, setTransactionData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [cancelData, setCancelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setLoadError(false);
      try {
        const year = new Date().getFullYear();

        const [yearlyRes, paymentRes, statusRes] = await Promise.all([
          axios.get(`/api/admin/dashboard/statistics/yearly`,
            {headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }}
          ),
          axios.get(`/api/admin/dashboard/payment-methods`,
            {headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }}
          ),
          axios.get(`/api/admin/dashboard/order-statuses`,
            {headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }}
          )
        ]);

        // Yearly order stats
        const yearlyData = yearlyRes.data.data.map((row: any) => ({
          month: `Tháng ${row[0]}`,
          transactions: row[1]
        }));

        // Payment method distribution
        const paymentChartData = paymentRes.data.data.map((row: any) => ({
          method: row[0],
          value: row[1]
        }));

        // Order status distribution (only for statuses 7, 8, 9 as in backend)
        const statusChartData = statusRes.data.data.map((row: any) => ({
          status: row[1], // statusName
          value: row[2]   // count
        }));

        setTransactionData(yearlyData);
        setPaymentData(paymentChartData);
        setOrderStatusData(statusChartData);

      } catch (error) {
        console.error("Lỗi khi load dữ liệu dashboard:", error);
        toast.error("Không thể tải dữ liệu thống kê");
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loading />;
  if (loadError) return <div className="text-red-500">❌ Không thể tải dữ liệu thống kê.</div>;

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* 🔹 Biểu đồ số lượng đơn hàng theo tháng */}
      <Card className="p-6 col-span-2">
        <h2 className="text-lg font-semibold">📊 Số lượng đơn hàng theo tháng</h2>
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
                <Cell key={`payment-${index}`} fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* 🔹 Biểu đồ trạng thái đơn hàng */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold">📈 Trạng thái đơn hàng</h2>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={orderStatusData} dataKey="value" nameKey="status" cx="50%" cy="50%" outerRadius={80}>
              {orderStatusData.map((entry, index) => (
                <Cell key={`status-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* 🔹 Biểu đồ lý do đơn hàng bị hủy (placeholder nếu chưa có API) */}
      <Card className="p-6 col-span-1">
        <h2 className="text-lg font-semibold">❌ Đơn hàng bị hủy (đang phát triển)</h2>
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
