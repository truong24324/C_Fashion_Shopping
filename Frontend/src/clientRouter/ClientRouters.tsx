import React, { useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Spin } from 'antd';
import { toast } from 'react-hot-toast';
import { LoadingOutlined } from '@ant-design/icons';

import HomePage from '../pages/UserPage/HomePage';
import AuthenticatePage from '../pages/UserPage/AuthenticatePage';
import CartPage from '../pages/UserPage/CartPage';
import StoreListPage from '../pages/UserPage/StoreListPage';
import ContactPage from '../pages/UserPage/ContactPage';
import ProductDetailPage from '../pages/UserPage/ProductDetailPage';
import WishlistPage from '../pages/UserPage/WishListPage';
import ProfilePage from '../pages/UserPage/ProfilePage';
import AdminDashboard from '../pages/AdminPage/AdminDashboard';
import AboutPage from '../pages/UserPage/AboutPage';
import ReturnPolicyPage from '../pages/UserPage/ReturnPolixyPage';
import NotFoundPage from 'src/NotFoundPage/NotFoundPage';
import CheckoutPage from 'src/pages/UserPage/CheckoutPage';
import FashionPage from 'src/pages/UserPage/FashionPage';
import PurchasedProductsPage from 'src/pages/UserPage/PurchasedProductsPage';
import ProductReviewPage from 'src/pages/UserPage/ProductReviewPage';
import ShippingPolicy from 'src/pages/UserPage/ShippingPolixyPage';
import OrderSuccessPage from 'src/pages/UserPage/OrderSuccessPage';
import { useAxiosInterceptor } from '../Utils/useAxiosInterceptor';
import FAQ from 'src/pages/UserPage/FAQ';
import SupportCenterPage from 'src/pages/UserPage/SupportCenterPage';
import AshHousePage from 'src/pages/UserPage/AshHousePage';
import ChangePasswordForm from '../components/Profile/ChangePasswordForm';
import EditProfileForm from '../components/Profile/EditProfileForm';

const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  try {
    const decoded: { exp: number } = jwtDecode(token);
    return decoded.exp > Date.now() / 1000;
  } catch {
    return false;
  }
};
const PrivateRoute: React.FC<{ children: ReactNode; requiredRoles?: string[] }> = ({
  children,
  requiredRoles,
}) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;

  useEffect(() => {
    const checkAccess = async () => {

      if (requiredRoles?.includes('ROLE_Admin') || requiredRoles?.includes('ROLE_Super_Admin') || requiredRoles?.includes('ROLE_Manager')) {
        try {
          const res = await axios.get('/auth/check-admin', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          });
          if (res.status === 200) {
            setHasAccess(true);
          }
        } catch {
          toast.error('Bạn không có quyền truy cập trang quản trị.');
          navigate('/');
        } finally {
          setLoading(false);
        }
      } else {
        setHasAccess(true);
        setLoading(false);
      }
    };

    checkAccess();
  }, [requiredRoles, navigate]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <Spin indicator={antIcon} />
        <div className="text-lg text-gray-500">Đang xác thực quyền truy cập...</div>
      </div>
    );
  }

  return hasAccess ? <>{children}</> : null;
};

const AppRouterWrapper: React.FC = () => {
  const navigate = useNavigate();
  useAxiosInterceptor();

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token && isTokenValid(token)) {
      try {
        const decoded: { roles: { authority: string }[] } = jwtDecode(token);
        const isAdmin = decoded.roles?.some(role => role.authority === 'ROLE_Admin');
        if (isAdmin && window.location.pathname === '/') {
          navigate('/admin');
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || ' Phiên đăng nhập không hợp lệ, vui lòng đăng nhập lại!');
      }
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthenticatePage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/store" element={<StoreListPage />} />
      <Route path="/fashion" element={<FashionPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/product/:productName" element={<ProductDetailPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/returns" element={<ReturnPolicyPage />} />
      <Route path="/purchased" element={<PurchasedProductsPage />} />
      <Route path="/review" element={<ProductReviewPage />} />
      <Route path="/order-success" element={<OrderSuccessPage />} />
      <Route path="/shipping" element={<ShippingPolicy />} />
      <Route path='/faq' element={<FAQ />} />
      <Route path="/help" element={<SupportCenterPage />} />
      <Route path="/ash-house" element={<AshHousePage />} />
      <Route path="*" element={<NotFoundPage />} />

      <Route
        path="/admin"
        element={
          <PrivateRoute requiredRoles={['ROLE_Admin', 'ROLE_Super_Admin', 'ROLE_Manager']}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

const AppRouter: React.FC = () => {
  return (
    <Router>
      <AppRouterWrapper />
    </Router>
  );
};

export default AppRouter;
