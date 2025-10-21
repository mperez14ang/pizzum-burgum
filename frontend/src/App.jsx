import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { CreatorProvider } from './contexts/CreatorContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { HomePage } from './pages/HomePage';
import { CreatorPage } from './pages/CreatorPage';
import { CardPage } from "./pages/CardPage";
import {CardProvider} from "./contexts/CardContext.jsx";

function App() {
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

    return (
        <AuthProvider>
            <CardProvider>
                {(currentPage === 'card') && (
                    <CardPage onBack={handleBack}/>
                )}
            </CardProvider>

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