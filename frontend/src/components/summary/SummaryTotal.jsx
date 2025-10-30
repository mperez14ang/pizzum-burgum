export const SummaryTotal = ({ total }) => {
    return (
        <div className="border-t pt-4 mb-6">
            <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-orange-500">${total}</span>
            </div>
        </div>
    );
};