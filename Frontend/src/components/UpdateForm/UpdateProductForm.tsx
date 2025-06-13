import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, Row, Col, Card, Spin, Typography, Divider } from 'antd';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Product, OptionType } from '../../components/CreateForm/Product/types';
const { Option } = Select;
const { Title } = Typography;

const UpdateProductForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [productList, setProductList] = useState<Product[]>([]);
  const [brands, setBrands] = useState<OptionType[]>([]);
  const [categories, setCategories] = useState<OptionType[]>([]);
  const [suppliers, setSuppliers] = useState<OptionType[]>([]);
  const [productStatuses, setProductStatuses] = useState<OptionType[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [productsRes, brandsRes, categoriesRes, suppliersRes, statusRes] = await Promise.all([
          axios.get('/api/products/all', { headers }),
          axios.get('/api/brands/all', { headers }),
          axios.get('/api/categories/all', { headers }),
          axios.get('/api/suppliers/all', { headers }),
          axios.get('/api/product-status/all', { headers }),
        ]);

        setProductList(productsRes.data.content || []);
        setBrands(brandsRes.data.content || []);
        setCategories(categoriesRes.data.content || []);
        setSuppliers(suppliersRes.data.content || []);
        setProductStatuses(statusRes.data.content || []);
        setDataLoaded(true);
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Lỗi khi tải dữ liệu ban đầu');
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchProductDetail = async () => {
      if (!selectedProductId || !dataLoaded) return;
      setLoading(true);
      try {
        const { data: product } = await axios.get(`/api/products/${selectedProductId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        form.setFieldsValue({
          productName: product.productName,
          description: product.description,
          brand: product.brandId,
          category: product.categoryId,
          supplier: product.supplierId,
          status: product.statusId,
        });
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Không thể tải chi tiết sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [selectedProductId, dataLoaded]);

  const onFinish = async (values: any) => {
    if (!selectedProductId) return toast.error('Vui lòng chọn sản phẩm');

    const payload = {
      ...values,
      brandId: values.brand,
      categoryId: values.category,
      supplierId: values.supplier,
      statusId: values.status,
    };

    try {
      await axios.put(`/api/products/${selectedProductId}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success('Cập nhật sản phẩm thành công');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Cập nhật sản phẩm thất bại');
    }
  };

  return (
    <Card className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
      <Title level={4}>Cập nhật sản phẩm</Title>
      <Divider />
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {/* Chọn sản phẩm */}
          <Form.Item label="Chọn sản phẩm để chỉnh sửa">
            <Select
              showSearch
              placeholder="Chọn sản phẩm"
              onChange={(value: number) => setSelectedProductId(value)}
              filterOption={(input, option) =>
                option && option.children
                  ? option.children.toString().toLowerCase().includes(input.toLowerCase())
                  : false
              }
            >
              {productList.map(p => (
                <Option key={p.productId} value={p.productId}>
                  {p.productName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Tên & mô tả */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="productName"
                label="Tên sản phẩm"
                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
              >
                <Input placeholder="Nhập tên sản phẩm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="description" label="Mô tả">
                <Input.TextArea rows={2} placeholder="Mô tả ngắn gọn" />
              </Form.Item>
            </Col>
          </Row>

          {/* Danh mục, thương hiệu, nhà cung cấp, trạng thái */}
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="brand" label="Thương hiệu" rules={[{ required: true }]}>
                <Select placeholder="Chọn thương hiệu">
                  {brands.map(b => (
                    <Option key={b.brandId} value={b.brandId}>
                      {b.brandName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="category" label="Loại sản phẩm" rules={[{ required: true }]}>
                <Select placeholder="Chọn loại sản phẩm">
                  {categories.map(c => (
                    <Option key={c.categoryId} value={c.categoryId}>
                      {c.categoryName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="supplier" label="Nhà cung cấp" rules={[{ required: true }]}>
                <Select placeholder="Chọn nhà cung cấp">
                  {suppliers.map(s => (
                    <Option key={s.supplierId} value={s.supplierId}>
                      {s.supplierName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
                <Select placeholder="Chọn trạng thái">
                  {productStatuses.map(st => (
                    <Option key={st.statusId} value={st.statusId}>
                      {st.statusName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Nút cập nhật */}
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Cập nhật sản phẩm
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
};

export default UpdateProductForm;
