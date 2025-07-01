import React from 'react';

type PaymentItem = {
  icon: string;
  label: string;
  value: string;
};

const PaymentCard: React.FC = () => {
  const paymentDetails: PaymentItem[] = [
    { icon: "🏠", label: "Tiền thuê phòng", value: "2.500.000 đ" },
    { icon: "⚡", label: "Tiền điện (120 số × 3.500đ)", value: "420.000 đ" },
    { icon: "💧", label: "Tiền nước (15 khối × 25.000đ)", value: "375.000 đ" },
    { icon: "📶", label: "Internet + Cable", value: "150.000 đ" },
    { icon: "🧹", label: "Vệ sinh chung", value: "50.000 đ" },
    { icon: "🚗", label: "Gửi xe máy", value: "80.000 đ" },
  ];

  const totalAmount = "3.575.000 đ";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-500 flex items-center justify-center p-5">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full relative animate-[slideUp_0.6s_ease-out]">
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-[shimmer_3s_ease-in-out_infinite]" />
          </div>
          <div className="absolute top-4 right-4 bg-white bg-opacity-20 backdrop-blur-sm px-3 py-2 rounded-full text-xs font-bold">
            Tháng 12/2024
          </div>
          <div className="relative z-10">
            <div className="text-4xl mb-2">💳</div>
            <h1 className="text-xl font-bold mb-1">THÔNG BÁO ĐÓNG TIỀN</h1>
            <p className="text-sm opacity-90">Tiền thuê nhà trọ hàng tháng</p>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-gradient-to-r from-pink-400 to-red-400 text-white p-5 rounded-2xl mb-6 text-center">
            <div className="text-2xl font-bold mb-1">PHÒNG 101</div>
            <div className="text-sm opacity-90">Anh/Chị: Nguyễn Văn A</div>
          </div>

          <div className="bg-gradient-to-r from-pink-300 to-purple-300 p-4 rounded-xl text-center mb-5">
            <div className="text-xs text-amber-800 font-medium mb-1">HẠN ĐÓNG TIỀN</div>
            <div className="text-lg font-bold text-red-700">05/01/2025</div>
          </div>

          <div className="mb-6">
            {paymentDetails.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-4 border-b border-gray-100 hover:bg-indigo-50 hover:mx-[-12px] hover:px-3 hover:rounded-lg transition-all duration-300 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg text-indigo-500">{item.icon}</span>
                  <span className="font-medium text-gray-700">{item.label}</span>
                </div>
                <div className="font-semibold text-gray-800">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-yellow-200 to-orange-300 p-5 rounded-2xl mb-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-amber-800">TỔNG CỘNG:</span>
              <span className="text-2xl font-bold text-orange-700">{totalAmount}</span>
            </div>
          </div>

          <div className="bg-gray-50 p-5 rounded-2xl border-l-4 border-green-500 mb-5">
            <div className="font-bold text-green-600 mb-3 flex items-center gap-2">
              🏦 Thông tin chuyển khoản
            </div>
            <div className="text-sm text-gray-600 leading-relaxed">
              <div className="mb-1"><strong>Ngân hàng:</strong> Vietcombank</div>
              <div className="mb-1"><strong>Số TK:</strong> 1234567890</div>
              <div className="mb-1"><strong>Chủ TK:</strong> NGUYEN VAN LANDLORD</div>
              <div><strong>Nội dung CK:</strong> P101 T12/2024 [Tên người thuê]</div>
            </div>
          </div>

          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">Có thắc mắc? Liên hệ ngay với chúng tôi</p>
            <div className="flex gap-3">
              <a
                href="tel:0123456789"
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-indigo-600 hover:to-purple-700 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                📞 Gọi ngay
              </a>
              <a
                href="https://zalo.me/0123456789"
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                💬 Zalo
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0%, 100% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentCard;
