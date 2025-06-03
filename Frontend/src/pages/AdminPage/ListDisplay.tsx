import { useState, useEffect } from "react";
import { Table, Input, Pagination, Spin, Modal, Form } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import axios from "axios";
import { getColumnsConfig } from "src/constants/columnsConfig";

const API_URLS = {
    product: "/api/products/all",
    brand: "/api/brands/all",
    category: "/api/categories/all",
    discount: "/api/discounts/all",
    variant: "/api/variants/all",
    image: "/api/images/all",
    color: "/api/colors/all",
    size: "/api/sizes/all",
    material: "/api/materials/all",
    supplier: "/api/suppliers/all",
    role: "/api/roles/all",
    status: "/api/product-status/all",
};

const ListDisplay = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState<"product" | "status" | "variant" | "image" | "color" | "size" | "material" | "supplier" | "role" | "brand" | "category" | "discount">("product");
    const [updateApi, setUpdateApi] = useState<string>("");
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editingValue, setEditingValue] = useState<string>("");
    const [pageSize, setPageSize] = useState(5);  // Default page size is 8
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [detailData, setDetailData] = useState<any>(null);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    useEffect(() => {
        const map: Record<typeof category, string> = {
            product: "products",
            brand: "brands",
            category: "categories",
            discount: "discounts",
            variant: "variants",
            image: "images",
            color: "colors",
            size: "sizes",
            material: "materials",
            supplier: "suppliers",
            role: "roles",
            status: "product-status",
        };
        setUpdateApi(map[category]);
    }, [category]);

    useEffect(() => {
        // Set page size tùy theo category có ảnh hay không
        const categoriesWithImage = ["brand", "image"]; // các bảng có ảnh logo, image,...
        if (categoriesWithImage.includes(category)) {
            setCurrentPage(1);
            setPageSize(5);
        } else {
            setPageSize(6);
            setCurrentPage(1);
        }
    }, [category]);

    useEffect(() => {
        fetchData();
    }, [currentPage, category, pageSize]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URLS[category]}?page=${currentPage - 1}&size=${pageSize}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });
            const { content, totalElements } = response.data;
            if (totalElements === 0 && currentPage > 1) {
                setCurrentPage(1);
            } else {
                setData(content);
                setTotalItems(totalElements);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Lỗi khi tải dữ liệu!");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleActive = async (itemId: number, newStatus: boolean) => {
        const idKey = `${category}Id`;

        try {
            const response = await axios.patch(
                `/api/${updateApi}/${itemId}/status?isActive=${newStatus}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            if (response.data.success) {
                toast.success("Cập nhật trạng thái thành công!");
                setData((prevData) =>
                    prevData.map((item) =>
                        item[idKey] === itemId
                            ? {
                                ...item,
                                // Dùng key khác nếu là `role`
                                [category === "role" ? "loginAllowed" : "isActive"]: newStatus
                            }
                            : item
                    )
                );
            } else {
                toast.error(response?.data?.message || "Lỗi khi cập nhật trạng thái!");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Lỗi kết nối server!");
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, record: any) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const idKey = `${category}Id`;
        const updateUrl = `/api/${updateApi}/${record[idKey]}/upload`;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const updatedItem = {
                ...record,
                logo: file.name, // hoặc giữ nguyên path nếu backend không cần tên mới
            };

            const formPayload = new FormData();
            formPayload.append("logo", file);

            const res = await axios.put(updateUrl, formPayload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            const newLogoUrl = res.data.logo;

            setData((prevData) =>
                prevData.map((item) =>
                    item[idKey] === record[idKey] ? { ...item, logo: newLogoUrl } : item
                )
            );
            toast.success("Cập nhật ảnh thành công!");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "⚠️ Lỗi khi cập nhật ảnh!");
        }
    };

    const handleEdit = (record: any, dataIndex: string) => {
        setEditingKey(`${record[`${category}Id`]}-${dataIndex}`);
        setEditingValue(record[dataIndex]);
    };

    const saveEdit = async (record: any, dataIndex: string) => {
        const idKey = `${category}Id`;
        const updateUrl = `/api/${updateApi}/${record[idKey]}`;

        try {
            const updatedItem = {
                ...record,
                [dataIndex]: editingValue,
            };

            await axios.put(updateUrl, updatedItem, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            const newData = [...data];
            const index = newData.findIndex((item) => item[idKey] === record[idKey]);
            if (index > -1) {
                newData[index] = updatedItem;
                setData(newData);
                toast.success("Cập nhật thành công!");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "⚠️ Lỗi khi cập nhật dữ liệu!");
        } finally {
            setEditingKey(null);
            setEditingValue("");
        }
    };

    const handleIdDoubleClick = async (id: number) => {
        const apiMap: Record<string, string> = {
            product: `/api/products/${id}`,
            brand: `/api/brands/${id}`,
            category: `/api/categories/${id}`,
            discount: `/api/discounts/${id}`,
        };

        try {
            const res = await axios.get(apiMap[category], {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            setDetailData(res.data);
            setSelectedId(id);
            setShowDetailModal(true);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Không thể tải chi tiết!");
        }
    };

    const handleDelete = async (record: any) => {
        const idKey = `${category}Id`;
        const deleteUrl = `/api/${updateApi}/${record[idKey]}`;

        try {
            const response = await axios.delete(deleteUrl, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (response.data.success) {
                toast.success("Xóa thành công!");
                setData((prevData) => prevData.filter(item => item[idKey] !== record[idKey]));
            } else {
                toast.error("Lỗi khi xóa!");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "⚠️ Lỗi kết nối khi xóa!");
        }
    };

    const renderCell = (text: any, record: any, dataIndex: string) => {
        const isEditing = editingKey === `${record[`${category}Id`]}-${dataIndex}`;
        if (isEditing) {
            return (
                <Input
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onPressEnter={() => saveEdit(record, dataIndex)}
                    onBlur={() => saveEdit(record, dataIndex)}
                    autoFocus
                />
            );
        }
        return (
            <div onDoubleClick={() => handleEdit(record, dataIndex)}>
                {text || <i className="text-gray-400">Chưa có</i>}
            </div>
        );
    };

    const categories = [
        { value: "product", label: "Sản phẩm" },
        { value: "variant", label: "Biến thể" },
        { value: "image", label: "Hình ảnh sản phẩm" },
        { value: "status", label: "Trạng thái sản phẩm" },
        { value: "color", label: "Màu sắc" },
        { value: "size", label: "Kích thước" },
        { value: "material", label: "Chất liệu" },
        { value: "supplier", label: "Nhà cung cấp" },
        { value: "role", label: "Vai trò" },
        { value: "brand", label: "Thương hiệu" },
        { value: "category", label: "Loại sản phẩm" },
        { value: "discount", label: "Mã giảm giá" },
    ];

    const columns = getColumnsConfig(category, renderCell, handleToggleActive, handleImageChange, handleIdDoubleClick, handleDelete);

    return (
        <div className="p-4 rounded-lg shadow-xl">
            <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-3">
                    {categories.map((cat) => (
                        <button
                            key={cat.value}
                            onClick={() => setCategory(cat.value as any)}
                            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${category === cat.value
                                ? "bg-gradient-to-r from-green-500 to-green-700 text-white shadow-md"
                                : "bg-gray-300 text-gray-800 hover:bg-green-500 hover:text-white"}`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
                {/* <Input
                    prefix={<SearchOutlined className="text-gray-500" />}
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-72 px-4 py-2 rounded-lg border border-gray-500 focus:border-green-500 focus:ring-2 focus:ring-green-500 transition-all bg-white shadow-sm focus:shadow-lg"
                /> */}
            </div>

            <div className="border border-green-300 rounded-lg shadow-md overflow-hidden">
                {loading ? (
                    <div className="flex justify-center p-4">
                        <Spin size="large" />
                    </div>
                ) : (
                    <Table
                        columns={getColumnsConfig(category, renderCell, handleToggleActive, handleImageChange, handleIdDoubleClick, handleDelete)}
                        dataSource={data}
                        pagination={false}
                        rowKey={(record) => record[`${category}Id`]}
                        rowClassName={(record, index) => (index % 2 === 0 ? "bg-green-100" : "bg-white")}
                        className="border-none"
                    />
                )}
            </div>

            <div className="flex justify-end mt-4">
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={totalItems}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                    showQuickJumper
                />
            </div>
            <Modal
                title={`Chi tiết ${category}`}
                open={showDetailModal}
                onCancel={() => setShowDetailModal(false)}
                footer={null}
            >
                {detailData ? (
                    <Form layout="vertical">
                        {Object.entries(detailData).map(([key, value]) => (
                            <Form.Item
                                key={key}
                                label={<span style={{ fontWeight: 600 }}>{key}</span>}
                            >
                                <Input value={String(value ?? "Không có")} />
                            </Form.Item>
                        ))}
                    </Form>
                ) : (
                    <Spin />
                )}
            </Modal>
        </div>
    );
};

export default ListDisplay;
