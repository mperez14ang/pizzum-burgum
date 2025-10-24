import { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { OrderManagement } from './OrderManagement';
import { ProductManagement } from './ProductManagement';
import { AdminManagement } from './AdminManagement';
import AdminProfilePage from './AdminProfilePage.jsx';

export const AdminPage = () => {
    const [currentSection, setCurrentSection] = useState('orders');

    const renderSection = () => {
        switch (currentSection) {
            case 'orders':
                return <OrderManagement />;
            case 'products':
                return <ProductManagement />;
            case 'admins':
                return <AdminManagement />;
            case 'profile':
                return <AdminProfilePage onBack={() => {}} onEditPassword={() => {}} />;
            default:
                return <OrderManagement />;
        }
    };

    return (
        <AdminLayout currentSection={currentSection} onSectionChange={setCurrentSection}>
            {renderSection()}
        </AdminLayout>
    );
};
