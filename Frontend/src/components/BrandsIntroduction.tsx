import React, { useEffect, useRef, useState } from "react";

const BrandsIntroduction: React.FC = () => {
  const brands = [
    { name: "CHANEL", image: "https://th.bing.com/th/id/OIP.eOIlz4uJ9ypFmTb2Sttw3gHaE7?rs=1&pid=ImgDetMain" },
    { name: "ALOPHOTO", image: "https://png.pngtree.com/png-vector/20230120/ourmid/pngtree-beauty-logo-design-png-image_6568470.png" },
    { name: "VIVA", image: "https://th.bing.com/th/id/OIP.eGEDJV_bA6J9Ww2RVGlLZwHaHa?pid=ImgDet&w=184&h=184&c=7&dpr=1.3" },
    { name: "PHÚC LONG", image: "https://th.bing.com/th/id/OIP.BKt8C_yx6mLenPJlfyFsPgHaHa?w=162&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" },
    { name: "VICTORIA", image: "https://th.bing.com/th/id/OIP.E-0qyiRWl-V6r9974iXiHAHaHa?pid=ImgDet&w=184&h=184&c=7&dpr=1.3" },
    { name: "IVY MODEL", image: "https://ttagencyads.com/wp-content/uploads/2021/04/10-logo-thuong-hieu-quan-ao-5.png" },
    { name: "MODA CITY", image: "https://th.bing.com/th/id/OIP.-9IbuAz71of87nHLYdvYYgHaHa?pid=ImgDet&w=184&h=184&c=7&dpr=1.3" },
    { name: "MV CLOTHING", image: "https://th.bing.com/th/id/OIP._qvuPPOV4Hpk3T2uBpW87QHaHF?pid=ImgDet&w=184&h=175&c=7&dpr=1.3" },
    { name: "VERA MODAL", image: "https://th.bing.com/th/id/OIP.ttMdeNudrEuoaBhBHCGXvgHaHa?pid=ImgDet&w=184&h=184&c=7&dpr=1.3" },
    { name: "VICKY MAR", image: "https://th.bing.com/th/id/OIP.PbSU1jjcGjOstoyka6-X4gHaHa?pid=ImgDet&w=184&h=184&c=7&dpr=1.3" },
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

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

  return (
    <div className="flex items-center justify-center max-h-screen">
      <div className="relative w-full max-w-full px-4 py-8 bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex justify-center items-center mb-6">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Thương Hiệu Hợp Tác Cùng Chúng Tôi
          </h2>
        </div>

        {/* Container cuộn */}
        <div
          className="relative overflow-hidden"
          ref={containerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Danh sách thương hiệu */}
          <div
            className="flex gap-4"
            style={{ width: `${brands.length * 150}px` }} // Đảm bảo cuộn tốt trên mọi màn hình
          >
            {brands.concat(brands).map((brand, index) => (
              <div
                key={index}
                className="w-40 sm:w-48 px-2 py-2 flex-shrink-0"
              >
                <div className="bg-white shadow-md rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 hover:shadow-lg h-full">
                  <div
                    className="relative w-full"
                    style={{ paddingBottom: "100%" }}
                  >
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="absolute inset-0 w-full h-full object-cover rounded-t-lg transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-sm sm:text-base font-semibold text-gray-700">
                      {brand.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandsIntroduction;
