import React, { useState, useEffect, } from "react";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import Navbar from "../../Layouts/Navbar";
import Footer from "../../Layouts/Footer";
import ProductSale from "../../components/Product/ProductSale";
import { FaCartPlus } from "react-icons/fa";
import Loading from "../../components/common/Loading";
import { useNavigate } from "react-router-dom";
import CartItem from "src/Cart/CartItem";
import ShippingAddress from "src/Cart/ShippingAddress";
import DiscountAndNote from "src/Cart/DiscountAndNote";
import axios from "axios";
import { CartItemType, DecodedToken, } from "../../components/CreateForm/Product/types";
import MessageAlert from "../../components/common/MessageAlert";
import UsePointsSection from "src/Cart/UsePointsSection";

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

const CartPage: React.FC = () => {
  useEffect(() => {
    document.title = `C WEB - Giỏ Hàng`;
  }, []);

  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [coupon, setCoupon] = useState("");
  const [invoice, setInvoice] = useState(false);
  const [note, setNote] = useState("");
  const [productList, setProductList] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [estimatedDelivery, setEstimatedDelivery] = useState<string>(""); // Dùng để lưu thời gian giao hàng
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isCalculatingFee, setIsCalculatingFee] = useState(false);
  const [discount, setDiscount] = useState(0); // Giả sử không có giảm giá ban đầu
  const [discountFromCoupon, setDiscountFromCoupon] = useState<number>(0); // Thêm biến cho mã giảm giá
  const [usedPoints, setUsedPoints] = useState<number>(0); // Thêm biến cho điểm đã dùng
  const [total, setTotal] = useState<number>(0);
  const [shippingFee, setShippingFee] = useState<number | null>(null); // Phí vận chuyển, có thể là null nếu chưa tính
  const [currentPoints, setCurrentPoints] = useState<number>(0);

  const navigate = useNavigate();

  const getAccountIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const decoded: DecodedToken = jwtDecode(token);
    return parseInt(decoded.accountId);
  };
  const accountId = getAccountIdFromToken();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`/api/cart/${accountId}/views`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCartItems(response.data);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Lỗi khi tải giỏ hàng.");
      } finally {
        setLoading(false);
      }
    };

    if (accountId) fetchCartItems();
  }, [accountId]);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(`/api/cart/${accountId}/views`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCartItems(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi tải giỏ hàng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    axios
      .get("/api/views/suggest")
      .then((response) => {
        setProductList(response.data.data); // ✅ FIX HERE
      })
      .catch((error: any) => {
        toast.error(error.response?.data?.message || "Lỗi khi tải sản phẩm gợi ý.");
      });
    fetchCurrentPoints();
  }, []);

  // ✅ Tải tỉnh khi mở trang
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get("/api/locations/provinces");
        if (Array.isArray(response.data)) {
          setProvinces(response.data);
        } else if (response.data.data && Array.isArray(response.data.data)) {
          setProvinces(response.data.data);
        } else {
          toast.error("Dữ liệu tỉnh thành không hợp lệ");
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Không thể tải danh sách tỉnh/thành.");
      }
    };
    fetchProvinces();
  }, []);

  const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProvince = e.target.value;
    setProvince(selectedProvince);
    setDistrict("");
    setDistricts([]);
    setWard("");
    setWards([]);

    if (!selectedProvince) return;

    try {
      const response = await axios.get("/api/locations/districts", {
        params: { provinceId: selectedProvince },
      });

      const data = response.data?.data ?? response.data;

      if (Array.isArray(data)) {
        setDistricts(data);
      } else {
        toast.error("Dữ liệu quận/huyện không hợp lệ");
        setDistricts([]);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi tải danh sách quận/huyện");
    }
  };

  const handleDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDistrict = e.target.value;
    setDistrict(selectedDistrict);
    setWard("");
    setWards([]);

    if (!selectedDistrict) return;

    try {
      const response = await axios.get("/api/locations/wards", {
        params: { districtId: selectedDistrict },
      });

      const data = response.data?.data ?? response.data;

      if (Array.isArray(data)) {
        setWards(data);
      } else {
        toast.error("Dữ liệu phường/xã không hợp lệ");
        setWards([]);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi tải danh sách phường/xã");
    }
  };

  const handleUpdateQuantity = async (variantId: number, amount: number) => {
    const currentItem = cartItems.find((item) => item.variantId === variantId);
    if (!currentItem) return;

    const newQuantity = currentItem.quantity + amount;
    if (newQuantity < 1) return;

    try {
      await axios.post(
        "/api/cart/update",
        { accountId, variantId, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setCartItems((prev) =>
        prev.map((item) =>
          item.variantId === variantId
            ? { ...item, quantity: newQuantity, totalPrice: item.price * newQuantity }
            : item
        )
      );
      handleCalculateShippingFee();

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật giỏ hàng.");
    }
  };

  // 📌 Giữ nguyên xoá item
  const handleRemoveItem = async (variantId: number) => {
    try {
      await axios.delete("/api/cart/remove", {
        params: { accountId, variantId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setCartItems((prev) => prev.filter((item) => item.variantId !== variantId));
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng!");
    } catch (error: any) {
      setError("Lỗi khi xóa sản phẩm.");
      toast.error(error.response?.data?.message || "Lỗi khi xóa sản phẩm khỏi giỏ hàng.");
    }
  };

  const defaultWeights = {
    'tshirt': 200,
    'jeans': 700,
    'jacket': 600,
    'dress': 350,
    'accessory': 100,
  };

  function getWeight(item: CartItemType & { category?: keyof typeof defaultWeights }) {
    return item.weightPerUnit
      ?? (item.category ? defaultWeights[item.category] : undefined)
      ?? 200; // fallback chung
  }

  const handleCalculateShippingFee = async () => {
    const selectedCartItems = cartItems.filter(item =>
      selectedItems.includes(item.variantId)
    );

    if (
      selectedCartItems.length === 0 ||
      !province ||
      !district ||
      !ward
    ) {
      setShippingFee(null);
      return;
    }
    try {
      setIsCalculatingFee(true);

      const totalWeight = cartItems
        .filter(item => selectedItems.includes(item.variantId))
        .reduce((sum, item) => {
          const weight = getWeight(item); // từ hàm bên trên
          return sum + item.quantity * weight;
        }, 0);

      const totalWeightKg = (totalWeight / 1000).toFixed(2);  // Trọng lượng mỗi sản phẩm (1500 là giá trị mặc định nếu không có)

      // Gọi API tính phí vận chuyển với trọng lượng đã tính
      const feeResponse = await axios.post("/api/locations/calculate-fee", {
        fromProvince: 217,
        fromDistrict: 1566,
        fromWard: 510103,
        toProvince: parseInt(province),
        toDistrict: parseInt(district),
        toWard: parseInt(ward),
        weight: totalWeight,  // Trọng lượng tổng cộng
      });

      if (feeResponse.status !== 200) {
        toast.error("Lỗi khi tính phí vận chuyển.");
        setShippingFee(null);
        return;
      }

      const fee = feeResponse.data?.data?.total ?? 0;
      setShippingFee(fee);

      // Gọi API ước tính thời gian giao hàng
      const timeResponse = await axios.post("/api/locations/estimate-delivery-time", {
        fromProvince: 217,
        fromDistrict: 1566,
        fromWard: 510103,
        toProvince: parseInt(province),
        toDistrict: parseInt(district),
        toWard: parseInt(ward),
        serviceId: 2,  // Nếu có serviceId hoặc thêm tham số khác cần thiết
      });

      if (timeResponse.status !== 200) {
        toast.error("Lỗi khi ước tính thời gian giao hàng.");
        return;
      }

      const estimatedDelivery = timeResponse.data?.data?.estimatedDelivery ?? "Không có dữ liệu";
      setEstimatedDelivery(estimatedDelivery);  // Lưu thời gian giao hàng

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể tính phí vận chuyển hoặc thời gian giao hàng.");
      setShippingFee(null);
    } finally {
      setIsCalculatingFee(false);
    }
  };

  useEffect(() => {
    if (province && district && ward) {
      handleCalculateShippingFee();
    }
  }, [province, district, ward]);

  const nextProduct = () => {
    setCurrentIndex((prev) => (prev + 1) % productList.length);
  };

  const prevProduct = () => {
    setCurrentIndex((prev) => (prev - 1 + productList.length) % productList.length);
  };

  const handleToggleSelectItem = (variantId: number) => {
    setSelectedItems((prev) => {
      const updatedItems = prev.includes(variantId)
        ? prev.filter((id) => id !== variantId)
        : [...prev, variantId];
      handleCalculateShippingFee();
      return updatedItems;
    });
  };

  const handleToggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
      handleCalculateShippingFee();
    } else {
      setSelectedItems(cartItems.map((item) => item.variantId));
      handleCalculateShippingFee();
    }
  };

  const handleProceedToCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm.");
      return;
    }

    if (!shippingFee && !isCalculatingFee) {
      toast.error("Vui lòng đợi tính phí vận chuyển.");
      return;
    }

    const selectedCartItems = cartItems.filter(item =>
      selectedItems.includes(item.variantId)
    );

    const checkoutData = {
      items: selectedCartItems,
      address: {
        province: province || "",
        district: district || "",
        ward: ward || "",

      }, pricing: { subtotal, discount, shippingFee, total, note, coupon, invoice, estimatedDelivery, usedPoints },
    };

    navigate("/checkout", { state: checkoutData });
  };

  const fetchCurrentPoints = async () => {
    try {
      const res = await axios.get("/api/points/current/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCurrentPoints(res.data.data || 0);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể tải điểm hiện tại.");
    }
  };

  const subtotal = cartItems
    .filter(item => selectedItems.includes(item.variantId))  // Lọc chỉ các sản phẩm đã chọn
    .reduce((sum, item) => sum + item.totalPrice, 0);  // Tính tổng giá trị các sản phẩm đã chọn

  useEffect(() => {
    const newDiscount = discountFromCoupon + usedPoints;
    setDiscount(newDiscount);

    const computedTotal = Math.max((subtotal ?? 0) - newDiscount + (shippingFee ?? 0), 0);
    setTotal(computedTotal);
  }, [discountFromCoupon, usedPoints, subtotal, shippingFee]);

  return (
    <div>
      <Navbar />
      <div className="pt-20 flex flex-col lg:flex-row min-h-screen bg-gray-100 p-4 lg:p-6 gap-4">
        {/* Giỏ hàng */}
        <div className="w-full lg:w-3/5 bg-white p-4 lg:p-6 rounded-lg shadow-md">
          <h2 className="pt-12 text-2xl font-bold flex items-center gap-3">
            Giỏ hàng
            <input
              type="checkbox"
              checked={selectedItems.length === cartItems.length}
              onChange={handleToggleSelectAll}
              className="ml-2"
            />
            <span className="text-sm font-medium">Chọn tất cả</span>
          </h2>
          {loading ? (
            <Loading
              text="Đang tải giỏ hàng..."
              color="yellow-500"
              size="6xl"
              icon={<FaCartPlus className="text-yellow-500 text-6xl animate-pulse" />} // Icon đại diện người dùng
            />
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : cartItems.length === 0 ? (
            <MessageAlert
              icon="ℹ️"
              title="Thông báo"
              message=" Giỏ hàng của bạn đang trống."
              className="mt-4"
            />
          ) : (
            cartItems.map((item) => (
              <CartItem
                key={item.variantId}
                {...item}
                selected={selectedItems.includes(item.variantId)}
                toggleSelectItem={handleToggleSelectItem}
                updateQuantity={handleUpdateQuantity}
                removeItem={handleRemoveItem}
              />
            ))
          )}
        </div>

        {/* Thông tin đơn hàng */}
        <div className="w-full lg:w-2/5 bg-white p-4 lg:p-6 rounded-lg shadow-md">
          <div className="pt-12">
            {productList.length > 0 && (
              <ProductSale
                product={productList[currentIndex]}
                onNext={nextProduct}
                onPrev={prevProduct}
                onCartUpdated={fetchCartItems}
              />
            )}
          </div>

          <h2 className="text-xl lg:text-2xl font-bold mb-4 mt-6">Thông tin đơn hàng</h2>

          <ShippingAddress
            provinces={provinces}
            districts={districts}
            wards={wards}
            province={province}
            district={district}
            ward={ward}
            handleProvinceChange={handleProvinceChange}
            handleDistrictChange={handleDistrictChange}
            setWard={setWard}
            estimatedDelivery={estimatedDelivery}
          />
          <DiscountAndNote
            coupon={coupon}
            setCoupon={setCoupon}
            invoice={invoice}
            setInvoice={setInvoice}
            note={note}
            setNote={setNote}
            setDiscount={setDiscountFromCoupon} // riêng mã giảm giá
            subtotal={subtotal}
            shippingFee={shippingFee ?? 0}
            setShippingFee={setShippingFee}
          />

          <UsePointsSection
            currentPoints={currentPoints}
            onUsePoints={setUsedPoints}
            subtotal={subtotal}
          />

          <div className="space-y-2 text-sm lg:text-base">
            <div className="flex justify-between">
              <span>Tạm tính:</span>
              <span>{(subtotal ?? 0).toLocaleString()} vn₫</span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển:</span>
              <span>{shippingFee !== null ? `${shippingFee.toLocaleString()} vn₫` : "Đang tính..."}</span>
            </div>
            <div className="flex justify-between">
              <span>Giảm giá:</span>
              <span className="text-green-600">- {(discount ?? 0).toLocaleString()} vn₫</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-red-500">
              <span>Tổng cộng:</span>
              <span>{total.toLocaleString()} vn₫</span>
            </div>
          </div>
          <button
            onClick={handleProceedToCheckout}
            disabled={
              selectedItems.length === 0 || shippingFee === null || isCalculatingFee
            }
            className={`w-full text-white px-6 py-2 rounded-lg text-lg ${selectedItems.length === 0 || shippingFee === null || isCalculatingFee
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            Thanh toán
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CartPage;
