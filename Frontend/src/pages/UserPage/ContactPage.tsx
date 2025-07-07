import React, {useEffect} from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import Navbar from "../../Layouts/Navbar";
import Footer from "../../Layouts/Footer";

const ContactPage: React.FC = () => {
     useEffect(() => {
          document.title = `C WEB - Liên Hệ Chúng Tôi`;
      }, []);

  return (
    <div className="pt-5">
    <Navbar/>
    <div className="pt-20 mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
        Liên Hệ Chúng Tôi
      </h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Thông tin liên hệ */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Thông Tin Liên Hệ</h3>
          <p className="flex items-center mb-3">
            <FaMapMarkerAlt className="text-yellow-500 mr-2" />
            123 Đường ABC, Quận XYZ, TP. HCM
          </p>
          <p className="flex items-center mb-3">
            <FaPhone className="text-yellow-500 mr-2" />
            0123-456-789
          </p>
          <p className="flex items-center">
            <FaEnvelope className="text-yellow-500 mr-2" />
            contact@yourshop.com
          </p>
        </div>

        {/* Biểu mẫu liên hệ */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Gửi Tin Nhắn</h3>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
              <input type="text" className="mt-1 p-2 w-full border rounded-md" placeholder="Nhập họ và tên" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" className="mt-1 p-2 w-full border rounded-md" placeholder="Nhập email" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Tin nhắn</label>
              <textarea className="mt-1 p-2 w-full border rounded-md" rows={4} placeholder="Nhập nội dung"></textarea>
            </div>
            <button type="submit" className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600">
              Gửi tin nhắn
            </button>
          </form>
        </div>
      </div>

      {/* Bản đồ nhúng */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold text-center mb-4">Vị Trí Của Chúng Tôi</h3>
        <div className="w-full h-72">
          <iframe
            title="Bản đồ liên hệ"
            className="w-full h-full rounded-lg shadow-md"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.682149970927!2d106.68007937513337!3d10.75991775960309!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752fd092f93367%3A0x93bbcfb6b3a75b78!2zMTIzIMSQLiBBQkMsIFF14bqtbiBYWlksIFRIUC4gSOG6oE5HIE3hu7DIMSBRVQ!5e0!3m2!1svi!2s!4v1613634512789!5m2!1svi!2s"
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default ContactPage;
