import React, { useState } from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import { FaTimes } from "react-icons/fa";

interface Props {
  onClose: () => void;
}

const SizeSuggestionModal: React.FC<Props> = ({ onClose }) => {
  const [height, setHeight] = useState<number>(170);
  const [weight, setWeight] = useState<number>(65);
  const [fitPreference, setFitPreference] = useState<"slim" | "regular" | "loose">("regular");
  const [suggestedSize, setSuggestedSize] = useState("");

  const sizeRecommendation = (h: number, w: number, fit: string) => {
    let baseSize = "M";
    if (h <= 160 && w <= 55) baseSize = "S";
    else if (h <= 170 && w <= 65) baseSize = "M";
    else if (h <= 180 && w <= 75) baseSize = "L";
    else baseSize = "XL";

    if (fit === "slim") return baseSize;
    if (fit === "regular") return baseSize + (baseSize !== "XL" ? "+" : "");
    return baseSize + (baseSize !== "S" ? "++" : "");
  };

  const handleSuggestion = () => {
    setSuggestedSize(sizeRecommendation(height, weight, fitPreference));
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      {/* Modal với animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }} // Bắt đầu từ nhỏ và mờ
        animate={{ opacity: 1, scale: 1 }} // Hiện ra với hiệu ứng zoom nhẹ
        exit={{ opacity: 0, scale: 0.8 }} // Khi đóng, modal thu nhỏ lại
        transition={{ duration: 0.3, ease: "easeOut" }} // Hiệu ứng mượt
        className="bg-white p-6 rounded-2xl shadow-xl w-96 text-center relative"
      >
        {/* Nút đóng */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 transition"
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-800">Chọn Kích Thước</h2>

        {/* Height Slider */}
        <div className="mb-5">
          <label className="font-medium text-gray-700">Chiều cao: {height} cm</label>
          <input
            type="range"
            min="140"
            max="200"
            value={height}
            onChange={(e) => setHeight(parseInt(e.target.value))}
            className="w-full mt-2 accent-blue-500"
          />
        </div>

        {/* Weight Slider */}
        <div className="mb-5">
          <label className="font-medium text-gray-700">Cân nặng: {weight} kg</label>
          <input
            type="range"
            min="40"
            max="120"
            value={weight}
            onChange={(e) => setWeight(parseInt(e.target.value))}
            className="w-full mt-2 accent-blue-500"
          />
        </div>

        {/* Fit Preference */}
        <div className="mb-5">
          <p className="font-medium text-gray-700 mb-3">Bạn muốn mặc thế nào?</p>
          <div className="flex justify-between gap-3">
            {["slim", "regular", "loose"].map((fit) => (
              <div
                key={fit}
                className={`cursor-pointer p-2 border-2 rounded-lg w-1/3 text-gray-800 text-sm font-semibold transition ${
                  fitPreference === fit
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300 hover:border-blue-400"
                }`}
                onClick={() => setFitPreference(fit as "slim" | "regular" | "loose")}
              >
                <img
                  src={`https://theme.hstatic.net/1000360022/1001322458/14/suggest-body${
                    fit === "slim" ? "1" : fit === "regular" ? "2" : "3"
                  }.png?v=1098`}
                  alt={`${fit} Fit`}
                  className="w-full h-20 object-cover rounded"
                />
                <p className="mt-2">{fit === "slim" ? "Ôm" : fit === "regular" ? "Vừa" : "Rộng"}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Suggest Button */}
        <button
          onClick={handleSuggestion}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl w-full mt-4 hover:bg-blue-700 transition transform hover:scale-105"
        >
          Gợi ý size
        </button>

        {/* Suggested Size */}
        {suggestedSize && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-5 p-4 bg-gray-100 rounded-lg shadow-inner"
          >
            <p className="font-semibold text-lg text-gray-700">Kích thước phù hợp:</p>
            <p className="text-blue-600 font-bold text-2xl">{suggestedSize}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default SizeSuggestionModal;
