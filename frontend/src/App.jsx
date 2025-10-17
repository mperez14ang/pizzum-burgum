import { useState } from 'react';
import { CreatorProvider } from './contexts/CreatorContext';
import { HomePage } from './pages/HomePage';
import { CreatorPage } from './pages/CreatorPage';

function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const [productType, setProductType] = useState(null);

    const handleNavigate = (type) => {
        setProductType(type);
        setCurrentPage('creator');
    };

    const handleBack = () => {
        setCurrentPage('home');
        setProductType(null);
    };

    return (
        <CreatorProvider>
            {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
            {currentPage === 'creator' && (
                <CreatorPage productType={productType} onBack={handleBack} />
            )}
        </CreatorProvider>
    );
}

export default App;