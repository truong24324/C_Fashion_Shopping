import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import Loading from "./common/Loading";

const BrandsIntroduction: React.FC = () => {
  const [brands, setBrands] = useState<any[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const fetchBrands = async () => {
    try {
      const response = await axios.get("/api/views/listBrand");
      const brandData = response.data || [];
      setBrands(brandData);
      setLoading(false);
    } catch (error) {
      toast.error("Lỗi khi tải thương hiệu. Vui lòng thử lại sau.");
      setLoading(false);
      setError(true);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const scrollWidth = container?.scrollWidth || 0;

    const interval = setInterval(() => {
      if (container && !isHovered) {
        const newPosition = scrollPosition + 2;
        setScrollPosition(newPosition >= scrollWidth / 2 ? 0 : newPosition);
        container.scrollLeft = newPosition;
      }
    }, 30);

    return () => clearInterval(interval);
  }, [scrollPosition, isHovered]);

  const handleRetry = () => {
    setError(false);
    setLoading(true);
    fetchBrands();
  };

  return (
    <div className="flex items-center justify-center max-h-screen">
      <div className="relative w-full max-w-full px-4 py-8 bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex justify-center items-center mb-6">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Thương Hiệu Hợp Tác Cùng Chúng Tôi
          </h2>
        </div>

        {loading ? (
          <Loading showRetryButton={error} onRetry={handleRetry} />
        ) : brands.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            Không có thương hiệu nào để hiển thị.
          </div>
        ) : (
          <div
            className="relative overflow-hidden"
            ref={containerRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              className="flex gap-4"
              style={{ width: `${(brands?.length || 0) * 2 * 150}px` }}
            >
              {(brands?.length ? brands.concat(brands) : []).map((brand, index) => (
                <div key={index} className="w-40 sm:w-48 px-2 py-2 flex-shrink-0">
                  <div className="bg-white shadow-md rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 hover:shadow-lg h-full">
                    <div className="relative w-full" style={{ paddingBottom: "100%" }}>
                      <img
                        src={brand.logo}
                        alt={brand.brandName}
                        className="absolute inset-0 w-full h-full object-cover rounded-t-lg transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                    <div className="text-center mt-2">
                      <span className="text-sm sm:text-base font-semibold text-gray-700">
                        {brand.brandName}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandsIntroduction;
