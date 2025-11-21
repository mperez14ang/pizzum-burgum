import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { CreatorProvider } from './contexts/CreatorContext.jsx';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { HomePage } from './pages/HomePage';
import { CreatorPage } from './pages/CreatorPage';
import { AdminPage } from './pages/admin/AdminPage';
import { CardProvider } from "./contexts/CardContext.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import { SessionExpiredPage } from "./pages/SessionExpiredPage.jsx";
import { ExtrasPage } from './pages/ExtrasPage';
import FavoritesPage from "./pages/FavoritesPage.jsx";
import OrderHistoryPage from "./pages/OrderHistoryPage.jsx";
import { CheckoutPage } from "./pages/CheckoutPage.jsx";
import { Header } from "./components/common/Header.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";
import { UseSessionChecker } from "./contexts/UseSessionChecker.jsx";

function useAppNavigation() {
    const navigate = useNavigate();

    return (type, payedOrderId = null) => {
        const routes = {
            'pizza': '/creator/pizza',
            'burger': '/creator/burger',
            'profile': '/profile',
            'home': '/',
            'favorites': '/favorites',
            'orders': '/orders',
            'checkout': '/checkout',
            'extras': '/extras'
        };

        const path = routes[type] || '/';

        if (payedOrderId) {
            navigate(path, { state: { orderPayedId: payedOrderId } });
        } else {
            navigate(path);
        }
    };
}

function ProtectedRoute({ children }) {
    const { user, isAuthenticated, checkUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const validateSession = async () => {
            if (user && isAuthenticated) {
                const result = await checkUser();
                if (!result) {
                    navigate('/session-expired', {
                        state: { from: location.pathname },
                        replace: true
                    });
                }
            }
        };

        validateSession();
    }, [location.pathname]);

    return children;
}

// Admin Route Guard
function AdminRoute({ children }) {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated || user?.role !== 'ADMIN') {
        return <Navigate to="/" replace />;
    }

    return children;
}

// Layout Component for regular users
function UserLayout({ children, hideCart = false }) {
    const location = useLocation();
    const handleNavigate = useAppNavigation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <>
            <Header onNavigate={handleNavigate} hideCart={hideCart} />
            {children}
        </>
    );
}

// Session Checker Wrapper
function SessionCheckerWrapper() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleSessionExpired = () => {
        navigate('/session-expired', {
            state: { from: location.pathname },
            replace: true
        });
    };

    UseSessionChecker(handleSessionExpired, () => {}, location.pathname, 30000);

    return null;
}

// Wrapper común para rutas protegidas con providers
function ProtectedPageWrapper({ children, requireAuth = true }) {
    const content = (
        <FavoritesProvider>
            <CreatorProvider>
                {children}
            </CreatorProvider>
        </FavoritesProvider>
    );

    return requireAuth ? (
        <ProtectedRoute>{content}</ProtectedRoute>
    ) : content;
}

function AppRoutes() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated } = useAuth();
    const handleNavigate = useAppNavigation();

    const handleBack = () => navigate(-1);

    // Redirecciona a admin
    if (isAuthenticated && user?.role === 'ADMIN' && !location.pathname.startsWith('/admin')) {
        return <Navigate to="/admin" replace />;
    }

    return (
        <>
            <SessionCheckerWrapper />
            <Routes>
                {/* Admin Routes */}
                <Route path="/admin/*" element={
                    <AdminRoute>
                        <AdminPage />
                    </AdminRoute>
                } />

                {/* Home - No requiere autenticación */}
                <Route path="/" element={
                    <UserLayout>
                        <ProtectedPageWrapper requireAuth={false}>
                            <HomePage
                                onNavigate={handleNavigate}
                                orderPayedId={location.state?.orderPayedId}
                            />
                        </ProtectedPageWrapper>
                    </UserLayout>
                } />

                {/* Creator Routes */}
                <Route path="/creator/pizza" element={
                    <UserLayout>
                        <ProtectedPageWrapper>
                            <CreatorPage
                                type="pizza"
                                onBack={handleBack}
                                onNavigate={handleNavigate}
                            />
                        </ProtectedPageWrapper>
                    </UserLayout>
                } />

                <Route path="/creator/burger" element={
                    <UserLayout>
                        <ProtectedPageWrapper>
                            <CreatorPage
                                type="burger"
                                onBack={handleBack}
                                onNavigate={handleNavigate}
                            />
                        </ProtectedPageWrapper>
                    </UserLayout>
                } />

                {/* Extras */}
                <Route path="/extras" element={
                    <UserLayout hideCart>
                        <ProtectedPageWrapper>
                            <ExtrasPage
                                onBack={handleBack}
                                onNavigate={handleNavigate}
                            />
                        </ProtectedPageWrapper>
                    </UserLayout>
                } />

                {/* Profile */}
                <Route path="/profile" element={
                    <UserLayout>
                        <ProtectedPageWrapper>
                            <ProfilePage
                                onBack={() => handleNavigate('home')}
                                user={user}
                                onNavigate={handleNavigate}
                            />
                        </ProtectedPageWrapper>
                    </UserLayout>
                } />

                {/* Favorites */}
                <Route path="/favorites" element={
                    <UserLayout>
                        <ProtectedPageWrapper>
                            <FavoritesPage
                                onBack={() => handleNavigate('home')}
                                onNavigate={handleNavigate}
                            />
                        </ProtectedPageWrapper>
                    </UserLayout>
                } />

                {/* Orders */}
                <Route path="/orders" element={
                    <UserLayout>
                        <ProtectedPageWrapper>
                            <OrderHistoryPage
                                onBack={() => handleNavigate('home')}
                                onNavigate={handleNavigate}
                            />
                        </ProtectedPageWrapper>
                    </UserLayout>
                } />

                {/* Checkout */}
                <Route path="/checkout" element={
                    <UserLayout hideCart>
                        <ProtectedPageWrapper>
                            <CheckoutPage
                                onNavigate={handleNavigate}
                                onBack={handleBack}
                            />
                        </ProtectedPageWrapper>
                    </UserLayout>
                } />

                {/* Session Expired */}
                <Route path="/session-expired" element={
                    <UserLayout>
                        <ProtectedPageWrapper requireAuth={false}>
                            <SessionExpiredPage
                                onLogin={() => {
                                    const from = location.state?.from || '/';
                                    navigate(from, { replace: true });
                                }}
                                onBack={() => handleNavigate('home')}
                                isAuthenticated={isAuthenticated}
                            />
                        </ProtectedPageWrapper>
                    </UserLayout>
                } />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <CardProvider>
                <CartProvider>
                    <AppRoutes />
                </CartProvider>
            </CardProvider>
        </BrowserRouter>
    );
}

export default App;