import React, { useState, useEffect } from "react";
import { Form, Select, InputNumber, Button, Row, Col, Modal, Upload, Card, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { Color, Material, Size, Variant } from "./types";
import axios from "axios";
import toast from "react-hot-toast";

interface Props {
    variants: Variant[];
    colors: Color[];   // ✅ Thêm dòng này
    sizes: Size[];     // ✅ Thêm dòng này
    materials: Material[]; // ✅ Thêm dòng này
    setVariants: React.Dispatch<React.SetStateAction<Variant[]>>;
}

const VariantForm: React.FC<Props> = ({ variants, setVariants }) => {
    const [variantModalVisible, setVariantModalVisible] = useState(false);
    const [variantForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [colors, setColors] = useState<Color[]>([]);
    const [sizes, setSizes] = useState<Size[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };
                const [colorRes, sizeRes, materialRes] = await Promise.all([
                    axios.get("/api/colors/all", { headers }),
                    axios.get("/api/sizes/all", { headers }),
                    axios.get("/api/materials/all", { headers }),
                ]);
                setColors(colorRes.data.content || []);
                setSizes(sizeRes.data.content || []);
                setMaterials(materialRes.data.content || []);
            } catch (error: any) {
                toast.error(error.response?.data?.message || "⚠️ Có lỗi xảy ra khi tải dữ liệu!");
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        // Lấy dữ liệu từ cache khi component mount
        const cachedVariants = localStorage.getItem("variants_cache");
        if (cachedVariants) {
            setVariants(JSON.parse(cachedVariants));
        }
    }, []);

    useEffect(() => {
        // Lưu danh sách biến thể vào cache mỗi khi thay đổi
        localStorage.setItem("variants_cache", JSON.stringify(variants));
    }, [variants]);

    const handleAddVariant = async (values: Omit<Variant, "key">) => {
        setLoading(true);
        try {
            const newVariant: Variant = {
                key: `${Date.now()}`,
                ...values,
            };
            await new Promise((resolve) => setTimeout(resolve, 500));
            setVariants((prevVariants) => {
                const updatedVariants = [...prevVariants, newVariant];
                localStorage.setItem("variants_cache", JSON.stringify(updatedVariants)); // ✅ Lưu vào cache
                return updatedVariants;
            });
            variantForm.resetFields();
            message.success("Thêm biến thể thành công!");
        } catch (error: any) {
            message.error("Lỗi khi thêm biến thể!");
            toast.error(error.response?.data?.message || "⚠️ Có lỗi xảy ra khi thêm biến thể!");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteVariant = (key: string) => {
        setVariants((prevVariants) => {
            const updatedVariants = prevVariants.filter((variant) => String(variant.key) !== String(key));
            localStorage.setItem("variants_cache", JSON.stringify(updatedVariants)); // ✅ Cập nhật cache
            return updatedVariants;
        });
    };

    return (
        <>
            <Row gutter={16}>
                <Col span={24}>
                    <div onClick={() => setVariantModalVisible(true)} className="cursor-pointer">
                        <Upload
                            listType="picture-card"
                            showUploadList={false}
                            openFileDialogOnClick={false}
                            disabled
                            className="border-2 border-gray-400 hover:border-blue-500 rounded-lg shadow-md w-full"
                        >
                            <div>+ Thêm biến thể</div>
                        </Upload>
                    </div>
                </Col>
            </Row>

            <Modal
                title={<h2 className="text-xl font-semibold text-gray-800">Thêm Biến Thể</h2>}
                open={variantModalVisible}
                onCancel={() => setVariantModalVisible(false)}
                footer={null}
                centered
            >
                <Form form={variantForm} onFinish={handleAddVariant} layout="vertical">
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="color" label="Màu Sắc" rules={[{ required: true, message: "Vui lòng chọn màu sắc!" }]}>
                                <Select placeholder="Chọn màu"
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        typeof option?.children === "string" &&
                                        (option.children as string).toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {colors.map((c) => (
                                        <Select.Option key={c.colorId} value={c.colorId}>
                                            {c.colorName}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="size" label="Kích Thước" rules={[{ required: true, message: "Vui lòng chọn kích thước!" }]}>
                                <Select placeholder="Chọn size"
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        typeof option?.children === "string" &&
                                        (option.children as string).toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {sizes.map((s) => (
                                        <Select.Option key={s.sizeId} value={s.sizeId}>
                                            {s.sizeName}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="material" label="Chất Liệu" rules={[{ required: true, message: "Vui lòng chọn chất liệu!" }]}>
                                <Select placeholder="Chọn chất liệu"
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        typeof option?.children === "string" &&
                                        (option.children as string).toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {materials.map((m) => (
                                        <Select.Option key={m.materialId} value={m.materialId}>
                                            {m.materialName}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="stock"
                                label="Tồn Kho"
                                rules={[
                                    { required: true, message: "Vui lòng nhập số lượng!" },
                                    { type: "integer", min: 0, message: "Số lượng phải là số nguyên không âm!" }
                                ]}
                            >
                                <InputNumber
                                    placeholder="Nhập số lượng"
                                    min={0}
                                    step={1}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="price"
                                label="Giá Bán"
                                rules={[
                                    { required: true, message: "Vui lòng nhập giá!" },
                                    { type: "number", min: 0, message: "Giá phải lớn hơn 0!" }
                                ]}
                            >
                                <InputNumber
                                    placeholder="Nhập giá bán"
                                    min={0}
                                    step={1000}
                                    style={{ width: "100%" }}
                                    formatter={(value) =>
                                        value !== undefined && value !== null
                                            ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                            : ""
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Button type="primary" htmlType="submit" loading={loading} className="px-6 py-2 text-lg">
                        {loading ? "Đang xử lý..." : "Thêm Biến Thể"}
                    </Button>
                    {variants.length > 0 && (
                        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                            <h3 className="font-semibold mb-2">Danh sách biến thể</h3>
                            <Row gutter={[16, 16]}>
                                {variants.map((variant) => (
                                    <Col key={variant.key} span={12}>
                                        <Card
                                            onClick={() => {
                                                setSelectedVariant(variant);
                                                variantForm.setFieldsValue({
                                                    color: variant.color,
                                                    size: variant.size,
                                                    material: variant.material,
                                                    stock: variant.stock,
                                                    price: variant.price,
                                                });
                                                setVariantModalVisible(true);
                                            }}
                                            className="shadow-md border border-gray-300 rounded-lg p-3 text-center relative cursor-pointer hover:shadow-lg transition"
                                            actions={[
                                                <DeleteOutlined
                                                    key="delete"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // tránh trigger onClick của card
                                                        handleDeleteVariant(variant.key);
                                                    }}
                                                    className={`text-red-500 hover:text-red-700 ${loading ? "cursor-not-allowed opacity-50" : ""}`}
                                                    style={{ pointerEvents: loading ? "none" : "auto" }}
                                                />,
                                            ]}
                                        >
                                            <p><b>Màu:</b> {colors.find(c => c.colorId === variant.color)?.colorName || "N/A"}</p>
                                            <p><b>Kích thước:</b> {sizes.find(s => s.sizeId === variant.size)?.sizeName || "N/A"}</p>
                                            <p><b>Chất liệu:</b> {materials.find(m => m.materialId === variant.material)?.materialName || "N/A"}</p>
                                            <p><b>Giá:</b> {new Intl.NumberFormat("vi-VN").format(variant.price)} VND</p>
                                            <p><b>Tồn kho:</b> {variant.stock}</p>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    )}
                </Form>
            </Modal>
        </>
    );
};

export default VariantForm;
