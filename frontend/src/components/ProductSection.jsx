import toast from 'react-hot-toast';
import {Accordion} from "./common/accordion.jsx";
import {QuantitySelector} from "./common/QuantitySelector.jsx";

export const ProductSection = ({
                                   section,
                                   ingredients,
                                   selections,
                                   onUpdateSelection,
                                   isOpen = false
                               }) => {
    const currentValue = selections[section.stateKey];

    // Handler para selección única
    const handleSingleSelect = (item) => {
        onUpdateSelection(section.stateKey, item);
    };

    // Handler para selección múltiple
    const handleMultiSelect = (item) => {
        const currentItems = currentValue || [];
        const isSelected = currentItems.some(i => i.id === item.id);

        if (isSelected) {
            onUpdateSelection(
                section.stateKey,
                currentItems.filter(i => i.id !== item.id)
            );
        } else {
            if (section.maxItems && currentItems.length >= section.maxItems) {
                toast.error(`Puedes seleccionar hasta ${section.maxItems} ${section.title.toLowerCase()}`, {
                    duration: 2000
                });
                return;
            }
            onUpdateSelection(section.stateKey, [...currentItems, item]);
        }
    };

    // Handler para cantidad
    const handleQuantityChange = (delta) => {
        const quantityKey = section.quantityConfig.stateKey;
        const currentQuantity = selections[quantityKey] || 1;
        const newQuantity = currentQuantity + delta;

        if (newQuantity >= section.quantityConfig.min &&
            newQuantity <= section.quantityConfig.max) {
            onUpdateSelection(quantityKey, newQuantity);
        }
    };

    const renderTitle = () => (
        <span>
            {section.title}
            {section.required && <span className="text-red-500"> *</span>}
        </span>
    );

    const renderItem = (item) => {
        const isSelected = section.type === 'multi-select'
            ? (currentValue || []).some(i => i.id === item.id)
            : currentValue?.id === item.id;

        const onClick = section.type === 'multi-select'
            ? () => handleMultiSelect(item)
            : () => handleSingleSelect(item);

        return (
            <button
                key={item.id}
                onClick={onClick}
                className={`p-4 border-2 rounded-lg transition ${
                    isSelected
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                }`}
            >
                <div className="font-semibold text-sm">{item.name}</div>
                <div className="text-xs text-gray-600">
                    {item.price > 0 ? `+$${item.price}` : 'Incluido'}
                </div>
            </button>
        );
    };

    return (
        <Accordion title={renderTitle()} isOpen={isOpen}>
            {section.showCounter && section.type === 'multi-select' && (
                <p className="text-sm text-gray-600 mb-3">
                    Seleccionados: {(currentValue || []).length}/{section.maxItems}
                </p>
            )}

            <div className={`grid grid-cols-1 md:grid-cols-${section.gridCols} gap-3`}>
                {ingredients.map(renderItem)}
            </div>

            {section.type === 'single-select-with-quantity' && currentValue && (
                <div className="mt-4 p-4 bg-gray-50 rounded">
                    <label className="block text-sm font-medium mb-2">
                        Cantidad (máx. {section.quantityConfig.max}):
                    </label>
                    <QuantitySelector
                        quantity={selections[section.quantityConfig.stateKey] || 1}
                        onIncrease={() => handleQuantityChange(1)}
                        onDecrease={() => handleQuantityChange(-1)}
                        min={section.quantityConfig.min}
                        max={section.quantityConfig.max}
                    />
                </div>
            )}
        </Accordion>
    );
};