import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import Footer from "src/Layouts/Footer";
import Navbar from "src/Layouts/Navbar";

interface DecodedToken {
    accountId: string;
    exp: number;
    iat: number;
    email: string;
    roles: { authority: string }[];
}
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
        address = {},
        pricing = {},
    } = state || {};

    const [province, setProvince] = useState<any>(address.province || null);
    const [district, setDistrict] = useState<any>(address.district || null);
    const [ward, setWard] = useState<any>(address.ward || "");
    const [paymentMethod, setPaymentMethod] = useState<string>("COD");
    const [note, setNote] = useState<string>(""); // Add state for note

    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);
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

    useEffect(() => {
        const initAddressSelection = async () => {
            try {
                // 1. Fetch all provinces
                const resProvince = await axios.get("/api/locations/provinces");
                const provincesData = resProvince.data?.data || resProvince.data;
                setProvinces(provincesData);

                const selectedProvince = provincesData.find((p: any) => p.ProvinceID === address.province);
                if (selectedProvince) {
                    setProvince(selectedProvince);

                    // 2. Fetch districts for selected province
                    const resDistrict = await axios.get("/api/locations/districts", {
                        params: { provinceId: address.province }
                    });
                    const districtsData = resDistrict.data?.data || resDistrict.data;
                    setDistricts(districtsData);

                    const selectedDistrict = districtsData.find((d: any) => d.DistrictID === address.district);
                    if (selectedDistrict) {
                        setDistrict(selectedDistrict);

                        // 3. Fetch wards for selected district
                        const resWard = await axios.get("/api/locations/wards", {
                            params: { districtId: address.district }
                        });
                        const wardsData = resWard.data?.data || resWard.data;
                        setWards(wardsData);

                        const selectedWard = wardsData.find((w: any) => w.WardCode === address.ward);
                        if (selectedWard) {
                            setWard(selectedWard);
                        }
                    }
                }
            } catch (error) {
                toast.error("Không thể khởi tạo địa chỉ mặc định.");
                console.error("initAddressSelection error:", error);
            }
        };

        initAddressSelection();
    }, []);

    const handlePayment = async () => {
        const orderRequest = {
            address: customerInfo.shippingAddress,
            paymentMethod, // được chọn
            pricing, // tổng giá
            fullName: customerInfo.fullName,
            email: customerInfo.email,
            phone: customerInfo.phone,
            accountId: accountId,
            totalAmount: pricing.total,
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
                navigate("/order-success");
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
                navigate("/order-success"); // giả sử bạn có trang này
            }
            else {
                toast.error("Chưa chọn phương thức thanh toán.");
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra khi xử lý thanh toán.");
        }
    };

    return (
        <>
            <Navbar />

            <div className="pt-20 flex flex-col md:flex-row p-4 md:p-8 bg-gray-100">
                {/* Cột bên trái */}
                <div className="pt-20 w-full md:w-1/2 md:pr-8 mb-6 md:mb-0">
                    <h2 className="text-3xl font-bold text-blue-600 mb-4">Thông tin giao hàng</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Bạn đã có tài khoản? <Link to="/auth" className="text-blue-500">Đăng nhập</Link>
                    </p>

                    {address && (
                        <div className="mb-4 text-sm text-gray-600">
                            <p><strong>Giao đến:</strong> {address.ward}, {address.district}, {address.province}</p>
                        </div>
                    )}

                    {/* Thông tin người nhận */}
                    <div className="mb-4">
                        <label className="block text-sm text-gray-700">Họ và tên</label>
                        <input
                            type="text"
                            name="fullName"
                            value={customerInfo.fullName}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập họ và tên"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={customerInfo.email}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập email"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm text-gray-700">Số điện thoại</label>
                        <input
                            type="tel"
                            name="phone"
                            value={customerInfo.phone}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập số điện thoại"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm text-gray-700">Địa chỉ</label>

                        <h3 className="text-lg font-semibold mt-4">Ước tính thời gian giao hàng</h3>
                        <select
                            value={province}
                            onChange={(e) => {
                                const selectedProvince = provinces.find((p) => p.ProvinceID === e.target.value);
                                setProvince(selectedProvince);
                            }}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {provinces.map((prov) => (
                                <option key={prov.ProvinceID} value={prov.ProvinceID}>
                                    {prov.ProvinceName}
                                </option>
                            ))}
                        </select>
                        <select
                            value={district}
                            onChange={(e) => {
                                const selectedDistrict = districts.find((d) => d.DistrictID === e.target.value);
                                setDistrict(selectedDistrict);
                                setWard("");
                            }}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                        >
                            {districts.map((dist) => (
                                <option key={dist.DistrictID} value={dist.DistrictID}>
                                    {dist.DistrictName}
                                </option>
                            ))}
                        </select>
                        <select
                            value={ward}
                            onChange={(e) => setWard(e.target.value)}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                        >
                            {wards.map((w) => (
                                <option key={w.WardCode} value={w.WardCode}>
                                    {w.WardName}
                                </option>
                            ))}
                        </select>
                        

                        {pricing.estimatedDelivery && (
                            <div className="mt-4 text-lg">
                                <strong>Thời gian giao hàng ước tính: </strong>{pricing.estimatedDelivery}
                            </div>
                        )}

                        <label className="block text-sm text-gray-700 mt-2">Địa chỉ chi tiết</label>
                        <input
                            type="text"
                            name="shippingAddress"
                            value={customerInfo.shippingAddress}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập địa chỉ (số nhà, tên đường...)"
                        />

                        <label className="block text-sm text-gray-700 mt-2">Ghi chú</label>
                        <textarea
                            name="note"
                            value={pricing.note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập ghi chú (nếu có)"
                            rows={3}
                        ></textarea>
                    </div>


                    {/* Phương thức vận chuyển */}
                    <div className="mb-4 p-4 bg-gray-200 rounded-lg text-center">
                        <p className="text-sm text-gray-600">Vui lòng chọn tỉnh / thành để có danh sách phương thức vận chuyển</p>
                    </div>

                    {/* Phương thức thanh toán */}
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                        {[
                            {
                                key: "COD",
                                label: "Thanh toán khi nhận hàng (COD)",
                                description: "Freeship mọi đơn hàng",
                                color: "blue",
                                img: "/images/shipcod.png",
                            },
                            {
                                key: "VNPAY",
                                label: "Thanh toán online qua VNPAY",
                                description: "Bảo mật & nhanh chóng",
                                color: "green",
                                img: "/images/vnpay.png",
                            },
                            {
                                key: "MoMo",
                                label: "Thanh toán qua Ví MoMo",
                                description: "Tiện lợi trên di động",
                                color: "pink",
                                img: "/images/momo.jpg",
                            },
                        ].map((method) => (
                            <label
                                key={method.key}
                                htmlFor={method.key}
                                className={`flex items-center border rounded-xl p-4 cursor-pointer shadow-sm transition 
                        hover:shadow-md relative
                        ${paymentMethod === method.key ? `border-${method.color}-500 ring-2 ring-${method.color}-300` : "border-gray-300"}`}
                            >
                                <input
                                    type="radio"
                                    id={method.key}
                                    name="paymentMethod"
                                    value={method.key}
                                    checked={paymentMethod === method.key}
                                    onChange={() => setPaymentMethod(method.key)}
                                    className="hidden"
                                />
                                <img src={method.img} alt={method.label} className="w-10 h-10 mr-4 rounded-full object-cover" />
                                <div className="flex flex-col">
                                    <span className="font-medium text-gray-800">{method.label}</span>
                                    <span className="text-xs text-gray-500">{method.description}</span>
                                </div>
                                {paymentMethod === method.key && (
                                    <div className={`absolute top-2 right-2 w-4 h-4 rounded-full bg-${method.color}-500`}></div>
                                )}
                            </label>
                        ))}
                    </div>

                    {/* Nút hoàn tất */}
                    <div className="flex justify-between mt-8">
                        <Link to="/cart" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg text-lg text-center">
                            Giỏ hàng
                        </Link>
                        <button
                            onClick={handlePayment}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-lg"
                        >
                            Thanh toán đơn hàng
                        </button>

                    </div>
                </div>

                {/* Cột bên phải */}
                <div className="pt-20 w-full md:w-1/2 md:pl-8">
                    <h2 className="text-3xl font-bold text-blue-600 mb-4">Thông tin đơn hàng</h2>
                    {items.map((item: any) => (
                        <div
                            key={item.variantId}
                            className="flex items-center gap-4 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition mb-4"
                        >
                            <img
                                src={item.productImage}
                                alt={item.productName}
                                className="w-20 h-20 object-cover rounded-md"
                            />
                            <div className="flex-1">
                                <p className="text-base font-semibold text-gray-800">{item.productName}</p>

                                <div className="text-sm text-gray-500 mt-1">
                                    <p>
                                        Giá:{" "}
                                        <span className="font-medium text-gray-700">
                                            {item.price.toLocaleString()} VNĐ
                                        </span>{" "}
                                        x {item.quantity}
                                    </p>
                                    <p>
                                        Đã chọn: {item.variantDetails || "Thông tin không có sẵn"}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-sm text-gray-500">Tổng:</p>
                                <p className="text-lg font-bold text-blue-600">
                                    {(item.totalPrice || item.price * item.quantity).toLocaleString()} VNĐ
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Mã giảm giá */}
                    <div className="mb-4">
                        <label className="block text-sm text-gray-700">Mã giảm giá</label>
                        <div className="flex">
                            <input
                                type="text"
                                defaultValue={pricing.coupon}
                                className="w-3/4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập mã giảm giá"
                            />
                            <button className="w-1/4 bg-blue-600 text-white p-2 rounded-lg">Áp dụng</button>
                        </div>
                    </div>

                    {/* Chương trình KH thân thiết */}
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
                        <div className="flex justify-between mb-2">
                            <p>Tạm tính:</p>
                            <p>{pricing.subtotal?.toLocaleString()}₫</p>
                        </div>
                        <div className="flex justify-between mb-2">
                            <p>Giảm giá:</p>
                            <p>{pricing.discount?.toLocaleString()}₫</p>
                        </div>
                        <div className="flex justify-between mb-2">
                            <p>Phí vận chuyển:</p>
                            <p>{pricing.shippingFee?.toLocaleString() || "Đang cập nhật..."}₫</p>
                        </div>
                        <div className="flex justify-between font-semibold text-lg">
                            <p>Tổng cộng:</p>
                            <p>{pricing.total?.toLocaleString()}₫</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CheckoutPage;
