import React, { useState } from "react";
import Loading from "../components/common/Loading";
import { FaTshirt } from "react-icons/fa";
import ProductCard from "./ProductCard";

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
}

interface ProductPanelProps {
  products: Product[];
  loading?: boolean;
  retryVisible?: boolean;
  onRetry?: () => void;
  onSearch?: (query: string) => void;
  onSort?: (sortOrder: string) => void;
}

const ProductPanel: React.FC<ProductPanelProps> = ({
  products,
  loading = false,
  retryVisible = false,
  onRetry,
  onSearch,
  onSort,
}) => {
  const [wishlistProducts, setWishlistProducts] = useState<number[]>([]);
  return (
    <div className="w-full bg-gray-50">
      {/* Banner */}
      <div
        className="w-full h-72 sm:h-96 bg-cover bg-center rounded-t-lg shadow-lg"
        style={{
          backgroundImage:
            "url('/images/banner6.webp')",
        }}
      >
        <div className="flex justify-center items-center h-full bg-black bg-opacity-50 rounded-t-lg">
          <h1 className="text-white text-3xl sm:text-5xl font-bold text-center">
            C WEB - Thế Giới Thời Trang Nam Nữ
          </h1>
        </div>
      </div>

      {/* Filter/Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-6 space-y-4 sm:space-y-0 sm:space-x-4 bg-white shadow-md rounded-md my-6">
        <div className="flex space-x-4">
          <select
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => onSort?.(e.target.value)}
          >
            <option value="asc">Sort by Name (A-Z)</option>
            <option value="desc">Sort by Name (Z-A)</option>
          </select>

          <div className="flex items-center border border-gray-300 rounded-md p-2 w-full sm:w-64">
            <input
              type="text"
              className="ml-2 outline-none w-full"
              placeholder="Search products"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="flex justify-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-auto max-w-7xl px-4 py-8">
        {loading ? (
          <Loading
            text="Đang tải sản phẩm..."
            color="yellow-500"
            size="6xl"
            icon={<FaTshirt className="text-yellow-500 text-6xl animate-pulse" />}
          />
        ) : products.length === 0 ? (
          <div className="col-span-full text-center">
            <p className="text-lg text-gray-600 mb-4">Hiện tại chưa có sản phẩm nào.</p>
            {retryVisible && onRetry && (
              <button
                onClick={onRetry}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Thử lại
              </button>
            )}
          </div>
        ) : (
          products.map((product) => (
            <div key={product.productId} className="flex justify-center">
              <ProductCard
                product={product}
                wishlistProducts={wishlistProducts}
                setWishlistProducts={setWishlistProducts}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductPanel;
