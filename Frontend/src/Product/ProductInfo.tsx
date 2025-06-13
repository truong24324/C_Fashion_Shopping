import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FaCartPlus, FaShoppingBag, FaRulerVertical } from "react-icons/fa";
import PromotionCard from "../components/PromotionCard";
import axios from "axios";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "../components/CreateForm/Product/types";

interface Variant {
  variantId: number;
  colorName: string;
  colorCode: string;
  sizeName: string;
  materialName: string;
  stock: number;
  price: number;
}

interface Image {
  imageUrl: string;
  imageType: string;
}

interface ProductDetail {
  productName: string;
  brandName: string;
  categoryName: string;
  description: string | null;
  barcode: string;
  model: string;
  warrantyPeriod: string;
  supplierName: string;
  colorNames: string[];
  sizeNames: string[];
  materialNames: string[];
  images: Image[];
  variants: Variant[];
}

interface Props {
  product: ProductDetail;
  onSizeSuggest: () => void;
}

const ProductInfo: React.FC<Props> = ({ product, onSizeSuggest }) => {
  const colors = useMemo(
    () => Array.from(new Set(product?.variants?.map((v) => v.colorName) || [])),
    [product?.variants]
  );

  const sizes = useMemo(
    () => Array.from(new Set(product?.variants?.map((v) => v.sizeName) || [])),
    [product?.variants]
  );

  const materials = useMemo(
    () => Array.from(new Set(product?.variants?.map((v) => v.materialName) || [])),
    [product?.variants]
  );
  const [selectedColor, setSelectedColor] = useState(colors[0] || "");
  const [selectedSize, setSelectedSize] = useState(sizes[0] || "");
  const [selectedMaterial, setSelectedMaterial] = useState(materials[0] || "");
  const [quantity, setQuantity] = useState(1);

  const matchedVariant = useMemo(() => {
    return product?.variants?.find(
      (v) =>
        v.colorName === selectedColor &&
        v.sizeName === selectedSize &&
        v.materialName === selectedMaterial
    );
  }, [selectedColor, selectedSize, selectedMaterial, product?.variants]);

  const lowestPrice = useMemo(() => {
    return Math.min(...(product?.variants?.map((v) => v.price) || [0]));
  }, [product?.variants]);

  const getAccountIdFromToken = (): number | null => {
    const token = localStorage.getItem("token"); // hoặc từ cookie/context

    if (!token) return null;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      return parseInt(decoded.accountId);
    } catch (error: any) {
      console.error("Lỗi giải mã token:", error);
      toast.error(error.response?.data?.message || "Lỗi giải mã token. Vui lòng đăng nhập lại.");
      return null;
    }
  };

  const handleAddToCart = async () => {
    const accountId = getAccountIdFromToken();
    if (!accountId) {
      toast.error("Bạn cần đăng nhập để thêm vào giỏ hàng.");
      return;
    }

    if (matchedVariant) {
      try {
        const response = await axios.post(
          "/api/cart/add",
          {
            accountId: accountId,
            variantId: matchedVariant.variantId,
            quantity,
            price: matchedVariant.price,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success(response.data.message || "Sản phẩm đã được thêm vào giỏ hàng!");
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Lỗi khi thêm sản phẩm vào giỏ hàng!");
      }
    } else {
      toast.error("Biến thể sản phẩm không hợp lệ.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full md:w-1/2 p-6 text-left"
    >
      <h2 className="text-4xl font-bold text-gray-900">{product.productName}</h2>
      <p className="text-sm text-gray-600 mt-1">
        <strong>Thương hiệu:</strong> {product.brandName} | <strong>Danh mục:</strong> {product.categoryName}
      </p>
      <p className="text-sm text-gray-600 mt-1">
        <strong>Mẫu:</strong> {product.model} | <strong>Bảo hành:</strong> {product.warrantyPeriod}
      </p>
      <p className="text-sm text-gray-600 mt-1">
        <strong>Nhà cung cấp:</strong> {product.supplierName} | <strong>Mã vạch:</strong> {product.barcode}
      </p>
      <p className="text-gray-500 mt-3">{product.description || "Không có mô tả."}</p>

      <p className="text-red-500 font-bold text-3xl mt-4">
        Giá từ: {lowestPrice.toLocaleString()} VNĐ
      </p>

      <div className="mt-6">
        <p className="font-semibold text-lg">Màu sắc:</p>
        <div className="flex gap-3 mt-2">
          {colors.map((color) => (
            <motion.div
              key={color}
              whileHover={{ scale: 1.1 }}
              className={`px-4 py-2 rounded-lg border cursor-pointer transition ${selectedColor === color
                ? "border-gray-900 bg-gray-200"
                : "border-gray-300"
                }`}
              onClick={() => setSelectedColor(color)}
            >
              {color}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="font-semibold text-lg">Kích thước:</p>
        <div className="flex gap-3 mt-2">
          {sizes.map((size) => (
            <motion.button
              key={size}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2 border rounded-lg text-lg font-semibold transition ${selectedSize === size
                ? "border-black bg-gray-200"
                : "border-gray-400"
                }`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="font-semibold text-lg">Chất liệu:</p>
        <div className="flex gap-3 mt-2">
          {materials.map((material) => (
            <motion.div
              key={material}
              whileHover={{ scale: 1.1 }}
              className={`px-4 py-2 rounded-lg border cursor-pointer transition ${selectedMaterial === material
                ? "border-gray-900 bg-gray-200"
                : "border-gray-300"
                }`}
              onClick={() => setSelectedMaterial(material)}
            >
              {material}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {matchedVariant ? (
          <p className="text-green-600 font-semibold">
            Có hàng: {matchedVariant.stock} | Giá:{" "}
            {matchedVariant.price.toLocaleString()}₫
          </p>
        ) : (
          <p className="text-red-600 font-semibold">
            Không tìm thấy biến thể phù hợp với lựa chọn của bạn.
          </p>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-5 px-5 py-2 bg-gray-800 text-white font-semibold rounded-lg flex items-center gap-2 hover:bg-gray-900 transition"
        onClick={onSizeSuggest}
      >
        <FaRulerVertical size={18} /> Gợi ý chọn size
      </motion.button>

      <div className="pt-5">
        <PromotionCard />
      </div>

      {/* Số lượng */}
      <div className="mt-8 flex items-center gap-6">
        <div className="flex items-center border border-gray-400 rounded-lg">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="px-4 py-2 bg-gray-300 text-lg font-bold hover:bg-gray-400 transition"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            -
          </motion.button>
          <span className="px-6 py-2 text-xl font-semibold">{quantity}</span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="px-4 py-2 bg-gray-300 text-lg font-bold hover:bg-gray-400 transition"
            onClick={() => setQuantity((q) => q + 1)}
          >
            +
          </motion.button>
        </div>
      </div>

      {/* Nút hành động */}
      <div className="mt-6 flex gap-4">
        <motion.button
          onClick={handleAddToCart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!matchedVariant}
          className={`flex-1 px-6 py-3 text-white text-lg font-semibold rounded-lg flex items-center gap-3 transition ${matchedVariant
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          <FaCartPlus size={20} /> Thêm vào giỏ hàng
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!matchedVariant}
          className={`flex-1 px-6 py-3 text-white text-lg font-semibold rounded-lg flex items-center gap-3 transition ${matchedVariant
            ? "bg-red-600 hover:bg-red-700"
            : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          <FaShoppingBag size={20} /> Mua ngay
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductInfo;
