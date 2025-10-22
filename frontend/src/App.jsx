import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CreatorProvider } from './contexts/CreatorContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { HomePage } from './pages/HomePage';
import { CreatorPage } from './pages/CreatorPage';
import { AdminPage } from './pages/admin/AdminPage';
import { CardPage } from "./pages/CardPage";
import { CardProvider } from "./contexts/CardContext.jsx";

function AppContent() {
    const { user, isAuthenticated } = useAuth();
    const [currentPage, setCurrentPage] = useState('home');
    const [productType, setProductType] = useState(null);

    const handleNavigate = (type) => {
        if (type === 'card'){
            setCurrentPage('card');
            return;
        }

        setProductType(type);
        setCurrentPage('creator');
    };

    const handleBack = () => {
        setCurrentPage('home');
        setProductType(null);
    };

    // Si el usuario es ADMIN, mostrar panel de admin
    if (isAuthenticated && user?.role === 'ADMIN') {
        return <AdminPage />;
    }

    // Para clientes o usuarios no autenticados, mantener funcionalidad original
    return (
        <CardProvider>
            <FavoritesProvider>
                <CreatorProvider>
                    {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
                    {currentPage === 'creator' && (
                        <CreatorPage productType={productType} onBack={handleBack} />
                    )}
                    {currentPage === 'card' && (
                        <CardPage onBack={handleBack}/>
                    )}
                </CreatorProvider>
            </FavoritesProvider>
        </CardProvider>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;