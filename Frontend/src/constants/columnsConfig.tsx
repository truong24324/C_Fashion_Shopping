import ImageTypeCell from "../components/ImageTypeCell";
import { Switch, Button, Popconfirm, Select } from "antd";
import React from "react";

type RenderCellFn = (text: any, record: any, dataIndex: string) => React.ReactElement;
type HandleToggleActiveFn = (discountId: number, newStatus: boolean) => void;
type HandleImageChangeFn = (e: React.ChangeEvent<HTMLInputElement>, record: any) => void;
type HandleIdDoubleClickFn = (id: number) => void;
type HandleDeleteFn = (id: number) => void;

export const getColumnsConfig = (
    category: string,
    renderCell: RenderCellFn,
    handleToggleActive: HandleToggleActiveFn,
    handleImageChange: HandleImageChangeFn,
    handleIdDoubleClick: HandleIdDoubleClickFn,
    handleDelete: HandleDeleteFn,
    editingKey?: any,
    editingField?: string,
    setEditingKey?: (key: any) => void,
    setEditingField?: (field: string) => void,
    handleUpdate?: (record: any, field: string, value: any) => void,
    options?: { brand?: any[]; category?: any[]; supplier?: any[] }
) => {
    return {
        product: [
            {
                title: "ID",
                dataIndex: "productId",
                key: "productId",
                ellipsis: true,
                render: (text: any, record: any) => (
                    <div
                        className="cursor-pointer text-blue-600 underline"
                        onDoubleClick={() => handleIdDoubleClick(record.productId)}
                    >
                        {text}
                    </div>
                ),
            },
            { title: "Tên sản phẩm", dataIndex: "productName", key: "productName", ellipsis: true, render: (text: any, record: any) => renderCell(text, record, "productName") },
            { title: "Mô tả", dataIndex: "description", key: "description", ellipsis: true, render: (text: any, record: any) => renderCell(text, record, "description") },
            { title: "Mã vạch", dataIndex: "barcode", key: "barcode", ellipsis: true, render: (text: any, record: any) => renderCell(text, record, "barcode") },
            { title: "Thương hiệu", dataIndex: "brandName", key: "brandName", ellipsis: true },
            { title: "Loại sản phẩm", dataIndex: "categoryName", key: "categoryName", ellipsis: true },
            { title: "Nhà cung cấp", dataIndex: "supplierName", key: "supplierName", ellipsis: true },
            { title: "Mẫu sản phẩm", dataIndex: "model", key: "model", ellipsis: true, render: (text: any, record: any) => renderCell(text, record, "model") },
            { title: "Thời gian bảo hành", dataIndex: "warrantyPeriod", key: "warrantyPeriod", ellipsis: true, render: (text: any, record: any) => renderCell(text, record, "warrantyPeriod") },
            {
                title: "Hành động",
                key: "action",
                render: (text: any, record: any) => (
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa sản phẩm này?"
                        onConfirm={() => handleDelete(record)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button danger>Xóa</Button>
                    </Popconfirm>
                )
            },
        ],
        variant: [
            { title: "ID", dataIndex: "variantId", key: "variantId", ellipsis: true },
            {
                title: "Mã sản phẩm",
                dataIndex: "productId",
                key: "productId",
                ellipsis: true,
            },
            {
                title: "Sản phẩm",
                dataIndex: "productName",
                key: "productName",
                ellipsis: true,
                render: (text: any, record: any) => record?.productName || "N/A",
            },
            {
                title: "Màu sắc",
                dataIndex: "colorName",
                key: "colorName",
                ellipsis: true,
                render: (text: any, record: any) => record?.colorName || "N/A",
            },
            {
                title: "Kích cỡ",
                dataIndex: "sizeName",
                key: "sizeName",
                ellipsis: true,
                render: (text: any, record: any) => record?.sizeName || "N/A",
            },
            {
                title: "Chất liệu",
                dataIndex: "materialName",
                key: "materialName",
                ellipsis: true,
                render: (text: any, record: any) => record?.materialName || "N/A",
            },
            {
                title: "Tồn kho",
                dataIndex: "stock",
                key: "stock",
                ellipsis: true,
                render: (text: any, record: any) => renderCell(text, record, "stock"),
            },
            {
                title: "Giá bán",
                dataIndex: "price",
                key: "price",
                ellipsis: true,
                render: (text: any, record: any) => renderCell(text, record, "price"),
            },
            {
                title: "Hành động",
                key: "action",
                render: (text: any, record: any) => (
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa biến thể này?"
                        onConfirm={() => handleDelete(record)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button danger>Xóa</Button>
                    </Popconfirm>
                )
            }
        ],
        image: [
            {
                title: "ID",
                dataIndex: "imageId",
                key: "imageId",
                ellipsis: true
            },
            {
                title: "Sản phẩm",
                dataIndex: "productName",
                key: "productName",
                ellipsis: true,
                render: (text: any) => text || "N/A",
            },
            {
                title: "Loại ảnh",
                dataIndex: "imageType",
                key: "imageType",
                ellipsis: true,
                render: (text: any, record: any) => (
                    <ImageTypeCell value={text} imageId={record.imageId} />
                )
            },
            {
                title: "Ảnh",
                dataIndex: "imageUrl",
                key: "imageUrl",
                render: (path: string, record: any) => {
                    return (
                        <div onDoubleClick={() => document.getElementById(`file-${record.imageId}`)?.click()}>
                            <img
                                src={`/${path}`}
                                alt="imageId"
                                className="h-12 w-12 object-contain rounded-lg shadow cursor-pointer hover:opacity-80 transition"
                            />
                            <input
                                id={`file-${record.imageId}`}
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(e) => handleImageChange(e, record)}
                            />
                        </div>
                    );
                },
            },
            {
                title: "Thời gian tạo",
                dataIndex: "createdAt",
                key: "createdAt",
                ellipsis: true,
                render: (createdAt: any) => {
                    if (Array.isArray(createdAt) && createdAt.length >= 6) {
                        const date = new Date(
                            createdAt[0],                // year
                            createdAt[1] - 1,            // month (0-based)
                            createdAt[2],                // day
                            createdAt[3],                // hour
                            createdAt[4],                // minute
                            createdAt[5]                 // second
                        );
                        return date.toLocaleString();
                    }
                    return "N/A";
                },
            },
            {
                title: "Hành động",
                key: "action",
                render: (text: any, record: any) => (
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa ảnh này?"
                        onConfirm={() => handleDelete(record)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button danger>Xóa</Button>
                    </Popconfirm>
                ),
            }
        ],
        brand: [
            { title: "ID", dataIndex: "brandId", key: "brandId", ellipsis: true },
            {
                title: "Tên thương hiệu",
                dataIndex: "brandName",
                key: "brandName",
                ellipsis: true,
                render: (text: any, record: any) => renderCell(text, record, "brandName")
            },
            {
                title: "Logo",
                dataIndex: "logo",
                key: "logo",
                render: (path: string, record: any) => {
                    return (
                        <div onDoubleClick={() => document.getElementById(`file-${record.brandId}`)?.click()}>
                            <img
                                src={`/${path}`}
                                alt="Logo"
                                className="h-12 w-12 object-contain rounded-lg shadow cursor-pointer hover:opacity-80 transition"
                            />
                            <input
                                id={`file-${record.brandId}`}
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(e) => handleImageChange(e, record)}
                            />
                        </div>
                    );
                },
            },
            {
                title: "Hành động",
                key: "action",
                render: (text: any, record: any) => (
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa thương hiệu này?"
                        onConfirm={() => handleDelete(record)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button danger>Xóa</Button>
                    </Popconfirm>
                )
            },
        ],
        category: [
            { title: "ID", dataIndex: "categoryId", key: "categoryId", ellipsis: true },
            { title: "Tên loại sản phẩm", dataIndex: "categoryName", key: "categoryName", ellipsis: true, render: (text: any, record: any) => renderCell(text, record, "categoryName") },
            { title: "Mô tả", dataIndex: "description", key: "description", ellipsis: true, render: (text: any, record: any) => renderCell(text, record, "description") },
            {
                title: "Hành động",
                key: "action",
                render: (text: any, record: any) => (
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa loại sản phẩm này?"
                        onConfirm={() => handleDelete(record)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button danger>Xóa</Button>
                    </Popconfirm>
                )
            },
        ],
        status: [
            {
                title: "ID",
                dataIndex: "statusId",
                key: "statusId",
                ellipsis: true,
            },
            {
                title: "Tên trạng thái",
                dataIndex: "statusName",
                key: "statusName",
                ellipsis: true,
                render: (text: any, record: any) => renderCell(text, record, "statusName"),
            },
            {
                title: "Mô tả",
                dataIndex: "description",
                key: "description",
                ellipsis: true,
                render: (text: any, record: any) => renderCell(text, record, "description"),
            },
            {
                title: "Hành động",
                key: "action",
                render: (text: any, record: any) => (
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa trạng thái sản phẩm này?"
                        onConfirm={() => handleDelete(record)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button danger>Xóa</Button>
                    </Popconfirm>
                ),
            },
        ],

        discount: [
            { title: "ID", dataIndex: "discountId", key: "discountId", ellipsis: true },
            { title: "Mã giảm giá", dataIndex: "discountCode", key: "discountCode", ellipsis: true, render: (text: any, record: any) => renderCell(text, record, "discountCode") },
            { title: "Giá trị giảm", dataIndex: "discountValue", key: "discountValue", ellipsis: true, render: (text: any, record: any) => renderCell(text, record, "discountValue") },
            {
                title: "Kích hoạt",
                dataIndex: "isActive",
                key: "isActive",
                render: (isActive: boolean, record: any) => (
                    <Switch
                        checked={isActive}
                        onChange={() => handleToggleActive(record.discountId, !isActive)}
                    />
                )
            },
            { title: "Số lượng", dataIndex: "quantity", key: "quantity", ellipsis: true, render: (text: any, record: any) => renderCell(text, record, "quantity") },
            {
                title: "Ngày bắt đầu",
                dataIndex: "startDate",
                key: "startDate",
                ellipsis: true
            },
            {
                title: "Ngày kết thúc",
                dataIndex: "endDate",
                key: "endDate",
                render: (date: string | null) => date || "Không có",
                ellipsis: true
            },
            { title: "Mô tả", dataIndex: "description", key: "description", ellipsis: true, render: (text: any, record: any) => renderCell(text, record, "description") },
            {
                title: "Hành động",
                key: "action",
                render: (text: any, record: any) => (
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa mã giảm giá này?"
                        onConfirm={() => handleDelete(record)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button danger>Xóa</Button>
                    </Popconfirm>
                )
            },
        ],
        color: [
            { title: "ID", dataIndex: "colorId", key: "colorId", ellipsis: true },
            {
                title: "Tên màu",
                dataIndex: "colorName",
                key: "colorName",
                ellipsis: true,
                render: (text: any, record: any) => renderCell(text, record, "colorName")
            },
            {
                title: "Mã màu",
                dataIndex: "colorCode",
                key: "colorCode",
                ellipsis: true,
                render: (text: any, record: any) => (
                    <div className="flex items-center gap-2">
                        <div
                            className="w-6 h-6 rounded-full border border-gray-300"
                            style={{ backgroundColor: text }}
                        />
                        {renderCell(text, record, "colorCode")}
                    </div>
                )
            },
            {
                title: "Hành động",
                key: "action",
                render: (text: any, record: any) => (
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa màu này?"
                        onConfirm={() => handleDelete(record)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button danger>Xóa</Button>
                    </Popconfirm>
                )
            },
        ],
        material: [
            { title: "ID", dataIndex: "materialId", key: "materialId", ellipsis: true },
            {
                title: "Tên chất liệu",
                dataIndex: "materialName",
                key: "materialName",
                ellipsis: true,
                render: (text: any, record: any) => renderCell(text, record, "materialName")
            },
            {
                title: "Hành động",
                key: "action",
                render: (text: any, record: any) => (
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa chất liệu này?"
                        onConfirm={() => handleDelete(record)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button danger>Xóa</Button>
                    </Popconfirm>
                )
            },
        ],
        size: [
            { title: "ID", dataIndex: "sizeId", key: "sizeId", ellipsis: true },
            {
                title: "Tên kích thước",
                dataIndex: "sizeName",
                key: "sizeName",
                ellipsis: true,
                render: (text: any, record: any) => renderCell(text, record, "sizeName")
            },
            {
                title: "Hành động",
                key: "action",
                render: (text: any, record: any) => (
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa kích thước này?"
                        onConfirm={() => handleDelete(record)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button danger>Xóa</Button>
                    </Popconfirm>
                )
            },
        ],
        supplier: [
            { title: "ID", dataIndex: "supplierId", key: "supplierId", ellipsis: true },
            {
                title: "Tên nhà cung cấp",
                dataIndex: "supplierName",
                key: "supplierName",
                ellipsis: true,
                render: (text: any, record: any) => renderCell(text, record, "supplierName")
            },
            {
                title: "Người liên hệ",
                dataIndex: "contactName",
                key: "contactName",
                ellipsis: true,
                render: (text: any, record: any) => renderCell(text, record, "contactName")
            },
            {
                title: "Số điện thoại",
                dataIndex: "phone",
                key: "phone",
                ellipsis: true,
                render: (text: any, record: any) => renderCell(text, record, "phone")
            },
            {
                title: "Email",
                dataIndex: "email",
                key: "email",
                ellipsis: true,
                render: (text: any, record: any) => renderCell(text, record, "email")
            },
            {
                title: "Địa chỉ",
                dataIndex: "address",
                key: "address",
                ellipsis: true,
                render: (text: any, record: any) => renderCell(text, record, "address")
            },
            {
                title: "Hành động",
                key: "action",
                render: (text: any, record: any) => (
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa nhà cung cấp này?"
                        onConfirm={() => handleDelete(record)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button danger>Xóa</Button>
                    </Popconfirm>
                )
            }
        ],
        role: [
            { title: "ID", dataIndex: "roleId", key: "roleId", ellipsis: true },
            {
                title: "Tên vai trò",
                dataIndex: "roleName",
                key: "roleName",
                ellipsis: true
            },
            {
                title: "Cho phép đăng nhập",
                dataIndex: "loginAllowed",
                key: "loginAllowed",
                render: (loginAllowed: boolean, record: any) => (
                    <Switch
                        checked={loginAllowed}
                        onChange={() => handleToggleActive(record.roleId, !loginAllowed)}
                    />
                )
            },
            {
                title: "Mô tả",
                dataIndex: "description",
                key: "description",
                ellipsis: true,
                render: (text: any, record: any) => renderCell(text, record, "description")
            },
            {
                title: "Hành động",
                key: "action",
                render: (text: any, record: any) => (
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa vai trò này?"
                        onConfirm={() => handleDelete(record)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button danger>Xóa</Button>
                    </Popconfirm>
                )
            },
        ],



    }[category]

};
