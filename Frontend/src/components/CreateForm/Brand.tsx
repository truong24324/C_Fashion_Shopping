import { useState } from "react";
import { Form, Input, Upload, Button, Card, Typography, Spin } from "antd";
import { UploadOutlined, CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const Brand = () => {
    const [form] = Form.useForm();
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: Record<string, any>) => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("brandName", values.brandName || "");
            const logoFile = values.logo?.[0]?.originFileObj;
            if (logoFile) {
                formData.append("file", logoFile);
            }

            const response = await axios.post("/api/brands/add", formData, {
                headers: { "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            toast.success(response.data?.message || "🎉 Thêm mới thương hiệu thành công!");
            setPreview(null);
            form.resetFields();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "⚠️ Có lỗi xảy ra! Hãy thử lại.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = (file: any) => {
        const reader = new FileReader();
        reader.onload = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        return false;
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
                    🏷️ Thêm thương hiệu mới
                </Typography.Title>

                <Form form={form} onFinish={handleSubmit} layout="vertical">
                    {/* Nhập tên thương hiệu */}
                    <Form.Item
                        name="brandName"
                        label={<span className="text-gray-600">Tên thương hiệu</span>}
                        rules={[
                            { required: true, message: "⚠️ Vui lòng nhập tên thương hiệu!" },
                            { min: 3, message: "⚠️ Tên thương hiệu phải có ít nhất 3 ký tự!" },
                            { max: 50, message: "⚠️ Tên thương hiệu không được quá 50 ký tự!" },
                            { pattern: /^[^\s]+(\s+[^\s]+)*$/, message: "⚠️ Không được nhập toàn khoảng trắng!" },
                            { pattern: /^[a-zA-Z0-9\sÀ-Ỹà-ỹ]+$/, message: "⚠️ Không được chứa ký tự đặc biệt!" },
                            { pattern: /[a-zA-ZÀ-Ỹà-ỹ]/, message: "⚠️ Tên thương hiệu không được chỉ gồm số!" },
                        ]}
                    >
                        <Input placeholder="Nhập tên thương hiệu" className="rounded-lg" />
                    </Form.Item>

                    {/* Tải lên logo */}
                    <Form.Item
                        name="logo"
                        label={<span className="text-gray-600">Logo thương hiệu</span>}
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e?.fileList || []}
                        rules={[
                            { required: true, message: "⚠️ Vui lòng tải lên logo thương hiệu!" },
                            ({ getFieldValue }) => ({
                                validator(_, fileList) {
                                    if (!fileList || fileList.length === 0) {
                                        return Promise.reject("⚠️ Vui lòng tải lên logo!");
                                    }
                                    const file = fileList[0].originFileObj;
                                    const isImage = ["image/jpeg", "image/png", "image/jpg"].includes(file?.type);
                                    const isLt2M = file?.size / 1024 / 1024 < 2;

                                    if (!isImage) {
                                        return Promise.reject("⚠️ Chỉ chấp nhận file JPG, JPEG hoặc PNG!");
                                    }
                                    if (!isLt2M) {
                                        return Promise.reject("⚠️ Kích thước ảnh phải nhỏ hơn 2MB!");
                                    }
                                    return Promise.resolve();
                                },
                            }),
                        ]}
                    >
                        <Upload
                            beforeUpload={handlePreview}
                            maxCount={1}
                            listType="picture"
                            showUploadList={false}
                        >
                            <Button icon={<UploadOutlined />} className="rounded-lg">
                                Chọn tệp ảnh
                            </Button>
                        </Upload>
                    </Form.Item>

                    {/* Hiển thị ảnh xem trước */}
                    {preview && (
                        <div className="flex justify-center my-3">
                            <img
                                src={preview}
                                alt="Xem trước logo"
                                className="w-32 h-32 object-cover rounded-lg shadow-lg border border-gray-300"
                            />
                        </div>
                    )}

                    {/* Nút Submit với Loading */}
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

export default Brand;
