import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Discount {
  discountCode: string;
  description: string;
}

interface DiscountAndNoteProps {
  coupon: string;
  setCoupon: (value: string) => void;
  invoice: boolean;
  setInvoice: (value: boolean) => void;
  note: string;
  setNote: (value: string) => void;
}

const DiscountAndNote: React.FC<DiscountAndNoteProps> = ({
  coupon,
  setCoupon,
  invoice,
  setInvoice,
  note,
  setNote,
}) => {
  const [showDiscountPanel, setShowDiscountPanel] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showDiscountPanel) {
      setLoading(true);
      axios
        .get("/api/discounts/public",
          {headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }},
        )
        .then((res) => setAvailableCoupons(res.data))
        .catch((error) => toast.error(error.response?.data?.message ||"Lỗi khi lấy mã giảm giá:"))
        .finally(() => setLoading(false));
    }
  }, [showDiscountPanel]);

  const handleApplyCoupon = (discountCode: string) => {
    setCoupon(discountCode);
    setShowDiscountPanel(false);
  };

  return (
    <div className="relative">
      {/* Mã giảm giá */}
      <div className="mt-4 mb-2">
        <h3 className="text-lg font-semibold mb-1">Mã giảm giá</h3>
        <div className="flex shadow-sm">
          <input
            type="text"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Nhập mã giảm giá"
            className="flex-1 p-2 border border-r-0 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <button
            onClick={() => setShowDiscountPanel(true)}
            className="px-4 py-2 bg-blue-500 text-white border border-blue-500 rounded-r hover:bg-blue-600 transition duration-300"
          >
            Danh sách mã
          </button>
        </div>
      </div>

      {/* Xuất hóa đơn */}
      <div className="flex items-center mt-4">
        <input
          type="checkbox"
          checked={invoice}
          onChange={() => setInvoice(!invoice)}
          className="mr-2"
        />
        <label>Xuất hóa đơn</label>
      </div>

      {/* Ghi chú */}
      <h3 className="text-lg font-semibold mt-4">Ghi chú đơn hàng</h3>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full p-2 border rounded mt-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        placeholder="Nhập ghi chú..."
      />

      {/* Slide panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg border-l border-gray-200 z-50 transform transition-transform duration-500 ease-in-out ${showDiscountPanel ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h4 className="font-semibold text-lg">Danh sách mã giảm giá</h4>
          <button
            onClick={() => setShowDiscountPanel(false)}
            className="text-gray-500 hover:text-red-500 text-xl transition"
          >
            ✕
          </button>
        </div>
        <div className="p-4 space-y-3">
          {loading ? (
            <p className="text-center text-gray-500">Đang tải mã giảm giá...</p>
          ) : availableCoupons.length > 0 ? (
            availableCoupons.map((coupon) => (
              <div
                key={coupon.discountCode}
                className="relative flex border border-dashed border-blue-500 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md cursor-pointer transition-all"
                onClick={() => handleApplyCoupon(coupon.discountCode)}
              >
                <div className="w-2 bg-white relative z-10">
                  <div className="absolute top-0 left-0 h-full w-full bg-white">
                    <svg
                      viewBox="0 0 4 100"
                      preserveAspectRatio="none"
                      className="h-full w-full text-blue-500"
                    >
                      <path
                        d="M2,0 Q0,10 2,20 Q4,30 2,40 Q0,50 2,60 Q4,70 2,80 Q0,90 2,100"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                      />
                    </svg>
                  </div>
                </div>

                <div className="flex-1 p-4">
                  <p className="text-xl font-bold text-blue-600">{coupon.discountCode}</p>
                  <p className="text-sm text-gray-600 mt-1">{coupon.description}</p>
                </div>

                <div className="bg-blue-500 text-white px-4 flex items-center justify-center">
                  <span className="text-sm font-medium">Áp dụng</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Không có mã giảm giá nào</p>
          )}
        </div>
      </div>

      {/* Backdrop */}
      {showDiscountPanel && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300"
          onClick={() => setShowDiscountPanel(false)}
        />
      )}
    </div>
  );
};

export default DiscountAndNote;
