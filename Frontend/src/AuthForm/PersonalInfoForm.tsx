import React, { useState } from 'react';
import { FaUser, FaCalendar, FaTransgender, FaMapMarkerAlt, FaCamera, FaArrowLeft, FaGlobe } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface PersonalInfoFormProps {
  formData: any;
  avatarPreview: string | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmitPersonalInfo: () => void;
  goToRegister: () => void;
}

const nationalities = ["Việt Nam", "Hoa Kỳ", "Anh", "Pháp", "Nhật Bản", "Hàn Quốc", "Trung Quốc", "Đức", "Úc", "Canada"];

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ formData, avatarPreview, handleChange, handleAvatarChange, handleSubmitPersonalInfo, goToRegister }) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Hàm kiểm tra lỗi
  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Họ và tên không được để trống";
    } else if (formData.fullName.length > 100) {
      newErrors.fullName = "Họ và tên không được vượt quá 100 ký tự";
    }

    if (!formData.birthday) {
      newErrors.birthday = "Ngày sinh không được để trống";
    } else {
      const birthDate = new Date(formData.birthday);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        newErrors.birthday = "Bạn phải ít nhất 18 tuổi";
      }
    }

    if (formData.gender && formData.gender.length > 20) {
      newErrors.gender = "Giới tính không được vượt quá 20 ký tự";
    }

    if (formData.homeAddress && formData.homeAddress.length > 255) {
      newErrors.homeAddress = "Địa chỉ nhà không được vượt quá 255 ký tự";
    }

    if (formData.officeAddress && formData.officeAddress.length > 255) {
      newErrors.officeAddress = "Địa chỉ công ty không được vượt quá 255 ký tự";
    }

    if (!formData.nationality) {
      newErrors.nationality = "Quốc tịch không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gửi form nếu hợp lệ
  const handleSubmit = () => {
    if (validateForm()) {
      handleSubmitPersonalInfo();
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
      <div className="bg-white shadow-xl rounded-xl p-8 border border-gray-200 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Thông tin cá nhân</h2>
        <div className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden relative border-2 border-gray-400 shadow-lg">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <FaCamera className="text-gray-500 text-2xl absolute" />
              )}
              <input type="file" name="avatar" accept="image/*" className="absolute opacity-0 w-full h-full cursor-pointer" onChange={handleAvatarChange} />
            </div>
            <div className="flex-1">
              <div className="relative">
                <FaUser className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                <input name="fullName" placeholder="Nhập họ và tên" value={formData.fullName} onChange={handleChange} className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 shadow-md" />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>
            </div>
          </div>

          {/* Ngày sinh & Giới tính */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="relative">
                <FaCalendar className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                <input name="birthday" type="date" value={formData.birthday} onChange={handleChange} className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 shadow-md" />
                {errors.birthday && <p className="text-red-500 text-sm mt-1">{errors.birthday}</p>}
              </div>
            </div>
            <div>
              <div className="relative">
                <FaTransgender className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 shadow-md">
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
              </div>
            </div>
          </div>

          <div className="relative">
            <FaGlobe className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
            <select name="nationality" value={formData.nationality} onChange={handleChange} className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 shadow-md">
              <option value="">Chọn quốc tịch</option>
              {nationalities.map((nation) => (
                <option key={nation} value={nation}>{nation}</option>
              ))}
            </select>
          </div>

          {/* Địa chỉ */}
          <div className="grid grid-cols-1 gap-4">
            <div className="relative">
              <FaMapMarkerAlt className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
              <input
                name="homeAddress"
                value={formData.homeAddress}
                onChange={handleChange}
                placeholder="Nhập địa chỉ nhà"
                className="w-full mt-1 pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 shadow-md"
              />
              {errors.homeAddress && <p className="text-red-500 text-sm mt-1">{errors.homeAddress}</p>}
            </div>
            <div className="relative">
              <FaMapMarkerAlt className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
              <input
                name="officeAddress"
                value={formData.officeAddress}
                onChange={handleChange}
                placeholder="Nhập địa chỉ công ty"
                className="w-full mt-1 pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 shadow-md"
              />
              {errors.officeAddress && <p className="text-red-500 text-sm mt-1">{errors.officeAddress}</p>}
            </div>
          </div>

          {/* Nút */}
          <div className="flex justify-between mt-6">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={goToRegister} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-all">
              <FaArrowLeft /> Quay lại
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSubmit} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all">
              Hoàn tất
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PersonalInfoForm;
