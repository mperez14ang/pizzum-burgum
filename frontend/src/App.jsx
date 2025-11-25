import {useEffect, useRef, useState} from 'react';
import {useAuth} from './contexts/AuthContext';
import {CreatorProvider} from './contexts/CreatorContext.jsx';
import {FavoritesProvider} from './contexts/FavoritesContext';
import {HomePage} from './pages/HomePage';
import {CreatorPage} from './pages/CreatorPage';
import {AdminPage} from './pages/admin/AdminPage';
import {CardProvider} from "./contexts/CardContext.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import {SessionExpiredPage} from "./pages/SessionExpiredPage.jsx";
import {ExtrasPage} from './pages/ExtrasPage';
import FavoritesPage from "./pages/FavoritesPage.jsx";
import OrderHistoryPage from "./pages/OrderHistoryPage.jsx";
import {CheckoutPage} from "./pages/CheckoutPage.jsx";
import {Header} from "./components/common/Header.jsx";
import {CartProvider} from "./contexts/CartContext.jsx";
import {UseSessionChecker} from "./contexts/UseSessionChecker.jsx";

function App() {
    const headerRef = useRef()
    const [currentPage, setCurrentPage] = useState('home');
    const [prevPageType, setPrevPageType] = useState('home');
    const { user, isAuthenticated, isLoading, checkUser } = useAuth();
    const [hideCart, setHideCart] = useState(false)
    const [orderPayedId, setOrderPayedId] = useState(null)

    useEffect(() => {
        window.history.replaceState({ page: 'home' }, '', window.location.href);
        setCurrentPage('home');

        const handlePopState = (e) => {
            const state = e.state;
            if (state) {
                setCurrentPage(state.page);
            } else {
                setCurrentPage('home');
            }
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    useEffect(() => {
        requestAnimationFrame(() => {
            window.scrollTo(0, 0);
        });
    }, [currentPage]);

    useEffect(() => {
        setHideCart(currentPage === 'checkout' || currentPage === 'extras');
    }, [currentPage]);

    const handleNavigate = async (type, payedOrderId=null, validate=true) => {
        let newPage = 'home';
        setOrderPayedId(null)

        if (type === 'pizza' || type === 'burger'){
            newPage = `creator-${type}`
        }
        else if (type === 'profile'){
            newPage = 'profile'
        }
        else if (type === 'home'){
            newPage = 'home'
            setOrderPayedId(payedOrderId)
        }
        else if (type === 'favorites'){
            newPage = 'favorites'
        }
        else if (type === 'orders') {
            newPage = 'orders'
        }
        else if (type === 'checkout'){
            newPage = 'checkout'
        }
        else if (type === 'extras'){
            newPage = 'extras'
        }
        else{
            setCurrentPage('session-expired');
            return
        }

        if (user && validate && type !== 'home') {
            const result = await checkUser();
            if (!result) {
                setPrevPageType(type);
                setCurrentPage('session-expired');
                return;
            }
        }

        setCurrentPage(newPage);
        window.history.pushState({ page: newPage }, '', window.location.href);
    };

    const handleBack = () => {
        setOrderPayedId(null)
        window.history.back();
    };

    const onLogin = async () => {
        await handleNavigate(prevPageType, false)
    }

    UseSessionChecker(handleNavigate, setPrevPageType, currentPage, 10000); // Cada 10 segundos

    if (isAuthenticated && user?.role === 'ADMIN') {
        return (
            <>
                <CardProvider>
                    <AdminPage />
                </CardProvider>
            </>
        );
    }

    return (
        <CardProvider>
            <CartProvider>
                <Header ref={headerRef} onNavigate={handleNavigate} hideCart={hideCart}/>
                <FavoritesProvider>
                    <CreatorProvider>
                        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} orderPayedId={orderPayedId} />}
                        {currentPage === 'creator-pizza' && (
                            <CreatorPage type={"pizza"} onBack={handleBack} onNavigate={handleNavigate}/>
                        )}
                        {currentPage === 'creator-burger' && (
                            <CreatorPage type={"burger"} onBack={handleBack} onNavigate={handleNavigate}/>
                        )}
                        {currentPage === 'extras' && (
                            <ExtrasPage onBack={handleBack} onNavigate={handleNavigate}/>
                        )}
                        {currentPage === 'profile' && (
                            <ProfilePage onBack={() => handleNavigate('home')} user={user} onNavigate={handleNavigate}/>
                        )}
                        {currentPage === 'favorites' && (
                            <FavoritesPage onBack={() => handleNavigate('home')} onNavigate={handleNavigate}/>
                        )}
                        {currentPage === 'orders' && (
                            <OrderHistoryPage onBack={() => handleNavigate('home')} onNavigate={handleNavigate}/>
                        )}
                        {currentPage === 'checkout' && (
                            <CheckoutPage onNavigate={handleNavigate} onBack={handleBack}/>
                        )}
                        {currentPage === 'session-expired' && (
                            <SessionExpiredPage onLogin={onLogin} onBack={() => handleNavigate('home')} isAuthenticated={isAuthenticated} />
                        )}
                    </CreatorProvider>
                </FavoritesProvider>
            </CartProvider>
        </CardProvider>
    );
}

export default App;