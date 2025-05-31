import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../Layouts/Navbar";
import Footer from "../../Layouts/Footer";
import ProductImageGallery from "../../Product/ProductImageGallery";
import ProductInfo from "../../Product/ProductInfo";
import SizeSuggestionModal from "../../components/SizeSuggestionModal";
import toast from "react-hot-toast";
import axios from "axios";

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

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSizeModal, setShowSizeModal] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/views/${productId}`);
        setProduct(res.data.data);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "⚠️ Có lỗi xảy ra khi tải dữ liệu!");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <div className="text-center mt-10">Đang tải chi tiết sản phẩm...</div>;
  }

  if (!product) {
    return <div className="text-red-500 text-center text-xl mt-10">Không tìm thấy sản phẩm!</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen pt-4">
      <Navbar />
      <div className="container pt-20 mx-auto p-6">
        <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden">
          <ProductImageGallery
            images={
              Array.isArray(product.images) && product.images.length > 0
                ? product.images.map((img) => img.imageUrl)
                : ["/default.jpg"]
            }
            name={product.productName}
          />
          <ProductInfo product={product} onSizeSuggest={() => setShowSizeModal(true)} />
        </div>
      </div>

      {showSizeModal && <SizeSuggestionModal onClose={() => setShowSizeModal(false)} />}
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
