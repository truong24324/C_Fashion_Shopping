import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { PointHistory } from "./CreateForm/Product/types";
import { motion } from "framer-motion";

const DailyPointClaim: React.FC = () => {
    const [currentPoints, setCurrentPoints] = useState<number>(0);
    const [history, setHistory] = useState<PointHistory[]>([]);
    const [loading, setLoading] = useState(false);
    const [streak, setStreak] = useState<number>(3); // giả lập chuỗi

    const fetchCurrentPoints = async () => {
        try {
            const res = await axios.get("/api/points/current/me", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setCurrentPoints(res.data.data || 0);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Không thể tải điểm hiện tại.");
        }
    };

    const fetchPointHistory = async () => {
        try {
            const res = await axios.get("/api/points/history/me", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setHistory(res.data.data || []);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Không thể tải lịch sử nhận xu.");
        }
    };

    const handleClaimPoints = async () => {
        setLoading(true);
        try {
            const res = await axios.post("/api/points/checkin", null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            toast.success("Nhận xu thành công!");
            await fetchCurrentPoints();
            await fetchPointHistory();
            await fetchStreak();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Bạn đã nhận xu hôm nay rồi!");
        } finally {
            setLoading(false);
        }
    };

    const fetchStreak = async () => {
        try {
            const res = await axios.get("/api/points/streak", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setStreak(res.data.data || 0);
        } catch (error) {
            toast.error("Không thể lấy chuỗi điểm danh");
        }
    };

    useEffect(() => {
        fetchCurrentPoints();
        fetchPointHistory();
        fetchStreak(); // Gọi thêm streak khi load
    }, []);

    const renderCalendar = () => {
        const days = Array.from({ length: 14 }, (_, i) => i + 1);
        return (
            <div className="grid grid-cols-7 gap-3 mt-4">
                {days.map((day) => (
                    <div
                        key={day}
                        className={`day-box p-3 text-center rounded-lg border-2 transition transform ${day < 4
                                ? "bg-gradient-to-r from-green-500 to-green-400 text-white border-green-500"
                                : day === 4
                                    ? "bg-gradient-to-r from-blue-500 to-blue-400 text-white border-blue-500 animate-pulse"
                                    : "bg-white border-gray-200"
                            } hover:-translate-y-1 shadow-sm`}
                    >
                        Ngày {day}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="max-w-full mx-auto px-6 py-10">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-red-400 to-yellow-300 text-white text-center p-8 rounded-2xl overflow-hidden shadow-lg">
                <h1 className="text-3xl font-bold mb-2">🎯 Hệ Thống Nhận Xu Hàng Ngày</h1>
                <div className="flex justify-center items-center gap-3 text-3xl font-bold mb-2">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="w-10 h-10 rounded-full bg-yellow-300 text-gray-800 flex items-center justify-center"
                    >
                        🪙
                    </motion.div>
                    <span>{currentPoints}</span>
                    <span className="text-lg">xu</span>
                </div>
                <p className="text-sm">Hoàn thành các nhiệm vụ hàng ngày để nhận xu miễn phí!</p>
            </div>

            {/* Daily Check-in Section */}
            <div className="bg-gray-50 mt-10 rounded-xl border p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2 mb-4">
                    📅 Điểm Danh Hàng Ngày
                </h3>

                {/* Calendar */}
                {renderCalendar()}

                {/* Button claim */}
                <div className="text-center mt-6">
                    <button
                        onClick={handleClaimPoints}
                        disabled={loading}
                        className={`px-6 py-3 rounded-full text-white font-semibold text-lg transition-all shadow-md ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-red-400 to-yellow-400 hover:shadow-lg hover:-translate-y-1"
                            }`}
                    >
                        {loading ? "Đang nhận..." : "Điểm danh hôm nay (+100 xu)"}
                    </button>
                </div>

                {/* Streak */}
                <p className="text-center mt-4 font-bold text-red-500">🔥 Chuỗi điểm danh: {streak} ngày</p>
            </div>
        </div>
    );
};

export default DailyPointClaim;
