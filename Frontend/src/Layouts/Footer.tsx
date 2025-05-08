import React from 'react';  
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Phần đầu của Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 border-b border-gray-700 pb-8">
          {/* Thông tin liên hệ */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4">Thông tin liên hệ</h4>
            <p>123 Đường Thời Trang</p>
            <p>Thành phố, Tỉnh, Mã ZIP</p>
            <p>Email: hotro@thuonghieu.com</p>
            <p>Điện thoại: +84 123 456 789</p>
          </div>

          {/* Liên kết nhanh */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-yellow-400">Trang chủ</Link></li>
              <li><Link to="/about" className="hover:text-yellow-400">Giới thiệu</Link></li>
              <li><Link to="/products" className="hover:text-yellow-400">Sản phẩm</Link></li>
              <li><Link to="/contact" className="hover:text-yellow-400">Liên hệ</Link></li>
              <li><Link to="/blog" className="hover:text-yellow-400">Tin tức</Link></li>
            </ul>
          </div>

          {/* Hỗ trợ khách hàng */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4">Hỗ trợ khách hàng</h4>
            <ul className="space-y-2">
              <li><Link to="/help" className="hover:text-yellow-400">Trung tâm hỗ trợ</Link></li>
              <li><Link to="/shipping" className="hover:text-yellow-400">Chính sách vận chuyển</Link></li>
              <li><Link to="/returns" className="hover:text-yellow-400">Chính sách đổi trả</Link></li>
              <li><Link to="/faq" className="hover:text-yellow-400">Câu hỏi thường gặp</Link></li>
            </ul>
          </div>

          {/* Đăng ký nhận tin */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4">Đăng ký nhận tin</h4>
            <p className="mb-4">Nhận thông tin mới nhất và ưu đãi từ chúng tôi.</p>
            <form className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="Nhập email của bạn" 
                className="px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button 
                type="submit" 
                className="py-2 px-4 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-500"
              >
                Đăng ký
              </button>
            </form>
          </div>

          {/* Mạng xã hội */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4">Theo dõi chúng tôi</h4>
            <p className="mb-4">Kết nối qua mạng xã hội:</p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="fab fa-facebook text-2xl hover:text-yellow-400"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fab fa-instagram text-2xl hover:text-yellow-400"></i>
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <i className="fab fa-x-twitter text-2xl hover:text-yellow-400"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <i className="fab fa-youtube text-2xl hover:text-yellow-400"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Phần cuối của Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-8">
          {/* Bản quyền */}
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} Thương Hiệu. Mọi quyền được bảo lưu.
          </div>

          {/* Điều khoản và chính sách */}
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/terms" className="hover:text-yellow-400">Điều khoản sử dụng</Link>
            <Link to="/privacy" className="hover:text-yellow-400">Chính sách bảo mật</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
