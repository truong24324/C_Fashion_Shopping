import axios from "axios";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import Footer from "src/Layouts/Footer";
import Navbar from "src/Layouts/Navbar";
import React, { useState, useEffect } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, MapPin, CreditCard, Truck, Gift, Check, ShoppingBag, User } from 'lucide-react';
import { DecodedToken } from "../../components/CreateForm/Product/types";

const CheckoutPage: React.FC = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!state) {
            navigate("/cart");
        }
    }, [state]);

    const {
        items = [],
        pricing = {},
    } = state || {};

    const [paymentMethod, setPaymentMethod] = useState<string>("COD");
    const [note, setNote] = useState<string>(""); // Add state for note
    const [isPaying, setIsPaying] = useState<boolean>(false);
    const [isQRModalOpen, setIsQRModalOpen] = useState<boolean>(false);
    const [qrImage, setQrImage] = useState<string | null>(null);
    const [orderCode, setOrderCode] = useState<string | null>(null);
    const [amount, setAmount] = useState<number | null>(null);
    const [dataOrder, setDataOrder] = useState<any>(null);
    const [dataOrderDetails, setDataOrderDetails] = useState<any>(null);

    const getAccountIdFromToken = () => {
        const token = localStorage.getItem("token");
        if (!token) return null;
        const decoded: DecodedToken = jwtDecode(token);
        return parseInt(decoded.accountId);
    };

    const [accountId, setAccountId] = useState<number | null>(null);
    const [customerInfo, setCustomerInfo] = useState({
        fullName: "",
        email: "",
        phone: "",
        shippingAddress: "",
    });

    useEffect(() => {
        const accId = getAccountIdFromToken();
        setAccountId(accId);

        const userCacheRaw = localStorage.getItem("user_cache");
        if (userCacheRaw) {
            try {
                const userCache = JSON.parse(userCacheRaw);
                setCustomerInfo({
                    fullName: userCache.fullName || "",
                    email: userCache.email || "",
                    phone: userCache.phone || "",
                    shippingAddress: userCache.homeAddress || "", // mapping homeAddress to shippingAddress
                });
            } catch (error) {
                console.error("Failed to parse user_cache from localStorage", error);
                toast.error("Lỗi khi tải dữ liệu người dùng");
            }
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCustomerInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePayment = async () => {
        setIsPaying(true);

        const orderRequest = {
            address: customerInfo.shippingAddress,
            paymentMethod, // được chọn
            pricing, // tổng giá
            fullName: customerInfo.fullName,
            email: customerInfo.email,
            phone: customerInfo.phone,
            accountId: accountId,
            totalAmount: pricing.total,
            discountCode: pricing.coupon,
            orderDetails: items.map((item: any) => ({
                variantId: item.variantId,
                quantity: item.quantity,
                productPrice: item.price,
            })),
            shippingFee: pricing.shippingFee,
            note: note, // Ghi chú
            orderStatusId: 1,
            shippingAddress: customerInfo.shippingAddress,
        };

        try {
            if (paymentMethod === "VNPAY") {
                // Gửi yêu cầu tạo link thanh toán VNPAY
                const response = await axios.post(
                    `/api/payment/create/vnpay?amount=${pricing.total}`, { order: orderRequest },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,  // Thêm Authorization header
                        },
                    }
                );
                const paymentUrl = response.data.paymentUrl;  // Nhận URL thanh toán từ backend
                window.location.href = paymentUrl;  // Chuyển hướng đến trang thanh toán VNPAY
            } else if (paymentMethod === "MoMo") {
                // Gửi yêu cầu tạo thanh toán MoMo
                const response = await axios.post(
                    "/api/payment/create/momo",   // URL endpoint
                    orderRequest,         // Tham số orderRequest
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,  // Thêm Authorization header
                        },
                    }
                );
                const paymentUrl = response.data.paymentUrl;  // Nhận URL thanh toán từ backend
                window.location.href = paymentUrl;  // Chuyển hướng đến trang thanh toán MoMo
            } else if (paymentMethod === "COD") {
                const response = await axios.post(
                    "/api/payment/create/COD",
                    orderRequest,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                toast.success("Đặt hàng thành công!");  // hoặc chuyển trang
                // Điều hướng đến trang thành công hoặc reset form
                const createdOrder = response.data;
                navigate("/order-success", { state: { order: createdOrder.data } });
            } else if (paymentMethod === "VietQR") {
                const response = await axios.post(
                    "/api/payment/create/VietQR",
                    orderRequest,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                const { qrBase64Image, orderCode, order, orderDetails } = response.data.data;

                setQrImage(qrBase64Image);
                setOrderCode(orderCode);    // Mã đơn hàng từ backend
                setAmount(pricing.total);          // Tổng tiền từ backend
                setIsQRModalOpen(true);
                setDataOrder(order);
                setDataOrderDetails(orderDetails);
            }
            else {
                toast.error("Chưa chọn phương thức thanh toán.");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra khi xử lý thanh toán.");
        } finally {
            setIsPaying(false);
        }
    };

    const paymentMethods = [
        {
            key: "COD",
            label: "Thanh toán khi nhận hàng",
            description: "Miễn phí vận chuyển",
            icon: Truck,
            color: "emerald",
            badge: "Phổ biến"
        },
        {
            key: "MoMo",
            label: "Ví điện tử MoMo",
            description: "Nhanh chóng & bảo mật",
            icon: CreditCard,
            color: "pink"
        },
        {
            key: "VietQR",
            label: "Chuyển khoản VietQR",
            description: "Quét mã QR thanh toán",
            icon: CreditCard,
            color: "purple"
        },
        {
            key: "VNPAY",
            label: "Thanh toán VNPAY",
            description: "Thanh toán trực tuyến an toàn",
            icon: CreditCard,
            color: "blue"
        }
    ];

    if (!state) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingOutlined className="text-4xl text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="pt-10 min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                {/* QR Modal */}
                {isQRModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4 backdrop-blur-sm">
                        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-purple-100 relative w-full max-w-md animate-fade-in-up transition-all duration-300">
                            {/* Close Button */}
                            <button
                                onClick={() => setIsQRModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
                                aria-label="Đóng"
                            >
                                ×
                            </button>

                            {/* Header */}
                            <h3 className="text-2xl font-semibold mb-5 text-center text-purple-700">
                                Thanh toán bằng QR Code
                            </h3>

                            {/* QR and Info */}
                            <div className="flex flex-col items-center gap-3">
                                {/* Logo VPBank */}
                                <img
                                    src="/images/vpbank.png"
                                    alt="VPBank Logo"
                                    className="h-10 object-contain mb-1"
                                />

                                {/* QR Code */}
                                <div className="border-2 border-dashed border-purple-200 p-2 rounded-xl">
                                    <img
                                        src={qrImage ?? ""}
                                        alt="QR Code"
                                        className="w-52 h-52 rounded-md object-contain"
                                    />
                                </div>

                                {/* Logo VietQR + Napas 247 */}
                                <div className="flex items-center justify-center gap-4 mt-2">
                                    <img
                                        src="/images/vietqr.png"
                                        alt="VietQR Logo"
                                        className="h-8 object-contain"
                                    />
                                    <img
                                        src="/images/napas247.png"
                                        alt="Napas247 Logo"
                                        className="h-8 object-contain"
                                    />
                                </div>

                                {/* Thông tin */}
                                <div className="text-sm text-center text-gray-700 leading-relaxed space-y-1 mt-3">
                                    <p>
                                        <span className="font-semibold">Người nhận:</span> Nguyễn Minh Trường
                                    </p>
                                    <p>
                                        <span className="font-semibold">Ngân hàng:</span> VP Bank
                                    </p>
                                    {orderCode && (
                                        <p>
                                            <span className="font-semibold">Mã đơn hàng:</span>{" "}
                                            <span className="text-gray-800">{orderCode}</span>
                                        </p>
                                    )}
                                    {amount && (
                                        <p className="text-lg font-bold text-green-600">
                                            Số tiền: {Number(amount).toLocaleString("vi-VN")} vn₫
                                        </p>
                                    )}
                                </div>

                                <p className="text-sm text-gray-500 mt-3 text-center px-4">
                                    Vui lòng sử dụng ứng dụng ngân hàng hoặc ví MoMo để quét mã và hoàn tất thanh toán.
                                </p>
                            </div>

                            {/* Warning & Confirmation */}
                            <div className="mt-6 px-4 text-xs text-center text-gray-600 italic leading-relaxed">
                                Đây là mã QR được cung cấp bởi <span className="font-medium text-purple-600">VietQR</span> để hỗ trợ thanh toán nhanh.
                                Sau khi thanh toán, hãy nhấn <span className="font-semibold">"Tôi đã thanh toán thành công"</span> để chuyển sang trang xác nhận.
                                <br />
                                <span className="text-red-500 font-semibold">
                                    Lưu ý: Nếu bạn chưa thanh toán mà bấm xác nhận, đơn hàng sẽ bị hủy tự động.
                                </span>
                            </div>

                            {/* Confirm Button */}
                            <div className="mt-6 flex justify-center">
                                <button
                                    onClick={() => {
                                        setIsQRModalOpen(false);
                                        navigate("/order-success", { state: { order: dataOrder, orderDetails: dataOrderDetails } });
                                    }}
                                    className="bg-purple-600 text-white px-6 py-2 rounded-full font-medium shadow hover:bg-purple-700 transition"
                                >
                                    Tôi đã thanh toán thành công
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center text-sm text-gray-600 mb-4">
                            <span>Giỏ hàng</span>
                            <ChevronRight className="w-4 h-4 mx-2" />
                            <span className="font-medium text-blue-600">Thanh toán</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Hoàn tất đơn hàng</h1>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column - Customer Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Login Prompt */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <User className="w-5 h-5 text-blue-600" />
                                        <span className="text-blue-800">Đã có tài khoản?</span>
                                    </div>
                                    <button className="text-blue-600 font-medium hover:text-blue-700">
                                        Đăng nhập ngay
                                    </button>
                                </div>
                            </div>

                            {/* Delivery Address */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center space-x-3 mb-6">
                                    <MapPin className="w-5 h-5 text-gray-600" />
                                    <h2 className="text-xl font-semibold text-gray-900">Thông tin giao hàng</h2>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Họ và tên *
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={customerInfo.fullName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="Nhập họ và tên"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Số điện thoại *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={customerInfo.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="Nhập số điện thoại"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={customerInfo.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="Nhập địa chỉ email"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Địa chỉ giao hàng *
                                        </label>
                                        <input
                                            type="text"
                                            name="shippingAddress"
                                            value={customerInfo.shippingAddress}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Ghi chú đơn hàng
                                        </label>
                                        <textarea
                                            name="note"
                                            value={pricing.note}
                                            onChange={(e) => setNote(e.target.value)}
                                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Nhập ghi chú (nếu có)"
                                            rows={3}
                                        ></textarea>
                                    </div>
                                </div>

                                {/* Delivery Estimate */}
                                <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                    <div className="flex items-center space-x-2">
                                        <Truck className="w-5 h-5 text-emerald-600" />
                                        <span className="font-medium text-emerald-800">
                                            Giao hàng dự kiến: {pricing.estimatedDelivery}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Methods */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center space-x-3 mb-6">
                                    <CreditCard className="w-5 h-5 text-gray-600" />
                                    <h2 className="text-xl font-semibold text-gray-900">Phương thức thanh toán</h2>
                                </div>

                                <div className="space-y-3">
                                    {paymentMethods.map((method) => {
                                        const IconComponent = method.icon;
                                        return (
                                            <label
                                                key={method.key}
                                                className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${paymentMethod === method.key
                                                    ? `border-${method.color}-500 bg-${method.color}-50`
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value={method.key}
                                                    checked={paymentMethod === method.key}
                                                    onChange={() => setPaymentMethod(method.key)}
                                                    className="sr-only"
                                                />

                                                <IconComponent className={`w-6 h-6 mr-4 ${paymentMethod === method.key ? `text-${method.color}-600` : 'text-gray-400'
                                                    }`} />

                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-medium text-gray-900">{method.label}</span>
                                                        {method.badge && (
                                                            <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-medium">
                                                                {method.badge}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                                                </div>

                                                {paymentMethod === method.key && (
                                                    <div className={`w-5 h-5 rounded-full bg-${method.color}-500 flex items-center justify-center`}>
                                                        <Check className="w-3 h-3 text-white" />
                                                    </div>
                                                )}
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Order Summary */}
                        <div className="space-y-6">
                            {/* Order Items */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center space-x-3 mb-6">
                                    <ShoppingBag className="w-5 h-5 text-gray-600" />
                                    <h2 className="text-xl font-semibold text-gray-900">Đơn hàng của bạn</h2>
                                </div>

                                <div className="space-y-4">
                                    {items.map((item: any) => (
                                        <div key={item.variantId} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                                            <img
                                                src={item.productImage}
                                                alt={item.productName}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-gray-900 truncate">{item.productName}</h3>
                                                <p className="text-sm text-gray-600">{item.variantDetails}</p>
                                                <div className="flex items-center justify-between mt-1">
                                                    <span className="text-sm text-gray-600">x{item.quantity}</span>
                                                    <span className="font-medium text-gray-900">
                                                        {item.totalPrice.toLocaleString()} vn₫
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Discount Code */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center space-x-3 mb-4">
                                    <Gift className="w-5 h-5 text-gray-600" />
                                    <h3 className="font-medium text-gray-900">Mã giảm giá</h3>
                                </div>
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        placeholder="Nhập mã giảm giá"
                                        defaultValue={pricing.coupon}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                                        Áp dụng
                                    </button>
                                </div>
                            </div>

                            {/* Loyalty Program */}
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
                                <h3 className="font-semibold text-amber-900 mb-3">🎁 Ưu đãi thành viên</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-amber-800">Giảm 100.000₫</span>
                                        <button className="text-xs bg-amber-600 text-white px-3 py-1 rounded-full hover:bg-amber-700 transition-colors">
                                            Đăng nhập
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-amber-800">Giảm 30.000₫</span>
                                        <button className="text-xs bg-amber-600 text-white px-3 py-1 rounded-full hover:bg-amber-700 transition-colors">
                                            Đăng nhập
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Order Total */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Tổng đơn hàng</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tạm tính:</span>
                                        <span className="font-medium">{pricing.subtotal.toLocaleString()} ₫</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Phí vận chuyển:</span>
                                        <span className="font-medium">{pricing.shippingFee.toLocaleString()} ₫</span>
                                    </div>
                                    <div className="flex justify-between text-emerald-600">
                                        <span>Giảm giá:</span>
                                        <span className="font-medium">-{pricing.discount.toLocaleString()} ₫</span>
                                    </div>
                                    <div className="border-t pt-3">
                                        <div className="flex justify-between text-lg font-bold text-gray-900">
                                            <span>Tổng cộng:</span>
                                            <span>{pricing.total.toLocaleString()} ₫</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={handlePayment}
                                    disabled={isPaying}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    {isPaying ? <LoadingOutlined /> : "Thanh toán đơn hàng"}
                                </button>
                                <Link to="/cart" className="inline-block w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                                    ← Quay lại giỏ hàng
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            );

            <Footer />
        </>
    );
};

export default CheckoutPage;
