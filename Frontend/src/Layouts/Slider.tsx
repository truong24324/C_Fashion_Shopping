import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Slider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  const slides = [
    {
      image: "https://file1.dangcongsan.vn/DATA/0/2018/10/68___gi%E1%BA%BFng_l%C3%A0ng_qu%E1%BA%A3ng_ph%C3%BA_c%E1%BA%A7u__%E1%BB%A9ng_h%C3%B2a___%E1%BA%A3nh_vi%E1%BA%BFt_m%E1%BA%A1nh-16_51_07_908.jpg",
      title: "Sản phẩm 1",
      description: "Mô tả sản phẩm 1",
      price: "99.000 VNĐ",
      link: "/san-pham/1"
    },
    {
      image: "https://th.bing.com/th/id/OIP.JlRrta9thPS6T8Li5vVKywHaEK?w=1240&h=698&rs=1&pid=ImgDetMain",
      title: "Sản phẩm 2",
      description: "Mô tả sản phẩm 2",
      price: "129.000 VNĐ",
      link: "/san-pham/2"
    },
    {
      image: "https://www.thewanderinglens.com/wp-content/uploads/2018/05/Fitzroy-Island-Nudey-Beach-24.jpg",
      title: "Sản phẩm 3",
      description: "Mô tả sản phẩm 3",
      price: "149.000 VNĐ",
      link: "/san-pham/3"
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
      title: "Sản phẩm 4",
      description: "Mô tả sản phẩm 4",
      price: "199.000 VNĐ",
      link: "/san-pham/4"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    resetAutoSlide();
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    resetAutoSlide();
  };

  const resetAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressRef.current) clearInterval(progressRef.current);

    setProgress(0);
    intervalRef.current = setInterval(nextSlide, 5000);
    progressRef.current = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1.67));
    }, 100);
  };

  useEffect(() => {
    resetAutoSlide();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-cover bg-center transition-all duration-500 ease-in-out" style={{ backgroundImage: `url(${slides[currentIndex].image})` }}>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="absolute inset-0 flex justify-center items-center z-10 px-8 py-4 text-center text-white">
        <div>
          <h2 className="text-4xl font-bold sm:text-5xl">{slides[currentIndex].title}</h2>
          <p className="mt-2 text-xl sm:text-2xl">{slides[currentIndex].description}</p>
          <p className="mt-4 text-2xl sm:text-3xl">{slides[currentIndex].price}</p>
          <Link to={slides[currentIndex].link} className="mt-4 inline-block py-2 px-6 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-500">
            Xem sản phẩm
          </Link>
        </div>
      </div>

      {/* Nút Previous */}
      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 text-4xl sm:text-5xl text-white hover:text-yellow-400 transition"
        onClick={prevSlide}
      >
        &#10094;
      </button>

      {/* Nút Next */}
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-4xl sm:text-5xl text-white hover:text-yellow-400 transition"
        onClick={nextSlide}
      >
        &#10095;
      </button>

      {/* Chấm tròn có thanh đếm thời gian */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <div
            key={index}
            className="relative w-10 h-3 flex items-center justify-center rounded-full border-2 overflow-hidden cursor-pointer"
            onClick={() => { setCurrentIndex(index); resetAutoSlide(); }}
            style={{ borderColor: currentIndex === index ? "#FACC15" : "#9CA3AF" }} // Vàng hoặc xám
          >
            {/* Thanh đếm thời gian bên trong chấm dài */}
            <div
              className="absolute top-0 left-0 h-full bg-yellow-400 transition-all duration-100"
              style={{ width: currentIndex === index ? `${progress}%` : "0%" }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
