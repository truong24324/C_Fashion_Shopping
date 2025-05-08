import React, { useState } from "react";
import { Link } from "react-router-dom";

const CheckoutPage: React.FC = () => {
    const [province, setProvince] = useState<string>("");
    const [district, setDistrict] = useState<string>("");
    const [ward, setWard] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<string>("COD");

    // Giả lập dữ liệu sản phẩm
    const product = {
        name: "Áo Thun Nam Họa Tiết Daisy Sét Bitistine Form Oversize",
        price: 269100,
        imageUrl: "https://via.placeholder.com/100x100.png?text=Áo+Thun",
    };

    return (
        <div className="flex p-8 bg-gray-100">
            {/* Cột bên trái */}
            <div className="w-1/2 pr-8">
                <h2 className="text-3xl font-bold text-blue-600 mb-4">Thông tin giao hàng</h2>
                <p className="text-sm text-gray-500 mb-4">Bạn đã có tài khoản? <Link to="/auth" className="text-blue-500">Đăng nhập</Link></p>

                {/* Thông tin người nhận */}
                <div className="mb-4">
                    <label className="block text-sm text-gray-700">Họ và tên</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập họ và tên"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm text-gray-700">Số điện thoại</label>
                    <input
                        type="tel"
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập số điện thoại"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm text-gray-700">Địa chỉ</label>
                    <select
                        className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                    >
                        <option value="">Chọn tỉnh / thành</option>
                        <option value="Hanoi">Hà Nội</option>
                        <option value="HCM">TP. Hồ Chí Minh</option>
                    </select>
                    <select
                        className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        disabled={!province}
                    >
                        <option value="">Chọn quận / huyện</option>
                        {province === "Hanoi" && (
                            <>
                                <option value="DongDa">Đống Đa</option>
                                <option value="CauGiay">Cầu Giấy</option>
                            </>
                        )}
                        {province === "HCM" && (
                            <>
                                <option value="TanBinh">Tân Bình</option>
                                <option value="ThuDuc">Thủ Đức</option>
                            </>
                        )}
                    </select>
                    <select
                        className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={ward}
                        onChange={(e) => setWard(e.target.value)}
                        disabled={!district}
                    >
                        <option value="">Chọn phường / xã</option>
                        {/* Thêm các lựa chọn phường / xã tương ứng */}
                    </select>
                </div>

                {/* Phương thức vận chuyển */}
                <div className="mb-4 p-4 bg-gray-200 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Vui lòng chọn tỉnh / thành để có danh sách phương thức vận chuyển</p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                        <input
                            type="radio"
                            id="cod"
                            name="paymentMethod"
                            value="COD"
                            checked={paymentMethod === "COD"}
                            onChange={() => setPaymentMethod("COD")}
                            className="form-radio text-blue-500"
                        />
                        <label htmlFor="cod" className="flex items-center space-x-2 text-sm text-gray-700">
                            <img src="/images/shipcod.png" alt="COD Icon" className="w-6 h-6 rounded-full" />
                            <span>Thanh toán khi nhận hàng (COD) - Freeship mọi đơn hàng</span>
                        </label>
                    </div>

                    <div className="flex items-center space-x-3">
                        <input
                            type="radio"
                            id="vnpay"
                            name="paymentMethod"
                            value="VNPAY"
                            checked={paymentMethod === "VNPAY"}
                            onChange={() => setPaymentMethod("VNPAY")}
                            className="form-radio text-green-500"
                        />
                        <label htmlFor="vnpay" className="flex items-center space-x-2 text-sm text-gray-700">
                            <img src="/images/vnpay.png" alt="VNPAY Icon" className="w-6 h-6 rounded-full" />
                            <span>Thanh toán online qua VNPAY</span>
                        </label>
                    </div>

                    <div className="flex items-center space-x-3">
                        <input
                            type="radio"
                            id="momo"
                            name="paymentMethod"
                            value="MoMo"
                            checked={paymentMethod === "MoMo"}
                            onChange={() => setPaymentMethod("MoMo")}
                            className="form-radio text-yellow-500"
                        />
                        <label htmlFor="momo" className="flex items-center space-x-2 text-sm text-gray-700">
                            <img src="/images/momo.jpg" alt="MoMo Icon" className="w-6 h-6 rounded-full" />
                            <span>Thanh toán qua Ví MoMo</span>
                        </label>
                    </div>
                </div>

                {/* Nút hoàn tất */}
                <div className="flex justify-between mt-8">
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-lg">
                        <Link to="/cart">Giỏ hàng</Link>
                    </button>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-lg">Hoàn tất đơn hàng</button>
                </div>
            </div>

            {/* Cột bên phải */}
            <div className="w-1/2 pl-8">
                <h2 className="text-3xl font-bold text-blue-600 mb-4">Thông tin đơn hàng</h2>
                <div className="flex mb-4">
                    <img src={product.imageUrl} alt="Sản phẩm" className="w-16 h-16 mr-4" />
                    <div>
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-sm text-gray-500">269.100₫</p>
                    </div>
                </div>

                {/* Mã giảm giá */}
                <div className="mb-4">
                    <label className="block text-sm text-gray-700">Mã giảm giá</label>
                    <div className="flex">
                        <input
                            type="text"
                            className="w-3/4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập mã giảm giá"
                        />
                        <button className="w-1/4 bg-blue-600 text-white p-2 rounded-lg">Áp dụng</button>
                    </div>
                </div>

                {/* Chương trình khách hàng thân thiết */}
                <div className="mb-4">
                    <h3 className="text-xl text-blue-600 font-semibold">Chương trình khách hàng thân thiết</h3>
                    <div className="flex items-center mb-2">
                        <span className="bg-yellow-400 px-2 py-1 text-sm font-semibold rounded-md">Giảm 100.000₫</span>
                        <button className="ml-2 bg-blue-600 text-white px-4 py-1 rounded-lg">Đăng nhập</button>
                    </div>
                    <div className="flex items-center">
                        <span className="bg-yellow-400 px-2 py-1 text-sm font-semibold rounded-md">Giảm 30.000₫</span>
                        <button className="ml-2 bg-blue-600 text-white px-4 py-1 rounded-lg">Đăng nhập</button>
                    </div>
                </div>

                {/* Tổng tiền */}
                <div className="mt-8">
                    <div className="flex justify-between mb-4">
                        <p>Tạm tính:</p>
                        <p>{product.price.toLocaleString()}₫</p>
                    </div>
                    <div className="flex justify-between mb-4">
                        <p>Phí vận chuyển:</p>
                        <p>Đang cập nhật...</p>
                    </div>
                    <div className="flex justify-between mb-4 font-semibold">
                        <p>Tổng cộng:</p>
                        <p>{product.price.toLocaleString()}₫</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
