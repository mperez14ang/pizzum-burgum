
import { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Header } from '../components/common/Header';
import { Accordion } from '../components/common/Accordion';
import { QuantitySelector } from '../components/common/QuantitySelector';
import { useCreatorStore } from '../contexts/CreatorContext';
import { ingredientsService } from '../services/api';

export const CreatorPage = ({ productType, onBack }) => {
    const { creation, updateCreation, resetCreation } = useCreatorStore();

    // Código modificado - Definir las imágenes
    const images = {
        pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
        burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80'
    };

    // Estados para ingredientes dinámicos desde el backend
    const [ingredients, setIngredients] = useState({
        BREAD_OPTIONS: [],
        MEAT_OPTIONS: [],
        BURGER_CHEESE: [],
        BURGER_TOPPINGS: [],
        BURGER_SAUCES: [],
        PIZZA_DOUGH: [],
        PIZZA_SIZES: [],
        PIZZA_SAUCE: [],
        PIZZA_CHEESE: [],
        PIZZA_TOPPINGS: []
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados para la creación actual
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedDough, setSelectedDough] = useState(null);
    const [selectedSauce, setSelectedSauce] = useState(null);
    const [selectedCheese, setSelectedCheese] = useState(null);
    const [selectedToppings, setSelectedToppings] = useState([]);

    // Para hamburguesas
    const [selectedBread, setSelectedBread] = useState(null);
    const [selectedMeat, setSelectedMeat] = useState(null);
    const [meatQuantity, setMeatQuantity] = useState(1);
    const [selectedBurgerCheese, setSelectedBurgerCheese] = useState(null);
    const [selectedBurgerToppings, setSelectedBurgerToppings] = useState([]);
    const [selectedBurgerSauces, setSelectedBurgerSauces] = useState([]);

    const MAX_TOPPINGS = 10;
    const MAX_BURGER_PATTIES = 3;

    // Cargar ingredientes del backend al montar el componente
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
        setSelectedSize(null);
        setSelectedDough(null);
        setSelectedSauce(null);
        setSelectedCheese(null);
        setSelectedToppings([]);
        setSelectedBread(null);
        setSelectedMeat(null);
        setMeatQuantity(1);
        setSelectedBurgerCheese(null);
        setSelectedBurgerToppings([]);
        setSelectedBurgerSauces([]);
    }, [productType, resetCreation]);

    // Calcular precio total
    const calculateTotal = () => {
        let total = 0;

        if (productType === 'pizza') {
            if (selectedSize) total += selectedSize.price;
            if (selectedDough) total += selectedDough.price;
            if (selectedSauce) total += selectedSauce.price;
            if (selectedCheese) total += selectedCheese.price;
            selectedToppings.forEach(topping => {
                total += topping.price;
            });
        } else if (productType === 'burger') {
            if (selectedBread) total += selectedBread.price;
            if (selectedMeat) total += selectedMeat.price * meatQuantity;
            if (selectedBurgerCheese) total += selectedBurgerCheese.price;
            selectedBurgerToppings.forEach(topping => {
                total += topping.price;
            });
            selectedBurgerSauces.forEach(sauce => {
                total += sauce.price;
            });
        }

        return total;
    };

    // Toggle topping para pizza
    const toggleTopping = (topping) => {
        const isSelected = selectedToppings.some(t => t.id === topping.id);

        if (isSelected) {
            setSelectedToppings(selectedToppings.filter(t => t.id !== topping.id));
        } else {
            if (selectedToppings.length < MAX_TOPPINGS) {
                setSelectedToppings([...selectedToppings, topping]);
            } else {
                alert(`Solo puedes seleccionar hasta ${MAX_TOPPINGS} toppings`);
            }
        }
    };

    // Toggle topping para hamburguesa
    const toggleBurgerTopping = (topping) => {
        const isSelected = selectedBurgerToppings.some(t => t.id === topping.id);

        if (isSelected) {
            setSelectedBurgerToppings(selectedBurgerToppings.filter(t => t.id !== topping.id));
        } else {
            setSelectedBurgerToppings([...selectedBurgerToppings, topping]);
        }
    };

    // Toggle salsa para hamburguesa
    const toggleBurgerSauce = (sauce) => {
        const isSelected = selectedBurgerSauces.some(s => s.id === sauce.id);

        if (isSelected) {
            setSelectedBurgerSauces(selectedBurgerSauces.filter(s => s.id !== sauce.id));
        } else {
            setSelectedBurgerSauces([...selectedBurgerSauces, sauce]);
        }
    };

    // Incrementar/decrementar cantidad de carne
    const handleMeatIncrease = () => {
        if (meatQuantity < MAX_BURGER_PATTIES) {
            setMeatQuantity(meatQuantity + 1);
        }
    };

    const handleMeatDecrease = () => {
        if (meatQuantity > 1) {
            setMeatQuantity(meatQuantity - 1);
        }
    };

    // Guardar creación
    const handleSaveCreation = () => {
        const creationData = productType === 'pizza' ? {
            type: 'pizza',
            size: selectedSize,
            dough: selectedDough,
            sauce: selectedSauce,
            cheese: selectedCheese,
            toppings: selectedToppings,
            total: calculateTotal()
        } : {
            type: 'burger',
            bread: selectedBread,
            meat: selectedMeat,
            meatQuantity: meatQuantity,
            cheese: selectedBurgerCheese,
            toppings: selectedBurgerToppings,
            sauces: selectedBurgerSauces,
            total: calculateTotal()
        };

        console.log('Creación guardada:', creationData);
        alert('¡Creación guardada en favoritos!');
    };

    // Agregar al carrito
    const handleAddToCart = () => {
        const creationData = productType === 'pizza' ? {
            type: 'pizza',
            size: selectedSize,
            dough: selectedDough,
            sauce: selectedSauce,
            cheese: selectedCheese,
            toppings: selectedToppings,
            total: calculateTotal()
        } : {
            type: 'burger',
            bread: selectedBread,
            meat: selectedMeat,
            meatQuantity: meatQuantity,
            cheese: selectedBurgerCheese,
            toppings: selectedBurgerToppings,
            sauces: selectedBurgerSauces,
            total: calculateTotal()
        };

        console.log('Agregado al carrito:', creationData);
        alert('¡Agregado al carrito!');
    };

    // Estados de carga y error
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
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
                <Header />
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
            <Header />

            <div className="container mx-auto px-4 py-6">
                {/* Botón volver */}
                <button
                    onClick={onBack}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ChevronLeft size={20} />
                    <span className="ml-1">Volver</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Panel de selección de ingredientes */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-2xl font-bold mb-6">
                                {productType === 'pizza' ? '🍕 Crea tu Pizza' : '🍔 Crea tu Hamburguesa'}
                            </h2>

                            {/* SECCIÓN PIZZA */}
                            {productType === 'pizza' && (
                                <div className="space-y-4">
                                    {/* Tamaño */}
                                    <Accordion title="1. Tamaño" isOpen={true}>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            {ingredients.PIZZA_SIZES.map((size) => (
                                                <button
                                                    key={size.id}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`p-4 border-2 rounded-lg transition ${
                                                        selectedSize?.id === size.id
                                                            ? 'border-orange-500 bg-orange-50'
                                                            : 'border-gray-200 hover:border-orange-300'
                                                    }`}
                                                >
                                                    <div className="font-semibold">{size.name}</div>
                                                    <div className="text-sm text-gray-600">${size.price}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </Accordion>

                                    {/* Masa */}
                                    <Accordion title="2. Tipo de Masa">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            {ingredients.PIZZA_DOUGH.map((dough) => (
                                                <button
                                                    key={dough.id}
                                                    onClick={() => setSelectedDough(dough)}
                                                    className={`p-4 border-2 rounded-lg transition ${
                                                        selectedDough?.id === dough.id
                                                            ? 'border-orange-500 bg-orange-50'
                                                            : 'border-gray-200 hover:border-orange-300'
                                                    }`}
                                                >
                                                    <div className="font-semibold">{dough.name}</div>
                                                    <div className="text-sm text-gray-600">
                                                        {dough.price > 0 ? `+$${dough.price}` : 'Incluido'}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </Accordion>

                                    {/* Salsa */}
                                    <Accordion title="3. Salsa">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {ingredients.PIZZA_SAUCE.map((sauce) => (
                                                <button
                                                    key={sauce.id}
                                                    onClick={() => setSelectedSauce(sauce)}
                                                    className={`p-4 border-2 rounded-lg transition ${
                                                        selectedSauce?.id === sauce.id
                                                            ? 'border-orange-500 bg-orange-50'
                                                            : 'border-gray-200 hover:border-orange-300'
                                                    }`}
                                                >
                                                    <div className="font-semibold">{sauce.name}</div>
                                                    <div className="text-sm text-gray-600">
                                                        {sauce.price > 0 ? `+$${sauce.price}` : 'Incluido'}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </Accordion>

                                    {/* Queso */}
                                    <Accordion title="4. Queso">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {ingredients.PIZZA_CHEESE.map((cheese) => (
                                                <button
                                                    key={cheese.id}
                                                    onClick={() => setSelectedCheese(cheese)}
                                                    className={`p-4 border-2 rounded-lg transition ${
                                                        selectedCheese?.id === cheese.id
                                                            ? 'border-orange-500 bg-orange-50'
                                                            : 'border-gray-200 hover:border-orange-300'
                                                    }`}
                                                >
                                                    <div className="font-semibold">{cheese.name}</div>
                                                    <div className="text-sm text-gray-600">
                                                        {cheese.price > 0 ? `+$${cheese.price}` : 'Incluido'}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </Accordion>

                                    {/* Toppings */}
                                    <Accordion title="5. Toppings">
                                        <p className="text-sm text-gray-600 mb-3">
                                            Seleccionados: {selectedToppings.length}/{MAX_TOPPINGS}
                                        </p>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {ingredients.PIZZA_TOPPINGS.map((topping) => {
                                                const isSelected = selectedToppings.some(t => t.id === topping.id);
                                                return (
                                                    <button
                                                        key={topping.id}
                                                        onClick={() => toggleTopping(topping)}
                                                        className={`p-3 border-2 rounded-lg transition ${
                                                            isSelected
                                                                ? 'border-orange-500 bg-orange-50'
                                                                : 'border-gray-200 hover:border-orange-300'
                                                        }`}
                                                    >
                                                        <div className="font-semibold text-sm">{topping.name}</div>
                                                        <div className="text-xs text-gray-600">+${topping.price}</div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </Accordion>
                                </div>
                            )}

                            {/* SECCIÓN HAMBURGUESA */}
                            {productType === 'burger' && (
                                <div className="space-y-4">
                                    {/* Pan */}
                                    <Accordion title="1. Tipo de Pan" isOpen={true}>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            {ingredients.BREAD_OPTIONS.map((bread) => (
                                                <button
                                                    key={bread.id}
                                                    onClick={() => setSelectedBread(bread)}
                                                    className={`p-4 border-2 rounded-lg transition ${
                                                        selectedBread?.id === bread.id
                                                            ? 'border-orange-500 bg-orange-50'
                                                            : 'border-gray-200 hover:border-orange-300'
                                                    }`}
                                                >
                                                    <div className="font-semibold">{bread.name}</div>
                                                    <div className="text-sm text-gray-600">
                                                        {bread.price > 0 ? `+$${bread.price}` : 'Incluido'}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </Accordion>

                                    {/* Carne */}
                                    <Accordion title="2. Tipo de Carne">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {ingredients.MEAT_OPTIONS.map((meat) => (
                                                <button
                                                    key={meat.id}
                                                    onClick={() => setSelectedMeat(meat)}
                                                    className={`p-4 border-2 rounded-lg transition ${
                                                        selectedMeat?.id === meat.id
                                                            ? 'border-orange-500 bg-orange-50'
                                                            : 'border-gray-200 hover:border-orange-300'
                                                    }`}
                                                >
                                                    <div className="font-semibold">{meat.name}</div>
                                                    <div className="text-sm text-gray-600">${meat.price}</div>
                                                </button>
                                            ))}
                                        </div>

                                        {selectedMeat && (
                                            <div className="mt-4 p-4 bg-gray-50 rounded">
                                                <label className="block text-sm font-medium mb-2">
                                                    Cantidad de carnes (máx. {MAX_BURGER_PATTIES}):
                                                </label>
                                                <QuantitySelector
                                                    quantity={meatQuantity}
                                                    onIncrease={handleMeatIncrease}
                                                    onDecrease={handleMeatDecrease}
                                                    min={1}
                                                    max={MAX_BURGER_PATTIES}
                                                />
                                            </div>
                                        )}
                                    </Accordion>

                                    {/* Queso */}
                                    <Accordion title="3. Queso">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {ingredients.BURGER_CHEESE.map((cheese) => (
                                                <button
                                                    key={cheese.id}
                                                    onClick={() => setSelectedBurgerCheese(cheese)}
                                                    className={`p-4 border-2 rounded-lg transition ${
                                                        selectedBurgerCheese?.id === cheese.id
                                                            ? 'border-orange-500 bg-orange-50'
                                                            : 'border-gray-200 hover:border-orange-300'
                                                    }`}
                                                >
                                                    <div className="font-semibold">{cheese.name}</div>
                                                    <div className="text-sm text-gray-600">
                                                        {cheese.price > 0 ? `+$${cheese.price}` : 'Incluido'}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </Accordion>

                                    {/* Toppings */}
                                    <Accordion title="4. Toppings">
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {ingredients.BURGER_TOPPINGS.map((topping) => {
                                                const isSelected = selectedBurgerToppings.some(t => t.id === topping.id);
                                                return (
                                                    <button
                                                        key={topping.id}
                                                        onClick={() => toggleBurgerTopping(topping)}
                                                        className={`p-3 border-2 rounded-lg transition ${
                                                            isSelected
                                                                ? 'border-orange-500 bg-orange-50'
                                                                : 'border-gray-200 hover:border-orange-300'
                                                        }`}
                                                    >
                                                        <div className="font-semibold text-sm">{topping.name}</div>
                                                        <div className="text-xs text-gray-600">
                                                            {topping.price > 0 ? `+$${topping.price}` : 'Incluido'}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </Accordion>

                                    {/* Salsas */}
                                    <Accordion title="5. Salsas">
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {ingredients.BURGER_SAUCES.map((sauce) => {
                                                const isSelected = selectedBurgerSauces.some(s => s.id === sauce.id);
                                                return (
                                                    <button
                                                        key={sauce.id}
                                                        onClick={() => toggleBurgerSauce(sauce)}
                                                        className={`p-3 border-2 rounded-lg transition ${
                                                            isSelected
                                                                ? 'border-orange-500 bg-orange-50'
                                                                : 'border-gray-200 hover:border-orange-300'
                                                        }`}
                                                    >
                                                        <div className="font-semibold text-sm">{sauce.name}</div>
                                                        <div className="text-xs text-gray-600">
                                                            {sauce.price > 0 ? `+$${sauce.price}` : 'Incluido'}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </Accordion>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Panel de resumen */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                            {/* Código modificado - Imagen agregada aquí */}
                            <div className="mb-6 relative overflow-hidden rounded-lg shadow-md">
                                <img
                                    src={images[productType]}
                                    alt={productType === 'pizza' ? 'Pizza personalizada' : 'Hamburguesa personalizada'}
                                    className="w-full h-48 object-cover transition-transform hover:scale-105 duration-300"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/400x300?text=Imagen+no+disponible';
                                    }}
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                                    <p className="text-white font-semibold text-lg">
                                        {productType === 'pizza' ? '🍕 Tu Pizza' : '🍔 Tu Hamburguesa'}
                                    </p>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold mb-4">Resumen</h3>

                            {productType === 'pizza' ? (
                                <div className="space-y-3 mb-6">
                                    {selectedSize && (
                                        <div className="flex justify-between text-sm">
                                            <span>Tamaño: {selectedSize.name}</span>
                                            <span className="font-semibold">${selectedSize.price}</span>
                                        </div>
                                    )}
                                    {selectedDough && (
                                        <div className="flex justify-between text-sm">
                                            <span>Masa: {selectedDough.name}</span>
                                            <span className="font-semibold">
                                                {selectedDough.price > 0 ? `$${selectedDough.price}` : 'Incluido'}
                                            </span>
                                        </div>
                                    )}
                                    {selectedSauce && (
                                        <div className="flex justify-between text-sm">
                                            <span>Salsa: {selectedSauce.name}</span>
                                            <span className="font-semibold">
                                                {selectedSauce.price > 0 ? `$${selectedSauce.price}` : 'Incluido'}
                                            </span>
                                        </div>
                                    )}
                                    {selectedCheese && (
                                        <div className="flex justify-between text-sm">
                                            <span>Queso: {selectedCheese.name}</span>
                                            <span className="font-semibold">
                                                {selectedCheese.price > 0 ? `$${selectedCheese.price}` : 'Incluido'}
                                            </span>
                                        </div>
                                    )}
                                    {selectedToppings.length > 0 && (
                                        <div>
                                            <div className="font-medium text-sm mb-1">Toppings:</div>
                                            {selectedToppings.map((topping) => (
                                                <div key={topping.id} className="flex justify-between text-sm pl-2">
                                                    <span>• {topping.name}</span>
                                                    <span className="font-semibold">${topping.price}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-3 mb-6">
                                    {selectedBread && (
                                        <div className="flex justify-between text-sm">
                                            <span>Pan: {selectedBread.name}</span>
                                            <span className="font-semibold">
                                                {selectedBread.price > 0 ? `$${selectedBread.price}` : 'Incluido'}
                                            </span>
                                        </div>
                                    )}
                                    {selectedMeat && (
                                        <div className="flex justify-between text-sm">
                                            <span>Carne: {selectedMeat.name} x{meatQuantity}</span>
                                            <span className="font-semibold">${selectedMeat.price * meatQuantity}</span>
                                        </div>
                                    )}
                                    {selectedBurgerCheese && (
                                        <div className="flex justify-between text-sm">
                                            <span>Queso: {selectedBurgerCheese.name}</span>
                                            <span className="font-semibold">
                                                {selectedBurgerCheese.price > 0 ? `$${selectedBurgerCheese.price}` : 'Incluido'}
                                            </span>
                                        </div>
                                    )}
                                    {selectedBurgerToppings.length > 0 && (
                                        <div>
                                            <div className="font-medium text-sm mb-1">Toppings:</div>
                                            {selectedBurgerToppings.map((topping) => (
                                                <div key={topping.id} className="flex justify-between text-sm pl-2">
                                                    <span>• {topping.name}</span>
                                                    <span className="font-semibold">
                                                        {topping.price > 0 ? `$${topping.price}` : 'Incluido'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {selectedBurgerSauces.length > 0 && (
                                        <div>
                                            <div className="font-medium text-sm mb-1">Salsas:</div>
                                            {selectedBurgerSauces.map((sauce) => (
                                                <div key={sauce.id} className="flex justify-between text-sm pl-2">
                                                    <span>• {sauce.name}</span>
                                                    <span className="font-semibold">
                                                        {sauce.price > 0 ? `$${sauce.price}` : 'Incluido'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="border-t pt-4 mb-6">
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total:</span>
                                    <span className="text-orange-500">${calculateTotal()}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={handleAddToCart}
                                    className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart size={20} />
                                    Agregar al Carrito
                                </button>

                                <button
                                    onClick={handleSaveCreation}
                                    className="w-full border-2 border-orange-500 text-orange-500 py-3 rounded-lg hover:bg-orange-50 transition"
                                >
                                    Guardar en Favoritos
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};