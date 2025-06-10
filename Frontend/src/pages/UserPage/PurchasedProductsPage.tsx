import { useEffect, useState, useMemo } from 'react';
import { Table, Button, Space, Tag, Divider } from 'antd';
import { toast } from 'react-hot-toast';
import Navbar from 'src/Layouts/Navbar';
import Footer from 'src/Layouts/Footer';
import axios from 'axios';

const PurchasedProductsPage = () => {
    interface Product {
        orderId: string;
        productName: string;
        orderStatus: string;
        productImageUrl: string;
        colorName: string;
        sizeName: string;
        materialName: string;
        productPrice: number;
        quantity: number;
        totalPrice: number;
    }

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/user/orders/purchased-products', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setProducts(response.data.data);
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
        try {
            await axios.patch(
                `/api/user/orders/${orderId}/status`,
                null,
                {
                    params: { targetStatusName: status },
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );

            // Cập nhật trạng thái local trước
            setProducts((prev) =>
                prev.map((item) =>
                    item.orderId === orderId ? { ...item, orderStatus: status } : item
                )
            );

            toast.success('Cập nhật trạng thái thành công!');

            // Đồng bộ lại dữ liệu từ backend (tránh sai lệch)
            await fetchProducts();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Lỗi khi cập nhật trạng thái!');
        }
    };

    const renderStatusSelect = (orderId: string, status: string) => {
        const cancelableStatuses = ['Chờ xác nhận', 'Đang xử lý', 'Đang chuẩn bị hàng'];

        if (['Hoàn thành', 'Đã hủy'].includes(status)) {
            return <Tag color={status === 'Hoàn thành' ? 'green' : 'red'}>{status}</Tag>;
        }

        if (status === 'Giao thành công') {
            return (
                <Space>
                    <Button size="small" onClick={() => updateStatus(orderId, 'Yêu cầu trả hàng')}>
                        Yêu cầu trả hàng
                    </Button>
                    <Button type="primary" size="small" onClick={() => updateStatus(orderId, 'Hoàn thành')}>
                        Hoàn thành
                    </Button>
                </Space>
            );
        }

        if (cancelableStatuses.includes(status)) {
            return (
                <Button danger size="small" onClick={() => updateStatus(orderId, 'Đã hủy')}>
                    Hủy đơn hàng
                </Button>
            );
        }

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
            <div className="pt-20 py-20 px-8 bg-gray-100">
                <h2 className="pt-10 text-2xl font-bold text-gray-700">Sản phẩm đã mua</h2>
                {Object.entries(groupedOrders).map(([orderId, { status, items }]) => (
                    <div
                        key={orderId}
                        className="bg-white p-6 mb-6 rounded-lg shadow-lg"
                    >
                        <div className="flex justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">Đơn hàng #{orderId}</h3>
                            {renderStatusSelect(orderId, status)}
                        </div>
                        <Table
                            columns={columns}
                            dataSource={items}
                            rowKey={(record) => `${record.orderId}-${record.productName}-${record.colorName}`}
                            pagination={false}
                            loading={loading}
                            className="rounded-lg"
                            scroll={{ x: 500 }}
                            size="small"
                        />
                        <Divider className="my-6" />
                    </div>
                ))}
            </div>
            <Footer />
        </>
    );
};

export default PurchasedProductsPage;
