import { useState } from "react";
import { Form, Input, Button, Card, Typography, Spin } from "antd";
import { CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const Size = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: Record<string, any>) => {
        try {
            setLoading(true);
            const response = await axios.post("/api/sizes/add", values,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            toast.success(response.data?.message || "🎉 Thêm mới kích thước thành công!");
            form.resetFields();
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
                    📏 Thêm kích thước mới
                </Typography.Title>

                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    {/* Nhập tên kích thước */}
                    <Form.Item
                        name="sizeName"
                        label={<span className="text-gray-600">Tên kích thước</span>}
                        rules={[
                            { required: true, message: "⚠️ Vui lòng nhập tên kích thước!" },
                            { min: 1, max: 10, message: "⚠️ Tên kích thước phải từ 1 - 10 ký tự!" },
                            { pattern: /^[a-zA-Z0-9\s-]+$/, message: "⚠️ Chỉ chấp nhận chữ, số, khoảng trắng, dấu gạch ngang!" },
                        ]}
                    >
                        <Input placeholder="Nhập kích thước" className="rounded-lg" />
                    </Form.Item>

                    {/* Nút Submit với hiệu ứng Loading */}
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={loading ? <LoadingOutlined /> : <CheckCircleOutlined />}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center"
                    >
                        {loading ? <Spin size="small" /> : "Thêm mới"}
                    </Button>
                </Form>
            </Card>
        </motion.div>
    );
};

export default Size;
