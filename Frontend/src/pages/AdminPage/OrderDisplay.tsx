import { useEffect, useState, useRef } from "react";
import { Table, Modal, Button, Spin, Pagination, Tag } from "antd";
import toast from "react-hot-toast";
import { ArrowRightOutlined, DeleteFilled } from "@ant-design/icons";
import axios from "axios";
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
    const [statusPage, setStatusPage] = useState(0);
    const statusesPerPage = 6;

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
        {
            title: "ID", dataIndex: "orderId", ellipsis: true
        },
        {
            title: "Mã đơn hàng", dataIndex: "orderCode", ellipsis: true
        },
        {
            title: "Ngày đặt", dataIndex: "orderDate", ellipsis: true
        },
        {
            title: "Trạng thái thanh toán", dataIndex: "paymentStatus", ellipsis: true
        },
        {
            title: "Tổng tiền", dataIndex: "totalAmount", render: (v: number) => `${v.toLocaleString()} vn₫`, ellipsis: true
        },
        {
            title: "Thanh toán", dataIndex: "paymentMethod", ellipsis: true
        },
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
            title: "Thao tác",
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

    const scrollRef = useRef<HTMLDivElement>(null);

    const totalStatusPages = Math.ceil(statuses.length / statusesPerPage);

    const handleNextStatusPage = () => {
        setStatusPage((prev) => (prev + 1 < totalStatusPages ? prev + 1 : prev));
    };

    const handlePrevStatusPage = () => {
        setStatusPage((prev) => (prev > 0 ? prev - 1 : 0));
    };

    return (
        <div className="p-4 rounded-lg shadow-xl">
            <div className="relative w-full mb-4">
                {/* Nút cuộn trái */}
                <button
                    onClick={handlePrevStatusPage}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 px-2 py-1 bg-white border rounded-full shadow hover:bg-green-500 hover:text-white"
                >
                    &lt;
                </button>

                {/* Vùng nút trạng thái */}
                <div className="mx-6 overflow-hidden">
                    <div className="flex gap-2 flex-wrap justify-center">
                        <button
                            key="all"
                            onClick={() => handleStatusChange(null)}
                            className={`min-w-[120px] px-5 py-2 rounded-lg text-sm font-semibold transition-all ${statusId === null
                                ? "bg-gradient-to-r from-green-500 to-green-700 text-white shadow-md"
                                : "bg-gray-300 text-gray-800 hover:bg-green-500 hover:text-white"
                                }`}
                        >
                            Tất cả
                        </button>

                        {statuses
                            .slice(statusPage * statusesPerPage, (statusPage + 1) * statusesPerPage)
                            .map((s) => (
                                <button
                                    key={s.statusId}
                                    onClick={() => handleStatusChange(s.statusId)}
                                    className={`min-w-[120px] px-5 py-2 rounded-lg text-sm font-semibold transition-all ${statusId === s.statusId
                                        ? "bg-gradient-to-r from-green-500 to-green-700 text-white shadow-md"
                                        : "bg-gray-300 text-gray-800 hover:bg-green-500 hover:text-white"
                                        }`}
                                >
                                    {s.statusName}
                                </button>
                            ))}
                    </div>
                </div>

                {/* Nút cuộn phải */}
                <button
                    onClick={handleNextStatusPage}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 px-2 py-1 bg-white border rounded-full shadow hover:bg-green-500 hover:text-white"
                >
                    &gt;
                </button>
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
                title={<span className="text-xl font-semibold text-gray-800">🧾 Chi tiết đơn hàng</span>}
                footer={null}
                width={800}
            >
                {selectedOrder ? (
                    <div className="space-y-6 text-sm text-gray-700">

                        {/* Thông tin khách hàng */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="font-medium text-gray-500">👤 Tên khách hàng</p>
                                <p className="text-base">{selectedOrder.fullName}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-500">📧 Email</p>
                                <p className="text-base">{selectedOrder.email}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-500">📱 Số điện thoại</p>
                                <p className="text-base">{selectedOrder.phone}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-500">🏠 Địa chỉ giao hàng</p>
                                <p className="text-base">{selectedOrder.shippingAddress}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-500">💳 Phương thức thanh toán</p>
                                <p className="text-base capitalize">{selectedOrder.paymentMethod}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-500">💰 Tổng tiền</p>
                                <p className="text-base font-semibold text-orange-600">
                                    {selectedOrder.totalAmount?.toLocaleString()}₫
                                </p>
                            </div>
                        </div>

                        {/* Chi tiết sản phẩm */}
                        <div>
                            <p className="font-medium text-gray-600 mb-2">📦 Sản phẩm đã đặt</p>
                            <div className="bg-gray-50 border rounded p-3 space-y-2 max-h-60 overflow-y-auto">
                                {selectedOrder.orderDetails?.map((item: any, index: number) => (
                                    <div key={index} className="border-b pb-2">
                                        <p className="font-medium">{item.productName}</p>
                                        <p className="text-xs text-gray-500">
                                            Màu: {item.colorName} | Kích cỡ: {item.sizeName} | Chất liệu: {item.materialName}
                                        </p>
                                        <p className="text-sm">
                                            Số lượng: {item.quantity} &nbsp;&nbsp; | &nbsp;&nbsp;
                                            Thành tiền: <span className="font-semibold text-orange-600">
                                                {item.totalPrice?.toLocaleString()}₫
                                            </span>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center py-10"><Spin /></div>
                )}
            </Modal>
        </div>
    );
};

export default OrderDisplay;
