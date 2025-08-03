import React, { useState } from 'react';
import { FaUser, FaCalendar, FaTransgender, FaMapMarkerAlt, FaCamera, FaArrowLeft, FaGlobe, FaHome, FaBuilding, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface PersonalInfoFormProps {
  formData: any;
  avatarPreview: string | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmitPersonalInfo: () => void;
  goToRegister: () => void;
}

const nationalities = [
  "Việt Nam", "Hoa Kỳ", "Anh", "Pháp", "Nhật Bản", "Hàn Quốc", 
  "Trung Quốc", "Đức", "Úc", "Canada", "Singapore", "Malaysia", 
  "Thái Lan", "Indonesia", "Philippines"
];

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ 
  formData, 
  avatarPreview, 
  handleChange, 
  handleAvatarChange, 
  handleSubmitPersonalInfo, 
  goToRegister 
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

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

    if (!formData.nationality) {
      newErrors.nationality = "Quốc tịch không được để trống";
    }

    if (formData.homeAddress && formData.homeAddress.length > 255) {
      newErrors.homeAddress = "Địa chỉ nhà không được vượt quá 255 ký tự";
    }

    if (formData.officeAddress && formData.officeAddress.length > 255) {
      newErrors.officeAddress = "Địa chỉ công ty không được vượt quá 255 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      handleSubmitPersonalInfo();
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      goToRegister();
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Thông tin cơ bản";
      case 2: return "Thông tin cá nhân";
      case 3: return "Địa chỉ liên hệ";
      default: return "Thông tin cá nhân";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500"></div>
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-purple-500/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-pink-500/10 rounded-full blur-xl"></div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    step <= currentStep 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step < currentStep ? <FaCheck /> : step}
                  </div>
                  {step < totalSteps && (
                    <div className={`h-1 w-16 mx-2 transition-all duration-300 ${
                      step < currentStep ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 text-center">{getStepTitle()}</h2>
            <p className="text-gray-600 text-center mt-1">Bước {currentStep} / {totalSteps}</p>
          </div>

          {/* Step 1: Basic Info & Avatar */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Avatar Upload */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-2xl relative group cursor-pointer">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <FaCamera className="text-gray-400 text-3xl mb-2" />
                        <p className="text-xs text-gray-500">Thêm ảnh</p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <FaCamera className="text-white text-2xl" />
                    </div>
                    <input 
                      type="file" 
                      name="avatar" 
                      accept="image/*" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={handleAvatarChange} 
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <FaCamera className="text-white text-sm" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Tải lên ảnh đại diện của bạn<br />
                  <span className="text-xs text-gray-500">JPG, PNG tối đa 5MB</span>
                </p>
              </div>

              {/* Full Name */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <FaUser className="text-gray-400" />
                </div>
                <input 
                  name="fullName" 
                  placeholder="Nhập họ và tên đầy đủ" 
                  value={formData.fullName} 
                  onChange={handleChange} 
                  className={`w-full pl-12 pr-4 py-4 bg-gray-50/80 border-2 rounded-xl text-gray-800 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:bg-white focus:border-purple-500 focus:shadow-lg ${
                    errors.fullName ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                {errors.fullName && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1 ml-1"
                  >
                    {errors.fullName}
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 2: Personal Details */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Birthday & Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <FaCalendar className="text-gray-400" />
                  </div>
                  <input 
                    name="birthday" 
                    type="date" 
                    value={formData.birthday} 
                    onChange={handleChange} 
                    className={`w-full pl-12 pr-4 py-4 bg-gray-50/80 border-2 rounded-xl text-gray-800 transition-all duration-300 focus:outline-none focus:bg-white focus:border-purple-500 focus:shadow-lg ${
                      errors.birthday ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  {errors.birthday && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1 ml-1"
                    >
                      {errors.birthday}
                    </motion.p>
                  )}
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <FaTransgender className="text-gray-400" />
                  </div>
                  <select 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleChange} 
                    className="w-full pl-12 pr-4 py-4 bg-gray-50/80 border-2 rounded-xl text-gray-800 transition-all duration-300 focus:outline-none focus:bg-white focus:border-purple-500 focus:shadow-lg border-gray-200"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>

              {/* Nationality */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <FaGlobe className="text-gray-400" />
                </div>
                <select 
                  name="nationality" 
                  value={formData.nationality} 
                  onChange={handleChange} 
                  className={`w-full pl-12 pr-4 py-4 bg-gray-50/80 border-2 rounded-xl text-gray-800 transition-all duration-300 focus:outline-none focus:bg-white focus:border-purple-500 focus:shadow-lg ${
                    errors.nationality ? 'border-red-300' : 'border-gray-200'
                  }`}
                >
                  <option value="">Chọn quốc tịch</option>
                  {nationalities.map((nation) => (
                    <option key={nation} value={nation}>{nation}</option>
                  ))}
                </select>
                {errors.nationality && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1 ml-1"
                  >
                    {errors.nationality}
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: Address Information */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Home Address */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <FaHome className="text-gray-400" />
                </div>
                <input
                  name="homeAddress"
                  value={formData.homeAddress}
                  onChange={handleChange}
                  placeholder="Địa chỉ nhà (tùy chọn)"
                  className={`w-full pl-12 pr-4 py-4 bg-gray-50/80 border-2 rounded-xl text-gray-800 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:bg-white focus:border-purple-500 focus:shadow-lg ${
                    errors.homeAddress ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                {errors.homeAddress && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1 ml-1"
                  >
                    {errors.homeAddress}
                  </motion.p>
                )}
              </div>

              {/* Office Address */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <FaBuilding className="text-gray-400" />
                </div>
                <input
                  name="officeAddress"
                  value={formData.officeAddress}
                  onChange={handleChange}
                  placeholder="Địa chỉ công ty/nơi làm việc (tùy chọn)"
                  className={`w-full pl-12 pr-4 py-4 bg-gray-50/80 border-2 rounded-xl text-gray-800 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:bg-white focus:border-purple-500 focus:shadow-lg ${
                    errors.officeAddress ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
                {errors.officeAddress && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1 ml-1"
                  >
                    {errors.officeAddress}
                  </motion.p>
                )}
              </div>

              {/* Summary Card */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <h3 className="font-semibold text-gray-800 mb-4">Tóm tắt thông tin</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Họ tên:</span> {formData.fullName || 'Chưa nhập'}</p>
                  <p><span className="font-medium">Ngày sinh:</span> {formData.birthday || 'Chưa nhập'}</p>
                  <p><span className="font-medium">Giới tính:</span> {formData.gender || 'Chưa chọn'}</p>
                  <p><span className="font-medium">Quốc tịch:</span> {formData.nationality || 'Chưa chọn'}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={prevStep}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-300"
            >
              <FaArrowLeft />
              Quay lại
            </motion.button>

            {currentStep < totalSteps ? (
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={nextStep}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg"
              >
                Tiếp tục
              </motion.button>
            ) : (
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg"
              >
                Hoàn tất đăng ký
              </motion.button>
            )}
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Thông tin của bạn sẽ được bảo mật và chỉ sử dụng để cải thiện trải nghiệm mua sắm
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PersonalInfoForm;