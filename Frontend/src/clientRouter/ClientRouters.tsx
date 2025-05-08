import React, { useState, useEffect, ReactNode } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

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
import toast from 'react-hot-toast';
import NotFoundPage from 'src/NotFoundPage/NotFoundPage';
import CheckoutPage from 'src/pages/UserPage/CheckoutPage';

const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  try {
    const decoded: { exp: number } = jwtDecode(token);
    const now = Date.now() / 1000;
    return decoded.exp > now;
  } catch (e) {
    return false;
  }
};

const PrivateRoute: React.FC<{ children: ReactNode; requiredRole?: string }> = ({
  children,
  requiredRole,
}) => {
  const token = localStorage.getItem('jwt_token');
  const location = useLocation();

  if (!isTokenValid(token)) {
    localStorage.removeItem('jwt_token');
    toast.error('Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.');
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (requiredRole) {
    try {
      const decoded: { roles: { authority: string }[] } = jwtDecode(token!);
      const hasRole = decoded.roles.some(role => role.authority === requiredRole);
      if (!hasRole) {
        toast.error('Bạn không có quyền truy cập vào trang này.');
        return <Navigate to="/" replace />;
      }
    } catch (err) {
      toast.error('Có lỗi xảy ra khi xác thực quyền truy cập.');
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

const AppRouterWrapper: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (isTokenValid(token)) {
      setIsAuthenticated(true);
      try {
        const decoded: { roles: { authority: string }[] } = jwtDecode(token!);
        const isAdmin = decoded.roles.some(role => role.authority === 'ROLE_Admin');
        if (isAdmin && window.location.pathname === '/') {
          navigate('/admin');
        }
      } catch (err) {
        console.error('Lỗi giải mã token:', err);
      }
    } else {
      localStorage.removeItem('jwt_token');
      setIsAuthenticated(false);
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthenticatePage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/store" element={<StoreListPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/product/:productId" element={<ProductDetailPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/returns" element={<ReturnPolicyPage />} />
      <Route path="*" element={<NotFoundPage />} />

      <Route
        path="/admin"
        element={
          <PrivateRoute requiredRole="ROLE_Admin">
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
