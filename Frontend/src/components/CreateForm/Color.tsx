import { useState } from "react";
import { Form, Input, Button, Card, Typography, Spin } from "antd";
import { SketchPicker } from "react-color";
import { CheckCircleOutlined, LoadingOutlined, BgColorsOutlined } from "@ant-design/icons";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const Color = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [color, setColor] = useState("#000000"); // Màu mặc định
    const [showPicker, setShowPicker] = useState(false);

    const handleSubmit = async (values: { colorName: string; colorCode: string }) => {
        try {
            setLoading(true);
            const response = await axios.post("/api/colors/add", values,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            toast.success(response.data?.message || "🎨 Thêm màu sắc thành công!");
            form.resetFields();
            setColor("#000000"); // Reset về màu đen sau khi thêm
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "⚠️ Có lỗi xảy ra! Hãy thử lại.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w mx-auto"
        >
            <Card className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
                <Typography.Title level={3} className="text-center text-gray-700">
                    🎨 Thêm màu sắc mới
                </Typography.Title>

                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    {/* Nhập tên màu */}
                    <Form.Item
                        name="colorName"
                        label={<span className="text-gray-600">Tên màu</span>}
                        rules={[
                            { required: true, message: "⚠️ Vui lòng nhập tên màu!" },
                            { min: 2, message: "⚠️ Tên màu phải có ít nhất 2 ký tự!" },
                            { max: 30, message: "⚠️ Tên màu không được quá 30 ký tự!" },
                            { pattern: /^[^\s]+(\s+[^\s]+)*$/, message: "⚠️ Không được nhập toàn khoảng trắng!" },
                            { pattern: /^[a-zA-Z0-9\sÀ-Ỹà-ỹ]+$/, message: "⚠️ Không được chứa ký tự đặc biệt!" },
                        ]}
                    >
                        <Input placeholder="Nhập tên màu" className="rounded-lg" />
                    </Form.Item>

                    {/* Nhập mã màu với nút mở bảng chọn màu */}
                    <Form.Item
                        name="colorCode"
                        label={<span className="text-gray-600">Mã màu (HEX)</span>}
                        rules={[
                            { required: true, message: "⚠️ Vui lòng nhập mã màu!" },
                            { pattern: /^#([0-9A-Fa-f]{3}){1,2}$/, message: "⚠️ Mã màu không hợp lệ! VD: #FF5733" },
                        ]}
                    >
                        <div className="flex items-center space-x-2">
                            {/* Ô hiển thị màu */}
                            <div
                                className="w-10 h-10 rounded border border-gray-400"
                                style={{ backgroundColor: color }}
                            />
                            {/* Ô nhập mã màu */}
                            <Input
                                placeholder="VD: #FF5733"
                                className="rounded-lg"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                            />
                            {/* Nút mở bảng chọn màu */}
                            <Button
                                icon={<BgColorsOutlined />}
                                onClick={() => setShowPicker(!showPicker)}
                                className="border border-gray-400 hover:border-blue-500"
                            />
                        </div>
                    </Form.Item>

                    {/* Hiển thị bảng chọn màu khi người dùng bấm nút */}
                    {showPicker && (
                        <div className="absolute z-10 mt-2 shadow-lg border rounded-lg">
                            <SketchPicker
                                color={color}
                                onChange={(updatedColor: { hex: string }) => {
                                    setColor(updatedColor.hex);
                                    form.setFieldsValue({ colorCode: updatedColor.hex });
                                }}
                                styles={{
                                    default: {
                                        picker: {
                                            position: "absolute",
                                            top: "-250px", // Đẩy bảng màu lên trên
                                            left: "500",
                                            zIndex: 1000, // Đảm bảo bảng màu hiển thị trên các phần tử khác
                                        },
                                    },
                                }}
                            />
                        </div>
                    )}

                    {/* Nút Submit với hiệu ứng Loading */}
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={loading ? <LoadingOutlined /> : <CheckCircleOutlined />}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center"
                    >
                        {loading ? <Spin size="small" /> : "Thêm màu"}
                    </Button>
                </Form>
            </Card>
        </motion.div>
    );
};

export default Color;
