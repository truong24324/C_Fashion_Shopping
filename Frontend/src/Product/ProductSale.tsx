import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { DecodedToken } from "../components/CreateForm/Product/types";

interface Variant {
  variantId: number;
  colorName: string;
  colorCode: string;
  materialName: string;
  sizeName: string;
  stock: number;
  price: number;
}

interface Product {
  productId: number;
  productName: string;
  price: number | null;
  image: string;
  imageTypes: string[];
  colorCodes: string[];
  sizeNames: string[];
  materialNames: string[];
  variants: Variant[];
}

interface ProductSaleProps {
  product: Product;
  onNext?: () => void;
  onPrev?: () => void;
  onCartUpdated?: () => void; // 👈 mới thêm
}

const ProductSale: React.FC<ProductSaleProps> = ({ product, onNext, onPrev, onCartUpdated }) => {
  const [selectedColor, setSelectedColor] = useState<string>(product.colorCodes?.[0] || "");
  const [selectedSize, setSelectedSize] = useState<string>(product.sizeNames?.[0] || "");
  const [selectedMaterial, setSelectedMaterial] = useState<string>(product.materialNames?.[0] || "");

  const selectedVariant = product.variants.find(
    (variant) =>
      variant.colorCode === selectedColor &&
      variant.sizeName === selectedSize &&
      variant.materialName === selectedMaterial
  );

  const getAccountIdFromToken = (): number | null => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      return parseInt(decoded.accountId);
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
      return null;
    }
  };

  const handleAddToCart = async () => {
    const accountId = getAccountIdFromToken();

    if (!accountId) {
      toast.error("Bạn cần đăng nhập để thêm vào giỏ hàng.");
      return;
    }

    if (!selectedVariant) {
      toast.error("Biến thể sản phẩm không hợp lệ.");
      return;
    }

    try {
      const response = await axios.post(
        "/api/cart/add",
        {
          accountId,
          variantId: selectedVariant.variantId,
          quantity: 1,
          price: selectedVariant.price,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message || "Sản phẩm đã được thêm vào giỏ hàng!");
      onCartUpdated?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi thêm sản phẩm vào giỏ hàng!");
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h2 className="text-xl font-bold">{product.productName}</h2>
        <div className="flex space-x-2">
          <button onClick={onPrev} className="bg-gray-300 px-4 py-2 rounded">&#10094;</button>
          <button onClick={onNext} className="bg-gray-300 px-4 py-2 rounded">&#10095;</button>
        </div>
      </div>

      {/* Body */}
      <div className="flex">
        {/* Image */}
        <div className="w-1/5 flex justify-center items-center">
          <img src={product.image} alt={product.productName} className="w-20 h-20 object-cover rounded" />
        </div>

        {/* Info */}
        <div className="w-4/5 pl-4">
          <p className="text-left font-semibold text-red-500">
            Giá: {selectedVariant ? selectedVariant.price.toLocaleString("vi-VN") + "₫" : "Chọn biến thể"}
          </p>

          {/* Màu sắc */}
          <div className="mt-3 text-left">
            <p className="text-sm font-medium">Màu sắc:</p>
            <div className="flex space-x-2 mt-1">
              {product.colorCodes.map((color, index) => (
                <button
                  key={index}
                  className={`w-6 h-6 border rounded-full ${selectedColor === color ? "border-black" : ""}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          {/* Kích thước */}
          <div className="mt-3 text-left">
            <p className="text-sm font-medium">Size:</p>
            <div className="flex space-x-2 mt-1">
              {product.sizeNames.map((size, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 border rounded ${
                    selectedSize === size ? "bg-black text-white" : "bg-gray-200"
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Chất liệu */}
          <div className="mt-3 text-left">
            <p className="text-sm font-medium">Chất liệu:</p>
            <div className="flex space-x-2 mt-1">
              {product.materialNames.map((material, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 border rounded ${
                    selectedMaterial === material ? "bg-black text-white" : "bg-gray-200"
                  }`}
                  onClick={() => setSelectedMaterial(material)}
                >
                  {material}
                </button>
              ))}
            </div>
          </div>

          {/* Nút Mua ngay */}
          <button
            disabled={!selectedVariant}
            onClick={handleAddToCart}
            className={`block w-full mt-4 text-white text-center py-2 rounded font-semibold ${
              selectedVariant ? "bg-yellow-500 hover:bg-yellow-600" : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSale;
