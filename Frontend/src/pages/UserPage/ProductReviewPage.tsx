import { useEffect, useState } from "react";
import { Rate, Button, Input, Form, Upload, List, Card, Typography, Row, Col, Image } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-hot-toast";
import axios from "axios";
import Navbar from "src/Layouts/Navbar";
import Footer from "src/Layouts/Footer";

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
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);

  useEffect(() => {
    if (!accountId) return;
    axios
      .get(`/api/reviews/completed?accountId=${accountId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      )
      .then((res) => {
        setProducts(res.data);
      })
      .catch((error: any) => toast.error(error.response?.data?.message || "Lỗi khi tải danh sách sản phẩm đã mua"));
  }, [accountId]);

  const handleSelectProduct = async (product: ProductItem) => {
    setSelectedProduct(product);
    form.resetFields();
    setEditingReviewId(null); // reset trạng thái cũ

    if (product.reviewed && selectedProduct) {
      try {
        const res = await axios.get(`/api/reviews/detail?orderDetailId=${selectedProduct.orderDetailId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          }
        });

        const review = res.data;

        form.setFieldsValue({
          rating: review.rating,
          title: review.title,
          content: review.content,
          imageUrl: review.imageUrl ? { file: { originFileObj: review.imageUrl } } : null,
        });

        setEditingReviewId(review.reviewId);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Lỗi tải đánh giá cũ");
      }
    }
  };

  const handleSubmit = async (values: ReviewFormValues) => {
    if (!selectedProduct || !accountId) return;
    const formData = new FormData();
    formData.append("review", new Blob([JSON.stringify({
      reviewId: editingReviewId,
      rating: values.rating,
      title: values.title,
      content: values.content,
      orderDetailId: selectedProduct.orderDetailId
    })], { type: "application/json" }));

    setLoading(true);
    try {
      await axios.post("/api/reviews/submit", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      toast.success(editingReviewId ? "Cập nhật thành công" : "Đánh giá thành công");

      setProducts((prev) =>
        prev.map((item) =>
          item.orderDetailId === selectedProduct.orderDetailId
            ? { ...item, reviewed: true }
            : item
        )
      );

      setEditingReviewId(null);
      setSelectedProduct(null);
      form.resetFields();

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi gửi đánh giá");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editingReviewId) return;
    try {
      await axios.delete(`/api/reviews/delete/${editingReviewId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      toast.success("Đã xóa đánh giá");
      setEditingReviewId(null);
      setSelectedProduct(null);
      form.resetFields();
      const res = await axios.get(`/api/reviews/completed?accountId=${accountId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProducts(res.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi xóa đánh giá");
    }
  };

  return (
    <><Navbar/>
   
    <div className="pt-10 p-4 md:p-6 max-w-screen-xl mx-auto">
      <h1 className="pt-20 text-2xl md:text-3xl font-semibold text-center mb-6">Đánh giá sản phẩm</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Danh sách sản phẩm đã mua */}
        <div className="w-full md:w-2/5">
          <h2 className="text-xl font-semibold mb-4">Sản phẩm đã mua</h2>
          <div className="space-y-4">
            {products.map((item) => (
              <div
                key={item.orderDetailId}
                onClick={() => handleSelectProduct(item)}
                className={`border rounded-xl p-4 flex items-center gap-4 cursor-pointer transition
                  ${selectedProduct?.orderDetailId === item.orderDetailId ? "bg-blue-50 border-blue-400" : "bg-white"}
                `}
              >
                <img
                  src={item.mainImageUrl}
                  alt={item.productName}
                  className="w-16 h-16 rounded object-cover"
                />
                <div className="flex-1">
                  <div className="font-semibold">{item.productName}</div>
                  <div className="text-sm text-gray-500">
                    {item.colorName} / {item.sizeName} / {item.materialName}
                  </div>
                  <div className="text-sm mt-1">Số lượng: {item.quantity}</div>
                  <div className="text-sm mt-1">
                    {item.reviewed ? (
                      <span className="text-green-600 font-medium">✔ Đã đánh giá</span>
                    ) : (
                      <span className="text-yellow-600 font-medium">⏳ Chưa đánh giá</span>
                    )}
                  </div>
                </div>
                {editingReviewId && (
                  <button
                    className="text-red-500 hover:underline text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                    }}
                  >
                    Xóa
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form đánh giá */}
        <div className="w-full md:w-3/5">
          <h2 className="text-xl font-semibold mb-4">Viết đánh giá</h2>
          {selectedProduct ? (
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              className="space-y-4 bg-gray-50 p-6 rounded-xl border"
            >
              <Form.Item
                label="Đánh giá (sao)"
                name="rating"
                rules={[{ required: true, message: "Vui lòng chọn số sao" }]}
              >
                <Rate allowHalf />
              </Form.Item>

              <Form.Item
                label="Tiêu đề"
                name="title"
                rules={[{ required: true, message: "Tiêu đề không được để trống" }]}
              >
                <Input
                  className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Ví dụ: Sản phẩm rất tốt"
                />
              </Form.Item>

              <Form.Item
                label="Nội dung"
                name="content"
                rules={[{ required: true, message: "Nội dung không được để trống" }]}
              >
                <TextArea
                  className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                  rows={4}
                  placeholder="Chia sẻ trải nghiệm của bạn..."
                />
              </Form.Item>

              <div className="flex gap-3">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="bg-blue-600 text-white font-medium px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  {loading ? "Đang gửi..." : "Gửi đánh giá"}
                </Button>
                <Button
                  type="default"
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-600 hover:underline"
                >
                  Hủy
                </Button>
              </div>
            </Form>
          ) : (
            <div className="p-6 bg-white rounded-xl border text-center text-gray-500">
              Chọn một sản phẩm bên trái để đánh giá
            </div>
          )}
        </div>
      </div>
    </div>
     <Footer/>
    </>
  );
};

export default ProductReviewPage;