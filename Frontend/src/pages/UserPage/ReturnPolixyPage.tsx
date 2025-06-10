import { FaCheckCircle } from "react-icons/fa";
import Footer from "../../Layouts/Footer";
import Navbar from "../../Layouts/Navbar";

const ReturnPolicyPage = () => {
  return (
    <>
    <Navbar />
    <div className="pt-20 max-w-4xl mx-auto p-6">
      {/* Title Section */}
      <header className="text-center mb-10">
        <h1 className="pt-10 text-4xl font-bold text-blue-800">CHÍNH SÁCH ĐỔI TRẢ & BẢO HÀNH</h1>
        <p className="text-lg text-gray-600 mt-2">
          Cảm ơn bạn đã mua sắm tại <span className="font-semibold">icon denim.</span> Chúng tôi cam kết bảo vệ quyền lợi của bạn.
        </p>
      </header>

      {/* "Chính Sách Áp Dụng" Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">CHÍNH SÁCH ÁP DỤNG</h2>
        <ul className="list-decimal list-inside space-y-3 text-gray-700">
          <li className="flex items-center">
            <FaCheckCircle className="text-yellow-500 mr-2" />
            Đổi trả trong vòng 30 ngày kể từ ngày nhận hàng.
          </li>
          <li className="flex items-center">
            <FaCheckCircle className="text-yellow-500 mr-2" />
            Sản phẩm phải còn nguyên vẹn, chưa qua sử dụng, không bị hư hỏng.
          </li>
          <li className="flex items-center">
            <FaCheckCircle className="text-yellow-500 mr-2" />
            Khách hàng chịu chi phí vận chuyển khi trả sản phẩm do lỗi khách hàng.
          </li>
        </ul>
        <div className="border-l-4 border-blue-600 pl-4 mt-4 text-gray-600 italic">
          Lưu ý: Các sản phẩm khuyến mãi hoặc sale có thể không áp dụng chính sách đổi trả.
        </div>
      </section>

      {/* "Chính Sách Bảo Hành" Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">CHÍNH SÁCH BẢO HÀNH</h2>
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-blue-100">
              <th className="px-4 py-2 text-left">Lỗi Sản Phẩm</th>
              <th className="px-4 py-2 text-left">Thời Gian Giải Quyết</th>
              <th className="px-4 py-2 text-left">Điều Kiện Bảo Hành</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">Lỗi từ nhà sản xuất</td>
              <td className="border px-4 py-2">7-10 ngày làm việc</td>
              <td className="border px-4 py-2">Đổi mới sản phẩm hoặc hoàn tiền</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Lỗi trong quá trình sử dụng</td>
              <td className="border px-4 py-2">15-20 ngày làm việc</td>
              <td className="border px-4 py-2">Sửa chữa hoặc thay thế linh kiện</td>
            </tr>
          </tbody>
        </table>
        <div className="border-l-4 border-blue-600 pl-4 mt-4 text-gray-600 italic">
          Lưu ý: Bảo hành không áp dụng cho lỗi do tác động bên ngoài như rách, vết bẩn, v.v.
        </div>
      </section>

      {/* "Chính Sách Đổi Do Lỗi Kỹ Thuật & Hoàn Tiền" Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">
          CHÍNH SÁCH ĐỔI DO LỖI KỸ THUẬT & HOÀN TIỀN
        </h2>
        <ul className="list-disc list-inside space-y-3 text-gray-700">
          <li>Đổi hàng trong vòng 14 ngày nếu sản phẩm bị lỗi kỹ thuật.</li>
          <li>Hoàn tiền trong vòng 7 ngày sau khi kiểm tra và xác nhận lỗi kỹ thuật.</li>
          <li>Chi phí vận chuyển được hoàn trả nếu lỗi do sản phẩm.</li>
        </ul>
      </section>

      {/* "Chi Phí Đổi Hàng" Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">CHI PHÍ ĐỔI HÀNG</h2>
        <ul className="list-disc list-inside space-y-3 text-gray-700">
          <li>Khách hàng chịu chi phí vận chuyển nếu lỗi do người mua.</li>
          <li>Chúng tôi chịu chi phí vận chuyển nếu lỗi do sản phẩm.</li>
        </ul>
      </section>

      {/* "2 Bước Đổi Hàng Nhanh Chóng" Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">2 BƯỚC ĐỔI HÀNG NHANH CHÓNG</h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700">
          <li>Liên hệ với bộ phận hỗ trợ khách hàng qua email hoặc hotline.</li>
          <li>Gửi lại sản phẩm kèm theo phiếu đổi hàng và nhận sản phẩm mới hoặc hoàn tiền.</li>
        </ol>
      </section>
    </div>
    <Footer />
    </>
  );
};

export default ReturnPolicyPage;
