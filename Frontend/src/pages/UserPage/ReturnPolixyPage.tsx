import { useState } from 'react';
import { RefreshCw, Shield, AlertCircle, CheckCircle, Clock, DollarSign, ArrowRight, Phone, Mail, Package, Truck, Star, Heart } from 'lucide-react';
import Footer from 'src/Layouts/Footer';
import Navbar from 'src/Layouts/Navbar';

 const ReturnPolixyPage = () => {
  const [activeTab, setActiveTab] = useState('return');

  const warrantyData = [
    {
      type: 'Lỗi từ nhà sản xuất',
      time: '7-10 ngày làm việc',
      condition: 'Đổi mới sản phẩm hoặc hoàn tiền',
      color: 'green'
    },
    {
      type: 'Lỗi trong quá trình sử dụng',
      time: '15-20 ngày làm việc',
      condition: 'Sửa chữa hoặc thay thế linh kiện',
      color: 'blue'
    }
  ];

  const exchangeSteps = [
    {
      step: 1,
      title: 'Liên hệ hỗ trợ',
      description: 'Liên hệ với bộ phận hỗ trợ khách hàng qua email hoặc hotline',
      icon: Phone
    },
    {
      step: 2,
      title: 'Gửi sản phẩm',
      description: 'Gửi lại sản phẩm kèm theo phiếu đổi hàng và nhận sản phẩm mới hoặc hoàn tiền',
      icon: Package
    }
  ];

  const policies = [
    {
      icon: Clock,
      title: 'Thời gian đổi trả',
      description: 'Đổi trả trong vòng 30 ngày kể từ ngày nhận hàng',
      highlight: true
    },
    {
      icon: Shield,
      title: 'Điều kiện sản phẩm',
      description: 'Sản phẩm phải còn nguyên vẹn, chưa qua sử dụng, không bị hư hỏng',
      highlight: false
    },
    {
      icon: Truck,
      title: 'Chi phí vận chuyển',
      description: 'Khách hàng chịu chi phí vận chuyển khi trả sản phẩm do lỗi khách hàng',
      highlight: false
    }
  ];

  return (
    <>
    <Navbar />
    <div className="pt-20 min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-blue-600/10"></div>
        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              CHÍNH SÁCH <span className="text-indigo-600">ĐỔI TRẢ & BẢO HÀNH</span>
            </h2>
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-red-500 mr-3" />
                <p className="text-xl text-gray-700">
                  Cảm ơn bạn đã mua sắm tại <span className="font-bold text-indigo-600">C WEB.</span>
                </p>
              </div>
              <p className="text-lg text-gray-600">
                Chúng tôi cam kết bảo vệ quyền lợi của bạn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('return')}
                  className={`px-8 py-4 rounded-xl font-semibold transition-all ${
                    activeTab === 'return'
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <RefreshCw className="w-5 h-5 inline mr-2" />
                  Chính sách Đổi trả
                </button>
                <button
                  onClick={() => setActiveTab('warranty')}
                  className={`px-8 py-4 rounded-xl font-semibold transition-all ${
                    activeTab === 'warranty'
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Shield className="w-5 h-5 inline mr-2" />
                  Bảo hành
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Return Policy Content */}
      {activeTab === 'return' && (
        <section className="py-8">
          <div className="max-w-6xl mx-auto px-4">
            {/* Policy Cards */}
            <div className="mb-16">
              <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">CHÍNH SÁCH ÁP DỤNG</h3>
              <div className="grid md:grid-cols-3 gap-8">
                {policies.map((policy, index) => (
                  <div key={index} className={`bg-white rounded-3xl p-8 shadow-xl transition-transform hover:scale-105 ${
                    policy.highlight ? 'border-4 border-indigo-500 ring-4 ring-indigo-100' : 'border border-gray-200'
                  }`}>
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                      policy.highlight ? 'bg-indigo-600' : 'bg-gray-100'
                    }`}>
                      <policy.icon className={`w-8 h-8 ${policy.highlight ? 'text-white' : 'text-gray-600'}`} />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">{policy.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{policy.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 bg-yellow-50 border-2 border-yellow-200 rounded-3xl p-8">
                <div className="flex items-start space-x-4">
                  <AlertCircle className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg font-bold text-yellow-800 mb-2">Lưu ý quan trọng</h4>
                    <p className="text-yellow-700">
                      Các sản phẩm khuyến mãi hoặc sale có thể không áp dụng chính sách đổi trả.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Error Policy */}
            <div className="mb-16">
              <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
                CHÍNH SÁCH ĐỔI DO LỖI KỸ THUẬT & HOÀN TIỀN
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border-2 border-green-200">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mr-4">
                      <RefreshCw className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800">Đổi hàng lỗi kỹ thuật</h4>
                  </div>
                  <p className="text-gray-700 mb-4">Đổi hàng trong vòng <strong>14 ngày</strong> nếu sản phẩm bị lỗi kỹ thuật.</p>
                  <p className="text-gray-700">Chi phí vận chuyển được hoàn trả nếu lỗi do sản phẩm.</p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border-2 border-blue-200">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800">Hoàn tiền</h4>
                  </div>
                  <p className="text-gray-700 mb-4">Hoàn tiền trong vòng <strong>7 ngày</strong> sau khi kiểm tra và xác nhận lỗi kỹ thuật.</p>
                  <p className="text-gray-700">Quy trình hoàn tiền nhanh chóng và minh bạch.</p>
                </div>
              </div>
            </div>

            {/* Cost Policy */}
            <div className="mb-16">
              <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">CHI PHÍ ĐỔI HÀNG</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-red-50 rounded-3xl p-8 border-2 border-red-200">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-white font-bold text-xl">×</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Lỗi do khách hàng</h4>
                    <p className="text-gray-700">Khách hàng chịu chi phí vận chuyển nếu lỗi do người mua</p>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-3xl p-8 border-2 border-green-200">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4">Lỗi do sản phẩm</h4>
                    <p className="text-gray-700">Chúng tôi chịu chi phí vận chuyển nếu lỗi do sản phẩm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Warranty Content */}
      {activeTab === 'warranty' && (
        <section className="py-8">
          <div className="max-w-6xl mx-auto px-4">
            <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">CHÍNH SÁCH BẢO HÀNH</h3>
            
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
                      <th className="px-8 py-6 text-left text-lg font-bold">Lỗi Sản Phẩm</th>
                      <th className="px-8 py-6 text-left text-lg font-bold">Thời Gian Giải Quyết</th>
                      <th className="px-8 py-6 text-left text-lg font-bold">Điều Kiện Bảo Hành</th>
                    </tr>
                  </thead>
                  <tbody>
                    {warrantyData.map((item, index) => (
                      <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-indigo-50 transition-colors`}>
                        <td className="px-8 py-6">
                          <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full mr-4 ${
                              item.color === 'green' ? 'bg-green-500' : 'bg-blue-500'
                            }`}></div>
                            <span className="font-semibold text-gray-800">{item.type}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center">
                            <Clock className="w-5 h-5 text-gray-500 mr-3" />
                            <span className="text-gray-700">{item.time}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-gray-700">{item.condition}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-12 bg-orange-50 border-2 border-orange-200 rounded-3xl p-8">
              <div className="flex items-start space-x-4">
                <AlertCircle className="w-8 h-8 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-bold text-orange-800 mb-2">Lưu ý về bảo hành</h4>
                  <p className="text-orange-700">
                    Bảo hành không áp dụng cho lỗi do tác động bên ngoài như rách, vết bẩn, v.v.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Exchange Steps */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-4">
            2 BƯỚC ĐỔI HÀNG NHANH CHÓNG
          </h3>
          <p className="text-center text-gray-600 mb-12 text-lg">Quy trình đổi hàng đơn giản và tiện lợi</p>
          
          <div className="grid md:grid-cols-2 gap-12">
            {exchangeSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-8 border-2 border-indigo-200 text-center">
                  <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">{step.step}</span>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 mb-4">{step.title}</h4>
                  <p className="text-gray-700 leading-relaxed">{step.description}</p>
                </div>
                {index === 0 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2">
                    <ArrowRight className="w-12 h-12 text-indigo-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-white mb-6">Cần hỗ trợ thêm?</h3>
          <p className="text-xl text-indigo-100 mb-12">
            Đội ngũ chăm sóc khách hàng C WEB luôn sẵn sàng hỗ trợ bạn
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <Phone className="w-12 h-12 text-white mx-auto mb-6" />
              <h4 className="text-xl font-bold text-white mb-4">Hotline hỗ trợ</h4>
              <p className="text-indigo-100 mb-4">Hỗ trợ từ 8:00 - 22:00 hàng ngày</p>
              <p className="text-2xl font-bold text-white">1900-ICON-DENIM</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <Mail className="w-12 h-12 text-white mx-auto mb-6" />
              <h4 className="text-xl font-bold text-white mb-4">Email hỗ trợ</h4>
              <p className="text-indigo-100 mb-4">Phản hồi trong vòng 24 giờ</p>
              <p className="text-xl font-bold text-white">support@icondenim.com</p>
            </div>
          </div>
          
          <div className="mt-12">
            <button className="bg-white text-indigo-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-indigo-50 transition-colors shadow-lg">
              Liên hệ ngay
            </button>
          </div>
        </div>
      </section>

    </div>
    <Footer/>
    </>
  );
}

export default ReturnPolixyPage;