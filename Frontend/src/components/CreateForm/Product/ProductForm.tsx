import React, { useState } from "react";
import { Form, Input, Select, Button, Row, Col, Upload } from "antd";
import { BarcodeOutlined } from "@ant-design/icons";  // ✅ Sửa lỗi
import type { UploadFile } from "antd/es/upload/interface";
import VariantForm from "./VariantForm";
import { Brand, Category, Supplier, Status, Color, Size, Material, Variant } from "./types";
const { Option } = Select;  // ✅ Thêm dòng này để tránh lỗi

interface Props {
    onSubmit: (values: any) => void;
    brands: Brand[];
    categories: Category[];
    suppliers: Supplier[];
    statuses: Status[];
    imageList: UploadFile[];
    setImageList: React.Dispatch<React.SetStateAction<UploadFile[]>>;
    variants: Variant[];
    setVariants: React.Dispatch<React.SetStateAction<Variant[]>>;
    colors: Color[];   // ✅ Thêm dòng này
    sizes: Size[];     // ✅ Thêm dòng này
    materials: Material[]; // ✅ Thêm dòng này
    loading: boolean; // ✅ Thêm dòng này
}

const ProductForm: React.FC<Props> = ({ onSubmit, brands, categories, suppliers, statuses, imageList, setImageList, colors, sizes, materials, }) => {
    const [form] = Form.useForm();
    const [variants, setVariants] = useState<Variant[]>([]);

    const handleImageChange = ({ fileList }: { fileList: UploadFile[] }) => setImageList([...fileList]);
    const [loading, setLoading] = useState(false);
    const generateBarcode = () => {
        return Math.floor(100000000000 + Math.random() * 900000000000).toString();
    };
    const warrantyOptions = ["Không bảo hành", "1 Tháng", "3 Tháng", "6 Tháng", "9 Tháng", "1 Năm"];

    return (
        <Form
            form={form}
            onFinish={async (values) => {
                try {
                    setLoading(true); // bật loading
                    await onSubmit(values); // chờ submit xong
                } finally {
                    setLoading(false); // tắt loading dù thành công hay thất bại
                }
            }}
            layout="vertical"
        >
            <Row gutter={16}>
                <Col md={8} sm={24}>
                    <Form.Item label="Ảnh Sản Phẩm" name="productImages">
                        <Upload
                            listType="picture-card"
                            fileList={imageList}
                            onChange={handleImageChange}
                            beforeUpload={() => false}
                            className="border-2 border-gray-400 hover:border-blue-500 rounded-lg shadow-md">
                            {imageList.length < 6 && "+ Tải lên"}
                        </Upload>
                    </Form.Item>
                    <VariantForm
                        variants={variants}
                        setVariants={setVariants}
                        colors={colors}
                        sizes={sizes}
                        materials={materials}
                    />
                </Col>
                <Col md={16} sm={24}>
                    <Form.Item
                        name="productName"
                        label="Tên Sản Phẩm"
                        rules={[
                            { required: true, message: "Vui lòng nhập tên sản phẩm!" },
                            { min: 3, message: "Tên sản phẩm phải có ít nhất 3 ký tự!" },
                            { max: 100, message: "Tên sản phẩm không được quá 100 ký tự!" },
                            {
                                pattern: /^[\p{L}0-9\s]+$/u, // Chỉ cho phép chữ cái, số và khoảng trắng
                                message: "Tên sản phẩm chỉ được chứa chữ cái, số và khoảng trắng!",
                            },
                        ]}
                    >
                        <Input
                            placeholder="Nhập tên sản phẩm"
                            onBlur={(e) => {
                                const formattedValue = e.target.value
                                    .trim()
                                form.setFieldsValue({ productName: formattedValue });
                            }}
                        />
                    </Form.Item>

                    {/* Hàng 2: 4 ComboBox */}
                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item name="brand" label="Thương Hiệu" rules={[{ required: true }]}>
                                <Select placeholder="Chọn thương hiệu"
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        typeof option?.children === "string" &&
                                        (option.children as string).toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {brands.map((brand) => (
                                        <Option key={brand.brandId} value={brand.brandId}>{brand.brandName}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="category" label="Loại Sản Phẩm" rules={[{ required: true }]}>
                                <Select placeholder="Chọn loại sản phẩm"
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        typeof option?.children === "string" &&
                                        (option.children as string).toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {categories.map((category) => (
                                        <Option key={category.categoryId} value={category.categoryId}>{category.categoryName}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="supplier" label="Nhà Cung Cấp" rules={[{ required: true }]}>
                                <Select placeholder="Chọn nhà cung cấp"
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        typeof option?.children === "string" &&
                                        (option.children as string).toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {suppliers.map((supplier) => (
                                        <Option key={supplier.supplierId} value={supplier.supplierId}>{supplier.supplierName}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="status" label="Trạng Thái" rules={[{ required: true }]}>
                                <Select placeholder="Chọn trạng thái"
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    typeof option?.children === "string" &&
                                    (option.children as string).toLowerCase().includes(input.toLowerCase())
                                }
                                >
                                    {statuses.map((status) => (
                                        <Option key={status.statusId} value={status.statusId}>{status.statusName}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="barcode"
                                label="Mã vạch"
                                rules={[
                                    { required: true, message: "Mã vạch không được để trống" },
                                    { pattern: /^\d{8,13}$/, message: "Mã vạch phải chứa từ 8 đến 13 chữ số" },
                                ]}
                            >
                                <Input.Group compact>
                                    <Input
                                        placeholder="Nhập mã vạch sản phẩm"
                                        style={{ width: "calc(100% - 40px)" }}
                                    />
                                    <Button
                                        icon={<BarcodeOutlined />}
                                        onClick={() => {
                                            const newBarcode = generateBarcode();
                                            form.setFieldsValue({ barcode: newBarcode });
                                        }}
                                    />
                                </Input.Group>
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                name="model"
                                label="Mẫu Sản Phẩm"
                                rules={[
                                    { max: 100, message: "Mẫu sản phẩm không được dài hơn 100 ký tự" },
                                ]}
                            >
                                <Input placeholder="Nhập mẫu sản phẩm" />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item
                                name="warrantyPeriod"
                                label="Thời gian bảo hành"
                                rules={[
                                    { required: true, message: "Vui lòng chọn thời gian bảo hành" },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || warrantyOptions.includes(value)) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error("Giá trị không hợp lệ!"));
                                        },
                                    }),
                                ]}
                            >
                                <Select placeholder="Chọn thời gian bảo hành">
                                    {warrantyOptions.map((option) => (
                                        <Option key={option} value={option}>
                                            {option}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="description" label="Mô Tả">
                        <Input.TextArea placeholder="Nhập mô tả sản phẩm" />
                    </Form.Item>
                </Col>
            </Row>
            <Button type="primary" loading={loading} htmlType="submit">
                {loading ? "Đang xử lý..." : "Thêm sản phẩm"}
            </Button>
        </Form >
    );
};

export default ProductForm;
