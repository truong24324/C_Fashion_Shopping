import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import Loading from "../components/common/Loading";
import {toast} from "react-hot-toast";

interface VariantSummary {
  colorCode: string;
  sizeName: string;
  materialName: string;
  price: number;
  stock: number;
}

interface SpecialProduct {
  productId: number;
  productName: string;
  model: string;
  image: string[];
  imageTypes: string[];
  price: number;
  colorCodes: string[];
  sizeNames: string[];
  materialNames: string[];
  variants: VariantSummary[];
}

const TopSellingProducts: React.FC = () => {
  const [products, setProducts] = useState<SpecialProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<SpecialProduct[]>("/api/views/top-selling")
      .then((res) => setProducts(res.data))
      .catch((err) => toast.error("Lỗi khi tải top sản phẩm:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full bg-gradient-to-br from-yellow-50 to-white min-h-screen">
      {/* Header */}
      <div className="text-center py-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-yellow-600 drop-shadow-md animate-fade-in">
          🌟 Top 10 Sản Phẩm Đặc Sắc Nhất
        </h1>
        <p className="mt-2 text-lg text-gray-500">
          Những thiết kế nổi bật, phong cách và bán chạy nhất của chúng tôi
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loading
            text="Đang tải sản phẩm đặc sắc..."
            color="yellow-500"
            size="5xl"
            icon={<FaStar className="text-yellow-500 text-6xl animate-spin" />}
          />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 pb-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.productId}
              className="relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              {/* Badge */}
              <div className="absolute top-2 left-2 bg-yellow-400 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg z-10">
                Đặc sắc
              </div>

              {/* Image */}
              <img
                src={product.image[0]}
                alt={product.productName}
                className="w-full h-60 object-cover"
              />

              {/* Info */}
              <div className="p-5 space-y-2">
                <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
                  {product.productName}
                </h2>
                <p className="text-sm text-gray-500">{product.model}</p>
                <div className="text-xl font-bold text-yellow-600">
                  {product.price.toLocaleString("vi-VN")}₫
                </div>

                <div className="flex space-x-1">
                  {product.colorCodes.map((color) => (
                    <div
                      key={color}
                      className="w-5 h-5 rounded-full border border-gray-300"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>

                <div className="text-xs text-gray-400 italic">
                  {product.sizeNames.join(", ")}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopSellingProducts;
