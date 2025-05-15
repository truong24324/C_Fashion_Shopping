import { useEffect, useState } from "react";
import { Rate, Button, Input, Form, Upload, message, List, Card, Typography, Row, Col, Image } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const { TextArea } = Input;
const { Title } = Typography;

interface DecodedToken {
  accountId: string;
  exp: number;
  iat: number;
  email: string;
  roles: { authority: string }[];
}

interface ProductItem {
  orderDetailId: number;
  productId: number;
  variantId: number;
  mainImageUrl: string;
  productName: string;
  colorName: string;
  sizeName: string;
  materialName: string;
  quantity: number;
  reviewed: boolean;
}

interface ReviewFormValues {
  rating: number;
  title: string;
  content: string;
  imageUrl?: any;
}

const getAccountIdFromToken = (): number | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded: DecodedToken = jwtDecode(token);
    return parseInt(decoded.accountId);
  } catch (error) {
    console.error("Lỗi giải mã token:", error);
    return null;
  }
};

const ProductReviewPage = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const accountId = getAccountIdFromToken();

  useEffect(() => {
    if (!accountId) return;
    axios
      .get(`/api/reviews/completed?accountId=${accountId}`)
      .then((res) => {
        setProducts(res.data);
      })
      .catch(() => message.error("Lỗi khi tải danh sách sản phẩm đã mua"));
  }, [accountId]);

  const handleSelectProduct = (product: ProductItem) => {
    setSelectedProduct(product);
    form.resetFields();
  };

  const handleSubmit = async (values: ReviewFormValues) => {
    if (!selectedProduct || !accountId) return;
    try {
      setLoading(true);
      await axios.post("/api/reviews/create", {
        ...values,
        rating: values.rating,
        imageUrl: values.imageUrl?.file?.response?.url || "",
        orderDetailId: selectedProduct.orderDetailId,
        productId: selectedProduct.productId,
        variantId: selectedProduct.variantId,
        accountId: accountId,
      });
      message.success("Đánh giá thành công");
      form.resetFields();
      setSelectedProduct(null);
      // Cập nhật lại danh sách
      const res = await axios.get(`/api/reviews/completed?accountId=${accountId}`);
      setProducts(res.data);
    } catch (error) {
      message.error("Đánh giá thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row gutter={24} style={{ padding: 24 }}>
      {/* Danh sách bên trái */}
      <Col span={10}>
        <Title level={4}>Sản phẩm đã mua</Title>
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={products}
          renderItem={(item) => (
            <List.Item>
              <Card
                hoverable
                onClick={() => handleSelectProduct(item)}
                style={{ backgroundColor: selectedProduct?.orderDetailId === item.orderDetailId ? "#f0f5ff" : "#fff" }}
              >
                <Row gutter={16} align="middle">
                  <Col flex="80px">
                    <Image src={item.mainImageUrl} alt={item.productName} width={60} />
                  </Col>
                  <Col flex="auto">
                    <div><strong>{item.productName}</strong></div>
                    <div>{item.colorName} / {item.sizeName} / {item.materialName}</div>
                    <div>Số lượng: {item.quantity}</div>
                  </Col>
                  <Col>
                    {item.reviewed ? <span style={{ color: "#52c41a" }}>Đã đánh giá</span> : <span>Chưa đánh giá</span>}
                  </Col>
                </Row>
              </Card>
            </List.Item>
          )}
        />
      </Col>

      {/* Form bên phải */}
      <Col span={14}>
        <Title level={4}>Viết đánh giá</Title>
        {selectedProduct ? (
          <Form layout="vertical" form={form} onFinish={handleSubmit}>
            <Form.Item name="rating" label="Đánh giá (sao)" rules={[{ required: true }]}>
              <Rate />
            </Form.Item>
            <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: "Nhập tiêu đề" }]}>
              <Input placeholder="Ví dụ: Sản phẩm rất tốt" />
            </Form.Item>
            <Form.Item name="content" label="Nội dung" rules={[{ required: true, message: "Nhập nội dung đánh giá" }]}>
              <TextArea rows={4} placeholder="Chia sẻ trải nghiệm của bạn..." />
            </Form.Item>
            <Form.Item name="imageUrl" label="Tải ảnh (tuỳ chọn)">
              <Upload
                name="file"
                action="/api/upload" // Đổi endpoint tùy backend
                listType="picture"
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Tải ảnh</Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Gửi đánh giá
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={() => setSelectedProduct(null)}>
                Hủy
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <p>Chọn một sản phẩm bên trái để đánh giá</p>
        )}
      </Col>
    </Row>
  );
};

export default ProductReviewPage;
