import React from "react";
import { FaTag, FaShoppingCart } from "react-icons/fa";

const promotions = [
  { code: "VALENTINE", description: "Mua 2 sản phẩm thuộc nhóm, nhập mã VALENTINE giảm ngay 14%" },
  { code: "CAPTAIN", description: "Nhập mã CAPTAIN GIẢM 10% tối đa 10K" },
  { code: "REDHULK", description: "Nhập mã REDHULK GIẢM 50K cho đơn 699K" },
  { code: "WILSON", description: "Nhập mã WILSON GIẢM 80K cho đơn từ 999K" }
];

const PromotionCard = () => {
  return (
    <div className="w-full bg-gradient-to-r from-red-500 to-yellow-400 p-6 rounded-xl shadow-lg text-white max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <FaTag size={24} />
        <h2 className="text-xl font-bold">KHUYẾN MÃI - ƯU ĐÃI</h2>
      </div>
      <ul className="space-y-2">
        {promotions.map((promo, index) => (
          <li key={index} className="bg-white bg-opacity-20 p-3 rounded-lg flex justify-between items-center">
            <span className="text-sm">{promo.description}</span>
            <span className="bg-black text-white px-2 py-1 rounded text-xs font-bold">{promo.code}</span>
          </li>
        ))}
      </ul>
      <button className="mt-4 w-full bg-white text-red-600 py-2 rounded-lg flex items-center justify-center gap-2 font-semibold hover:bg-gray-200 transition">
        <FaShoppingCart /> Mua ngay
      </button>
    </div>
  );
};

export default PromotionCard;
