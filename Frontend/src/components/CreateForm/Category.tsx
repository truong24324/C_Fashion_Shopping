import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, Spin } from "antd";
import { CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const Category = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: Record<string, any>) => {
        try {
            setLoading(true);
            const response = await axios.post("/api/categories/add", values,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            toast.success(response.data?.message || "🎉 Thêm loại sản phẩm thành công!");
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
                    📂 Thêm loại sản phẩm
                </Typography.Title>

                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    {/* Nhập tên loại sản phẩm */}
                    <Form.Item
                        name="categoryName"
                        label={<span className="text-gray-600">Tên loại sản phẩm</span>}
                        rules={[
                            { required: true, message: "⚠️ Vui lòng nhập tên loại sản phẩm!" },
                            { min: 2, message: "⚠️ Tên loại sản phẩm phải có ít nhất 2 ký tự!" },
                            { max: 50, message: "⚠️ Tên loại sản phẩm không được quá 50 ký tự!" },
                            { pattern: /^[^\s]+(\s+[^\s]+)*$/, message: "⚠️ Không được nhập toàn khoảng trắng!" },
                            { pattern: /^[a-zA-Z0-9\sÀ-Ỹà-ỹ]+$/, message: "⚠️ Không được chứa ký tự đặc biệt!" },
                        ]}
                    >
                        <Input placeholder="Nhập tên loại sản phẩm" className="rounded-lg" />
                    </Form.Item>
                    {/* Nhập mô tả loại sản phẩm */}
                    <Form.Item
                        name="description"
                        label={<span className="text-gray-600">Mô tả</span>}
                    >
                        <Input.TextArea placeholder="Nhập mô tả (nếu có)" className="rounded-lg" />
                    </Form.Item>

                    {/* Nút Submit với Loading */}
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={loading ? <LoadingOutlined /> : <CheckCircleOutlined />}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center"
                    >
                        {loading ? <Spin size="small" /> : "Thêm loại sản phẩm"}
                    </Button>
                </Form>
            </Card>
        </motion.div>
    );
};

export default Category;
