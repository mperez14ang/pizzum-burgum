import {useEffect, useState} from 'react';
import {useAuth} from './contexts/AuthContext';
import {CreatorProvider} from './contexts/CreatorContext';
import {FavoritesProvider} from './contexts/FavoritesContext';
import {HomePage} from './pages/HomePage';
import {CreatorPage} from './pages/CreatorPage';
import {AdminPage} from './pages/admin/AdminPage';
import {CardModal} from "./pages/modals/CardModal.jsx";
import {CardProvider} from "./contexts/CardContext.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import {SessionExpiredPage} from "./pages/SessionExpiredPage.jsx";
import toast from "react-hot-toast";
import {ExtrasPage} from './pages/ExtrasPage';
import FavoritesPage from "./pages/FavoritesPage.jsx";
import OrderHistoryPage from "./pages/OrderHistoryPage.jsx";
import {CheckoutPage} from "./pages/CheckoutPage.jsx";

function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const [prevPageType, setPrevPageType] = useState('home');
    const { user, isAuthenticated, isLoading, checkUser } = useAuth();

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

    const handleNavigate = async (type, validate=true) => {
        let newPage = 'home';

        if (type === 'pizza' || type === 'burger'){
            newPage = `creator-${type}`
        }
        else if (type === 'profile'){
            newPage = 'profile'
        }
        else if (type === 'home'){
            newPage = 'home'
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
            console.log("No hay ninguna pagina definida!")
            return
        }

        // Check if token is verified
        if (user && validate && type !== 'home'){
            const result = await checkUser();
            if (!result) {
                setPrevPageType(type)
                setCurrentPage('session-expired');
                return
            }
        }
        setCurrentPage(newPage);
        window.history.pushState({ page: newPage }, '', window.location.href);
    };

    const handleBack = () => {
        window.history.back();
    };

    const onLogin = async () => {
        await handleNavigate(prevPageType, false)
    }

    if (isAuthenticated && user?.role === 'ADMIN') {
        return (
            <>
                <AdminPage />
            </>
        );
    }

    return (
        <CardProvider>
            <FavoritesProvider>
                <CreatorProvider>
                    {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
                    {currentPage === 'creator-pizza' && (
                        <CreatorPage productType={"pizza"} onBack={handleBack} onNavigate={handleNavigate}/>
                    )}
                    {currentPage === 'creator-burger' && (
                        <CreatorPage productType={"burger"} onBack={handleBack} onNavigate={handleNavigate}/>
                    )}
                    {currentPage === 'extras' && (
                        <ExtrasPage onBack={handleBack} onNavigate={handleNavigate}/>
                    )}
                    {currentPage === 'profile' && (
                        <ProfilePage onBack={() => handleNavigate('home')} user={user} onAddCard={CardModal} onNavigate={handleNavigate}/>
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
        </CardProvider>
    );
}

export default App;