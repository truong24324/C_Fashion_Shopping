import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { PointHistory } from "./CreateForm/Product/types";
import { motion } from "framer-motion";

const DailyPointClaim: React.FC = () => {
    const [currentPoints, setCurrentPoints] = useState<number>(0);
    const [history, setHistory] = useState<PointHistory[]>([]);
    const [loading, setLoading] = useState(false);
    const [streak, setStreak] = useState<number>(0);
    const [showAddPoint, setShowAddPoint] = useState(false);
    const [rewardAmount, setRewardAmount] = useState<number>(0);

    const calculateReward = (streak: number) => {
        if (streak >= 7) return 300;
        if (streak >= 4) return 200;
        return 100;
    };

    const handleClaimPoints = async () => {
        setLoading(true);
        const reward = calculateReward(streak);
        try {
            const res = await axios.post("/api/points/checkin", null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            toast.success(`Nhận ${reward} xu thành công!`);
            setRewardAmount(reward);
            setShowAddPoint(true);
            setTimeout(() => setShowAddPoint(false), 2000);

            await fetchUserPointInfo();

        } catch (error: any) {
            toast.error(error.response?.data?.message || "Bạn đã nhận xu hôm nay rồi!");
        } finally {
            setLoading(false);
        }
    };

    const fetchUserPointInfo = async () => {
        try {
            const res = await axios.get("/api/points/me", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const { currentPoints, history, streak } = res.data.data || {};
            setCurrentPoints(currentPoints || 0);
            setHistory(history || []);
            setStreak(streak || 0);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Không thể tải dữ liệu điểm xu.");
        }
    };

    useEffect(() => {
        fetchUserPointInfo();
    }, []);

    const renderCalendar = () => {
        const days = Array.from({ length: 14 }, (_, i) => i + 1);
        return (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-3 mt-4">
                {days.map((day) => {
                    let className = "day-box p-3 text-center rounded-lg border-2 transition transform shadow-sm hover:-translate-y-1";

                    if (day <= streak) {
                        className += " bg-gradient-to-r from-green-500 to-green-400 text-white border-green-500";
                    } else if (day === streak + 1) {
                        className += " bg-gradient-to-r from-blue-500 to-blue-400 text-white border-blue-500 animate-pulse";
                    } else {
                        className += " bg-white border-gray-200";
                    }

                    return (
                        <div key={day} className={className}>
                            Ngày {day}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="max-w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-red-400 to-yellow-300 text-white text-center p-6 sm:p-8 rounded-2xl overflow-hidden shadow-lg">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                    🎯 Hệ Thống Nhận Xu Hàng Ngày
                </h1>

                {/* Hiệu ứng +xu */}
                {showAddPoint && (
                    <motion.div
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: 1, y: -60 }}
                        exit={{ opacity: 0 }}
                        className="absolute left-1/2 transform -translate-x-1/2 top-12 text-yellow-300 text-3xl font-bold z-50"
                    >
                        +{rewardAmount} 🪙
                    </motion.div>
                )}

                <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 text-2xl sm:text-3xl font-bold mb-2">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="w-10 h-10 rounded-full bg-yellow-300 text-gray-800 flex items-center justify-center"
                    >
                        🪙
                    </motion.div>
                    <span>{currentPoints}</span>
                    <span className="text-sm sm:text-lg">xu</span>
                </div>
                <p className="text-sm">Điểm danh càng lâu, xu thưởng càng lớn!</p>
            </div>

            {/* Daily Check-in Section */}
            <div className="bg-gray-50 mt-10 rounded-xl border p-4 sm:p-6 shadow-sm">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 flex items-center gap-2 mb-4">
                    📅 Điểm Danh Hàng Ngày
                </h3>

                {/* Calendar */}
                {renderCalendar()}

                {/* Button claim */}
                <div className="text-center mt-6">
                    <button
                        onClick={handleClaimPoints}
                        disabled={loading}
                        className={`w-full sm:w-auto px-6 py-3 text-sm sm:text-lg rounded-full font-semibold shadow-md transition-all ${loading
                                ? "bg-gray-400 cursor-not-allowed text-white"
                                : "bg-gradient-to-r from-red-400 to-yellow-400 hover:shadow-lg hover:-translate-y-1 text-white"
                            }`}
                    >
                        {loading
                            ? "Đang nhận..."
                            : `Điểm danh hôm nay (+${calculateReward(streak)} xu)`}
                    </button>
                </div>

                {/* Streak */}
                <p className="text-center mt-4 font-bold text-red-500">
                    🔥 Chuỗi điểm danh: {streak} ngày
                </p>
            </div>
        </div>
    );
};

export default DailyPointClaim;
