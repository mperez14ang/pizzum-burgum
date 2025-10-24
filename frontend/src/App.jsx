import {useEffect, useState} from 'react';
import {AuthProvider, useAuth} from './contexts/AuthContext';
import { CreatorProvider } from './contexts/CreatorContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { HomePage } from './pages/HomePage';
import { CreatorPage } from './pages/CreatorPage';
import { AdminPage } from './pages/admin/AdminPage';
import { CardPage } from "./pages/CardPage";
import { CardProvider } from "./contexts/CardContext.jsx";
import {AuthPage} from "./pages/AuthPage.jsx";
import {Toaster} from "react-hot-toast";
import ProfilePage from "./pages/ProfilePage.jsx";

function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const { user, isAuthenticated, isLoading } = useAuth();

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

    const handleNavigate = (type) => {
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
        else{
            console.log("No hay ninguna pagina definida!")
            return
        }

        setCurrentPage(newPage);
        window.history.pushState({ page: newPage }, '', window.location.href);
    };

    const handleBack = () => {
        window.history.back();
    };

    if (isAuthenticated && user?.role === 'ADMIN') {
        return (
            <>
                <Toaster position="top-right" />
                <AdminPage />
            </>
        );
    }

    return (
        <CardProvider>
            <Toaster position="top-right" />
            <FavoritesProvider>
                <CreatorProvider>
                    {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
                    {currentPage === 'creator-pizza' && (
                        <CreatorPage productType={"pizza"} onBack={handleBack} onNavigate={handleNavigate}/>
                    )}
                    {currentPage === 'creator-burger' && (
                        <CreatorPage productType={"burger"} onBack={handleBack} onNavigate={handleNavigate}/>
                    )}
                    {currentPage === 'profile' && (
                        <ProfilePage onBack={handleBack} user={user} onAddCard={CardPage} onNavigate={handleNavigate}/>
                    )}
                </CreatorProvider>
            </FavoritesProvider>
        </CardProvider>
    );
}

export default App;