export const ProductImage = ({ productConfig }) => {
    return (
        <div className="mb-6 relative overflow-hidden rounded-lg shadow-md">
            <img
                src={productConfig.image}
                alt={`${productConfig.displayName} personalizada`}
                className="w-full h-48 object-cover transition-transform hover:scale-105 duration-300"
                onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Imagen+no+disponible';
                }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                <p className="text-white font-semibold text-lg">
                    {productConfig.emoji} Tu {productConfig.displayName}
                </p>
            </div>
        </div>
    );
};