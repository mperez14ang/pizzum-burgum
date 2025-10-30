export const SummaryItems = ({ productConfig, selections }) => {
    const renderItem = (section) => {
        const value = selections[section.stateKey];
        if (!value) return null;

        // Multi-select (arrays)
        if (section.type === 'multi-select' && Array.isArray(value) && value.length > 0) {
            return (
                <div key={section.id}>
                    <div className="font-medium text-sm mb-1">
                        {section.title.replace(/^\d+\.\s*/, '')}:
                    </div>
                    {value.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm pl-2">
                            <span>• {item.name}</span>
                            <span className="font-semibold">
                                {item.price > 0 ? `$${item.price}` : 'Incluido'}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }

        // Single select with quantity
        if (section.type === 'single-select-with-quantity') {
            const quantity = selections[section.quantityConfig.stateKey] || 1;
            return (
                <div key={section.id} className="flex justify-between text-sm">
                    <span>
                        {section.title.replace(/^\d+\.\s*/, '')}: {value.name} x{quantity}
                    </span>
                    <span className="font-semibold">${value.price * quantity}</span>
                </div>
            );
        }

        // Single select
        return (
            <div key={section.id} className="flex justify-between text-sm">
                <span>
                    {section.title.replace(/^\d+\.\s*/, '')}: {value.name}
                </span>
                <span className="font-semibold">
                    {value.price > 0 ? `$${value.price}` : 'Incluido'}
                </span>
            </div>
        );
    };

    return (
        <div className="space-y-3 mb-6">
            {productConfig.sections.map(renderItem)}
        </div>
    );
};