import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Card, CardBody, CardFooter } from './common/Card';

export const ExtrasCard = ({ extra, onQuantityChange, maxQuantity = 10 }) => {
    const [quantity, setQuantity] = useState(0);

    const handleIncrease = () => {
        if (quantity < maxQuantity) {
            const newQuantity = quantity + 1;
            setQuantity(newQuantity);
            onQuantityChange(extra.id, newQuantity);
        }
    };

    const handleDecrease = () => {
        if (quantity > 0) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            onQuantityChange(extra.id, newQuantity);
        }
    };

    return (
        <Card className="hover:shadow-lg transition-shadow flex flex-col">
            <CardBody className="flex-1 pb-2">
                {/* Imagen */}
                <div className="w-full h-40 bg-gray-200 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    <img
                        src={extra.image || '/placeholder-extra.jpg'}
                        alt={extra.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Información */}
                <div>
                    <h3 className="font-semibold text-lg mb-1">{extra.name}</h3>
                    {extra.description && (
                        <p className="text-sm text-gray-600 mb-2">{extra.description}</p>
                    )}
                    <p className="text-orange-600 font-bold text-lg">
                        ${extra.price.toFixed(2)}
                    </p>
                </div>
            </CardBody>

            <CardFooter className="pt-2">
                {/* Selector de cantidad */}
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                    <button
                        onClick={handleDecrease}
                        disabled={quantity === 0}
                        className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        <Minus size={16} />
                    </button>

                    <span className="font-semibold text-lg min-w-[2rem] text-center">
                        {quantity}
                    </span>

                    <button
                        onClick={handleIncrease}
                        disabled={quantity >= maxQuantity}
                        className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </CardFooter>
        </Card>
    );
};