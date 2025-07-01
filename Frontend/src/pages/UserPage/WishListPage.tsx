import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Layouts/Navbar";
import Footer from "../../Layouts/Footer";
import { motion } from "framer-motion";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import Loading from "../../components/common/Loading";
import axios from "axios";
import { DecodedToken, Product } from "../../components/CreateForm/Product/types";
import MessageAlert from "../../components/common/MessageAlert";

const WishlistPage: React.FC = () => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Default");
  const [brokenItems, setBrokenItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await axios.get("/api/wishlists/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setWishlist(res.data);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Không thể tải danh sách yêu thích.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

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

  const removeFromWishlist = async (productId: number) => {
    const accountId = getAccountIdFromToken();
    if (!accountId) {
      toast.error("Bạn cần đăng nhập để thao tác.");
      return;
    }

    try {
      const res = await axios.patch(
        "/api/wishlists/toggle",
        { accountId, productId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(res.data.message);

      setWishlist((prev) =>
        wishlistIds.includes(productId)
          ? prev.filter((item) => item.productId !== productId)
          : [...prev, { ...res.data.product }]
      );

      setWishlistIds((prev) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId]
      );
    } catch (err) {
      toast.error("Thao tác thất bại!");
    }
  };

  const addToCart = async (product: Product) => {
    try {
      await axios.post(
        `/api/wishlists/add-to-cart/${product.productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(`${product.productName} đã được thêm vào giỏ hàng!`);
    } catch (error) {
      toast.error("Thêm vào giỏ hàng thất bại.");
    }
  };

  const filteredWishlist = wishlist.filter(
    (product) => filter === "All" || product.category === filter
  );

  const sortedWishlist = [...filteredWishlist].sort((a, b) => {
    if (sort === "Price Low-High") return (a.minPrice || 0) - (b.minPrice || 0);
    if (sort === "Price High-Low") return (b.minPrice || 0) - (a.minPrice || 0);
    return 0;
  });

  return (
    <div className="min-h-screen pt-4 bg-gradient-to-br from-gray-100 to-white">
      <Navbar />
      <Toaster position="top-right" reverseOrder={false} />
      <div className="container mx-auto p-6 pt-20">
        <h2 className="text-3xl font-bold text-center mb-6">🧡 Danh Sách Yêu Thích</h2>

        {/* Loading */}
        {loading && <Loading
          text="Đang tải danh sách yêu thích..."
          color="yellow-500"
          size="6xl"
          icon={<FaHeart className="text-yellow-500 text-6xl animate-pulse" />} // Icon đại diện người dùng
        />}

        {/* Bộ lọc & sắp xếp */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <select
              className="border border-gray-300 rounded px-4 py-2 bg-white shadow-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">Tất cả danh mục</option>
              <option value="Áo">Áo</option>
              <option value="Quần">Quần</option>
              <option value="Giày">Giày</option>
            </select>
            <select
              className="border border-gray-300 rounded px-4 py-2 bg-white shadow-sm"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="Default">Mặc định</option>
              <option value="Price Low-High">Giá tăng dần</option>
              <option value="Price High-Low">Giá giảm dần</option>
            </select>
          </div>
        </div>

        {/* Danh sách yêu thích */}
        {wishlist.length === 0 && !loading ? (
          <MessageAlert
            icon="ℹ️"
            title="Thông tin"
            message="Bạn có thể theo dõi sản phẩm để nhận danh sách yêu thích sản phẩm bạn."
            className="mt-4"
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedWishlist.map((product) => (
              <motion.div
                key={product.productId}
                className="bg-white shadow-xl hover:shadow-2xl rounded-2xl p-4 flex flex-col items-center relative overflow-hidden transition-all duration-300"
                initial={{ opacity: 1 }}
                animate={brokenItems.includes(product.productId) ? { opacity: 0 } : {}}
                whileHover={{ scale: 1.03 }}
              >
                <Link to={`/product/${product.productId}`} className="relative w-full h-56 mb-4 rounded-lg overflow-hidden">
                  <img
                    src={product.mainImageUrl}
                    alt={product.productName}
                    className="w-full h-full object-cover absolute transition-opacity duration-300 opacity-100 hover:opacity-0"
                  />
                  {product.subImageUrl && (
                    <img
                      src={product.subImageUrl}
                      alt="Hover"
                      className="w-full h-full object-cover absolute transition-opacity duration-300 opacity-0 hover:opacity-100"
                    />
                  )}
                </Link>

                <h3 className="text-lg font-semibold text-center">{product.productName}</h3>
                <p className="text-gray-600 mb-2">
                  {typeof product.minPrice === "number"
                    ? `${product.minPrice.toLocaleString()} vn₫`
                    : "Chưa có giá"}
                </p>

                {/* Nút yêu thích */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-red-100 transition"
                  onClick={() => removeFromWishlist(product.productId)}
                >
                  {wishlistIds.includes(product.productId) ? (
                    <FaHeart className="text-gray-400" size={20} />
                  ) : (
                    <FaHeart className="text-red-500" size={20} />
                  )}
                </motion.button>

                {/* Nút giỏ hàng */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition"
                  onClick={() => addToCart(product)}
                >
                  <FaShoppingCart className="mr-2" /> Thêm vào giỏ hàng
                </motion.button>

                {/* Hiệu ứng mảnh vỡ */}
                {brokenItems.includes(product.productId) && (
                  <div className="absolute inset-0 flex flex-wrap">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1/3 h-1/3"
                        style={{
                          backgroundImage: `url(${product.mainImageUrl})`,
                          backgroundSize: "cover",
                        }}
                        initial={{ opacity: 1, y: 0 }}
                        animate={{ opacity: 0, y: 50, rotate: Math.random() * 30 }}
                        transition={{ duration: 0.8 }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default WishlistPage;
