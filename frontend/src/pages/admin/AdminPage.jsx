import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { OrderManagement } from './OrderManagement';
import { ProductManagement } from './ProductManagement';
import { UserManagement } from './UserManagement.jsx';
import AdminProfilePage from './AdminProfilePage.jsx';
import { useAuth } from "../../contexts/AuthContext.jsx";

export const AdminPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleSectionChange = (section) => {
        navigate(`/admin/${section}`);
    };

    // Get current section from URL
    const getCurrentSection = () => {
        const path = window.location.pathname;
        const section = path.split('/admin/')[1] || 'orders';
        return section;
    };

    return (
        <AdminLayout
            currentSection={getCurrentSection()}
            onSectionChange={handleSectionChange}
        >
            <Routes>
                <Route index element={<Navigate to="/admin/orders" replace />} />
                <Route path="orders" element={<OrderManagement />} />
                <Route path="products" element={<ProductManagement />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="profile" element={<AdminProfilePage onBack={() => {}} user={user} />} />
                <Route path="*" element={<Navigate to="/admin/orders" replace />} />
            </Routes>
        </AdminLayout>
    );
};