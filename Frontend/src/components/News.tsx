import React, { useState } from "react";

const News: React.FC = () => {
  const news = [
    {
      title: "Khuyến Mãi Cuối Năm",
      description: "Các sản phẩm thời trang chất lượng với giá ưu đãi.",
      image: "https://file.hstatic.net/1000360022/article/ao-hoodie-local-brand_1939a3859ce1499c982ba12f1633eecd_2048x2048.jpg",
      date: "2025-01-20",
    },
    {
      title: "Mùa Xuân Đến, Thời Trang Mới",
      description: "Các mẫu áo khoác mới nhất, chuẩn bị cho mùa xuân.",
      image: "https://file.hstatic.net/1000360022/article/phoi-do-quan-jogger-nam_4e586e3d15f04a30835f7dac3e5d40d7_2048x2048.jpg",
      date: "2025-01-15",
    },
    {
      title: "Event Bạn và Tooi6",
      description: "Các mẫu áo khoác mới nhất, chuẩn bị cho mùa xuân.",
      image: "https://file.hstatic.net/1000360022/article/jacket-la-gi_7f21fe43b160468895606131909d8a0d_2048x2048.png",
      date: "2025-01-15",
    },
    {
      title: "Event Bạn và Tooi6",
      description: "Các mẫu áo khoác mới nhất, chuẩn bị cho mùa xuân.",
      image: "https://file.hstatic.net/1000360022/article/jacket-la-gi_7f21fe43b160468895606131909d8a0d_2048x2048.png",
      date: "2025-01-15",
    },
  ];

  const [showAll, setShowAll] = useState(false);

  const handleShowAllClick = () => {
    setShowAll(!showAll);
  };

  return (
    <div className="news-section px-4 py-8">
      <h2 className="text-3xl font-semibold">Tin Tức Mới Nhất</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {news.slice(0, showAll ? news.length : 3).map((article, index) => (
          <div
            key={index}
            className="news-item bg-white rounded-lg shadow-lg p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-48 object-cover rounded-lg transition-transform duration-300 hover:scale-110"
            />
            <h3 className="text-xl font-medium mt-4 transition-colors duration-300 hover:text-blue-500">
              {article.title}
            </h3>
            <p className="text-gray-600 mt-2">{article.description}</p>
            <span className="text-gray-500 mt-2 block">{article.date}</span>
          </div>
        ))}
      </div>
      {news.length > 3 && (
        <button
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-700 transition duration-300"
          onClick={handleShowAllClick}
        >
          {showAll ? "Ẩn Bớt" : "Hiện Tất Cả"}
        </button>
      )}
    </div>
  );
};

export default News;
