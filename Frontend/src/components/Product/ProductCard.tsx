import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { FaCartPlus, FaEye, FaTimes, FaHeart } from "react-icons/fa";
import { Dialog } from "@headlessui/react";
import { data, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { Variant, DecodedToken } from "../CreateForm/Product/types";

export interface Product {
    productId: number;
    productName: string;
    model: string;
    productStatus: string;
    image: string[];
    imageTypes: string[];
    price: number;
    colorCodes: string[];
    sizeNames: string[];
    materialNames: string[];
}

const ProductCard: React.FC<{
    product: Product;
    wishlistProducts: number[];
    setWishlistProducts: React.Dispatch<React.SetStateAction<number[]>>;
}> = ({ product, wishlistProducts, setWishlistProducts }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
    const [variantAvailable, setVariantAvailable] = useState<boolean | null>(null);
    const [variantPrice, setVariantPrice] = useState<number | null>(null);
    const [variantStock, setVariantStock] = useState<number | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [variantList, setVariantList] = useState<Variant[]>([]);
    const navigate = useNavigate();

    const filteredColors = useMemo(() => {
        return [...new Set(
            variantList
                .filter(v =>
                    (!selectedSize || v.sizeName === selectedSize) &&
                    (!selectedMaterial || v.materialName === selectedMaterial)
                )
                .map(v => v.colorCode)
        )];
    }, [variantList, selectedSize, selectedMaterial]);

    const filteredSizes = useMemo(() => {
        return [...new Set(
            variantList
                .filter(v =>
                    (!selectedColor || v.colorCode === selectedColor) &&
                    (!selectedMaterial || v.materialName === selectedMaterial)
                )
                .map(v => v.sizeName)
        )];
    }, [variantList, selectedColor, selectedMaterial]);

    const filteredMaterials = useMemo(() => {
        return [...new Set(
            variantList
                .filter(v =>
                    (!selectedColor || v.colorCode === selectedColor) &&
                    (!selectedSize || v.sizeName === selectedSize)
                )
                .map(v => v.materialName)
        )];
    }, [variantList, selectedColor, selectedSize]);

    useEffect(() => {
        const cachedData = localStorage.getItem('cached_products_latest');

        if (cachedData) {
            const products = JSON.parse(cachedData);

            const productVariants = products.find((p: Product) => p.productId === product.productId)?.variants || [];
            setVariantList(productVariants);
        }
    }, [product.productId]);

    useEffect(() => {
        if (selectedColor && selectedSize && selectedMaterial) {
            const matchedVariant = variantList.find(
                v =>
                    v.colorCode === selectedColor &&
                    v.sizeName === selectedSize &&
                    v.materialName === selectedMaterial
            );

            if (matchedVariant) {
                setVariantAvailable(true);
                setVariantStock(matchedVariant.stock);
                setVariantPrice(matchedVariant.price);
            } else {
                setVariantAvailable(false);
                setVariantStock(null);
                setVariantPrice(null);
            }
        } else {
            setVariantAvailable(null);
            setVariantStock(null);
            setVariantPrice(null);
        }
    }, [selectedColor, selectedSize, selectedMaterial, variantList]);

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

    const WISHLIST_CACHE_KEY = "wishlist_cache";
    const WISHLIST_CACHE_DURATION = 5 * 60 * 1000; // 5 phút

    const getCachedWishlist = () => {
        const cached = localStorage.getItem(WISHLIST_CACHE_KEY);
        if (!cached) return null;

        const parsed = JSON.parse(cached);
        const isExpired = Date.now() - parsed.timestamp > WISHLIST_CACHE_DURATION;
        return isExpired ? null : parsed.data;
    };

    const setCachedWishlist = (data: number[]) => {
        localStorage.setItem(WISHLIST_CACHE_KEY, JSON.stringify({
            data,
            timestamp: Date.now()
        }));
    };

    const handleWishlist = async (productId: number) => {
        setIsAdding(true);
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

            setWishlistProducts((prev) => {
                const updated = prev.includes(productId)
                    ? prev.filter((id) => id !== productId)
                    : [...prev, productId];

                setCachedWishlist(updated); // Cập nhật cache
                return updated;
            });

        } catch (err: any) {
            toast.error(err.response?.data?.message || "Thao tác thất bại!");
        } finally {
            setIsAdding(false);
        }
    };

    useEffect(() => {
        const fetchWishlist = async () => {
            const accountId = getAccountIdFromToken();
            if (!accountId) return;

            const cached = getCachedWishlist();
            if (cached) {
                setWishlistProducts(cached);
                return;
            }

            try {
                const res = await axios.get(`/api/wishlists`, {
                    params: { accountId },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                const wishlistProductIds = res.data.data
                    .filter((item: any) => !item.deleted)
                    .map((item: any) => item.productId);

                setWishlistProducts(wishlistProductIds);
                setCachedWishlist(wishlistProductIds);
            } catch (err: any) {
                toast.error(err.response?.data?.message || "Lỗi khi tải danh sách yêu thích!");
            } finally {
                setIsAdding(false);
            }
        };

        fetchWishlist();
    }, []);

    const getColorForStatus = (status?: string): string => {
        const colorPalette = [
            '#2b8a3e', '#1c7ed6', '#6741d9', '#e67700', '#c92a2a',
            '#0ca678', '#6f42c1', '#495057', '#f59f00', '#12b886',
        ];

        if (!status || typeof status !== 'string') {
            return '#6c757d'; // fallback color (gray)
        }

        let hash = 0;
        for (let i = 0; i < status.length; i++) {
            hash = status.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % colorPalette.length;
        return colorPalette[index];
    };

    return (
        <>
            <div
                className="border rounded-lg shadow-md w-64 bg-white overflow-hidden group relative hover:shadow-xl transition-transform transform"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div
                    className={`absolute top-0 left-0 w-12 h-12 bg-white rounded-br-xl z-20 flex items-center justify-center cursor-pointer
        transition-all duration-300 shadow-md hover:shadow-lg border border-gray-300`}
                    onClick={() => !isAdding && handleWishlist(product.productId)}
                    title={wishlistProducts.includes(product.productId) ? "Bỏ yêu thích" : "Yêu thích"}
                >
                    {isAdding ? (
                        <svg className="animate-spin h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                    ) : (
                        <FaHeart className={` ${wishlistProducts.includes(product.productId)
                            ? "text-red-600 drop-shadow-md scale-110" : "text-gray-400"}
                transition-all duration-300 text-xl`} />
                    )}
                </div>

                <div className="relative w-full h-60 overflow-hidden bg-gray-100">
                    {product.image.length > 0 && (
                        <img
                            src={product.image[0]}
                            alt={product.productName}
                            onClick={() => navigate(`/product/${product.productName}`)}
                            className={`object-cover w-full h-full transition-all duration-500 ${isHovered && product.image.length > 1 ? "opacity-0" : "opacity-100"
                                } absolute top-0 left-0`}
                        />
                    )}

                    {product.image.length > 1 && (
                        <img
                            src={product.image[1]}
                            alt="Ảnh phụ"
                            onClick={() => navigate(`/product/${product.productName}`)}
                            className={`object-cover w-full h-full transition-all duration-500 ${isHovered ? "opacity-100" : "opacity-0"
                                } absolute top-0 left-0`}
                        />
                    )}

                    {product?.productStatus && (
                        <div
                            className="absolute top-2 right-2 text-white text-xs font-semibold px-2 py-1 rounded z-10 shadow-md"
                            style={{ backgroundColor: getColorForStatus(product.productStatus) }}
                        >
                            {product.productStatus}
                        </div>
                    )}

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

                <div className="p-4 flex flex-col gap-2">
                    <h3
                        className="text-md font-semibold text-gray-800 cursor-pointer hover:text-blue-500 transition"
                        onClick={() => navigate(`/product/${product.productName}`)}
                    >
                        {product.productName}
                    </h3>
                    <p className="text-sm text-gray-500">Mẫu: {product.model}</p>
                    <p className="text-lg text-blue-600 font-bold">{formatPrice(product.price)}</p>

                    <div className="flex items-center gap-2">
                        {filteredColors.map((color, index) => (
                            <div
                                key={index}
                                style={{ backgroundColor: color }}
                                className={`w-5 h-5 rounded-full border-2 cursor-pointer ${selectedColor === color ? "border-black" : "border-gray-300"}`}
                                onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                            />
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-1">
                        {filteredSizes.map((size) => (
                            <span
                                key={size}
                                className={`px-2 py-1 text-xs rounded border cursor-pointer ${selectedSize === size ? "border-black bg-gray-200" : "border-gray-300"}`}
                                onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                            >
                                {size}
                            </span>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-1">
                        {filteredMaterials.map((material) => (
                            <span
                                key={material}
                                className={`px-2 py-1 text-xs rounded border cursor-pointer ${selectedMaterial === material ? "border-black bg-gray-200" : "border-gray-300"}`}
                                onClick={() => setSelectedMaterial(selectedMaterial === material ? null : material)}
                            >
                                {material}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsModalOpen(false)}></div>
                <Dialog.Panel className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl z-10 relative">
                    <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-600 hover:text-red-600">
                        <FaTimes size={20} />
                    </button>

                    <div className="flex gap-6">
                        <img src={`/${product.image[0]}`} alt={product.productName} className="w-1/2 object-cover rounded" />
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold">{product.productName}</h2>
                            <p className="text-lg text-blue-600 font-bold">{formatPrice(product.price)}</p>
                            <p className="text-sm text-gray-600 mt-2">Mẫu: {product.model}</p>

                            <div className="flex items-center gap-2 mt-2">
                                {filteredColors.map((color, index) => (
                                    <div
                                        key={index}
                                        style={{ backgroundColor: color }}
                                        className={`w-5 h-5 rounded-full border-2 cursor-pointer ${selectedColor === color ? "border-black" : "border-gray-300"}`}
                                        onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                                    />
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-1 mt-2">
                                {filteredSizes.map((size) => (
                                    <span
                                        key={size}
                                        className={`px-2 py-1 text-xs rounded border cursor-pointer ${selectedSize === size ? "border-black bg-gray-200" : "border-gray-300"}`}
                                        onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                                    >
                                        {size}
                                    </span>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-1 mt-2">
                                {filteredMaterials.map((material) => (
                                    <span
                                        key={material}
                                        className={`px-2 py-1 text-xs rounded border cursor-pointer ${selectedMaterial === material ? "border-black bg-gray-200" : "border-gray-300"}`}
                                        onClick={() => setSelectedMaterial(selectedMaterial === material ? null : material)}
                                    >
                                        {material}
                                    </span>
                                ))}
                            </div>

                            {variantAvailable === false && (
                                <p className="text-red-500 text-sm mt-2">Biến thể này hiện không tồn tại hoặc đã hết hàng.</p>
                            )}

                            {variantAvailable === true && (
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-sm font-semibold text-gray-800">
                                        Số lượng: {variantStock != null ? variantStock : "Đang cập nhật"}
                                    </span>
                                    <p className="text-green-600 text-sm font-semibold">
                                        Giá: {variantPrice != null ? formatPrice(variantPrice) : "Đang cập nhật"}
                                    </p>
                                </div>
                            )}

                            <div className="mt-6 flex items-center gap-4">
                                <button className="bg-gray-300 px-3 py-1 rounded" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
                                <span>{quantity}</span>
                                <button className="bg-gray-300 px-3 py-1 rounded" onClick={() => setQuantity((q) => q + 1)}>+</button>
                                <button
                                    className="ml-4 bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 transition disabled:opacity-50"
                                    onClick={handleAddToCart}
                                    disabled={variantAvailable !== true}
                                >
                                    <FaCartPlus />
                                    Thêm vào giỏ
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
