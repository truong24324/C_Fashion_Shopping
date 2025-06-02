import React, { useEffect, useState, useRef } from "react";
import { FaTshirt } from "react-icons/fa";
import ProductCard from "../../Product/ProductCard";
import Loading from "src/components/common/Loading";
import { toast } from "react-hot-toast";
import axios from "axios";
import clsx from "clsx";
import Navbar from "src/Layouts/Navbar";
import Footer from "src/Layouts/Footer";
import { FiFilter } from "react-icons/fi";

interface Product {
  productId: number;
  productName: string;
  model: string;
  image: string[];
  imageTypes: string[];
  price: number;
  colorCodes: string[];
  colorNames: string[];
  sizeNames: string[];
  materialNames: string[];
  categoryName: string;
  supplierName: string;
  warrantyPeriod: string;
  brandName: string;
}

interface ColorOption {
  code: string;
  name: string;
}

const FashionPage: React.FC = () => {
  const [filters, setFilters] = useState({
    color: "",
    size: "",
    material: "",
    category: "",
    supplier: "",
    warrantyPeriod: "",
    brand: "",
    keyword: "", // ✅ thêm dòng này
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const filterButtonRef = useRef<HTMLDivElement | null>(null);
  const [wishlistProducts, setWishlistProducts] = useState<number[]>([]);

  const [uniqueValues, setUniqueValues] = useState({
    colors: [] as ColorOption[],
    sizes: [] as string[],
    materials: [] as string[],
    categories: [] as string[],
    suppliers: [] as string[],
    warranties: [] as string[],
    brands: [] as string[],
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await axios.get("/api/views/overview");
      const data = response.data.data as Product[]; // ✅ correct path to array
      setProducts(data);

      const allColors = new Map<string, string>();
      const allSizes = new Set<string>();
      const allMaterials = new Set<string>();
      const allCategories = new Set<string>();
      const allSuppliers = new Set<string>();
      const allWarranties = new Set<string>();
      const allBrands = new Set<string>();

      data.forEach((p) => {
        p.colorNames.forEach((c) => {
          const [code, name] = c.split("|");
          if (code && name) allColors.set(code, name);
        });
        p.sizeNames.forEach((s) => allSizes.add(s));
        p.materialNames.forEach((m) => allMaterials.add(m));
        if (p.categoryName) allCategories.add(p.categoryName);
        if (p.supplierName) allSuppliers.add(p.supplierName);
        if (p.warrantyPeriod) allWarranties.add(p.warrantyPeriod);
        if (p.brandName) allBrands.add(p.brandName);
      });

      setUniqueValues({
        colors: Array.from(allColors.entries()).map(([code, name]) => ({ code, name })),
        sizes: Array.from(allSizes),
        materials: Array.from(allMaterials),
        categories: Array.from(allCategories),
        suppliers: Array.from(allSuppliers),
        warranties: Array.from(allWarranties),
        brands: Array.from(allBrands),
      });
    } catch (err) {
      console.error("Lỗi khi tải sản phẩm:", err);
      toast.error("Lỗi khi tải sản phẩm.");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const match = (field: string, value: string | string[]) => {
      const filterVal = filters[field as keyof typeof filters];
      if (!filterVal) return true;
      if (Array.isArray(value)) {
        return value.some((v) =>
          field === "color" ? v.startsWith(filterVal) : v === filterVal
        );
      }
      return value === filterVal;
    };

    const matchKeyword =
      !filters.keyword ||
      product.productName.toLowerCase().includes(filters.keyword) ||
      product.model.toLowerCase().includes(filters.keyword);

    return (
      match("color", product.colorCodes) &&
      match("size", product.sizeNames) &&
      match("material", product.materialNames) &&
      match("category", product.categoryName) &&
      match("supplier", product.supplierName) &&
      match("warrantyPeriod", product.warrantyPeriod) &&
      match("brand", product.brandName) &&
      matchKeyword // ✅ áp dụng keyword lọc
    );
  });

  const renderColorFilter = () => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">Màu sắc</h3>
      <div className="flex flex-wrap gap-3">
        {uniqueValues.colors.map(({ code, name }) => (
          <div key={code} className="relative group">
            <button
              className={clsx(
                "w-9 h-9 rounded-full border-2 shadow-sm transition-all duration-200",
                filters.color === code
                  ? "ring-2 ring-offset-2 ring-blue-500 border-blue-500"
                  : "border-gray-300 hover:ring-2 hover:ring-gray-300"
              )}
              style={{ backgroundColor: code }}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  color: prev.color === code ? "" : code,
                }))
              }
            />
            <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 scale-0 group-hover:scale-100 transition-all bg-gray-900 text-white text-xs rounded px-2 py-1 z-10 whitespace-nowrap">
              {name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFilterBox = (
    title: string,
    options: string[],
    filterKey: keyof typeof filters
  ) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-1">{title}</h3>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <button
            key={option}
            className={clsx(
              "px-4 py-2 rounded-full border text-sm transition-all shadow-sm",
              filters[filterKey] === option
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            )}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                [filterKey]: prev[filterKey] === option ? "" : option,
              }))
            }
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );

  useEffect(() => {
    const btn = filterButtonRef.current;
    if (!btn) return;

    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;

    const handleMouseDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const pageX = (e as MouseEvent).pageX ?? (e as TouchEvent).touches[0].pageX;
      const pageY = (e as MouseEvent).pageY ?? (e as TouchEvent).touches[0].pageY;
      offsetX = pageX - btn.offsetLeft;
      offsetY = pageY - btn.offsetTop;
    };

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const pageX = (e as MouseEvent).pageX ?? (e as TouchEvent).touches[0].pageX;
      const pageY = (e as MouseEvent).pageY ?? (e as TouchEvent).touches[0].pageY;
      btn.style.left = `${pageX - offsetX}px`;
      btn.style.top = `${pageY - offsetY}px`;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    btn.addEventListener("mousedown", handleMouseDown);
    btn.addEventListener("touchstart", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);

    return () => {
      btn.removeEventListener("mousedown", handleMouseDown);
      btn.removeEventListener("touchstart", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="pt-20 w-full bg-gray-50 py-6 px-4 sm:px-6 max-w-7xl mx-auto">
        <div
          ref={filterButtonRef}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center cursor-move md:hidden"
          onClick={() => setShowMobileFilter(true)}
        >
          <FiFilter className="text-2xl" />
        </div>

        <div className="relative h-96 rounded-lg overflow-hidden">
          <img
            src="/images/baner5.webp"
            alt="Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center px-4 text-center space-y-6">
            <h1 className="text-white text-3xl sm:text-5xl font-bold">
              Chào mừng bạn đến với shop thời trang C WEB của chúng tôi
            </h1>
            <div className="w-full max-w-lg">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm theo tên..."
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    keyword: e.target.value.trim().toLowerCase(),
                  }))
                }
                className="w-full px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="hidden md:block w-3/10 lg:w-1/4 bg-white rounded-2xl shadow-lg px-6 py-6 space-y-4 sticky top-24 self-start">
            {renderColorFilter()}
            {renderFilterBox("Kích cỡ", uniqueValues.sizes, "size")}
            {renderFilterBox("Chất liệu", uniqueValues.materials, "material")}
            {renderFilterBox("Thương hiệu", uniqueValues.brands, "brand")}
            {renderFilterBox("Danh mục", uniqueValues.categories, "category")}
            {renderFilterBox("Nhà cung cấp", uniqueValues.suppliers, "supplier")}
            {renderFilterBox("Bảo hành", uniqueValues.warranties, "warrantyPeriod")}
          </div>

          <div className="flex-1">
            {loading ? (
              <Loading
                text="Đang tải sản phẩm..."
                color="yellow-500"
                size="6xl"
                icon={<FaTshirt className="text-yellow-500 text-6xl animate-pulse" />}
              />
            ) : error ? (
              <div className="text-red-500 text-center">Lỗi khi tải dữ liệu</div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center text-gray-600">
                Không tìm thấy sản phẩm phù hợp.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.productId}
                    product={product}
                    wishlistProducts={wishlistProducts}
                    setWishlistProducts={setWishlistProducts}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        {showMobileFilter && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowMobileFilter(false)}
          />
        )}

        <div
          className={clsx(
            "fixed top-0 left-0 w-3/4 sm:w-2/3 max-w-xs h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out",
            showMobileFilter ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="p-4 overflow-y-auto h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Bộ lọc</h2>
              <button
                className="text-gray-500 hover:text-black text-xl"
                onClick={() => setShowMobileFilter(false)}
              >
                ×
              </button>
            </div>
            {renderColorFilter()}
            {renderFilterBox("Kích cỡ", uniqueValues.sizes, "size")}
            {renderFilterBox("Chất liệu", uniqueValues.materials, "material")}
            {renderFilterBox("Thương hiệu", uniqueValues.brands, "brand")}
            {renderFilterBox("Danh mục", uniqueValues.categories, "category")}
            {renderFilterBox("Nhà cung cấp", uniqueValues.suppliers, "supplier")}
            {renderFilterBox("Bảo hành", uniqueValues.warranties, "warrantyPeriod")}
          </div>
        </div>

      </div>
      <Footer />
    </>
  );
};

export default FashionPage;
