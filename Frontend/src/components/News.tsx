import React, { useState } from "react";
import { Calendar, Clock, ArrowRight, Eye, Heart, Share2, ChevronDown, ChevronUp } from "lucide-react";

const News: React.FC = () => {
  const news = [
    {
      title: "Khuyến Mãi Cuối Năm",
      description: "Các sản phẩm thời trang chất lượng với giá ưu đãi lên đến 50%. Đừng bỏ lỡ cơ hội sở hữu những món đồ yêu thích với mức giá hấp dẫn.",
      image: "https://file.hstatic.net/1000360022/article/ao-hoodie-local-brand_1939a3859ce1499c982ba12f1633eecd_2048x2048.jpg",
      date: "2025-01-20",
      category: "Khuyến Mãi",
      views: 1250,
      likes: 89,
      readTime: "3 phút đọc"
    },
    {
      title: "Mùa Xuân Đến, Thời Trang Mới",
      description: "Khám phá bộ sưu tập áo khoác mới nhất cho mùa xuân 2025. Phong cách trẻ trung, hiện đại phù hợp với xu hướng thời trang quốc tế.",
      image: "https://file.hstatic.net/1000360022/article/phoi-do-quan-jogger-nam_4e586e3d15f04a30835f7dac3e5d40d7_2048x2048.jpg",
      date: "2025-01-15",
      category: "Xu Hướng",
      views: 980,
      likes: 67,
      readTime: "5 phút đọc"
    },
    {
      title: "Event Bạn và Tôi - Kết Nối Yêu Thương",
      description: "Sự kiện đặc biệt dành cho các cặp đôi và bạn bè. Tham gia để nhận những phần quà ý nghĩa và trải nghiệm mua sắm độc đáo.",
      image: "https://file.hstatic.net/1000360022/article/jacket-la-gi_7f21fe43b160468895606131909d8a0d_2048x2048.png",
      date: "2025-01-12",
      category: "Sự Kiện",
      views: 756,
      likes: 134,
      readTime: "4 phút đọc"
    },
    {
      title: "Bí Quyết Phối Đồ Chuyên Nghiệp",
      description: "Hướng dẫn chi tiết cách mix & match trang phục để có được phong cách chuyên nghiệp và thời thượng trong môi trường công sở.",
      image: "https://file.hstatic.net/1000360022/article/jacket-la-gi_7f21fe43b160468895606131909d8a0d_2048x2048.png",
      date: "2025-01-10",
      category: "Hướng Dẫn",
      views: 2100,
      likes: 156,
      readTime: "7 phút đọc"
    },
  ];

  const [showAll, setShowAll] = useState(false);
  const [likedItems, setLikedItems] = useState<number[]>([]);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

  const handleShowAllClick = () => {
    setShowAll(!showAll);
  };

  const handleLike = (index: number) => {
    setLikedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Khuyến Mãi': 'bg-red-500',
      'Xu Hướng': 'bg-purple-500',
      'Sự Kiện': 'bg-blue-500',
      'Hướng Dẫn': 'bg-green-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            <Clock className="w-4 h-4 mr-2" />
            Cập nhật mới nhất
          </div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Tin Tức Mới Nhất
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Khám phá những xu hướng thời trang mới nhất, sự kiện hấp dẫn và các mẹo phối đồ độc đáo
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {news.slice(0, showAll ? news.length : 3).map((article, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              onMouseEnter={() => setHoveredItem(index)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Category Badge */}
                <div className={`absolute top-4 left-4 ${getCategoryColor(article.category)} text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg`}>
                  {article.category}
                </div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Quick Actions */}
                <div className={`absolute top-4 right-4 flex space-x-2 transition-all duration-300 ${hoveredItem === index ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                  <button 
                    onClick={() => handleLike(index)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
                      likedItems.includes(index) 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <Heart className="w-4 h-4" fill={likedItems.includes(index) ? 'currentColor' : 'none'} />
                  </button>
                  <button className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(article.date)}
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {article.views.toLocaleString()}
                    </div>
                  </div>
                  <span className="text-blue-600 font-medium">{article.readTime}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {article.description}
                </p>

                {/* Stats and CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Heart className="w-4 h-4 mr-1" />
                      {article.likes + (likedItems.includes(index) ? 1 : 0)}
                    </span>
                  </div>
                  
                  <button className="flex items-center text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors duration-200 group">
                    Đọc tiếp
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </div>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-2xl transition-all duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Show More/Less Button */}
        {news.length > 3 && (
          <div className="text-center">
            <button
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
              onClick={handleShowAllClick}
            >
              {showAll ? (
                <>
                  <ChevronUp className="w-5 h-5 mr-2 group-hover:-translate-y-1 transition-transform duration-200" />
                  Ẩn Bớt
                </>
              ) : (
                <>
                  <ChevronDown className="w-5 h-5 mr-2 group-hover:translate-y-1 transition-transform duration-200" />
                  Xem Tất Cả ({news.length} bài viết)
                </>
              )}
            </button>
          </div>
        )}

        {/* Newsletter Subscription */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Đăng Ký Nhận Tin Tức</h3>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Nhận thông báo về những xu hướng thời trang mới nhất và các ưu đãi đặc biệt
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Nhập email của bạn..."
              className="flex-1 px-6 py-4 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30"
            />
            <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-colors duration-200 whitespace-nowrap">
              Đăng Ký
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;