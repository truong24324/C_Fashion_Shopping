import React, { useEffect, useState } from "react";
import { FaTshirt } from "react-icons/fa";
import ProductCard from "../../Product/ProductCard";
import Loading from "src/components/common/Loading";
import { toast } from "react-hot-toast";
import axios from "axios";
import clsx from "clsx";
import Navbar from "src/Layouts/Navbar";
import Footer from "src/Layouts/Footer";

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
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

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
      const data = response.data as Product[];
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
      if (!filters[field as keyof typeof filters]) return true;
      const filterVal = filters[field as keyof typeof filters];
      if (Array.isArray(value)) {
        return value.some((v) =>
          field === "color" ? v.startsWith(filterVal) : v === filterVal
        );
      }
      return value === filterVal;
    };
    return (
      match("color", product.colorCodes) &&
      match("size", product.sizeNames) &&
      match("material", product.materialNames) &&
      match("category", product.categoryName) &&
      match("supplier", product.supplierName) &&
      match("warrantyPeriod", product.warrantyPeriod) &&
      match("brand", product.brandName)
    );
  });

  const renderColorFilter = () => (
    <div className="mb-4">
      <h3 className="font-semibold mb-2">Màu sắc</h3>
      <div className="flex flex-wrap gap-3">
        {uniqueValues.colors.map(({ code, name }) => (
          <div key={code} className="relative group">
            <button
              className={clsx(
                "w-8 h-8 rounded-full border-2 transition-all",
                filters.color === code
                  ? "ring-2 ring-blue-500 border-blue-500"
                  : "border-gray-300"
              )}
              style={{ backgroundColor: code }}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  color: prev.color === code ? "" : code,
                }))
              }
            />
            <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-gray-800 text-white text-xs rounded px-2 py-1 pointer-events-none z-10">
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
    <div className="mb-4">
      <h3 className="font-semibold mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            className={clsx(
              "px-3 py-2 rounded border text-sm",
              filters[filterKey] === option
                ? "bg-blue-500 text-white border-blue-500"
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

  return (
    <>
      <Navbar />
      <div className="pt-20 w-full bg-gray-50 px-4 py-6 max-w-7xl mx-auto">
        {/* Banner */}
        <div
          className="w-full h-72 sm:h-96 bg-cover bg-center rounded-lg shadow-lg mb-6"
          style={{
            backgroundImage:
              "url('https://file.hstatic.net/1000360022/file/thumb_-_1__1_.png')",
          }}
        >
          <div className="flex justify-center items-center h-full bg-black bg-opacity-50 rounded-lg">
            <h1 className="text-white text-3xl sm:text-5xl font-bold text-center">
              Welcome to Our Store
            </h1>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar filter */}
          <div className="w-3/10 lg:w-1/4 bg-white p-4 rounded shadow-md">
            {renderColorFilter()}
            {renderFilterBox("Kích cỡ", uniqueValues.sizes, "size")}
            {renderFilterBox("Chất liệu", uniqueValues.materials, "material")}
            {renderFilterBox("Thương hiệu", uniqueValues.brands, "brand")}
            {renderFilterBox("Danh mục", uniqueValues.categories, "category")}
            {renderFilterBox("Nhà cung cấp", uniqueValues.suppliers, "supplier")}
            {renderFilterBox("Bảo hành", uniqueValues.warranties, "warrantyPeriod")}
          </div>

          {/* Product grid */}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.productId} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FashionPage;
