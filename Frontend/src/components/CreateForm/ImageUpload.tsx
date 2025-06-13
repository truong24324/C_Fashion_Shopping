import React, { useState, useEffect } from "react";
import { Form, Select, Upload, Button, message, Typography } from "antd";
import axios from "axios";
import toast from "react-hot-toast";
import Card from "../../components/UI/Card";
import { FormState, Product } from "./Product/types";

const { Option } = Select;
const { Title } = Typography;

const imageTypes = ["MAIN", "SECONDARY", "OTHER"];

const ImageUpload: React.FC = () => {
  const [productOptions, setProductOptions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [formState, setFormState] = useState<FormState>({
    label: "Ảnh sản phẩm",
    imageType: "MAIN",
    productId: null,
    fileList: [],
  });

  // Load danh sách sản phẩm khi mở form
  useEffect(() => {
    axios
      .get("/api/products/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const data = res.data?.content || res.data.content;
        if (Array.isArray(data)) {
          setProductOptions(data);
        } else {
          toast.error("Dữ liệu sản phẩm không hợp lệ.");
        }
      })
      .catch((err: any) => {
        toast.error(err.response?.data?.message || "Lỗi khi tải sản phẩm.");
      });
  }, []);

  // Xử lý thay đổi form
  const handleChange = (key: keyof FormState, value: any) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };
  
  const handleUpload = async () => {
    const { productId, imageType, fileList } = formState;
    const file = fileList[0]?.originFileObj;

    if (!productId || !imageType || !file) {
      message.error("Vui lòng chọn sản phẩm, loại ảnh và ảnh.");
      return;
    }

    const formData = new FormData();
    formData.append("productId", productId.toString());
    formData.append("imageType", imageType);
    formData.append("image", file);

    setLoading(true);
    try {
      await axios.post("/api/products/upload", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      message.success("Ảnh đã được tải lên thành công!");
      toast.success("Ảnh đã được tải lên thành công!");
      setFormState((prev) => ({ ...prev, fileList: [] })); // reset ảnh
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi không xác định khi tải ảnh.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
        <Title level={4}>Tải ảnh sản phẩm</Title>
        <Form layout="vertical" style={{ maxWidth: 480 }}>
          <Form.Item label="Chọn sản phẩm" required>
            <Select
              showSearch
              placeholder="Chọn sản phẩm"
              value={formState.productId}
              onChange={(value) => handleChange("productId", Number(value))}
              filterOption={(input, option) =>
                (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {productOptions.map((product) => (
                <Option key={product.productId} value={product.productId}>
                  {product.productName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Loại ảnh" required>
            <Select
              value={formState.imageType}
              onChange={(value) => handleChange("imageType", value)}
            >
              {imageTypes.map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Chọn ảnh" required>
            <div>
              <Upload
                fileList={formState.fileList}
                beforeUpload={() => false}
                onChange={({ fileList }) => {
                  // Chỉ giữ một file duy nhất
                  const latest = fileList.slice(-1);
                  setFormState((prev) => ({
                    ...prev,
                    fileList: [...latest], // tránh truyền mảng gốc
                  }));
                }}
                listType="picture-card"
                maxCount={1}
              >
                {formState.fileList.length === 0 && "+ Tải ảnh"}
              </Upload>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              onClick={handleUpload}
              loading={loading}
              disabled={
                !formState.productId || formState.fileList.length === 0 || loading
              }
            >
              Tải ảnh
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ImageUpload;
