import React, { useState } from "react";
import { motion } from 'framer-motion';
import {
    FaKey,
    FaEye,
    FaEyeSlash,
    FaLock,
    FaUserShield,
    FaCheck,
    FaTimes,
    FaExclamationTriangle,
    FaArrowLeft
} from "react-icons/fa";
import toast from 'react-hot-toast';
import { EditProfileFormProps } from "../../components/CreateForm/Product/types";

const ChangePasswordForm: React.FC<EditProfileFormProps> = ({ setIsChangePassword }) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    // Password strength validation
    const getPasswordStrength = (password: string) => {
        let strength = 0;
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            numbers: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        Object.values(checks).forEach(check => check && strength++);
        return { strength, checks };
    };

    const passwordStrength = getPasswordStrength(newPassword);

    const getStrengthColor = (strength: number) => {
        if (strength <= 2) return "bg-red-500";
        if (strength <= 3) return "bg-yellow-500";
        if (strength <= 4) return "bg-blue-500";
        return "bg-green-500";
    };

    const getStrengthText = (strength: number) => {
        if (strength <= 2) return "Yếu";
        if (strength <= 3) return "Trung bình";
        if (strength <= 4) return "Mạnh";
        return "Rất mạnh";
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!currentPassword.trim()) {
            newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
        }

        if (!newPassword.trim()) {
            newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
        } else if (newPassword.length < 8) {
            newErrors.newPassword = "Mật khẩu mới phải có ít nhất 8 ký tự";
        } else if (passwordStrength.strength < 3) {
            newErrors.newPassword = "Mật khẩu quá yếu. Vui lòng sử dụng mật khẩu mạnh hơn";
        }

        if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = "Xác nhận mật khẩu không khớp";
        }

        if (currentPassword === newPassword) {
            newErrors.newPassword = "Mật khẩu mới phải khác mật khẩu hiện tại";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChangePassword = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 2000));

            const success = Math.random() > 0.3; // 70% success rate demo

            if (!success) {
                throw new Error("Mật khẩu hiện tại không đúng");
            }

            const response = await fetch(`/api/password/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await response.json();
            if (response.ok && data.success) {
                toast.success("Đổi mật khẩu thành công!");
                setIsChangePassword(false);
            } else {
                throw new Error(data.message || "Đổi mật khẩu thất bại");
            }
        } catch (error: any) {
            const errorMessage = error.message || "Có lỗi xảy ra!";
            setErrors({ currentPassword: errorMessage });
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
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
        value,
        onChange,
        type = "password",
        showPassword,
        onToggleVisibility,
        error,
        icon: Icon,
        placeholder
    }: {
        label: string;
        value: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        type?: string;
        showPassword?: boolean;
        onToggleVisibility?: () => void;
        error?: string;
        icon: React.ComponentType<any>;
        placeholder?: string;
    }) => (
        <motion.div className="space-y-2" variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-300">
                <div className="flex items-center space-x-2 mb-2">
                    <Icon className="text-blue-400" />
                    <span>{label}</span>
                </div>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : type}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        className={`w-full px-4 py-3 bg-gray-800/50 border-2 rounded-xl text-white placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${error ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                            }`}
                    />
                    {type === "password" && onToggleVisibility && (
                        <button
                            type="button"
                            onClick={onToggleVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    )}
                </div>
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

    const PasswordStrengthIndicator = () => (
        <motion.div
            className="space-y-3"
            variants={itemVariants}
            initial={{ opacity: 0 }}
            animate={{ opacity: newPassword ? 1 : 0 }}
        >
            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Độ mạnh mật khẩu:</span>
                <span className={`text-sm font-medium ${passwordStrength.strength <= 2 ? 'text-red-400' :
                    passwordStrength.strength <= 3 ? 'text-yellow-400' :
                        passwordStrength.strength <= 4 ? 'text-blue-400' : 'text-green-400'
                    }`}>
                    {getStrengthText(passwordStrength.strength)}
                </span>
            </div>

            <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((level) => (
                    <div
                        key={level}
                        className={`h-2 flex-1 rounded-full transition-all duration-300 ${level <= passwordStrength.strength
                            ? getStrengthColor(passwordStrength.strength)
                            : 'bg-gray-600'
                            }`}
                    />
                ))}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                    { key: 'length', label: 'Ít nhất 8 ký tự' },
                    { key: 'uppercase', label: 'Chữ hoa' },
                    { key: 'lowercase', label: 'Chữ thường' },
                    { key: 'numbers', label: 'Số' },
                    { key: 'special', label: 'Ký tự đặc biệt' }
                ].map((requirement) => (
                    <div
                        key={requirement.key}
                        className={`flex items-center space-x-1 ${passwordStrength.checks[requirement.key as keyof typeof passwordStrength.checks]
                            ? 'text-green-400'
                            : 'text-gray-500'
                            }`}
                    >
                        {passwordStrength.checks[requirement.key as keyof typeof passwordStrength.checks] ? (
                            <FaCheck className="text-xs" />
                        ) : (
                            <FaTimes className="text-xs" />
                        )}
                        <span>{requirement.label}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );

    return (
        <motion.div
            className="max-w-md mx-auto"
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
                    onClick={() => setIsChangePassword(false)}
                    className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <FaArrowLeft className="text-gray-400" />
                </motion.button>
                <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                        <FaUserShield className="text-2xl text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Đổi mật khẩu</h2>
                        <p className="text-gray-400 text-sm">Cập nhật mật khẩu để bảo vệ tài khoản</p>
                    </div>
                </div>
            </motion.div>

            {/* Form */}
            <motion.div className="space-y-6" variants={itemVariants}>
                <InputField
                    label="Mật khẩu hiện tại"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    showPassword={showPasswords.current}
                    onToggleVisibility={() => togglePasswordVisibility('current')}
                    error={errors.currentPassword}
                    icon={FaKey}
                    placeholder="Nhập mật khẩu hiện tại"
                />

                <InputField
                    label="Mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    showPassword={showPasswords.new}
                    onToggleVisibility={() => togglePasswordVisibility('new')}
                    error={errors.newPassword}
                    icon={FaLock}
                    placeholder="Nhập mật khẩu mới"
                />

                {newPassword && <PasswordStrengthIndicator />}

                <InputField
                    label="Xác nhận mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    showPassword={showPasswords.confirm}
                    onToggleVisibility={() => togglePasswordVisibility('confirm')}
                    error={errors.confirmPassword}
                    icon={FaUserShield}
                    placeholder="Nhập lại mật khẩu mới"
                />
            </motion.div>

            {/* Security Tips */}
            <motion.div
                className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl"
                variants={itemVariants}
            >
                <div className="flex items-center space-x-2 mb-2">
                    <FaUserShield className="text-blue-400" />
                    <h3 className="text-sm font-medium text-blue-400">Lời khuyên bảo mật</h3>
                </div>
                <ul className="text-xs text-gray-400 space-y-1">
                    <li>• Sử dụng mật khẩu duy nhất cho từng tài khoản</li>
                    <li>• Không chia sẻ mật khẩu với bất kỳ ai</li>
                    <li>• Đổi mật khẩu định kỳ (3-6 tháng)</li>
                    <li>• Kích hoạt xác thực 2 lớp để bảo mật tốt hơn</li>
                </ul>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
                className="flex space-x-4 mt-8"
                variants={itemVariants}
            >
                <motion.button
                    onClick={handleChangePassword}
                    disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                    className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${loading || !currentPassword || !newPassword || !confirmPassword
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg'
                        }`}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Đang xử lý...</span>
                        </>
                    ) : (
                        <>
                            <FaCheck />
                            <span>Đổi mật khẩu</span>
                        </>
                    )}
                </motion.button>

                <motion.button
                    onClick={() => setIsChangePassword(false)}
                    className="px-6 py-3 rounded-xl font-medium bg-gray-600 hover:bg-gray-700 text-white transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    Hủy
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default ChangePasswordForm;