import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, Col, Spin, Row, Card } from 'antd';
import axios from 'axios';
import toast from 'react-hot-toast';

const { Option } = Select;

interface Product {
  id: number;
  productName: string;
  description: string;
  brandId: number;
  categoryId: number;
  supplierId: number;
  statusId: number;
}

interface OptionType {
  id: number;
  brandId?: number;
  brandName?: string;
  categoryId?: number;
  categoryName?: string;
  supplierId?: number;
  supplierName?: string;
  statusId?: number;
  statusName?: string;
  name?: string;
}

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

  // Lấy danh sách ban đầu
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [productsRes, brandsRes, categoriesRes, suppliersRes, statusRes] = await Promise.all([
          axios.get('/api/products/all', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/brands/all', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/categories/all', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/suppliers/all', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/product-status/all', { headers: { Authorization: `Bearer ${token}` } })
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

  // Khi chọn sản phẩm, tải chi tiết
  useEffect(() => {
    const fetchProductDetail = async () => {
      if (!selectedProductId || !dataLoaded) return;

      setLoading(true);
      try {
        const res = await axios.get(`/api/products/${selectedProductId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const product = res.data;

        form.setFieldsValue({
          productName: product.productName,
          description: product.description,
          brand: product.brandId,
          category: product.categoryId,
          supplier: product.supplierId,
          status: product.statusId
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
    if (!selectedProductId) {
      toast.error('Vui lòng chọn sản phẩm');
      return;
    }

    const payload = {
      ...values,
      brandId: values.brand,
      categoryId: values.category,
      supplierId: values.supplier,
      statusId: values.status
    };

    try {
      await axios.put(`/api/products/${selectedProductId}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Cập nhật sản phẩm thành công');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Cập nhật sản phẩm thất bại');
    }
  };

  return (
    <Card className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
      <Spin spinning={loading}>
        <Form layout="vertical" onFinish={onFinish} form={form}>
          {/* Chọn sản phẩm */}
          <Form.Item label="Chọn sản phẩm để chỉnh sửa">
            <Select
              showSearch
              placeholder="Chọn sản phẩm"
              onChange={(value: number) => setSelectedProductId(value)}
              filterOption={(input, option) =>
                option?.children
                  ? option.children.toString().toLowerCase().includes(input.toLowerCase())
                  : false
              }
            >
              {productList.map(product => (
                <Option key={product.id} value={product.id}>
                  {product.productName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Form chỉnh sửa */}
          <Form.Item
            label="Tên sản phẩm"
            name="productName"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="brand" label="Thương Hiệu" rules={[{ required: true }]}>
                <Select placeholder="Chọn thương hiệu">
                  {brands.map(brand => (
                    <Option key={brand.brandId} value={brand.brandId}>
                      {brand.brandName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="category" label="Loại Sản Phẩm" rules={[{ required: true }]}>
                <Select placeholder="Chọn loại sản phẩm">
                  {categories.map(category => (
                    <Option key={category.categoryId} value={category.categoryId}>
                      {category.categoryName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="supplier" label="Nhà Cung Cấp" rules={[{ required: true }]}>
                <Select placeholder="Chọn nhà cung cấp">
                  {suppliers.map(supplier => (
                    <Option key={supplier.supplierId} value={supplier.supplierId}>
                      {supplier.supplierName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="status" label="Trạng Thái" rules={[{ required: true }]}>
                <Select placeholder="Chọn trạng thái">
                  {productStatuses.map(status => (
                    <Option key={status.statusId} value={status.statusId}>
                      {status.statusName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full" loading={loading}>
              Cập nhật sản phẩm
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
};

export default UpdateProductForm;
