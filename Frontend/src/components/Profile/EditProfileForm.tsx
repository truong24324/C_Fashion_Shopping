import React, { useState } from "react";
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
    FaUser,
    FaCalendarAlt,
    FaVenusMars,
    FaHome,
    FaBuilding,
    FaGlobe,
    FaCamera,
    FaCheck,
    FaTimes,
    FaArrowLeft,
    FaExclamationTriangle,
    FaTrash
} from "react-icons/fa";
import { User, EditProfileFormProps } from "../../components/CreateForm/Product/types";

const EditProfileForm: React.FC<EditProfileFormProps> = ({ user, setUser, setIsEditing}) => {
    const [formData, setFormData] = useState({
        fullName: user.fullName,
        birthday: user.birthday,
        gender: user.gender,
        homeAddress: user.homeAddress,
        officeAddress: user.officeAddress,
        nationality: user.nationality,
        avatarFile: null as File | null,
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const nationalities = [
        "Việt Nam", "Hoa Kỳ", "Anh", "Pháp", "Nhật Bản",
        "Hàn Quốc", "Trung Quốc", "Đức", "Úc", "Canada"
    ];

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

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
            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                // Adjust age if birthday hasn't occurred this year
            }

            if (age < 18) {
                newErrors.birthday = "Bạn phải đủ 18 tuổi";
            }

            if (birthDate > today) {
                newErrors.birthday = "Ngày sinh không thể là ngày tương lai";
            }
        }

        if (!formData.gender) {
            newErrors.gender = "Vui lòng chọn giới tính";
        }

        if (!formData.nationality) {
            newErrors.nationality = "Vui lòng chọn quốc tịch";
        }

        if (formData.homeAddress.length > 255) {
            newErrors.homeAddress = "Địa chỉ nhà không được vượt quá 255 ký tự";
        }

        if (formData.officeAddress.length > 255) {
            newErrors.officeAddress = "Địa chỉ công ty không được vượt quá 255 ký tự";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === "birthday") {
            const birthDate = new Date(value);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();

            if (!value) {
                setErrors(prev => ({ ...prev, birthday: "Ngày sinh không được để trống" }));
            } else if (birthDate > today) {
                setErrors(prev => ({ ...prev, birthday: "Ngày sinh không thể là ngày tương lai" }));
            } else if (age < 18) {
                setErrors(prev => ({ ...prev, birthday: "Bạn phải đủ 18 tuổi" }));
            } else {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.birthday;
                    return newErrors;
                });
            }
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({ ...prev, avatar: "Vui lòng chọn file hình ảnh" }));
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, avatar: "Kích thước file không được vượt quá 5MB" }));
                return;
            }

            setFormData(prev => ({ ...prev, avatarFile: file }));

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);

            // Clear avatar error
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.avatar;
                return newErrors;
            });
        }
    };

    const removeAvatar = () => {
        setFormData(prev => ({ ...prev, avatarFile: null }));
        setAvatarPreview(null);
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        const formDataToSend = new FormData();
        formDataToSend.append("fullName", formData.fullName);
        formDataToSend.append("birthday", formData.birthday);
        formDataToSend.append("gender", formData.gender);
        formDataToSend.append("homeAddress", formData.homeAddress);
        formDataToSend.append("officeAddress", formData.officeAddress);
        formDataToSend.append("nationality", formData.nationality);

        // Chỉ gửi tệp tin thật sự (avatarFile) khi có sự thay đổi
        if (formData.avatarFile) {
            formDataToSend.append("avatarFile", formData.avatarFile);
        } else {
            // Trường hợp không có avatarFile, giữ lại avatar cũ
            formDataToSend.append("avatar", user.avatar ?? "");
        }

        try {
            const response = await fetch(`/api/information/me`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: formDataToSend,
            });

            let data;
            try {
                data = await response.json();
            } catch (error: any) {
                console.warn("Không thể parse JSON:", error);
                toast.success(error.response?.data?.message || "Cập nhật thông tin thành công!");
                setUser((prevUser: User | null) => {
                    if (!prevUser) return null;
                    return {
                        ...prevUser,
                        ...formData,
                        avatar: formData.avatarFile ? URL.createObjectURL(formData.avatarFile) : prevUser.avatar,
                    };
                });
                setIsEditing(false);
                return;
            }

            if (response.ok && data?.success) {
                toast.success("Cập nhật thông tin thành công!");

                setUser((prevUser) => {
                    if (!prevUser) return null;
                    return {
                        ...prevUser,
                        ...formData,
                        avatar: formData.avatarFile ? URL.createObjectURL(formData.avatarFile) : prevUser.avatar,
                    };
                });

                setIsEditing(false);
            } else {
                throw new Error(data?.message || "Cập nhật thất bại!");
            }
        } catch (error: any) {
            console.error("Lỗi khi cập nhật thông tin:", error);
            toast.error(error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!");
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.3,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const InputField = ({
        label,
        name,
        value,
        onChange,
        type = "text",
        error,
        icon: Icon,
        placeholder,
        maxLength,
        required = false
    }: {
        label: string;
        name: string;
        value: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        type?: string;
        error?: string;
        icon: React.ComponentType<any>;
        placeholder?: string;
        maxLength?: number;
        required?: boolean;
    }) => (
        <motion.div className="space-y-2" variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-300">
                <div className="flex items-center space-x-2 mb-2">
                    <Icon className="text-blue-400" />
                    <span>{label}</span>
                    {required && <span className="text-red-400">*</span>}
                </div>
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    className={`w-full px-4 py-3 bg-gray-800/50 border-2 rounded-xl text-white placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${error ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                        }`}
                />
                {maxLength && (
                    <div className="flex justify-end mt-1">
                        <span className="text-xs text-gray-500">
                            {value.length}/{maxLength}
                        </span>
                    </div>
                )}
            </label>
            {error && (
                <motion.p
                    className="text-red-400 text-sm flex items-center space-x-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <FaExclamationTriangle className="text-xs" />
                    <span>{error}</span>
                </motion.p>
            )}
        </motion.div>
    );

    const SelectField = ({
        label,
        name,
        value,
        onChange,
        options,
        error,
        icon: Icon,
        placeholder,
        required = false
    }: {
        label: string;
        name: string;
        value: string;
        onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
        options: string[];
        error?: string;
        icon: React.ComponentType<any>;
        placeholder?: string;
        required?: boolean;
    }) => (
        <motion.div className="space-y-2" variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-300">
                <div className="flex items-center space-x-2 mb-2">
                    <Icon className="text-blue-400" />
                    <span>{label}</span>
                    {required && <span className="text-red-400">*</span>}
                </div>
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={`w-full px-4 py-3 bg-gray-800/50 border-2 rounded-xl text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${error ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                        }`}
                >
                    {placeholder && <option value="">{placeholder}</option>}
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </label>
            {error && (
                <motion.p
                    className="text-red-400 text-sm flex items-center space-x-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <FaExclamationTriangle className="text-xs" />
                    <span>{error}</span>
                </motion.p>
            )}
        </motion.div>
    );

    const currentAvatar = avatarPreview || user.avatar || "https://via.placeholder.com/150";

    return (
        <form
            onSubmit={(e) => { e.preventDefault(); handleSave(); }}
            className="max-w-2xl mx-auto"
        >
            <motion.div
                className="max-w-2xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header */}
                <motion.div
                    className="flex items-center space-x-3 mb-8"
                    variants={itemVariants}
                >
                    <motion.button
                        onClick={() => setIsEditing(false)}
                        className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FaArrowLeft className="text-gray-400" />
                    </motion.button>
                    <div className="flex items-center space-x-3">
                        <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                            <FaUser className="text-2xl text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Chỉnh sửa thông tin</h2>
                            <p className="text-gray-400 text-sm">Cập nhật thông tin cá nhân của bạn</p>
                        </div>
                    </div>
                </motion.div>

                {/* Avatar Section */}
                <motion.div
                    className="flex flex-col items-center mb-8 p-6 bg-gray-800/30 rounded-xl border border-gray-700/50"
                    variants={itemVariants}
                >
                    <div className="relative group">
                        <motion.div
                            className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500/50"
                            whileHover={{ scale: 1.05 }}
                        >
                            <img
                                src={currentAvatar}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <FaCamera className="text-white text-2xl" />
                            </div>
                        </motion.div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </div>
                    {formData.avatarFile && (
                        <motion.button
                            onClick={removeAvatar}
                            className="mt-4 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center space-x-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaTrash />
                            <span>Xoá ảnh</span>
                        </motion.button>
                    )}
                    {errors.avatar && (
                        <p className="text-red-400 text-sm mt-2 flex items-center space-x-1">
                            <FaExclamationTriangle className="text-xs" />
                            <span>{errors.avatar}</span>
                        </p>
                    )}
                </motion.div>

                {/* Form Fields */}
                <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" variants={itemVariants}>
                    <InputField
                        label="Họ và tên"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        icon={FaUser}
                        placeholder="Nhập họ và tên"
                        maxLength={100}
                        error={errors.fullName}
                        required
                    />
                    <InputField
                        label="Ngày sinh"
                        name="birthday"
                        value={formData.birthday}
                        onChange={handleChange}
                        type="date"
                        icon={FaCalendarAlt}
                        error={errors.birthday}
                        required
                    />
                    <SelectField
                        label="Giới tính"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        options={["Nam", "Nữ", "Khác"]}
                        icon={FaVenusMars}
                        error={errors.gender}
                        placeholder="Chọn giới tính"
                        required
                    />
                    <SelectField
                        label="Quốc tịch"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleChange}
                        options={nationalities}
                        icon={FaGlobe}
                        error={errors.nationality}
                        placeholder="Chọn quốc tịch"
                        required
                    />
                    <InputField
                        label="Địa chỉ nhà"
                        name="homeAddress"
                        value={formData.homeAddress}
                        onChange={handleChange}
                        icon={FaHome}
                        placeholder="Nhập địa chỉ nhà"
                        maxLength={255}
                        error={errors.homeAddress}
                    />
                    <InputField
                        label="Địa chỉ công ty"
                        name="officeAddress"
                        value={formData.officeAddress}
                        onChange={handleChange}
                        icon={FaBuilding}
                        placeholder="Nhập địa chỉ công ty"
                        maxLength={255}
                        error={errors.officeAddress}
                    />
                </motion.div>

                {/* Action Buttons */}
                <motion.div className="flex justify-end space-x-4" variants={itemVariants}>
                    <motion.button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white flex items-center space-x-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaTimes />
                        <span>Hủy</span>
                    </motion.button>
                    <motion.button
                        onClick={handleSave}
                        disabled={loading}
                        className={`px-6 py-3 rounded-xl text-white flex items-center space-x-2 ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                        whileHover={{ scale: loading ? 1 : 1.05 }}
                        whileTap={{ scale: loading ? 1 : 0.95 }}
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                            </svg>
                        ) : (
                            <FaCheck />
                        )}
                        <span>{loading ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                    </motion.button>
                </motion.div>
            </motion.div>
        </form>
    );
};

export default EditProfileForm;
