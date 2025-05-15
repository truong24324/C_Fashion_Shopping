import { useEffect, useState } from "react";
import { Table, Modal, Button, Spin, Pagination, Tag } from "antd";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowRightOutlined, DeleteFilled } from "@ant-design/icons";

const OrderDisplay = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [statusId, setStatusId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);
    const [totalItems, setTotalItems] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [statuses, setStatuses] = useState<any[]>([]);

    useEffect(() => {
        fetchStatuses();
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [statusId, currentPage]);

    const fetchStatuses = async () => {
        try {
            const res = await axios.get("/api/orders/statuses", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setStatuses(res.data.data || []);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Không thể tải trạng thái đơn hàng!");
        }
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/orders/filter", {
                params: { statusId, page: currentPage - 1, size: pageSize },
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setOrders(res.data.data.content || []);
            setTotalItems(res.data.data.totalElements);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Lỗi khi tải đơn hàng!");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (newStatusId: number | null) => {
        setStatusId(newStatusId);
        setCurrentPage(1);  // Reset page to 1 when the status filter changes
    };

    const handleUpdateStatus = async (orderId: number) => {
        try {
            const res = await axios.patch(`/api/orders/${orderId}/next`, null, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            toast.success("Cập nhật trạng thái thành công!");

            // ✅ Cập nhật trực tiếp đơn hàng trong danh sách (không reset bảng)
            setOrders(prev =>
                prev.map(order =>
                    order.orderId === orderId
                        ? { ...order, orderStatus: res.data.data?.orderStatus }
                        : order
                )
            );
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Lỗi khi cập nhật trạng thái!");
        }
    };

    const handleCancelOrder = async (orderId: number) => {
        try {
            const res = await axios.patch(`/api/orders/${orderId}/cancel`, null, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            toast.success("Đơn hàng đã được hủy!");

            // ✅ Cập nhật trạng thái trong danh sách
            setOrders(prev =>
                prev.map(order =>
                    order.orderId === orderId
                        ? { ...order, orderStatus: "Đã hủy" }
                        : order
                )
            );
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Không thể hủy đơn hàng!");
        }
    };

    const columns = [
        { title: "ID", dataIndex: "orderId" },
        { title: "Tên", dataIndex: "fullName" },
        { title: "Email", dataIndex: "email" },
        { title: "Điện thoại", dataIndex: "phone" },
        { title: "Tổng tiền", dataIndex: "totalAmount", render: (v: number) => `${v.toLocaleString()} vn₫` },
        { title: "Thanh toán", dataIndex: "paymentMethod" },
        {
            title: "Trạng thái",
            dataIndex: "orderStatus",
            render: (status: string) => <Tag color="blue">{status}</Tag>
        },
        {
            title: "Trạng thái kế tiếp",
            render: (_: any, record: any) => {
                return (
                    <div className="space-y-2">
                        <Button
                            type="primary"
                            onClick={() => handleUpdateStatus(record.orderId)}
                            icon={<ArrowRightOutlined />}
                        />
                    </div>
                );
            }
        },
        {
            title: "Trạng thái kế tiếp",
            render: (_: any, record: any) => {
                return (
                    <div className="space-y-2">
                        <Button onClick={() => showDetails(record)}>🔍</Button>
                        <Button danger onClick={() => handleCancelOrder(record.orderId)}
                            icon={<DeleteFilled />}
                        >
                        </Button>
                    </div>
                );
            }
        }
    ];

    const showDetails = (record: any) => {
        setSelectedOrder(record);
        setShowModal(true);
    };

    return (
        <div className="p-4 rounded-lg shadow-xl">
            <div className="flex flex-wrap gap-2 mb-4">
                <button
                    key="all"
                    onClick={() => handleStatusChange(null)}
                    className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${statusId === null
                        ? "bg-gradient-to-r from-green-500 to-green-700 text-white shadow-md"
                        : "bg-gray-300 text-gray-800 hover:bg-green-500 hover:text-white"
                        }`}
                >
                    Tất cả
                </button>
                {statuses.map((s) => (
                    <button
                        key={s.statusId}
                        onClick={() => handleStatusChange(s.statusId)}
                        className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${statusId === s.statusId
                            ? "bg-gradient-to-r from-green-500 to-green-700 text-white shadow-md"
                            : "bg-gray-300 text-gray-800 hover:bg-green-500 hover:text-white"
                            }`}
                    >
                        {s.statusName}
                    </button>
                ))}
            </div>

            <div className="border rounded-lg shadow-md overflow-hidden">
                {loading ? (
                    <div className="flex justify-center p-6">
                        <Spin />
                    </div>
                ) : (
                    <Table
                        dataSource={orders}
                        columns={columns}
                        rowKey="orderId"
                        pagination={false}
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
                />
            </div>

            <Modal
                open={showModal}
                onCancel={() => setShowModal(false)}
                title="Chi tiết đơn hàng"
                footer={null}
                width={700}
            >
                {selectedOrder ? (
                    <div className="space-y-2">
                        <p><strong>Tên:</strong> {selectedOrder.fullName}</p>
                        <p><strong>Email:</strong> {selectedOrder.email}</p>
                        <p><strong>Điện thoại:</strong> {selectedOrder.phone}</p>
                        <p><strong>Địa chỉ:</strong> {selectedOrder.shippingAddress}</p>
                        <p><strong>Thanh toán:</strong> {selectedOrder.paymentMethod}</p>
                        <p><strong>Tổng tiền:</strong> {selectedOrder.totalAmount?.toLocaleString()}₫</p>
                        <p><strong>Chi tiết sản phẩm:</strong></p>
                        <ul className="list-disc ml-5">
                            {selectedOrder.orderDetails?.map((item: any, index: number) => (
                                <li key={index}>
                                    {item.productName} - {item.colorName}, {item.sizeName}, {item.materialName} × {item.quantity} = {item.totalPrice?.toLocaleString()}₫
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : <Spin />}
            </Modal>
        </div>
    );
};

export default OrderDisplay;
