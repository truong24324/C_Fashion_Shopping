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
    try {
      const res = await axios.get("/api/views/latest");
      const data = res.data;
      setProducts(data);

      if (data.length > 0) {
        setRetryVisible(false); // Ẩn nút thử lại nếu có dữ liệu
      } else {
        setRetryVisible(true); // Hiện nút nếu không có dữ liệu
      }
    } catch (error: any) {
      console.error("Lỗi khi lấy sản phẩm:", error);
      toast.error(error.response?.data?.message || "Lỗi khi lấy sản phẩm. Vui lòng thử lại sau.");
      setRetryVisible(true); // Hiện nút thử lại khi lỗi
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
