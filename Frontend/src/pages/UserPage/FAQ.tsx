import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, ShoppingBag, Truck, CreditCard, RefreshCw, Shield, Heart, MessageCircle, Phone, Mail, Star } from 'lucide-react';
import Navbar from 'src/Layouts/Navbar';
import Footer from 'src/Layouts/Footer';

const FAQ = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [openItem, setOpenItem] = useState<string | null>(null);

    const categories = [
        { name: 'Tất cả', icon: null, active: true },
        { name: 'Đặt hàng', icon: ShoppingBag },
        { name: 'Vận chuyển', icon: Truck },
        { name: 'Thanh toán', icon: CreditCard },
        { name: 'Đổi trả', icon: RefreshCw },
        { name: 'Bảo hành', icon: Shield },
    ];

    const faqData = [
        {
            category: 'Đặt hàng',
            icon: ShoppingBag,
            questions: [
                {
                    q: 'Làm thế nào để đặt hàng trên website?',
                    a: 'Bạn có thể đặt hàng dễ dàng bằng cách: 1) Chọn sản phẩm yêu thích và size phù hợp, 2) Thêm vào giỏ hàng, 3) Điền thông tin giao hàng, 4) Chọn phương thức thanh toán và hoàn tất đơn hàng. Hệ thống sẽ gửi email xác nhận ngay lập tức.'
                },
                {
                    q: 'Tôi có thể thay đổi hoặc hủy đơn hàng sau khi đặt không?',
                    a: 'Bạn có thể thay đổi hoặc hủy đơn hàng trong vòng 30 phút sau khi đặt hàng thành công. Sau thời gian này, đơn hàng sẽ được chuyển vào quy trình xử lý và không thể thay đổi. Vui lòng liên hệ hotline để được hỗ trợ nhanh nhất.'
                },
                {
                    q: 'Làm sao để kiểm tra trạng thái đơn hàng?',
                    a: 'Bạn có thể theo dõi đơn hàng bằng cách: 1) Đăng nhập tài khoản và vào mục "Đơn hàng của tôi", 2) Sử dụng mã đơn hàng để tra cứu trên trang chủ, 3) Nhận thông báo qua SMS/Email về tình trạng đơn hàng.'
                }
            ]
        },
        {
            category: 'Vận chuyển',
            icon: Truck,
            questions: [
                {
                    q: 'Thời gian giao hàng là bao lâu?',
                    a: 'Thời gian giao hàng phụ thuộc vào khu vực: Nội thành Hà Nội/HCM: 1-2 ngày, Ngoại thành: 2-3 ngày, Tỉnh thành khác: 3-5 ngày. Đối với các sản phẩm pre-order hoặc customize có thể mất 7-14 ngày.'
                },
                {
                    q: 'Phí vận chuyển được tính như thế nào?',
                    a: 'Phí vận chuyển được tính theo khu vực và trọng lượng đơn hàng. Miễn phí ship cho đơn hàng từ 500.000đ trong nội thành và từ 800.000đ toàn quốc. Bạn có thể xem chi tiết phí ship tại trang checkout trước khi thanh toán.'
                },
                {
                    q: 'Tôi có thể chọn thời gian giao hàng không?',
                    a: 'Có, chúng tôi hỗ trợ chọn khung giờ giao hàng: Sáng (8h-12h), Chiều (13h-17h), Tối (18h-21h). Dịch vụ này áp dụng cho nội thành các thành phố lớn với phí phụ trội 15.000đ.'
                }
            ]
        },
        {
            category: 'Thanh toán',
            icon: CreditCard,
            questions: [
                {
                    q: 'Website hỗ trợ những hình thức thanh toán nào?',
                    a: 'Chúng tôi hỗ trợ đa dạng phương thức thanh toán: Thanh toán khi nhận hàng (COD), Chuyển khoản ngân hàng, Thẻ tín dụng/ghi nợ (Visa, Mastercard), Ví điện tử (MoMo, ZaloPay, VNPay), Trả góp qua thẻ tín dụng và các công ty tài chính.'
                },
                {
                    q: 'Thông tin thanh toán của tôi có được bảo mật không?',
                    a: 'Tuyệt đối! Chúng tôi sử dụng công nghệ mã hóa SSL 256-bit và tuân thủ tiêu chuẩn bảo mật PCI DSS. Thông tin thẻ tín dụng được xử lý trực tiếp qua cổng thanh toán của ngân hàng đối tác, không lưu trữ trên hệ thống.'
                },
                {
                    q: 'Tôi có thể trả góp không lãi suất không?',
                    a: 'Có, chúng tôi hỗ trợ trả góp 0% lãi suất với các ngân hàng đối tác cho đơn hàng từ 3.000.000đ. Thời hạn trả góp từ 3-24 tháng tùy theo ngân hàng. Bạn chỉ cần có thẻ tín dụng và đáp ứng điều kiện của ngân hàng.'
                }
            ]
        },
        {
            category: 'Đổi trả',
            icon: RefreshCw,
            questions: [
                {
                    q: 'Chính sách đổi trả như thế nào?',
                    a: 'Chúng tôi hỗ trợ đổi trả trong 30 ngày kể từ ngày nhận hàng với điều kiện: Sản phẩm còn nguyên tem mác, chưa qua sử dụng, không bị dính bẩn hoặc có mùi lạ. Khách hàng chịu phí ship đổi trả là 25.000đ (ngoại trừ lỗi từ shop).'
                },
                {
                    q: 'Tôi muốn đổi size/màu sắc thì làm thế nào?',
                    a: 'Bạn có thể đổi size/màu trong vòng 15 ngày đầu với điều kiện sản phẩm chưa sử dụng. Quy trình: 1) Liên hệ hotline để tạo yêu cầu đổi, 2) Đóng gói và gửi sản phẩm về kho, 3) Nhận sản phẩm mới trong 3-5 ngày.'
                },
                {
                    q: 'Trường hợp nào được hoàn tiền 100%?',
                    a: 'Hoàn tiền 100% trong các trường hợp: Sản phẩm bị lỗi từ nhà sản xuất, Giao sai hàng, Hàng bị hư hỏng trong quá trình vận chuyển, Không đúng mô tả sản phẩm. Thời gian hoàn tiền 5-7 ngày làm việc.'
                }
            ]
        },
        {
            category: 'Bảo hành',
            icon: Shield,
            questions: [
                {
                    q: 'Sản phẩm có được bảo hành không?',
                    a: 'Tất cả sản phẩm được bảo hành chất lượng 6 tháng đối với lỗi từ nhà sản xuất như: phai màu, rách vải, bung chỉ, lỗi khóa kéo. Bảo hành không áp dụng cho hao mòn tự nhiên, sử dụng không đúng cách hoặc tai nạn.'
                },
                {
                    q: 'Làm thế nào để bảo quản quần áo đúng cách?',
                    a: 'Để quần áo bền đẹp, bạn nên: Giặt theo hướng dẫn trên nhãn mác, Phân loại màu sắc khi giặt, Sử dụng nước lạnh cho vải cotton và lụa, Không vắt mạnh, phơi nơi thoáng mát, tránh ánh nắng trực tiếp.'
                }
            ]
        }
    ];

    const toggleItem = (categoryIndex: number, questionIndex: number) => {
        const key = `${categoryIndex}-${questionIndex}`;
        setOpenItem(openItem === key ? null : key);
    };

    const filteredFAQ = faqData.map(category => ({
        ...category,
        questions: category.questions.filter(item =>
            item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.a.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(category => category.questions.length > 0);

    return (
        <>
            <Navbar />
            <div className="pt-20 min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
                {/* Hero Section */}
                <section className="py-16 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600/10 to-purple-600/10"></div>
                    <div className="max-w-4xl mx-auto px-4 text-center relative">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                            Câu hỏi <span className="text-pink-600">thường gặp</span>
                        </h2>
                        <p className="text-xl text-gray-600 mb-12">
                            Tìm câu trả lời nhanh chóng cho mọi thắc mắc về sản phẩm và dịch vụ của chúng tôi
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-2xl mx-auto mb-12">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm câu hỏi..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-pink-500 focus:outline-none text-lg shadow-lg"
                            />
                        </div>

                        {/* Categories */}
                        <div className="flex flex-wrap justify-center gap-4 mb-12">
                            {categories.map((category, index) => (
                                <button
                                    key={index}
                                    className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all ${category.active
                                            ? 'bg-pink-600 text-white shadow-lg'
                                            : 'bg-white text-gray-600 hover:bg-pink-50 hover:text-pink-600 shadow-md'
                                        }`}
                                >
                                    {category.icon && <category.icon className="w-4 h-4" />}
                                    <span className="font-medium">{category.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Content */}
                <section className="py-16">
                    <div className="max-w-4xl mx-auto px-4">
                        {filteredFAQ.length > 0 ? (
                            <div className="space-y-8">
                                {filteredFAQ.map((category, categoryIndex) => (
                                    <div key={categoryIndex} className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                                        <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                                    <category.icon className="w-5 h-5 text-white" />
                                                </div>
                                                <h3 className="text-2xl font-bold text-white">{category.category}</h3>
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            {category.questions.map((item, questionIndex) => (
                                                <div key={questionIndex} className="border-b border-gray-100 last:border-b-0">
                                                    <button
                                                        onClick={() => toggleItem(categoryIndex, questionIndex)}
                                                        className="w-full py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors rounded-lg px-4"
                                                    >
                                                        <h4 className="text-lg font-semibold text-gray-800 pr-4">{item.q}</h4>
                                                        {openItem === `${categoryIndex}-${questionIndex}` ? (
                                                            <ChevronUp className="w-6 h-6 text-pink-600 flex-shrink-0" />
                                                        ) : (
                                                            <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                                                        )}
                                                    </button>

                                                    {openItem === `${categoryIndex}-${questionIndex}` && (
                                                        <div className="px-4 pb-6">
                                                            <div className="bg-pink-50 rounded-2xl p-6 border-l-4 border-pink-500">
                                                                <p className="text-gray-700 leading-relaxed">{item.a}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                                <h3 className="text-2xl font-bold text-gray-600 mb-4">Không tìm thấy kết quả</h3>
                                <p className="text-gray-500">Thử tìm kiếm với từ khóa khác hoặc liên hệ với chúng tôi để được hỗ trợ</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Support Section */}
                <section className="py-16 bg-white">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <h3 className="text-3xl font-bold text-gray-800 mb-6">Vẫn chưa tìm thấy câu trả lời?</h3>
                        <p className="text-xl text-gray-600 mb-12">
                            Đội ngũ chăm sóc khách hàng của chúng tôi luôn sẵn sàng hỗ trợ bạn
                        </p>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-8 border-2 border-pink-100">
                                <Phone className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                                <h4 className="text-xl font-bold text-gray-800 mb-3">Gọi điện trực tiếp</h4>
                                <p className="text-gray-600 mb-4">Hỗ trợ 24/7 qua hotline</p>
                                <p className="text-2xl font-bold text-pink-600">1900-FASHION</p>
                                <button className="mt-4 bg-pink-600 text-white px-6 py-3 rounded-full hover:bg-pink-700 transition-colors">
                                    Gọi ngay
                                </button>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border-2 border-purple-100">
                                <Mail className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                                <h4 className="text-xl font-bold text-gray-800 mb-3">Gửi email</h4>
                                <p className="text-gray-600 mb-4">Phản hồi trong vòng 24 giờ</p>
                                <p className="text-xl font-bold text-purple-600">support@fashionhub.com</p>
                                <button className="mt-4 bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors">
                                    Gửi email
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Rating Section */}
                <section className="py-16 bg-gradient-to-r from-pink-600 to-purple-600">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <h3 className="text-3xl font-bold text-white mb-6">Trang FAQ này có hữu ích không?</h3>
                        <p className="text-pink-100 mb-8 text-lg">Đánh giá của bạn giúp chúng tôi cải thiện trải nghiệm tốt hơn</p>

                        <div className="flex justify-center space-x-2 mb-8">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} className="p-2">
                                    <Star className="w-8 h-8 text-yellow-300 fill-current hover:scale-110 transition-transform" />
                                </button>
                            ))}
                        </div>

                        <button className="bg-white text-pink-600 px-8 py-3 rounded-full font-bold hover:bg-pink-50 transition-colors shadow-lg">
                            Gửi đánh giá
                        </button>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}

export default FAQ;