import { CheckCircle, Home } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

type OrderDetail = {
  productName: string;
  colorName: string;
  sizeName: string;
  materialName: string;
  quantity: number;
  productPrice: number;
  totalPrice: number;
};

type OrderStatus = { statusName: string } | string | null;

type Order = {
  orderId?: number;
  orderCode?: string;
  orderDate?: string;
  paymentMethod?: string;
  paymentStatus?: string | null;
  orderStatus?: OrderStatus;
  fullName?: string;
  email?: string;
  phone?: string;
  shippingAddress?: string;
  orderDetails?: OrderDetail[];
  totalAmount?: number;
  shippingFee?: number;
};

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(location.state?.order ?? null);
  const query = new URLSearchParams(location.search);
  const orderIdParam = query.get('orderId');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const resultCode = query.get('resultCode');
    const isSuccess = resultCode === '0';

    const updateOrderStatusAndFetch = async () => {
      if (!orderIdParam) return;

      try {
        await axios.put(
          `/api/orders/momo/update-status/${orderIdParam}`,
          {
            paymentStatus: isSuccess
              ? 'Thanh toán thành công'
              : 'Thanh toán thất bại',
            orderStatusName: isSuccess ? 'Chờ xác nhận' : 'Đã hủy',
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        toast.success('Cập nhật trạng thái đơn hàng thành công!');
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || 'Cập nhật trạng thái thất bại!'
        );
      }

      await fetchOrder();
    };

    updateOrderStatusAndFetch();
  }, [orderIdParam]);

  const fetchOrder = async () => {
    if (!order && orderIdParam?.startsWith('ORDER-')) {
      setLoading(true);
      try {
        const response = await axios.get(`/api/orders/momo/${orderIdParam}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setOrder(response.data.data);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Lỗi khi tải đơn hàng!');
      } finally {
        setLoading(false);
      }
    }
  };

  const formatCurrency = (value?: number) =>
    (value ?? 0).toLocaleString('vi-VN');

  const getOrderStatus = (status: OrderStatus) => {
    if (!status) return 'Chờ xác nhận';
    if (typeof status === 'string') return status;
    return status.statusName || 'Chờ xác nhận';
  };

  if (!order) {
    return (
      <p className="text-center text-red-500 mt-10">
        Không tìm thấy thông tin đơn hàng.
      </p>
    );
  }

  const isOrderCancelled = getOrderStatus(order.orderStatus ?? null) === 'Đã hủy';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 relative">
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 flex items-center text-blue-600 hover:text-blue-800 transition text-sm"
      >
        <Home size={18} className="mr-1" />
        Về trang chủ
      </button>

      <div className="text-center mb-6">
        {isOrderCancelled ? (
          <>
            <CheckCircle size={64} className="text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2 text-red-600">
              Đặt hàng thất bại!
            </h1>
            <p className="text-gray-600">
              Rất tiếc! Đơn hàng của bạn đã bị hủy do thanh toán không thành công.
            </p>
          </>
        ) : (
          <>
            <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Đặt hàng thành công!</h1>
            <p className="text-gray-600">
              Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi.
            </p>
          </>
        )}
      </div>

      <div className="rounded-xl border bg-white text-black shadow p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Thông tin đơn hàng</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <div>
              <strong>Mã đơn hàng:</strong>{' '}
              {order.orderCode ?? `#${order.orderId ?? 'Chưa cập nhật'}`}
            </div>
            <div>
              <strong>Ngày đặt hàng:</strong>{' '}
              {(order.orderDate ?? 'Chưa cập nhật')}
            </div>
          
            <div>
              <strong>Phương thức thanh toán:</strong>{' '}
              {order.paymentMethod ?? 'Chưa cập nhật'}
            </div>
            <div>
              <strong>Trạng thái thanh toán:</strong>{' '}
              {order.paymentStatus ?? 'Chưa cập nhật'}
            </div>
            <div>
              <strong>Trạng thái đơn hàng:</strong>{' '}
              {getOrderStatus(order.orderStatus ?? null)}
            </div>
            <div>
              <strong>Người nhận:</strong> {order.fullName ?? 'Chưa cập nhật'}
            </div>
            <div>
              <strong>Email:</strong> {order.email ?? 'Chưa cập nhật'}
            </div>
            <div>
              <strong>Số điện thoại:</strong>{' '}
              {order.phone ?? 'Chưa cập nhật'}
            </div>
            <div className="sm:col-span-2">
              <strong>Địa chỉ giao hàng:</strong>{' '}
              {order.shippingAddress ?? 'Chưa cập nhật'}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Chi tiết sản phẩm</h2>
          <div className="divide-y">
            {order.orderDetails?.map((item, index) => (
              <div
                key={index}
                className="py-4 flex flex-col sm:flex-row justify-between gap-4 text-sm"
              >
                <div className="flex-1">
                  <p className="font-medium text-base">{item.productName}</p>
                  <p className="text-gray-600">
                    Màu: {item.colorName} • Kích thước: {item.sizeName} • Chất
                    liệu: {item.materialName}
                  </p>
                </div>
                <div className="text-right sm:text-left">
                  <p>
                    Số lượng:{' '}
                    <span className="font-medium">{item.quantity}</span>
                  </p>
                  <p>
                    Giá:{' '}
                    <span className="text-blue-600 font-medium">
                      {formatCurrency(item.productPrice)} VND
                    </span>
                  </p>
                  <p className="font-semibold text-green-700">
                    Tổng: {formatCurrency(item.totalPrice)} VND
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-right text-lg font-semibold text-gray-900">
          Tổng thanh toán:{' '}
          {formatCurrency(
            (order.totalAmount ?? 0) + (order.shippingFee ?? 0)
          )}{' '}
          VND
          <div className="text-sm font-normal text-gray-600">
            (Đã bao gồm phí vận chuyển:{' '}
            {formatCurrency(order.shippingFee ?? 0)} VND)
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
