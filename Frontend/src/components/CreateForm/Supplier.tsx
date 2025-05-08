import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, Row, Col, Spin } from "antd";
import { CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const Supplier = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);
            const payload = {
                supplierName: values.supplierName.trim(),
                contactName: values.contactName?.trim() || "",
                phone: values.phone?.trim() || "",
                email: values.email?.trim() || "",
                address: values.address?.trim() || "",
            };

            await axios.post("/api/suppliers/add", payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            toast.success("🎉 Thêm nhà cung cấp thành công!");
            form.resetFields();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "⚠️ Có lỗi xảy ra! Hãy thử lại.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
                <Typography.Title level={3} className="text-center text-gray-700">
                    🏢 Thêm nhà cung cấp
                </Typography.Title>

                <Form form={form} onFinish={handleSubmit} layout="vertical">
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="supplierName"
                            label="Tên nhà cung cấp"
                            rules={[
                                { required: true, message: "⚠️ Vui lòng nhập tên nhà cung cấp!" },
                                { min: 3, message: "⚠️ Tên phải có ít nhất 3 ký tự!" },
                                { max: 100, message: "⚠️ Không quá 100 ký tự!" },
                            ]}
                        >
                            <Input placeholder="Nhập tên nhà cung cấp" className="rounded-lg" />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            name="contactName"
                            label="Tên người liên hệ"
                            rules={[{ max: 100, message: "⚠️ Không quá 100 ký tự!" }]}
                        >
                            <Input placeholder="Nhập tên liên hệ (nếu có)" className="rounded-lg" />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                            rules={[
                                { required: true, message: "⚠️ Vui lòng nhập số điện thoại!" },
                                { pattern: /^[0-9]{8,15}$/, message: "⚠️ Số điện thoại từ 8-15 chữ số!" },
                            ]}
                        >
                            <Input placeholder="Nhập số điện thoại" className="rounded-lg" />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Hàng 2 */}
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: "⚠️ Vui lòng nhập email!" },
                                { type: "email", message: "⚠️ Email không hợp lệ!" },
                                { max: 100, message: "⚠️ Không quá 100 ký tự!" },
                            ]}
                        >
                            <Input placeholder="Nhập email" className="rounded-lg" />
                        </Form.Item>
                    </Col>

                    <Col span={16}>
                        <Form.Item
                            name="address"
                            label="Địa chỉ"
                            rules={[{ max: 255, message: "⚠️ Không quá 255 ký tự!" }]}
                        >
                            <Input.TextArea placeholder="Nhập địa chỉ (nếu có)" className="rounded-lg" />
                        </Form.Item>
                    </Col>
                </Row>

                    <Button type="primary" htmlType="submit" icon={loading ? <LoadingOutlined /> : <CheckCircleOutlined />} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center">
                        {loading ? <Spin size="small" /> : "Thêm nhà cung cấp"}
                    </Button>
                </Form>
            </Card>
        </motion.div>
    );
};

export default Supplier;
