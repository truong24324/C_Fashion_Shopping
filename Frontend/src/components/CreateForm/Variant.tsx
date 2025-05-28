import React, { useEffect, useState } from "react";
import {
  Form,
  InputNumber,
  Select,
  Button,
  Card,
  Typography,
  Spin,
} from "antd";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";

const { Option } = Select;

const Variant = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({
    products: [] as any[],
    colors: [] as any[],
    sizes: [] as any[],
    materials: [] as any[],
  });

  // Hàm trích xuất mảng an toàn từ response
  const extractArray = (res: any) =>
    Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res?.data?.data)
      ? res.data.data
      : [];

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const headers = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };
        const [productRes, colorRes, sizeRes, materialRes] = await Promise.all([
          axios.get("/api/products/all", headers),
          axios.get("/api/colors/all", headers),
          axios.get("/api/sizes/all", headers),
          axios.get("/api/materials/all", headers),
        ]);

        setOptions({
          products: extractArray(productRes),
          colors: extractArray(colorRes),
          sizes: extractArray(sizeRes),
          materials: extractArray(materialRes),
        });
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ||
            "⚠️ Lỗi khi tải dữ liệu danh mục."
        );
      }
    };
    fetchOptions();
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const res = await axios.post(
        "/api/variants/add",
        {
          productId: values.productId,
          colorId: values.colorId,
          sizeId: values.sizeId,
          materialId: values.materialId,
          stock: values.stock,
          price: values.price,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(res.data?.message || "✅ Thêm biến thể thành công!");
      form.resetFields();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "❌ Lỗi khi thêm biến thể."
      );
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
      <Card className="p-6 rounded-2xl border border-gray-200 shadow-md">
        <Typography.Title level={3} className="text-center text-gray-700">
          ➕ Thêm biến thể sản phẩm
        </Typography.Title>

        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Form.Item
              name="productId"
              label="Sản phẩm"
              rules={[{ required: true }]}
              className="mb-0"
            >
              <Select placeholder="Chọn sản phẩm">
                {options.products.map((p: any) => (
                  <Option key={p.productId} value={p.productId}>
                    {p.productName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="colorId"
              label="Màu sắc"
              rules={[{ required: true }]}
              className="mb-0"
            >
              <Select placeholder="Chọn màu sắc">
                {options.colors.map((c: any) => (
                  <Option key={c.colorId} value={c.colorId}>
                    {c.colorName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="sizeId"
              label="Kích cỡ"
              rules={[{ required: true }]}
              className="mb-0"
            >
              <Select placeholder="Chọn kích cỡ">
                {options.sizes.map((s: any) => (
                  <Option key={s.sizeId} value={s.sizeId}>
                    {s.sizeName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="materialId"
              label="Chất liệu"
              rules={[{ required: true }]}
              className="mb-0"
            >
              <Select placeholder="Chọn chất liệu">
                {options.materials.map((m: any) => (
                  <Option key={m.materialId} value={m.materialId}>
                    {m.materialName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="stock"
            label="Tồn kho"
            rules={[{ required: true }]}
          >
            <InputNumber
              min={0}
              className="w-full"
              placeholder="Nhập số lượng tồn kho"
            />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá bán (VNĐ)"
            rules={[{ required: true }]}
          >
            <InputNumber
              min={0}
              className="w-full"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              placeholder="Nhập giá bán"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            icon={loading ? <LoadingOutlined /> : <CheckCircleOutlined />}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            {loading ? <Spin size="small" /> : "Thêm mới"}
          </Button>
        </Form>
      </Card>
    </motion.div>
  );
};

export default Variant;
