import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import Loading from "../components/common/Loading";
import { toast } from "react-hot-toast";
import ProductCard from "./ProductCard";
import { VariantSummary } from "../components/CreateForm/Product/types";

interface Product {
  productId: number;
  productName: string;
  productStatus: string;
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlistProducts, setWishlistProducts] = useState<number[]>([]);

  useEffect(() => {
    axios
      .get("/api/views/top-selling")
      .then((res) => {
        // Giả sử API trả về { data: [...] }
        if (res.data && Array.isArray(res.data.data)) {
          setProducts(res.data.data);
        } else if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          setProducts([]);
          toast.error("Dữ liệu sản phẩm không hợp lệ");
        }
      })
      .catch((err) => toast.error("Lỗi khi tải top sản phẩm: " + err.message))
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
          {products.map((product: Product) => (
            <div key={product.productId} className="flex justify-center">
              <ProductCard
                product={product}
                wishlistProducts={wishlistProducts}
                setWishlistProducts={setWishlistProducts}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopSellingProducts;
