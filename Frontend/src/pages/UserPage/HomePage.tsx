import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../../Layouts/Footer";
import BrandsIntroduction from "../../components/BrandsIntroduction";
import ProductPanel from "../../Product/ProductPanel";
import News from "../../components/News";
import Navbar from "../../Layouts/Navbar";
import Slider from "../../Layouts/Slider";
import toast from "react-hot-toast";

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

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [retryVisible, setRetryVisible] = useState<boolean>(false);

  const fetchProducts = async () => {
    setLoading(true);
    const cacheKey = "cached_products_latest";
    const expiryKey = "cached_products_latest_expiry";
    const cacheExpiry = 20 * 60 * 1000; // 10 phút
  
    try {
      const now = Date.now();
      const cached = localStorage.getItem(cacheKey);
      const expiry = localStorage.getItem(expiryKey);
  
      // Nếu có cache và chưa hết hạn
      if (cached && expiry && now < parseInt(expiry)) {
        const data = JSON.parse(cached);
        setProducts(data);
        setRetryVisible(data.length === 0);
        setLoading(false);
        return;
      }
  
      // Nếu không có cache hoặc cache đã hết hạn → gọi API
      const res = await axios.get("/api/views/latest");
      const data = res.data;
      setProducts(data);
      setRetryVisible(data.length === 0);
  
      // Lưu vào cache
      localStorage.setItem(cacheKey, JSON.stringify(data));
      localStorage.setItem(expiryKey, (now + cacheExpiry).toString());
    } catch (error: any) {
      console.error("Lỗi khi lấy sản phẩm:", error);
      toast.error(error.response?.data?.message || "Lỗi khi lấy sản phẩm. Vui lòng thử lại sau.");
      setRetryVisible(true);
    } finally {
      setLoading(false);
    }
  };  

  useEffect(() => {
    fetchProducts(); // Chỉ gọi 1 lần khi mount
  }, []);

  return (
    <div>
      <header>
        <Navbar />
        <Slider />
      </header>
      <BrandsIntroduction />
      <ProductPanel
        products={products}
        loading={loading}
        retryVisible={retryVisible}
        onRetry={fetchProducts}
      />
      <News />
      <Footer />
    </div>
  );
};

export default HomePage;
