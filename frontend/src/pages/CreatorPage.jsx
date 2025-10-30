import {useEffect, useRef, useState} from 'react';
import {ChevronLeft} from 'lucide-react';
import {Header} from '../components/common/Header';
import {AddToCartModal} from './modals/AddToCartModal.jsx';
import {useCreatorStore} from '../contexts/CreatorContext';
import {useFavorites} from '../contexts/FavoritesContext';
import {useAuth} from '../contexts/AuthContext';
import {cartService, ingredientsService} from '../services/api';
import toast from "react-hot-toast";
import {FavoritesLoginModal} from "./modals/FavoritesLoginModal.jsx";
import {LoginAndRegisterModal} from "./modals/LoginAndRegisterModal.jsx";
import {PRODUCT_CONFIG} from "../utils/ProductsConfig.jsx";
import {ProductSection} from "../components/ProductSection.jsx";
import {SummaryPanel} from "../components/summary/SummaryPanel.jsx";

export const CreatorPage = ({ productType, onBack, onNavigate }) => {
    const headerRef = useRef();
    const { creation, updateCreation, resetCreation } = useCreatorStore();
    const { addToFavorites } = useFavorites();
    const { isAuthenticated, user } = useAuth();

    // Estado unificado para todas las selecciones
    const [selections, setSelections] = useState({});
    const [favoriteName, setFavoriteName] = useState('');
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [isSavingFavorite, setIsSavingFavorite] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [showCartModal, setShowCartModal] = useState(false);
    const [ingredients, setIngredients] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Obtener configuración del producto actual
    const productConfig = PRODUCT_CONFIG[productType];

    // Cargar ingredientes
    useEffect(() => {
        const loadIngredients = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await ingredientsService.getAllIngredients();
                setIngredients(data);
            } catch (err) {
                setError('Error al cargar los ingredientes. Por favor, intenta de nuevo.');
                console.error('Error loading ingredients:', err);
            } finally {
                setLoading(false);
            }
        };
        loadIngredients();
    }, []);

    // Resetear cuando cambia el tipo de producto
    useEffect(() => {
        resetCreation();
        setSelections({});
        setFavoriteName('');
    }, [productType, resetCreation]);

    // Handler genérico para actualizar selecciones
    const updateSelection = (stateKey, value) => {
        setSelections(prev => ({
            ...prev,
            [stateKey]: value
        }));
    };

    // Validar selecciones según configuración
    const validateSelections = () => {
        const validations = productConfig.validations;

        for (const [key, validation] of Object.entries(validations)) {
            if (validation.required) {
                const section = productConfig.sections.find(s => s.id === key);
                const value = selections[section.stateKey];

                if (!value || (Array.isArray(value) && value.length === 0)) {
                    toast.error(validation.message, { duration: 2000 });
                    return false;
                }
            }
        }
        return true;
    };

    // Calcular precio total
    const calculateTotal = () => {
        let total = 0;

        productConfig.sections.forEach(section => {
            const value = selections[section.stateKey];

            if (!value) return;

            if (section.type === 'multi-select' && Array.isArray(value)) {
                value.forEach(item => {
                    total += item.price || 0;
                });
            } else if (section.type === 'single-select-with-quantity') {
                const quantity = selections[section.quantityConfig.stateKey] || 1;
                total += (value.price || 0) * quantity;
            } else {
                total += value.price || 0;
            }
        });

        return total;
    };

    // Crear datos de creación para API
    const createCreationData = () => {
        if (!validateSelections()) return null;

        const data = {
            name: favoriteName.trim(),
            type: productConfig.type
        };

        // Mapear selecciones a formato de API
        productConfig.sections.forEach(section => {
            const value = selections[section.stateKey];
            if (value) {
                if (section.type === 'single-select-with-quantity') {
                    data[section.id] = value;
                    data[`${section.id}Quantity`] = selections[section.quantityConfig.stateKey] || 1;
                } else {
                    data[section.id] = value;
                }
            }
        });

        return data;
    };

    // Guardar en favoritos
    const handleSaveFavorite = async () => {
        if (!isAuthenticated) {
            setShowLoginPrompt(true);
            return;
        }

        if (!favoriteName.trim()) {
            toast.error('Por favor ingresa un nombre para tu favorito', { duration: 2000 });
            return;
        }

        const creationData = createCreationData();
        if (!creationData) return;

        setIsSavingFavorite(true);
        const result = await addToFavorites(creationData);
        setIsSavingFavorite(false);

        if (result.success) {
            setFavoriteName('');
            toast.success('¡Creación guardada en favoritos!', { duration: 2000 });
        } else {
            toast.error('Error al guardar en favoritos: ' + (result.error || 'Intenta de nuevo'), { duration: 2000 });
        }
    };

    // Agregar al carrito
    const handleAddToCart = async () => {
        if (!isAuthenticated || !user) {
            toast.error("Debes iniciar sesión para agregar al carrito");
            return;
        }

        const creationData = createCreationData();
        if (!creationData) return;

        setShowCartModal(true);
        const result = await cartService.addToCart(creationData, 1);

        if (!result) {
            toast.error("No se pudo agregar al carrito");
            return;
        }

        toast.success("Agregado al carrito");
    };

    const handleContinueShopping = () => {
        setShowCartModal(false);
        resetCreation();
        onNavigate('home');
    };

    const handleGoToExtras = () => {
        setShowCartModal(false);
        toast.loading('Funcionalidad en desarrollo', { duration: 2000 });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header ref={headerRef} onNavigate={onNavigate}/>
                <div className="flex justify-center items-center h-[calc(100vh-64px)]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Cargando ingredientes...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header ref={headerRef} onNavigate={onNavigate} />
                <div className="flex justify-center items-center h-[calc(100vh-64px)]">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header ref={headerRef} onNavigate={onNavigate} />

            <div className="container mx-auto px-4 py-6">
                <button
                    onClick={onBack}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ChevronLeft size={20} />
                    <span className="ml-1">Volver</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Panel de selección */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-2xl font-bold mb-6">
                                {productConfig.emoji} Crea tu {productConfig.displayName}
                            </h2>

                            <div className="space-y-4">
                                {productConfig.sections.map((section, index) => (
                                    <ProductSection
                                        key={section.id}
                                        section={section}
                                        ingredients={ingredients[section.ingredientKey] || []}
                                        selections={selections}
                                        onUpdateSelection={updateSelection}
                                        isOpen={index === 0}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Panel de resumen */}
                    <SummaryPanel
                        productConfig={productConfig}
                        selections={selections}
                        total={calculateTotal()}
                        favoriteName={favoriteName}
                        onFavoriteNameChange={setFavoriteName}
                        onSaveFavorite={handleSaveFavorite}
                        onAddToCart={handleAddToCart}
                        isSavingFavorite={isSavingFavorite}
                        isAuthenticated={isAuthenticated}
                    />
                </div>
            </div>

            <FavoritesLoginModal
                isOpen={showLoginPrompt}
                onOpenLogin={() => {
                    setShowLoginPrompt(false);
                    setIsAuthModalOpen(true);
                }}
                onClose={() => setShowLoginPrompt(false)}
            />

            <LoginAndRegisterModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />

            <AddToCartModal
                isOpen={showCartModal}
                onClose={() => setShowCartModal(false)}
                onContinueShopping={handleContinueShopping}
                onGoToExtras={handleGoToExtras}
                productType={productType}
            />
        </div>
    );
};