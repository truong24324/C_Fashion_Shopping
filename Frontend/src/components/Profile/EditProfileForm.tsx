import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { motion } from 'framer-motion';
import toast from "react-hot-toast";
import { EditProfileFormProps, JwtPayload } from "../CreateForm/Product/types";
import { Form, DatePicker } from "antd";

const EditProfileForm: React.FC<EditProfileFormProps> = ({ user, setUser, setIsEditing }) => {
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

    const accountId = (jwtDecode(localStorage.getItem("token") || "") as JwtPayload).accountId;

    const nationalities = ["Việt Nam", "Hoa Kỳ", "Anh", "Pháp", "Nhật Bản", "Hàn Quốc", "Trung Quốc", "Đức", "Úc", "Canada"];

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.fullName.trim()) newErrors.fullName = "Họ và tên không được để trống";
        else if (formData.fullName.length > 100) newErrors.fullName = "Họ và tên không được vượt quá 100 ký tự";

        if (!formData.birthday) newErrors.birthday = "Ngày sinh không được để trống";
        else {
            const birthDate = new Date(formData.birthday);
            const age = new Date().getFullYear() - birthDate.getFullYear();
            if (age < 18) newErrors.birthday = "Bạn phải đủ 18 tuổi";
        }

        if (!formData.gender) newErrors.gender = "Vui lòng chọn giới tính";
        if (!formData.nationality) newErrors.nationality = "Vui lòng chọn quốc tịch";

        if (formData.homeAddress.length > 255) newErrors.homeAddress = "Địa chỉ nhà không được vượt quá 255 ký tự";
        if (formData.officeAddress.length > 255) newErrors.officeAddress = "Địa chỉ công ty không được vượt quá 255 ký tự";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

        if (e.target.name === "birthday") {
            const birthDate = new Date(e.target.value);
            const age = new Date().getFullYear() - birthDate.getFullYear();
            if (!e.target.value) {
                setErrors((prev) => ({ ...prev, birthday: "Ngày sinh không được để trống" }));
            } else if (age < 18) {
                setErrors((prev) => ({ ...prev, birthday: "Bạn phải đủ 18 tuổi" }));
            } else {
                setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.birthday;
                    return newErrors;
                });
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, avatarFile: e.target.files[0] });
        }
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
            formDataToSend.append("avatar", user.avatar);
        }

        try {
            const response = await fetch(`/api/information/${accountId}`, {
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
                setUser((prevUser) => {
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

    return (
        <>
            <motion.h2
                className="text-xl font-semibold text-gray-300 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Chỉnh sửa thông tin
            </motion.h2>

            <motion.div
                className="space-y-4 mt-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                {/* Avatar & Name */}
                <motion.div
                    className="flex items-center"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="relative">
                        <motion.img
                            src={formData.avatarFile ? URL.createObjectURL(formData.avatarFile) : user.avatar || "https://via.placeholder.com/150"}
                            alt="Avatar"
                            className="w-32 h-32 rounded-full object-cover border-4 border-yellow-500 cursor-pointer"
                            onClick={() => document.getElementById("avatarFileInput")?.click()}
                            whileHover={{ scale: 1.1 }}
                        />
                        <input type="file" name="avatarFile" onChange={handleFileChange} id="avatarFileInput" className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" />
                    </div>

                    <div className="ml-6 flex-1">
                        <label className="block">
                            <span className="text-gray-400">Họ và tên:</span>
                            <motion.input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 text-black rounded"
                                whileFocus={{ scale: 1.05 }}
                            />
                            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
                        </label>

                        <label className="block mt-4">
                            <span className="text-gray-400">Ngày sinh:</span>
                            <motion.input
                                type="date"
                                name="birthday"
                                value={formData.birthday}
                                onChange={handleChange}
                                className="w-full px-3 py-2 text-black rounded"
                                whileFocus={{ scale: 1.05 }}
                            />
                            {errors.birthday && <p className="text-red-500 text-sm">{errors.birthday}</p>}
                        </label>
                    </div>
                </motion.div>

                {/* Giới tính & Quốc tịch */}
                <motion.div className="flex space-x-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                    <label className="flex-1">
                        <span className="text-gray-400">Giới tính:</span>
                        <motion.select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full px-3 py-2 text-black rounded"
                            whileFocus={{ scale: 1.05 }}
                        >
                            <option value="">Chọn giới tính</option>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                        </motion.select>
                        {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
                    </label>

                    <label className="flex-1">
                        <span className="text-gray-400">Quốc tịch:</span>
                        <motion.select
                            name="nationality"
                            value={formData.nationality}
                            onChange={handleChange}
                            className="w-full px-3 py-2 text-black rounded"
                            whileFocus={{ scale: 1.05 }}
                        >
                            {nationalities.map((nationality) => (
                                <option key={nationality} value={nationality}>
                                    {nationality}
                                </option>
                            ))}
                        </motion.select>
                        {errors.nationality && <p className="text-red-500 text-sm">{errors.nationality}</p>}
                    </label>
                </motion.div>

                {/* Địa chỉ */}
                <label className="block">
                    <span className="text-gray-400">Địa chỉ nhà:</span>
                    <motion.input
                        type="text"
                        name="homeAddress"
                        value={formData.homeAddress}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-black rounded"
                        whileFocus={{ scale: 1.05 }}
                    />
                </label>

                <label className="block">
                    <span className="text-gray-400">Địa chỉ công ty:</span>
                    <motion.input
                        type="text"
                        name="officeAddress"
                        value={formData.officeAddress}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-black rounded"
                        whileFocus={{ scale: 1.05 }}
                    />
                </label>
            </motion.div>

            {/* Nút Lưu và Hủy */}
            <motion.div className="mt-6 flex justify-center space-x-4">
                <motion.button
                    onClick={handleSave}
                    className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-400 transition"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    Lưu
                </motion.button>
                <motion.button
                    onClick={() => setIsEditing(false)}
                    className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-400 transition"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    Hủy
                </motion.button>
            </motion.div>
        </>
    );

};

export default EditProfileForm;
