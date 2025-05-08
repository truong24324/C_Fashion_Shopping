import React, { useEffect, useState } from "react";
import { FaTshirt } from "react-icons/fa";
import ProductCard from "../../Product/ProductCard";
import Loading from "src/components/common/Loading";
import { toast } from "react-hot-toast";
import axios from "axios";

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

const FashionPage: React.FC = () => {
  const [filters, setFilters] = useState({
    brand: "",
    category: "",
    color: "",
    size: "",
    material: "",
    keyword: "",
    sort: "name-asc",
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await axios.get("/api/views/filter", );
      setProducts(response.data);
    } catch (err) {
      console.error("Lỗi khi tải sản phẩm:", err);
      toast.error("Lỗi khi tải sản phẩm. Vui lòng thử lại sau.");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-full bg-gray-50">
      {/* Banner */}
      <div
        className="w-full h-72 sm:h-96 bg-cover bg-center rounded-t-lg shadow-lg"
        style={{
          backgroundImage:
            "url('https://file.hstatic.net/1000360022/file/thumb_-_1__1_.png')",
        }}
      >
        <div className="flex justify-center items-center h-full bg-black bg-opacity-50 rounded-t-lg">
          <h1 className="text-white text-3xl sm:text-5xl font-bold text-center">
            Welcome to Our Store
          </h1>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-white shadow-md rounded-md my-6 max-w-7xl mx-auto">
        <input
          type="text"
          name="keyword"
          value={filters.keyword}
          onChange={handleChange}
          placeholder="Tìm kiếm sản phẩm..."
          className="p-2 border rounded w-full"
        />
        <select name="brand" value={filters.brand} onChange={handleChange} className="p-2 border rounded w-full">
          <option value="">Thương hiệu</option>
          <option value="nike">Nike</option>
          <option value="adidas">Adidas</option>
        </select>
        <select name="category" value={filters.category} onChange={handleChange} className="p-2 border rounded w-full">
          <option value="">Loại sản phẩm</option>
          <option value="áo">Áo</option>
          <option value="quần">Quần</option>
        </select>
        <select name="color" value={filters.color} onChange={handleChange} className="p-2 border rounded w-full">
          <option value="">Màu sắc</option>
          <option value="red">Đỏ</option>
          <option value="blue">Xanh</option>
        </select>
        <select name="size" value={filters.size} onChange={handleChange} className="p-2 border rounded w-full">
          <option value="">Kích cỡ</option>
          <option value="S">S</option>
          <option value="M">M</option>
        </select>
        <select name="material" value={filters.material} onChange={handleChange} className="p-2 border rounded w-full">
          <option value="">Chất liệu</option>
          <option value="cotton">Cotton</option>
          <option value="polyester">Polyester</option>
        </select>
        <select name="sort" value={filters.sort} onChange={handleChange} className="p-2 border rounded w-full">
          <option value="name-asc">Sắp xếp: Tên (A-Z)</option>
          <option value="name-desc">Tên (Z-A)</option>
          <option value="price-asc">Giá tăng dần</option>
          <option value="price-desc">Giá giảm dần</option>
        </select>
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 py-8 max-w-7xl mx-auto">
        {loading ? (
          <Loading
            text="Đang tải sản phẩm..."
            color="yellow-500"
            size="6xl"
            icon={<FaTshirt className="text-yellow-500 text-6xl animate-pulse" />}
          />
        ) : error ? (
          <div className="col-span-full text-center text-red-500">Lỗi khi tải dữ liệu. Vui lòng thử lại.</div>
        ) : products.length === 0 ? (
          <div className="col-span-full text-center text-gray-600">Không tìm thấy sản phẩm phù hợp.</div>
        ) : (
          products.map((product) => (
            <div key={product.productId} className="flex justify-center">
              <ProductCard product={product} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FashionPage;
