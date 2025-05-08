import React from "react";
import Footer from "../../Layouts/Footer";
import Navbar from "../../Layouts/Navbar";

const AboutPage = () => {
  return (
    <>
      <Navbar />
      <div className="pt-20 max-w-4xl mx-auto p-6">
        <div className="text-center mb-10">
          <h1 className="pt-10 text-4xl font-extrabold mb-2 text-yellow-500 transform transition duration-500 hover:scale-110">
            Giới Thiệu Về Chúng Tôi
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed hover:text-gray-800 transition duration-300">
            Chào mừng bạn đến với <span className="font-semibold">FashionVibe</span> – điểm đến lý tưởng dành cho những tín đồ thời trang hiện đại!
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4 text-yellow-600 transition transform hover:scale-105">
            Về Chúng Tôi
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed hover:text-gray-800 transition duration-300">
            FashionVibe là nền tảng mua sắm trực tuyến chuyên cung cấp các sản phẩm thời trang chất lượng cao, theo kịp xu hướng mới nhất. Từ những chiếc áo thun basic cho đến các bộ trang phục dự tiệc sang trọng, chúng tôi đều có thể đáp ứng mọi phong cách và nhu cầu của bạn.
          </p>
          <blockquote className="mt-6 italic text-gray-500 border-l-4 border-yellow-400 pl-4 text-lg transition duration-300 hover:text-yellow-600">
            Chúng tôi tin rằng thời trang không chỉ là quần áo, mà còn là cách bạn thể hiện bản thân – một cá tính, một lối sống, một nguồn cảm hứng.
          </blockquote>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4 text-yellow-600 transition transform hover:scale-105">
            Sản Phẩm Của Chúng Tôi
          </h2>
          <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed">
            <li>Quần áo nam, nữ đa dạng mẫu mã</li>
            <li>Giày dép, túi xách thời thượng</li>
            <li>Phụ kiện cá tính: kính, nón, trang sức,...</li>
            <li>Bộ sưu tập thiết kế riêng theo mùa</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4 text-yellow-600 transition transform hover:scale-105">
            Vì Sao Chọn Chúng Tôi?
          </h2>
          <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed">
            <li>Thiết kế hợp xu hướng: cập nhật mẫu mới hàng tuần</li>
            <li>Mua sắm tiện lợi: thao tác đơn giản, giao hàng tận nơi</li>
            <li>Dịch vụ chăm sóc khách hàng tận tâm 24/7</li>
            <li>Chính sách đổi trả rõ ràng, bảo vệ quyền lợi khách hàng</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4 text-yellow-600 transition transform hover:scale-105">
            Sứ Mệnh
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Chúng tôi mong muốn mang lại trải nghiệm mua sắm trực tuyến an toàn, tiện lợi và tràn đầy cảm hứng thời trang cho mọi người – dù bạn ở đâu, chỉ với vài cú click là đã có thể sở hữu ngay phong cách riêng của mình.
          </p>
        </section>

        <div className="text-center border-t pt-6 mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Cảm Ơn Bạn!</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Cảm ơn bạn đã tin tưởng và đồng hành cùng <span className="font-semibold">FashionVibe</span>. Đừng quên theo dõi chúng tôi trên Facebook, Instagram để không bỏ lỡ các ưu đãi hấp dẫn và bộ sưu tập mới nhất nhé!
          </p>
          <p className="italic text-sm text-gray-500 mt-2">
            Thời trang là bạn, là cá tính, là sự tự tin. Hãy để FashionVibe cùng bạn tỏa sáng!
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;
