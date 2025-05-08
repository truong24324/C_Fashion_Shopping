import React, { useState } from "react";
import { Form, Input, InputNumber, DatePicker, Button, Card, Typography, Spin, Switch, Row, Col, Select,} from "antd";
import { CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const Discount = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      setLoading(true);
      const payload = {
        discountCode: values.discountCode.trim(),
        discountValue: values.discountValue,
        discountType: values.discountType,
        isActive: values.isActive || false,
        quantity: values.quantity,
        maxUsagePerUser: values.maxUsagePerUser || null,
        minOrderAmount: values.minOrderAmount || null,
        startDate: values.startDate.format("YYYY-MM-DD HH:mm:ss"),
        endDate: values.endDate?.format("YYYY-MM-DD HH:mm:ss") || null,
        description: values.description?.trim() || "",
      };

      const response = await axios.post(
        "/api/discounts/add",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(response.data?.message || "🎉 Thêm mã giảm giá thành công!");
      form.resetFields();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "⚠️ Có lỗi xảy ra! Hãy thử lại.";
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
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          {/* Hàng 1 */}
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="discountCode"
                label="Mã giảm giá"
                rules={[
                  { required: true, message: "⚠️ Vui lòng nhập mã giảm giá!" },
                  { min: 3, message: "⚠️ Mã giảm giá phải có ít nhất 3 ký tự!" },
                  { max: 20, message: "⚠️ Mã giảm giá không được quá 20 ký tự!" },
                  { pattern: /^[A-Za-z0-9]+$/, message: "⚠️ Không được chứa ký tự đặc biệt!" },
                ]}
              >
                <Input placeholder="Nhập mã giảm giá" className="rounded-lg" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="discountValue"
                label="Giá trị giảm (%)"
                rules={[
                  { required: true, message: "⚠️ Vui lòng nhập giá trị giảm!" },
                  { type: "number", min: 1, max: 100, message: "⚠️ Giá trị phải từ 1% đến 100%!" },
                ]}
              >
                <InputNumber
                  min={1}
                  max={100}
                  className="w-full rounded-lg"
                  placeholder="Nhập giá trị giảm"
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="quantity"
                label="Số lượng mã"
                rules={[
                  { required: true, message: "⚠️ Vui lòng nhập số lượng!" },
                  { type: "number", min: 1, message: "⚠️ Số lượng phải lớn hơn 0!" },
                ]}
              >
                <InputNumber min={1} className="w-full rounded-lg" placeholder="Nhập số lượng mã" />
              </Form.Item>
            </Col>
          </Row>

          {/* Hàng 2 */}
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="discountType" label="Loại giảm" rules={[{ required: true, message: "⚠️ Vui lòng chọn loại giảm!" }]}>
                <Select placeholder="Chọn loại giảm">
                  <Select.Option value="PERCENT">Phần trăm (%)</Select.Option>
                  <Select.Option value="AMOUNT">Số tiền (VNĐ)</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="startDate"
                label="Ngày bắt đầu"
                rules={[{ required: true, message: "⚠️ Vui lòng chọn ngày bắt đầu!" }]}
              >
                <DatePicker showTime className="w-full rounded-lg" />
              </Form.Item>
            </Col>
          </Row>

          {/* Hàng 3 */}
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="endDate" label="Ngày kết thúc (nếu có)">
                <DatePicker showTime className="w-full rounded-lg" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="maxUsagePerUser"
                label="Số lần dùng tối đa / người"
                rules={[{ type: "number", min: 1, message: "⚠️ Phải lớn hơn 0!" }]}
              >
                <InputNumber min={1} className="w-full rounded-lg" placeholder="Không giới hạn nếu để trống" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="minOrderAmount"
                label="Giá trị đơn tối thiểu (VNĐ)"
                rules={[{ type: "number", min: 0, message: "⚠️ Không được âm!" }]}
              >
                <InputNumber min={0} className="w-full rounded-lg" placeholder="Không bắt buộc" />
              </Form.Item>
            </Col>
          </Row>

          {/* Mô tả */}
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea placeholder="Nhập mô tả (nếu có)" className="rounded-lg" />
          </Form.Item>

          {/* Nút Submit */}
          <Button
            type="primary"
            htmlType="submit"
            icon={<CheckCircleOutlined />}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center"
          >
            {loading ? <Spin size="small" /> : "Thêm mã giảm giá"}
          </Button>
        </Form>
      </Card>
    </motion.div>
  );
};

export default Discount;
