import { Plus, Minus } from 'lucide-react';

export const QuantitySelector = ({ quantity, onIncrease, onDecrease }) => {
    return (
        <div className="flex items-center gap-4">
            <span className="text-gray-700 font-semibold">Quantity:</span>
            <div className="flex items-center gap-3">
                <button
                    onClick={onDecrease}
                    className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
                >
                    <Minus className="w-5 h-5" />
                </button>
                <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                <button
                    onClick={onIncrease}
                    className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};