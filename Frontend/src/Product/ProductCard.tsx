import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCartPlus, FaEye, FaTimes, FaHeart } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

interface Product {
    productId: number;
    productName: string;
    model: string;
    image: string[];
    imageTypes: string[];
    price: number;
    colorCodes: string[];
    sizeNames: string[];
    materialNames: string[];
}

interface DecodedToken {
    accountId: string;
    exp: number;
    iat: number;
    email: string;
    roles: { authority: string }[];
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedColor, setSelectedColor] = useState(product.colorCodes[0]);
    const [selectedSize, setSelectedSize] = useState(product.sizeNames[0]);
    const [selectedMaterial, setSelectedMaterial] = useState(product.materialNames[0]);
    const [variantStock, setVariantStock] = useState<number | null>(null); // State for stock
    const [variantAvailable, setVariantAvailable] = useState<boolean | null>(null);
    const [variantPrice, setVariantPrice] = useState<number | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [wishlistProducts, setWishlistProducts] = useState<number[]>([]);
    const navigate = useNavigate();

    const formatPrice = (price: number | null | undefined) => {
        return price != null ? `${price.toLocaleString()} vn₫` : "Đang cập nhật";
    };

    const getAccountIdFromToken = (): number | null => {
        const token = localStorage.getItem("token"); // hoặc từ cookie/context

        if (!token) return null;

        try {
            const decoded: DecodedToken = jwtDecode(token);
            return parseInt(decoded.accountId);
        } catch (error) {
            console.error("Lỗi giải mã token:", error);
            return null;
        }
    };

    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async () => {
        const accountId = getAccountIdFromToken();
        if (!accountId) {
            toast.error("Bạn cần đăng nhập để thêm vào giỏ hàng.");
            return;
        }

        setIsAdding(true);
        try {
            const variantRes = await axios.get("/api/cart/find", {
                params: {
                    productId: product.productId,
                    color: selectedColor,
                    size: selectedSize,
                    material: selectedMaterial,
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            });

            await axios.post("/api/cart/add", {
                accountId: accountId,
                variantId: variantRes.data.variantId,  // Ensure this is a number
                quantity: quantity,
                price: product.price,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            });

            toast.success("Đã thêm vào giỏ hàng!");
            setIsModalOpen(false);
        } catch (err: any) {
            if (axios.isAxiosError(err)) {
                const errorMessage = err.response?.data?.message;
                if (errorMessage === "Không tìm thấy biến thể phù hợp") {
                    toast.error("Không tìm thấy biến thể phù hợp. Vui lòng chọn lại màu, size hoặc chất liệu.");
                } else {
                    toast.error(errorMessage || "Lỗi khi thêm vào giỏ hàng!");
                }
            } else {
                toast.error("Đã có lỗi xảy ra!");
            }
        } finally {
            setIsAdding(false);
        }
    };
    useEffect(() => {
        // Kiểm tra xem người dùng đã chọn đầy đủ các thuộc tính chưa
        if (!selectedColor || !selectedSize || !selectedMaterial) {
            // Nếu thiếu thông tin, không thực hiện gọi API
            return;
        }

        const delayDebounce = setTimeout(() => {
            const checkVariant = async () => {
                try {
                    const res = await axios.get("/api/cart/find", {
                        params: {
                            productId: product.productId,
                            color: selectedColor,
                            size: selectedSize,
                            material: selectedMaterial,
                        },
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    });

                    const variant = res.data;
                    if (variant && variant.stock > 0) {
                        setVariantAvailable(true);
                        setVariantPrice(variant.price);
                        setVariantStock(variant.stock); // Set stock value
                    } else {
                        setVariantAvailable(false);
                        toast.error("Không tìm thấy biến thể hoặc đã hết hàng.");
                    }
                } catch (error) {
                    setVariantAvailable(false);
                    toast.error("Không tìm thấy biến thể hoặc đã hết hàng.");
                }
            };
            checkVariant();
        }, 300); // Chờ 300ms trước khi gọi

        return () => clearTimeout(delayDebounce); // Xóa timeout nếu người dùng đổi lựa chọn trước khi timeout chạy
    }, [selectedColor, selectedSize, selectedMaterial]); // Theo dõi khi người dùng thay đổi lựa chọn

    const handleWishlist = async (productId: number) => {
        const accountId = getAccountIdFromToken();
        if (!accountId) {
            toast.error("Bạn cần đăng nhập để thêm vào danh sách yêu thích.");
            return;
        }

        try {
            const res = await axios.patch("/api/wishlists/toggle", {
                accountId,
                productId,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            });

            toast.success(res.data.message);

            // Toggle local state
            setWishlistProducts((prev) =>
                prev.includes(productId)
                    ? prev.filter((id) => id !== productId)
                    : [...prev, productId]
            );
        } catch (err) {
            toast.error("Thao tác thất bại!");
        }
    };

    useEffect(() => {
        const fetchWishlist = async () => {
            const accountId = getAccountIdFromToken();
            if (!accountId) return;

            try {
                const res = await axios.get(`/api/wishlists`, {
                    params: { accountId },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                const wishlistProductIds = res.data
                    .filter((item: any) => !item.isDeleted)
                    .map((item: any) => item.productId);

                setWishlistProducts(wishlistProductIds);
            } catch (err) {
                console.error("Lỗi khi tải wishlist:", err);
            }
        };

        fetchWishlist();
    }, []);

    return (
        <>
            <div
                className="border rounded-lg shadow-md w-64 bg-white overflow-hidden group relative hover:shadow-xl transition-transform transform"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div
                    className="absolute top-0 left-0 w-12 h-12 bg-white rounded-br-xl z-20 flex items-center justify-center cursor-pointer 
        transition-all duration-300 shadow-md hover:shadow-lg border border-gray-300"
                    onClick={() => handleWishlist(product.productId)}
                    title={wishlistProducts.includes(product.productId) ? "Bỏ yêu thích" : "Yêu thích"}
                >
                    <FaHeart className={` ${wishlistProducts.includes(product.productId)
                        ? "text-red-600 drop-shadow-md scale-110" : "text-gray-400"}
            transition-all duration-300 text-xl`} />
                </div>

                {/* Hình ảnh sản phẩm */}
                <div className="relative w-full h-60 overflow-hidden bg-gray-100">
                    <img
                        src={product.image[0]}
                        alt={product.productName}
                        className={`object-cover w-full h-full transition-all duration-500 ${isHovered ? "opacity-0" : "opacity-100"} absolute top-0 left-0`}
                    />
                    {product.image[1] && (
                        <img
                            src={product.image[1]}
                            alt="Ảnh phụ"
                            className={`object-cover w-full h-full transition-all duration-500 ${isHovered ? "opacity-100" : "opacity-0"} absolute top-0 left-0`}
                        />
                    )}

                    <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded animate-pulse z-10">
                        Hàng Mới
                    </div>

                    {/* Hover buttons */}
                    <div
                        className={`absolute bottom-4 left-0 w-full flex justify-center items-center gap-4 transition-all duration-300 z-10 ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                            }`}
                    >
                        <button onClick={handleAddToCart}
                            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-3 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-xl"
                            title="Thêm vào giỏ hàng"
                        >
                            <FaCartPlus size={20} />
                        </button>
                        <button
                            className="bg-gradient-to-r from-gray-500 to-gray-700 text-white p-3 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-xl"
                            title="Xem chi tiết"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <FaEye size={20} />
                        </button>
                    </div>
                </div>

                {/* Thông tin sản phẩm */}
                <div className="p-4 flex flex-col gap-2">
                    <h3
                        className="text-md font-semibold text-gray-800 cursor-pointer hover:text-blue-500 transition"
                        onClick={() => navigate(`/product/${product.productId}`)}
                    >
                        {product.productName}
                    </h3>
                    <p className="text-sm text-gray-500">Mẫu: {product.model}</p>
                    <p className="text-lg text-blue-600 font-bold">{formatPrice(product.price)}</p>

                    {/* Màu hiển thị */}
                    <div className="flex items-center gap-2">
                        {product.colorCodes.map((color, index) => (
                            <div
                                key={index}
                                style={{ backgroundColor: color }}
                                className={`w-5 h-5 rounded-full border-2 cursor-pointer ${selectedColor === color ? "border-black" : "border-gray-300"
                                    }`}
                                onClick={() => setSelectedColor(color)}
                            />
                        ))}
                    </div>

                    {/* Kích cỡ */}
                    <div className="flex flex-wrap gap-1">
                        {product.sizeNames.map((size) => (
                            <span
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`px-2 py-1 text-xs rounded border cursor-pointer ${selectedSize === size ? "border-black bg-gray-200" : "border-gray-300"
                                    }`}
                            >
                                {size}
                            </span>
                        ))}
                    </div>

                    {/* Chất liệu */}
                    <div className="flex flex-wrap gap-1">
                        {product.materialNames.map((material) => (
                            <span
                                key={material}
                                onClick={() => setSelectedMaterial(material)}
                                className={`px-2 py-1 text-xs rounded border cursor-pointer ${selectedMaterial === material ? "border-black bg-gray-200" : "border-gray-300"
                                    }`}
                            >
                                {material}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal chi tiết sản phẩm */}
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsModalOpen(false)}></div>
                <Dialog.Panel className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl z-10 relative">
                    <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-600 hover:text-red-600">
                        <FaTimes size={20} />
                    </button>

                    <div className="flex gap-6">
                        <img src={product.image[0]} alt={product.productName} className="w-1/2 object-cover rounded" />
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold">{product.productName}</h2>
                            <p className="text-lg text-blue-600 font-bold">{formatPrice(product.price)}</p>
                            <p className="text-sm text-gray-600 mt-2">Model: {product.model}</p>

                            <div className="mt-4">
                                <p className="font-semibold">Màu sắc:</p>
                                <div className="flex gap-2 mt-1">
                                    {product.colorCodes.map((color, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-6 h-6 rounded-full cursor-pointer border-2 ${selectedColor === color ? "border-black" : "border-gray-300"
                                                }`}
                                            style={{ backgroundColor: color }}
                                            onClick={() => setSelectedColor(color)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4">
                                <p className="font-semibold">Kích thước:</p>
                                <div className="flex gap-2 mt-1">
                                    {product.sizeNames.map((size) => (
                                        <span
                                            key={size}
                                            className={`px-2 py-1 border rounded cursor-pointer ${selectedSize === size ? "border-black bg-gray-200" : "border-gray-300"
                                                }`}
                                            onClick={() => setSelectedSize(size)}
                                        >
                                            {size}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4">
                                <p className="font-semibold">Chất liệu:</p>
                                <div className="flex gap-2 mt-1">
                                    {product.materialNames.map((m) => (
                                        <span
                                            key={m}
                                            className={`px-2 py-1 border rounded cursor-pointer ${selectedMaterial === m ? "border-black bg-gray-200" : "border-gray-300"
                                                }`}
                                            onClick={() => setSelectedMaterial(m)}
                                        >
                                            {m}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {variantAvailable === false && (
                                <p className="text-red-500 text-sm mt-2">Biến thể này hiện không tồn tại hoặc đã hết hàng.</p>
                            )}

                            {variantAvailable && (
                                <div className="flex justify-between items-center mt-2">
                                    {/* Số lượng */}
                                    <span className="text-sm font-semibold text-gray-800">
                                        Số lượng: {variantStock !== null ? variantStock : "Đang cập nhật"}
                                    </span>

                                    {/* Giá */}
                                    <p className="text-green-600 text-sm font-semibold">
                                        Giá: {variantPrice ? formatPrice(variantPrice) : "Đang cập nhật"}
                                    </p>
                                </div>
                            )}
                            {/* Số lượng và thêm giỏ hàng */}
                            <div className="mt-6 flex items-center gap-4">
                                <button className="bg-gray-300 px-3 py-1 rounded" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
                                <span>{quantity}</span>
                                <button className="bg-gray-300 px-3 py-1 rounded" onClick={() => setQuantity((q) => q + 1)}>+</button>
                                <button
                                    className="ml-4 bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 transition disabled:opacity-50"
                                    onClick={handleAddToCart}
                                    disabled={isAdding}
                                >
                                    <FaCartPlus />
                                    {isAdding ? "Đang thêm..." : "Thêm vào giỏ"}
                                </button>
                            </div>
                        </div>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </>
    );
};

export default ProductCard;
