import { useEffect, useState } from 'react';
import { Header } from '../components/common/Header';
import { Accordion } from '../components/common/Accordion';
import { QuantitySelector } from '../components/common/QuantitySelector';
import { useCreatorStore } from '../contexts/CreatorContext';
import { PRODUCTS } from '../constants/products';
import {
    BREAD_OPTIONS,
    MEAT_OPTIONS,
    MEAT_POINTS,
    BURGER_CHEESE,
    BURGER_TOPPINGS,
    BURGER_SAUCES,
    PIZZA_DOUGH,
    PIZZA_SIZES,
    PIZZA_SAUCE,
    PIZZA_CHEESE,
    PIZZA_TOPPINGS,
    MAX_TOPPINGS
} from '../constants/ingredients';

export const CreatorPage = ({ productType, onBack }) => {
    const store = useCreatorStore();
    const [selectedBread, setSelectedBread] = useState('potato');
    const [selectedMeat, setSelectedMeat] = useState('beef');
    const [selectedMeatPoint, setSelectedMeatPoint] = useState('medium');
    const [selectedDough, setSelectedDough] = useState('neapolitan');
    const [selectedSize, setSelectedSize] = useState('small');
    const [selectedSauce, setSelectedSauce] = useState('tomato');
    const [selectedCheese, setSelectedCheese] = useState(productType === 'burger' ? 'cheddar' : 'mozzarella');

    useEffect(() => {
        const product = PRODUCTS[productType];
        store.setProductBase(product);
        return () => store.resetCreator();
    }, [productType]);

    if (!store.productBase) return null;

    const isBurger = productType === 'burger';

    const handleToggleTopping = (topping) => {
        const isSelected = store.selectedIngredients.some(ing => ing.id === topping.id);
        if (isSelected) {
            store.removeIngredient(topping.id);
        } else {
            if (store.selectedIngredients.filter(ing =>
                (isBurger ? BURGER_TOPPINGS : PIZZA_TOPPINGS).some(t => t.id === ing.id)
            ).length < MAX_TOPPINGS) {
                store.addIngredient(topping);
            }
        }
    };

    const handleAddToCart = () => {
        console.log('Adding to cart:', {
            product: store.productBase,
            ingredients: store.selectedIngredients,
            quantity: store.quantity,
            totalPrice: store.totalPrice * store.quantity
        });
        alert(`Added to cart! Total: $${(store.totalPrice * store.quantity).toFixed(0)}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <button
                    onClick={onBack}
                    className="text-gray-600 hover:text-gray-900 flex items-center gap-2 mb-4"
                >
                    <span>←</span> Back
                </button>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column - Image */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                            <img
                                src={store.productBase.image}
                                alt={store.productBase.name}
                                className="w-full h-96 object-cover"
                            />
                        </div>
                        <div className="flex gap-2">
                            <div className="w-20 h-20 bg-white rounded-lg overflow-hidden shadow cursor-pointer border-2 border-primary">
                                <img src={store.productBase.image} alt="thumbnail" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Customization */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {isBurger ? 'Create Your Burger' : 'Create Your Pizza'}
                        </h1>
                        <p className="text-gray-600 mb-6">
                            {store.productBase.description}
                        </p>

                        <h2 className="text-4xl font-bold text-primary mb-8">
                            $ {(store.totalPrice * store.quantity).toFixed(0)}
                        </h2>

                        {/* Ingredient Sections */}
                        <div className="space-y-2 mb-8">
                            {isBurger ? (
                                <>
                                    <Accordion title="BREAD" defaultOpen>
                                        <div className="space-y-2">
                                            {BREAD_OPTIONS.map(bread => (
                                                <label key={bread.id} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                                                    <input
                                                        type="radio"
                                                        name="bread"
                                                        value={bread.id}
                                                        checked={selectedBread === bread.id}
                                                        onChange={() => setSelectedBread(bread.id)}
                                                        className="w-4 h-4 text-primary"
                                                    />
                                                    <span className="flex-1">{bread.name}</span>
                                                    {bread.price > 0 && <span className="text-gray-500">+${bread.price}</span>}
                                                </label>
                                            ))}
                                        </div>
                                    </Accordion>

                                    <Accordion title="MEAT TYPE" defaultOpen>
                                        <div className="space-y-2">
                                            {MEAT_OPTIONS.map(meat => (
                                                <label key={meat.id} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                                                    <input
                                                        type="radio"
                                                        name="meat"
                                                        value={meat.id}
                                                        checked={selectedMeat === meat.id}
                                                        onChange={() => setSelectedMeat(meat.id)}
                                                        className="w-4 h-4 text-primary"
                                                    />
                                                    <span className="flex-1">{meat.name}</span>
                                                    {meat.price > 0 && <span className="text-gray-500">+${meat.price}</span>}
                                                </label>
                                            ))}
                                        </div>
                                    </Accordion>

                                    <Accordion title="MEAT POINT">
                                        <div className="space-y-2">
                                            {MEAT_POINTS.map(point => (
                                                <label key={point.id} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                                                    <input
                                                        type="radio"
                                                        name="meatPoint"
                                                        value={point.id}
                                                        checked={selectedMeatPoint === point.id}
                                                        onChange={() => setSelectedMeatPoint(point.id)}
                                                        className="w-4 h-4 text-primary"
                                                    />
                                                    <span>{point.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </Accordion>

                                    <Accordion title="CHEESE">
                                        <div className="space-y-2">
                                            {BURGER_CHEESE.map(cheese => (
                                                <label key={cheese.id} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                                                    <input
                                                        type="radio"
                                                        name="cheese"
                                                        value={cheese.id}
                                                        checked={selectedCheese === cheese.id}
                                                        onChange={() => setSelectedCheese(cheese.id)}
                                                        className="w-4 h-4 text-primary"
                                                    />
                                                    <span className="flex-1">{cheese.name}</span>
                                                    <span className="text-gray-500">+${cheese.price}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </Accordion>

                                    <Accordion title={`TOPPINGS (Maximum ${MAX_TOPPINGS})`}>
                                        <div className="space-y-2">
                                            {BURGER_TOPPINGS.map(topping => (
                                                <label key={topping.id} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                                                    <input
                                                        type="checkbox"
                                                        checked={store.selectedIngredients.some(ing => ing.id === topping.id)}
                                                        onChange={() => handleToggleTopping(topping)}
                                                        className="w-4 h-4 text-primary rounded"
                                                    />
                                                    <span className="flex-1">{topping.name}</span>
                                                    <span className="text-gray-500">+${topping.price}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </Accordion>

                                    <Accordion title="SAUCES">
                                        <div className="space-y-2">
                                            {BURGER_SAUCES.map(sauce => (
                                                <label key={sauce.id} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                                                    <input
                                                        type="checkbox"
                                                        checked={store.selectedIngredients.some(ing => ing.id === sauce.id)}
                                                        onChange={() => handleToggleTopping(sauce)}
                                                        className="w-4 h-4 text-primary rounded"
                                                    />
                                                    <span className="flex-1">{sauce.name}</span>
                                                    {sauce.price > 0 && <span className="text-gray-500">+${sauce.price}</span>}
                                                </label>
                                            ))}
                                        </div>
                                    </Accordion>
                                </>
                            ) : (
                                <>
                                    <Accordion title="SIZE" defaultOpen>
                                        <div className="space-y-2">
                                            {PIZZA_SIZES.map(size => (
                                                <label key={size.id} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                                                    <input
                                                        type="radio"
                                                        name="size"
                                                        value={size.id}
                                                        checked={selectedSize === size.id}
                                                        onChange={() => setSelectedSize(size.id)}
                                                        className="w-4 h-4 text-primary"
                                                    />
                                                    <span className="flex-1">{size.name}</span>
                                                    {size.price > 0 && <span className="text-gray-500">+${size.price}</span>}
                                                </label>
                                            ))}
                                        </div>
                                    </Accordion>

                                    <Accordion title="DOUGH" defaultOpen>
                                        <div className="space-y-2">
                                            {PIZZA_DOUGH.map(dough => (
                                                <label key={dough.id} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                                                    <input
                                                        type="radio"
                                                        name="dough"
                                                        value={dough.id}
                                                        checked={selectedDough === dough.id}
                                                        onChange={() => setSelectedDough(dough.id)}
                                                        className="w-4 h-4 text-primary"
                                                    />
                                                    <span className="flex-1">{dough.name}</span>
                                                    {dough.price > 0 && <span className="text-gray-500">+${dough.price}</span>}
                                                </label>
                                            ))}
                                        </div>
                                    </Accordion>

                                    <Accordion title="SAUCE">
                                        <div className="space-y-2">
                                            {PIZZA_SAUCE.map(sauce => (
                                                <label key={sauce.id} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                                                    <input
                                                        type="radio"
                                                        name="sauce"
                                                        value={sauce.id}
                                                        checked={selectedSauce === sauce.id}
                                                        onChange={() => setSelectedSauce(sauce.id)}
                                                        className="w-4 h-4 text-primary"
                                                    />
                                                    <span className="flex-1">{sauce.name}</span>
                                                    {sauce.price > 0 && <span className="text-gray-500">+${sauce.price}</span>}
                                                </label>
                                            ))}
                                        </div>
                                    </Accordion>

                                    <Accordion title="CHEESE">
                                        <div className="space-y-2">
                                            {PIZZA_CHEESE.map(cheese => (
                                                <label key={cheese.id} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                                                    <input
                                                        type="radio"
                                                        name="cheese"
                                                        value={cheese.id}
                                                        checked={selectedCheese === cheese.id}
                                                        onChange={() => setSelectedCheese(cheese.id)}
                                                        className="w-4 h-4 text-primary"
                                                    />
                                                    <span className="flex-1">{cheese.name}</span>
                                                    {cheese.price > 0 && <span className="text-gray-500">+${cheese.price}</span>}
                                                </label>
                                            ))}
                                        </div>
                                    </Accordion>

                                    <Accordion title={`TOPPINGS (Maximum ${MAX_TOPPINGS})`}>
                                        <div className="space-y-2">
                                            {PIZZA_TOPPINGS.map(topping => (
                                                <label key={topping.id} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded">
                                                    <input
                                                        type="checkbox"
                                                        checked={store.selectedIngredients.some(ing => ing.id === topping.id)}
                                                        onChange={() => handleToggleTopping(topping)}
                                                        className="w-4 h-4 text-primary rounded"
                                                    />
                                                    <span className="flex-1">{topping.name}</span>
                                                    <span className="text-gray-500">+${topping.price}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </Accordion>
                                </>
                            )}
                        </div>

                        {/* Quantity Selector */}
                        <div className="mb-6">
                            <QuantitySelector
                                quantity={store.quantity}
                                onIncrease={() => store.setQuantity(store.quantity + 1)}
                                onDecrease={() => store.setQuantity(store.quantity - 1)}
                            />
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-gray-900 text-white py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors"
                        >
                            ADD TO CART
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};