import React, { useEffect, useState } from "react";
import Footer from "../../Layouts/Footer";
import BrandsIntroduction from "../../components/BrandsIntroduction";
import ProductPanel from "../../components/Product/ProductPanel";
import News from "../../components/News";
import Navbar from "../../Layouts/Navbar";
import Slider from "../../Layouts/Slider";
import toast from "react-hot-toast";
import TopSellingProducts from "../../components/Product/TopSellingProducts";
import axios from "axios";
import DailyPointClaim from "../../components/DailyPointClaim";

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

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [retryVisible, setRetryVisible] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("asc");

  const fetchProducts = async () => {
    setLoading(true);
    const cacheKey = "cached_products_latest";
    const expiryKey = "cached_products_latest_expiry";
    const cacheExpiry = 20 * 60 * 1000; // 20 phút

    try {
      const now = Date.now();
      const cached = localStorage.getItem(cacheKey);
      const expiry = localStorage.getItem(expiryKey);

      if (cached && expiry && now < parseInt(expiry)) {
        const data = JSON.parse(cached);
        if (Array.isArray(data)) {
          setProducts(data);
          setRetryVisible(data.length === 0);
        } else {
          setProducts([]);
          setRetryVisible(true);
        }
        setLoading(false);
        return;
      }

      const res = await axios.get("/api/views/latest");

      if (res.data && Array.isArray(res.data.data)) {
        setProducts(res.data.data);
        setRetryVisible(res.data.data.length === 0);

        localStorage.setItem(cacheKey, JSON.stringify(res.data.data));
        localStorage.setItem(expiryKey, (now + cacheExpiry).toString());
      } else {
        setProducts([]);
        setRetryVisible(true);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi lấy sản phẩm. Vui lòng thử lại sau.");
      setRetryVisible(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    document.title = 'C WEB - Trang Chủ'
  }, []);

  const filteredProducts = products
    .filter((product) => {
      if (searchQuery) {
        return product.productName.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.productName.localeCompare(b.productName);
      } else {
        return b.productName.localeCompare(a.productName);
      }
    });

  return (
    <div>
      <header>
        <Navbar />
        <Slider />
      </header>
      <BrandsIntroduction />
      <TopSellingProducts />
      <DailyPointClaim />
      <ProductPanel
        products={filteredProducts}
        loading={loading}
        retryVisible={retryVisible}
        onRetry={fetchProducts}
        onSearch={setSearchQuery}
        onSort={setSortOrder}
      />
      <News />
      <Footer />
    </div>
  );
};

export default HomePage;
