import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, Spin } from "antd";
import { CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const Material = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);
            await axios.post("/api/materials/add", {
                materialName: values.materialName,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            toast.success("🎉 Thêm chất liệu thành công!");
            form.resetFields();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "⚠️ Có lỗi xảy ra!");
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
                    🧵 Thêm chất liệu mới
                </Typography.Title>

                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    <Form.Item
                        name="materialName"
                        label="Tên chất liệu"
                        rules={[
                            { required: true, message: "⚠️ Vui lòng nhập tên chất liệu!" },
                            { min: 2, message: "⚠️ Tên phải ít nhất 2 ký tự!" },
                            { max: 50, message: "⚠️ Không quá 50 ký tự!" },
                            { pattern: /^[^\s]+(\s+[^\s]+)*$/, message: "⚠️ Không được nhập toàn khoảng trắng!" },
                            { pattern: /^[a-zA-Z0-9\sÀ-Ỹà-ỹ]+$/, message: "⚠️ Không được chứa ký tự đặc biệt!" },
                        ]}
                    >
                        <Input placeholder="Nhập tên chất liệu" className="rounded-lg" />
                    </Form.Item>

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

export default Material;
