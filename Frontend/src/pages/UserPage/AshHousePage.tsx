import { useState, useEffect } from 'react';
import Navbar from 'src/Layouts/Navbar';
import Footer from 'src/Layouts/Footer';

const AshHousePage: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString("vi-VN"));

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toLocaleString("vi-VN");
      setCurrentTime(now);
      document.title = `Quản Lý Phòng Trọ - ${now}`;
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const reportMaintenance = () => {
    alert("Tính năng báo hỏng sẽ được mở trong phiên bản tiếp theo.\n\nHiện tại vui lòng liên hệ trực tiếp qua số điện thoại hoặc Zalo.");
  };

  const emergencyCall = () => {
    if (window.confirm("Bạn có muốn gọi ngay cho ban quản lý?")) {
      window.open("tel:0987654321");
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-20 pt-6 bg-gradient-to-br from-indigo-500 to-purple-600 min-h-screen p-5">
        <div className="max-w-6xl mx-auto">

          <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl p-8 mb-8 shadow-2xl text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">🏠 Bảng Điều Khiển Người Thuê</h1>
            <div className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 px-6 rounded-full font-semibold">
              Nguyễn Văn A - Phòng 101 - Tòa nhà B
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Thông Tin Thanh Toán */}
            <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl p-6 shadow-lg">
              <h2 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-4">
                <span className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white">💰</span>
                Thông Tin Thanh Toán
              </h2>

              <div className="space-y-2">
                <div className="flex justify-between items-center bg-red-100 text-red-800 px-4 py-3 rounded-lg">
                  <span>Tiền phòng tháng 7/2025</span>
                  <span className="font-bold">Chưa thanh toán</span>
                </div>
                <div className="flex justify-between items-center bg-green-100 text-green-800 px-4 py-3 rounded-lg">
                  <span>Tiền phòng tháng 6/2025</span>
                  <span className="font-bold">Đã thanh toán</span>
                </div>
                <div className="flex justify-between items-center bg-yellow-100 text-yellow-800 px-4 py-3 rounded-lg">
                  <span>Tiền điện tháng 6</span>
                  <span>Đến hạn 10/7</span>
                </div>
              </div>

              <div className="mt-5">
                <h4 className="font-semibold mb-3">Chi tiết hóa đơn tháng 7:</h4>
                <div className="space-y-2">
                  <div className="flex justify-between border-b pb-2">
                    <span>Tiền phòng</span><span className="font-semibold">2.500.000 VNĐ</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span>Tiền điện (150 kWh)</span><span className="font-semibold">450.000 VNĐ</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span>Tiền nước (8m³)</span><span className="font-semibold">120.000 VNĐ</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span>Rác + vệ sinh</span><span className="font-semibold">50.000 VNĐ</span>
                  </div>
                  <div className="flex justify-between pt-3 text-lg font-bold border-t">
                    <span>Tổng cộng</span><span className="text-red-600">3.120.000 VNĐ</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chỉ Số Điện Nước */}
            <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl p-6 shadow-lg">
              <h2 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-4">
                <span className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white">⚡</span>
                Chỉ Số Điện Nước
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <h4 className="text-indigo-500 font-semibold mb-1">Điện</h4>
                  <div className="text-3xl font-bold text-gray-800">1,247</div>
                  <div className="text-gray-500 text-sm">kWh - 01/07/2025</div>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <h4 className="text-indigo-500 font-semibold mb-1">Nước</h4>
                  <div className="text-3xl font-bold text-gray-800">89</div>
                  <div className="text-gray-500 text-sm">m³ - 01/07/2025</div>
                </div>
              </div>

              <div className="mt-4 bg-yellow-100 border border-yellow-300 rounded-lg p-3 flex items-center gap-3">
                <span>⚠️</span>
                <span>Chỉ số sẽ được kiểm tra vào ngày 30 hàng tháng</span>
              </div>
            </div>

          </div>

          {/* Thông Báo & Tin Tức */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl p-6 shadow-lg">
              <h2 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-4">
                <span className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white">📢</span>
                Thông Báo & Tin Tức
              </h2>

              <div className="space-y-3">
                <div className="bg-red-100 border border-red-300 rounded-lg p-3 flex gap-3">
                  <span>🚨</span>
                  <div>
                    <strong>Cắt nước:</strong> Ngày 15/7 từ 8h-17h để sửa chữa đường ống chính
                  </div>
                </div>
                <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 flex gap-3">
                  <span>🔧</span>
                  <div>
                    <strong>Bảo trì:</strong> Thang máy sẽ được bảo trì vào chủ nhật tuần tới
                  </div>
                </div>
                <div className="bg-green-100 border border-green-300 rounded-lg p-3 flex gap-3">
                  <span>✅</span>
                  <div>
                    <strong>Hoàn thành:</strong> Đã thay mới bóng đèn hành lang tầng 3
                  </div>
                </div>
              </div>
            </div>

            {/* Yêu Cầu Bảo Trì */}
            <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl p-6 shadow-lg">
              <h2 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-4">
                <span className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white">🔧</span>
                Yêu Cầu Bảo Trì
              </h2>

              <div className="space-y-3">
                <div className="border-l-4 border-red-500 bg-gray-100 p-3 rounded-lg">
                  <strong>Khẩn cấp:</strong> Máy lạnh không hoạt động<br />
                  <small>Đã gửi: 05/07/2025 - Trạng thái: Đang xử lý</small>
                </div>
                <div className="border-l-4 border-indigo-500 bg-gray-100 p-3 rounded-lg">
                  <strong>Bình thường:</strong> Vòi nước nhỏ giọt<br />
                  <small>Đã gửi: 03/07/2025 - Trạng thái: Chờ xử lý</small>
                </div>
                <div className="border-l-4 border-green-500 bg-gray-100 p-3 rounded-lg opacity-70">
                  <strong>Hoàn thành:</strong> Thay ổ khóa cửa<br />
                  <small>Hoàn thành: 01/07/2025</small>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <button onClick={reportMaintenance} className="bg-gray-100 border border-gray-300 rounded-lg p-3 hover:bg-indigo-100">
                  🔧 Báo hỏng<br /><small>Gửi yêu cầu sửa chữa</small>
                </button>
                <button onClick={emergencyCall} className="bg-red-500 text-white rounded-lg p-3 hover:bg-red-600">
                  🚨 Khẩn cấp<br /><small>Sự cố nghiêm trọng</small>
                </button>
              </div>
            </div>
          </div>

          {/* Hợp Đồng & Quy Định */}
          <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl p-6 shadow-lg mt-6">
            <h2 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-4">
              <span className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white">📋</span>
              Hợp Đồng & Quy Định
            </h2>

            <div className="bg-green-500 text-white p-4 rounded-lg mb-4">
              <h3 className="font-bold mb-1">Thông tin hợp đồng</h3>
              <p><strong>Ngày ký:</strong> 15/01/2025</p>
              <p><strong>Hết hạn:</strong> 15/01/2026</p>
              <p><strong>Gia hạn tự động:</strong> Có</p>
              <p><strong>Thời hạn báo trước:</strong> 30 ngày</p>
            </div>

            <h4 className="font-semibold mb-2">Quy định chung:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Thanh toán tiền phòng trước ngày 5 hàng tháng</li>
              <li>Giữ gìn vệ sinh khu vực chung</li>
              <li>Không gây ồn ào sau 22h</li>
              <li>Khách đến chơi phải đăng ký với ban quản lý</li>
              <li>Không sử dụng đồ điện công suất lớn</li>
            </ul>
          </div>

          {/* Liên Hệ Nhanh */}
          <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl p-6 shadow-lg mt-6">
            <h2 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-4">
              <span className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white">📞</span>
              Liên Hệ Nhanh
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <a href="tel:0901234567" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-lg text-center font-semibold">📞 Chủ nhà</a>
              <a href="tel:0987654321" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-lg text-center font-semibold">🏢 Ban quản lý</a>
              <a href="tel:113" className="bg-gradient-to-r from-red-500 to-red-700 text-white p-3 rounded-lg text-center font-semibold">🚨 Khẩn cấp</a>
              <a href="https://zalo.me/0901234567" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-lg text-center font-semibold">💬 Zalo</a>
            </div>

            <div className="text-sm">
              <p><strong>Chủ nhà:</strong> Anh Minh - 090 123 4567</p>
              <p><strong>Ban quản lý:</strong> Chị Lan - 098 765 4321</p>
              <p><strong>Bảo vệ:</strong> Anh Tùng - 091 111 2222</p>
              <p><strong>Thời gian làm việc:</strong> 7h - 21h</p>
            </div>
          </div>

          <div className="text-sm text-white text-center mt-6">{currentTime}</div>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default AshHousePage;
