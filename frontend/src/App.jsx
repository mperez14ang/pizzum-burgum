import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { CreatorProvider } from './contexts/CreatorContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { HomePage } from './pages/HomePage';
import { CreatorPage } from './pages/CreatorPage';
import { CardPage } from "./pages/CardPage";
import {CardProvider} from "./contexts/CardContext.jsx";
import {AuthPage} from "./pages/AuthPage.jsx";

function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const [productType, setProductType] = useState(null);

    const handleNavigate = (type) => {
        if (type === 'card'){
            setCurrentPage('card');
            return;
        }
        if (type === 'login'){
            setCurrentPage('login');
            return;
        }
        if (type === 'register'){
            setCurrentPage('register');
            return;
        }

        setProductType(type);
        setCurrentPage('creator');
    };

    const handleBack = () => {
        setCurrentPage('home');
        setProductType(null);
    };

    return (
        <AuthProvider>
            <CardProvider>
                {(currentPage === 'card') && (
                    <CardPage onBack={handleBack}/>
                )}
            </CardProvider>
            {(currentPage === 'login') && (
                <AuthPage type={'login'} onBack={handleBack} onNavigate={handleNavigate} ></AuthPage>
                )}
            {(currentPage === 'register') && (
                <AuthPage type={'register'} onBack={handleBack} onNavigate={handleNavigate} ></AuthPage>
            )}

            <FavoritesProvider>
                <CreatorProvider>
                    {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
                    {(currentPage === 'creator') && (
                        <CreatorPage productType={productType} onBack={handleBack} />
                    )}
                </CreatorProvider>
            </FavoritesProvider>

        </AuthProvider>
    );
}

export default App;