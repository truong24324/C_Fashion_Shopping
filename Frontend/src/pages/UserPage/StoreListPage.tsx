import React, { useState } from "react";
import { FaExchangeAlt, FaShieldAlt, FaGift, FaPhone } from "react-icons/fa";
import Footer from "../../Layouts/Footer";
import Navbar from "../../Layouts/Navbar";

const stores = [
    {
        id: 1,
        name: "Cửa hàng A",
        image: "https://file.hstatic.net/1000360022/file/icondenim-vo-van-ngan.jpg",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        hours: "08:00 - 22:00",
        status: "Mở cửa",
        phone: "0123 456 789",
        mapLink: "#",
        isNew: true,
    },
    {
        id: 2,
        name: "Cửa hàng B",
        image: "https://file.hstatic.net/1000360022/file/icondenim_nguyen_anh_thu_5ff5fddbeebd49bd94990ebdad05f070.jpg",
        address: "456 Đường XYZ, Quận 2, TP.HCM",
        hours: "09:00 - 21:00",
        status: "Đóng cửa",
        phone: "0987 654 321",
        mapLink: "#",
        isNew: false,
    },
];

const infoItems = [
    { text: "ĐỔI TRẢ TRONG 15 NGÀY", icon: <FaExchangeAlt className="text-xl text-blue-500" /> },
    { text: "BẢO HÀNH TRONG 30 NGÀY", icon: <FaShieldAlt className="text-xl text-green-500" /> },
    { text: "HÀNG MỚI MỖI NGÀY", icon: <FaGift className="text-xl text-yellow-500" /> },
    { text: "HOTLINE - 028 7306 6060", icon: <FaPhone className="text-xl text-red-500" /> },
];

const StoreListPage = () => {
    const [city, setCity] = useState("");
    const [district, setDistrict] = useState("");

    return (
        <div className="pt-3">
            <Navbar />
            <div className="pt-20 mx-auto p-4 lg:p-6">
                
                {/* Hình ảnh đầu trang */}
                <div className="w-full h-auto flex items-center justify-center bg-gray-100">
                    <img
                        src="https://file.hstatic.net/1000360022/file/artboard_1-min_1643d2c0f0bb4e81ae8841e0ba2f1ba7.jpg"
                        alt="Banner"
                        className="w-full h-auto object-cover"
                    />
                </div>

                {/* 4 Thẻ Thông Tin */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    {infoItems.map((item, index) => (
                        <div key={index} className="flex items-center p-4 border rounded-lg shadow text-sm sm:text-base">
                            {item.icon}
                            <p className="font-medium ml-2 sm:ml-4">{item.text}</p>
                        </div>
                    ))}
                </div>

                {/* Bộ lọc Tỉnh/Thành phố & Quận/Huyện */}
                <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
                    <select
                        className="p-2 border rounded w-full sm:w-auto"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    >
                        <option value="">Chọn Tỉnh/Thành phố</option>
                        <option value="HCM">TP.HCM</option>
                        <option value="HN">Hà Nội</option>
                    </select>

                    <select
                        className="p-2 border rounded w-full sm:w-auto"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                    >
                        <option value="">Chọn Quận/Huyện</option>
                        <option value="Q1">Quận 1</option>
                        <option value="Q2">Quận 2</option>
                    </select>
                </div>

                {/* Danh sách cửa hàng */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {stores.map((store) => (
                        <div key={store.id} className="border rounded-lg shadow p-4 flex flex-col">
                            {/* Hình ảnh */}
                            <img src={store.image} alt={store.name} className="w-full h-full sm:h-48 object-cover rounded" />

                            {/* Thông tin cửa hàng */}
                            <div className="mt-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-base sm:text-lg font-bold">{store.name}</h2>
                                    {store.isNew && <span className="text-red-500 font-semibold text-sm">NEW</span>}
                                </div>
                                <p className="text-gray-600 mt-2 text-sm sm:text-base">📍 {store.address}</p>
                                <div className="flex justify-between mt-2">
                                    <p className="text-sm sm:text-base">⏰ {store.hours}</p>
                                    <span className={store.status === "Mở cửa" ? "text-green-500" : "text-red-500"}>
                                        {store.status}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-sm sm:text-base">📞 {store.phone}</p>
                                    <a href={store.mapLink} className="bg-blue-500 text-white px-3 py-1 rounded text-xs sm:text-sm">Xem bản đồ</a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default StoreListPage;
