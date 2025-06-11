import { N } from 'framer-motion/dist/types.d-6pKw1mTI';
import { Truck, Clock, MapPin, Shield, Phone, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import Footer from 'src/Layouts/Footer';
import Navbar from 'src/Layouts/Navbar';

const ShippingPolixyPage = () => {
    const shippingZones = [
        { zone: 'Nội thành TP.HCM', time: '2-4 giờ', fee: '15.000đ', icon: MapPin },
        { zone: 'Ngoại thành TP.HCM', time: '4-8 giờ', fee: '25.000đ', icon: MapPin },
        { zone: 'Miền Nam', time: '1-2 ngày', fee: '35.000đ', icon: Truck },
        { zone: 'Miền Bắc/Trung', time: '2-3 ngày', fee: '45.000đ', icon: Truck }
    ];

    const features = [
        { title: 'Giao hàng siêu tốc', desc: 'Cam kết giao hàng nhanh nhất thị trường', icon: Clock },
        { title: 'Theo dõi đơn hàng', desc: 'Cập nhật trạng thái đơn hàng realtime', icon: Shield },
        { title: 'Hỗ trợ 24/7', desc: 'Đội ngũ chăm sóc khách hàng luôn sẵn sàng', icon: Phone }
    ];

    return (
        <>
        <Navbar />
        <div className="pt-20 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Hero Section */}
            <section className="py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
                <div className="max-w-6xl mx-auto px-4 relative">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                            Chính sách <span className="text-blue-600">Vận chuyển</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Cam kết mang đến dịch vụ giao hàng nhanh chóng, an toàn và tin cậy nhất cho khách hàng
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Shipping Zones */}
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
                        Khu vực giao hàng & Thời gian
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {shippingZones.map((zone, index) => (
                            <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-100 hover:border-blue-300 transition-colors">
                                <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-4">
                                    <zone.icon className="w-6 h-6 text-white" />
                                </div>
                                <h4 className="text-lg font-bold text-gray-800 mb-2">{zone.zone}</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center text-gray-600">
                                        <Clock className="w-4 h-4 mr-2" />
                                        <span className="text-sm">{zone.time}</span>
                                    </div>
                                    <div className="text-2xl font-bold text-blue-600">{zone.fee}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Policy Details */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Điều khoản vận chuyển</h3>
                            <div className="space-y-6">
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-1">Thời gian giao hàng</h4>
                                        <p className="text-gray-600">Cam kết giao hàng đúng thời gian đã thông báo. Trường hợp chậm trễ, khách hàng được hoàn phí vận chuyển.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-1">Kiểm tra hàng hóa</h4>
                                        <p className="text-gray-600">Khách hàng được kiểm tra hàng hóa trước khi thanh toán. Từ chối nhận hàng nếu không đúng yêu cầu.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-1">Bảo hiểm hàng hóa</h4>
                                        <p className="text-gray-600">Tất cả đơn hàng đều được bảo hiểm 100% giá trị trong quá trình vận chuyển.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Lưu ý quan trọng</h3>
                            <div className="space-y-6">
                                <div className="flex items-start space-x-3">
                                    <AlertCircle className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-1">Hàng hóa cấm gửi</h4>
                                        <p className="text-gray-600">Không vận chuyển hàng hóa nguy hiểm, chất lỏng, thực phẩm dễ hỏng và các mặt hàng bị cấm theo quy định pháp luật.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <AlertCircle className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-1">Thông tin liên lạc</h4>
                                        <p className="text-gray-600">Vui lòng cung cấp thông tin liên lạc chính xác để shipper có thể liên hệ khi giao hàng.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <AlertCircle className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-1">Phí vận chuyển</h4>
                                        <p className="text-gray-600">Phí vận chuyển có thể thay đổi tùy theo khoảng cách, trọng lượng và kích thước hàng hóa.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h3 className="text-3xl font-bold text-white mb-6">Cần hỗ trợ thêm?</h3>
                    <p className="text-xl text-blue-100 mb-8">
                        Đội ngũ chăm sóc khách hàng C WEB sẵn sàng hỗ trợ bạn 24/7
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
                        <div className="flex items-center text-white">
                            <Phone className="w-6 h-6 mr-3" />
                            <span className="text-lg font-medium">Hotline: 1900-VOI-71</span>
                        </div>
                        <div className="flex items-center text-white">
                            <Mail className="w-6 h-6 mr-3" />
                            <span className="text-lg font-medium">support@voi71.com</span>
                        </div>
                    </div>
                    <div className="mt-8">
                        <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors shadow-lg">
                            Liên hệ ngay
                        </button>
                    </div>
                </div>
            </section>
        </div>
         <Footer />
        </>
    );
}

export default ShippingPolixyPage;