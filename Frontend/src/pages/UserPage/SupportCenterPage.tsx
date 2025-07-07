import { useState, useEffect } from 'react';
import { Search, MessageCircle, FileText, Settings, Phone, Mail, Clock, ChevronRight, Star, Users, BookOpen, Zap } from 'lucide-react';
import Footer from 'src/Layouts/Footer';
import Navbar from 'src/Layouts/Navbar';

const SupportCenterPage = () => {
  useEffect(() => {
    document.title = 'C WEB - Hỗ Trợ Khách Hàng';
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const categories = [
    {
      id: 1,
      title: 'Bắt Đầu Sử Dụng',
      description: 'Hướng dẫn cơ bản cho người dùng mới',
      icon: <Zap className="w-8 h-8" />,
      color: 'from-blue-500 to-purple-600',
      articles: 12
    },
    {
      id: 2,
      title: 'Quản Lý Tài Khoản',
      description: 'Thiết lập và quản lý thông tin cá nhân',
      icon: <Settings className="w-8 h-8" />,
      color: 'from-green-500 to-teal-600',
      articles: 8
    },
    {
      id: 3,
      title: 'Thanh Toán & Billing',
      description: 'Thông tin về thanh toán và hóa đơn',
      icon: <FileText className="w-8 h-8" />,
      color: 'from-orange-500 to-red-600',
      articles: 15
    },
    {
      id: 4,
      title: 'Bảo Mật',
      description: 'Bảo vệ tài khoản và dữ liệu của bạn',
      icon: <Users className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-600',
      articles: 6
    }
  ];

  const faqs = [
    {
      question: 'Làm thế nào để đặt lại mật khẩu?',
      answer: 'Bạn có thể đặt lại mật khẩu bằng cách click vào "Quên mật khẩu" ở trang đăng nhập.'
    },
    {
      question: 'Tôi có thể thay đổi email không?',
      answer: 'Có, bạn có thể thay đổi email trong phần Cài đặt tài khoản.'
    },
    {
      question: 'Làm sao để liên hệ hỗ trợ?',
      answer: 'Bạn có thể liên hệ qua chat trực tuyến, email hoặc số điện thoại bên dưới.'
    }
  ];

  return (
    <>
    <Navbar />
    <div className="pt-20 min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Trung Tâm <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Hỗ Trợ</span>
          </h1>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Tìm câu trả lời nhanh chóng cho mọi thắc mắc của bạn. Chúng tôi luôn sẵn sàng hỗ trợ 24/7.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <input
              type="text"
              placeholder="Tìm kiếm câu hỏi, hướng dẫn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 pr-14 text-lg rounded-full border-0 shadow-2xl focus:ring-4 focus:ring-blue-500/50 focus:outline-none bg-white/95 backdrop-blur-sm"
            />
            <button className="absolute right-2 top-2 p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white hover:scale-105 transition-transform">
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Stats */}
          <div className="flex justify-center space-x-8 text-white/80">
            <div className="text-center">
              <div className="text-2xl font-bold">1000+</div>
              <div className="text-sm">Bài viết hướng dẫn</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm">Hỗ trợ trực tuyến</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">99%</div>
              <div className="text-sm">Khách hàng hài lòng</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="bg-white rounded-t-3xl mt-8 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          
          {/* Categories Section */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Danh Mục Hỗ Trợ</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="group cursor-pointer bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-transparent hover:-translate-y-2"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{category.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{category.articles} bài viết</span>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Câu Hỏi Thường Gặp</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-teal-600 mx-auto rounded-full"></div>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4">
                      {index + 1}
                    </div>
                    {faq.question}
                  </h3>
                  <p className="text-gray-700 leading-relaxed ml-12">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-12 text-white">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Cần Hỗ Trợ Thêm?</h2>
              <p className="text-xl opacity-90">Đội ngũ hỗ trợ chuyên nghiệp của chúng tôi luôn sẵn sàng giúp đỡ bạn</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-4">Chat Trực Tuyến</h3>
                <p className="opacity-90 mb-6">Hỗ trợ tức thì qua chat</p>
                <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                  Bắt Đầu Chat
                </button>
              </div>
              
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-4">Gửi Email</h3>
                <p className="opacity-90 mb-6">support@example.com</p>
                <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                  Gửi Email
                </button>
              </div>
              
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-4">Gọi Điện</h3>
                <p className="opacity-90 mb-6">1900-xxxx</p>
                <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                  Gọi Ngay
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}

export default SupportCenterPage;