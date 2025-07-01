import { useEffect, useState, useMemo } from 'react';
import { Table, Button, Space, Tag, Divider } from 'antd';
import { toast } from 'react-hot-toast';
import Navbar from 'src/Layouts/Navbar';
import Footer from 'src/Layouts/Footer';
import axios from 'axios';
import Loading from '../../components/common/Loading';
import { Product } from '../../components/CreateForm/Product/types';

const PurchasedProductsPage = () => {

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
    const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());

    const fetchProducts = async (showLoading = true) => {
        setLoading(true);
        try {
            const response = await axios.get('/api/user/orders/purchased-products', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setProducts(response.data.data);
            setLastSyncTime(new Date());
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Lỗi khi tải sản phẩm!');
        } finally {
           setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const updateStatus = async (orderId: string, status: string) => {
        setStatusUpdating(orderId);

        // Lưu trạng thái cũ để rollback nếu có lỗi
        const previousState = products.filter(item => item.orderId === orderId);

        try {
            // Cập nhật optimistic UI
            setProducts((prev) =>
                prev.map((item) =>
                    item.orderId === orderId ? { ...item, orderStatus: status } : item
                )
            );

            // Gọi API
            await axios.patch(
                `/api/user/orders/${orderId}/status`,
                null,
                {
                    params: { targetStatusName: status },
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );

            // Sau khi API hoàn tất, fetch lại dữ liệu nếu muốn đồng bộ hoàn toàn
            await fetchProducts(false);
            toast.success('Cập nhật trạng thái thành công!');
        } catch (error: any) {
            // Nếu lỗi, khôi phục lại dữ liệu trước khi thay
            setProducts((prev) => {
                const updatedProducts = [...prev];
                previousState.forEach(oldItem => {
                    const index = updatedProducts.findIndex(item =>
                        item.orderId === oldItem.orderId &&
                        item.productName === oldItem.productName &&
                        item.colorName === oldItem.colorName
                    );
                    if (index !== -1) {
                        updatedProducts[index] = oldItem;
                    }
                });
                return updatedProducts;
            });

            toast.error(error.response?.data?.message || 'Lỗi khi cập nhật trạng thái!');
        } finally {
            setStatusUpdating(null);
        }
    };

    const renderStatusSelect = (orderId: string, status: string) => {
        const cancelableStatuses = ['Chờ xác nhận', 'Đang xử lý', 'Đang chuẩn bị hàng'];
        const isUpdating = statusUpdating === orderId;

        // Hiển thị Tag cho các trạng thái cuối cùng
        if (['Hoàn thành', 'Đã hủy', 'Yêu cầu trả hàng'].includes(status)) {
            let color = 'blue';
            if (status === 'Hoàn thành') color = 'green';
            else if (status === 'Đã hủy') color = 'red';
            else if (status === 'Yêu cầu trả hàng') color = 'orange';

            return <Tag color={color}>{status}</Tag>;
        }

        // Hiển thị buttons cho trạng thái "Giao thành công"
        if (status === 'Giao thành công') {
            return (
                <Space>
                    <Button
                        size="small"
                        loading={isUpdating}
                        disabled={isUpdating}
                        onClick={() => updateStatus(orderId, 'Yêu cầu trả hàng')}
                    >
                        Yêu cầu trả hàng
                    </Button>
                    <Button
                        type="primary"
                        size="small"
                        loading={isUpdating}
                        disabled={isUpdating}
                        onClick={() => updateStatus(orderId, 'Hoàn thành')}
                    >
                        Hoàn thành
                    </Button>
                </Space>
            );
        }

        // Hiển thị button hủy cho các trạng thái có thể hủy
        if (cancelableStatuses.includes(status)) {
            return (
                <Button
                    danger
                    size="small"
                    loading={isUpdating}
                    disabled={isUpdating}
                    onClick={() => updateStatus(orderId, 'Đã hủy')}
                >
                    Hủy đơn hàng
                </Button>
            );
        }

        // Hiển thị Tag cho các trạng thái khác
        return <Tag color="blue">{status}</Tag>;
    };

    const columns = [
        { title: 'Sản phẩm', dataIndex: 'productName', key: 'productName' },
        {
            title: 'Hình ảnh',
            dataIndex: 'productImageUrl',
            key: 'productImageUrl',
            render: (url: string) => (
                <img src={url} alt="product" className="w-16 h-16 object-cover rounded-lg" />
            )
        },
        { title: 'Màu sắc', dataIndex: 'colorName', key: 'colorName' },
        { title: 'Size', dataIndex: 'sizeName', key: 'sizeName' },
        { title: 'Chất liệu', dataIndex: 'materialName', key: 'materialName' },
        {
            title: 'Giá',
            dataIndex: 'productPrice',
            key: 'productPrice',
            render: (text: number) => `${text.toLocaleString()} VND`
        },
        { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (text: number) => `${text.toLocaleString()} VND`
        }
    ];

    const groupedOrders = useMemo(() => {
        const grouped: Record<string, { status: string; items: Product[] }> = {};
        products.forEach((item) => {
            if (!grouped[item.orderId]) {
                grouped[item.orderId] = { status: item.orderStatus, items: [] };
            }
            grouped[item.orderId].items.push(item);
        });
        return grouped;
    }, [products]);

    return (
        <>
            <Navbar />
            <div className="pt-20 py-20 px-8 bg-gray-100 min-h-screen">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="pt-10 text-2xl font-bold text-gray-700">
                        Sản phẩm đã mua
                    </h2>
                    {!loading && products.length > 0 && (
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500">
                                Cập nhật: {lastSyncTime.toLocaleTimeString('vi-VN')}
                            </span>
                            <Button
                                size="small"
                                onClick={() => fetchProducts(true)}
                                loading={loading}
                                icon="🔄"
                            >
                                Làm mới
                            </Button>
                        </div>
                    )}
                </div>

                {/* Hiển thị Loading khi đang tải lần đầu */}
                {loading && (
                    <Loading
                        text="Đang tải đơn hàng của bạn..."
                        color="blue-500"
                        showRetryButton={true}
                        onRetry={fetchProducts}
                        retryText="Tải lại"
                    />
                )}

                {/* Hiển thị nếu không có đơn hàng */}
                {!loading && products.length === 0 && (
                    <div className="flex flex-col items-center py-20">
                        <div className="text-center p-8 bg-white rounded-lg shadow-md">
                            <div className="text-6xl text-gray-300 mb-4">📦</div>
                            <p className="text-gray-500 text-lg mb-4">
                                Hiện tại bạn chưa có đơn hàng nào.
                            </p>
                            <Button
                                type="primary"
                                onClick={() => window.location.href = '/products'}
                                className="mt-2"
                            >
                                Khám phá sản phẩm
                            </Button>
                        </div>
                    </div>
                )}

                {/* Hiển thị nếu có đơn hàng */}
                {!loading && products.length > 0 && (
                    <div className="mt-6">
                        {Object.entries(groupedOrders).map(([orderId, { status, items }]) => {
                            // Lấy trạng thái mới nhất từ products array
                            const currentStatus = products.find(p => p.orderId === orderId)?.orderStatus || status;

                            return (
                                <div
                                    key={orderId}
                                    className="bg-white p-6 mb-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-semibold text-gray-800">
                                            Đơn hàng #{orderId}
                                        </h3>
                                        <div className="flex items-center space-x-2">
                                            {statusUpdating === orderId && (
                                                <span className="text-sm text-blue-500">Đang cập nhật...</span>
                                            )}
                                            {renderStatusSelect(orderId, currentStatus)}
                                        </div>
                                    </div>
                                    <Table
                                        columns={columns}
                                        dataSource={items}
                                        rowKey={(record) =>
                                            `${record.orderId}-${record.productName}-${record.colorName}`
                                        }
                                        pagination={false}
                                        loading={false}
                                        className="rounded-lg"
                                        scroll={{ x: 500 }}
                                        size="small"
                                    />
                                    <Divider className="my-6" />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}

export default PurchasedProductsPage;